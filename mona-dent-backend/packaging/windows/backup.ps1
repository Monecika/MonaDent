param(
    [Parameter(Mandatory = $true)][string]$DataRoot,
    [Parameter(Mandatory = $true)][string]$ResticExecutable
)

$ErrorActionPreference = 'Stop'
if (Test-Path variable:PSNativeCommandUseErrorActionPreference) {
    $PSNativeCommandUseErrorActionPreference = $false
}

$ConfigPath = Join-Path $DataRoot 'application.properties'
$BackupRoot = Join-Path $DataRoot 'backups'
$LocalRepository = Join-Path $BackupRoot 'local-repository'
$PasswordPath = Join-Path $BackupRoot 'recovery-key.txt'
$DatabaseExportDirectory = Join-Path $BackupRoot 'database-export'
$DatabaseExportPath = Join-Path $DatabaseExportDirectory 'clinic_db.backup'
$LogPath = Join-Path $BackupRoot 'backup.log'
$StatusPath = Join-Path $BackupRoot 'backup-status.txt'
$postgresService = Get-CimInstance -ClassName Win32_Service -Filter "Name='MonaDentPostgreSQL'" -ErrorAction SilentlyContinue
if (-not $postgresService) { throw 'The Mona Dent PostgreSQL service was not found; refusing to create a database backup.' }
$postgresExecutable = [regex]::Match($postgresService.PathName, '(?i)^\s*"?(.+?\\pg_ctl\.exe)"?(?:\s|$)').Groups[1].Value
if (-not $postgresExecutable) { throw 'Could not find pg_ctl.exe in the PostgreSQL service configuration.' }
$PostgreSqlBin = Split-Path -Parent $postgresExecutable

function Write-BackupLog([string]$Message) {
    $line = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message"
    Add-Content -LiteralPath $LogPath -Value $line -Encoding UTF8
    Set-Content -LiteralPath $StatusPath -Value $line -Encoding UTF8
}

function Get-Property([string]$Name, [string]$Default = '') {
    $line = Get-Content -LiteralPath $ConfigPath | Where-Object { $_ -match "^$([regex]::Escape($Name))=" } | Select-Object -First 1
    if (-not $line) { return $Default }
    return $line.Substring($Name.Length + 1).Trim()
}

function Invoke-Restic([string]$Repository, [string[]]$Arguments) {
    $output = & $ResticExecutable --repo $Repository --password-file $PasswordPath @Arguments 2>&1
    $exitCode = $LASTEXITCODE
    foreach ($line in $output) { Add-Content -LiteralPath $LogPath -Value $line -Encoding UTF8 }
    if ($exitCode -ne 0) { throw "restic failed (exit code $exitCode) for '$Repository'." }
}

$staging = $null
try {
    if (-not (Test-Path -LiteralPath $ConfigPath)) { throw "Application configuration is missing: $ConfigPath" }
    if (-not (Test-Path -LiteralPath $ResticExecutable)) { throw "Backup program is missing: $ResticExecutable" }
    if (-not (Test-Path -LiteralPath (Join-Path $DataRoot 'files'))) { throw 'Patient files directory is missing; refusing to create an incomplete backup.' }
    if (-not (Test-Path -LiteralPath $PasswordPath)) { throw "Backup recovery key is missing: $PasswordPath" }

    $databaseUrl = Get-Property 'spring.datasource.url' 'jdbc:postgresql://localhost:5432/clinic_db'
    if ($databaseUrl -notmatch '^jdbc:postgresql://([^:/?]+)(?::(\d+))?/([^?]+)') { throw 'The configured PostgreSQL URL cannot be backed up by the installer backup job.' }
    $databaseHost = $Matches[1]
    $databasePort = if ($Matches[2]) { $Matches[2] } else { '5432' }
    $databaseName = $Matches[3]
    $databaseUser = Get-Property 'spring.datasource.username'
    $databasePassword = Get-Property 'spring.datasource.password'
    if (-not $databaseUser -or -not $databasePassword) { throw 'Database credentials are missing from the protected application configuration.' }

    New-Item -ItemType Directory -Force -Path $BackupRoot, $LocalRepository, $DatabaseExportDirectory | Out-Null
    Get-ChildItem -LiteralPath $BackupRoot -Directory -Filter '.staging-*' -ErrorAction SilentlyContinue |
        Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $DatabaseExportPath -Force -ErrorAction SilentlyContinue
    $staging = Join-Path $BackupRoot ('.staging-' + [guid]::NewGuid().ToString('N'))
    New-Item -ItemType Directory -Path $staging | Out-Null
    $dumpPath = Join-Path $staging 'clinic_db.backup'
    $env:PGPASSWORD = $databasePassword
    try {
        $dumpOutput = & (Join-Path $PostgreSqlBin 'pg_dump.exe') -w -h $databaseHost -p $databasePort -U $databaseUser -d $databaseName -Fc -f $dumpPath 2>&1
        $dumpExitCode = $LASTEXITCODE
        foreach ($line in $dumpOutput) { Add-Content -LiteralPath $LogPath -Value "pg_dump: $line" -Encoding UTF8 }
        if ($dumpExitCode -ne 0 -or -not (Test-Path -LiteralPath $dumpPath) -or (Get-Item -LiteralPath $dumpPath).Length -eq 0) {
            throw "Database export failed (exit code $dumpExitCode); no backup snapshot was created."
        }
        Move-Item -LiteralPath $dumpPath -Destination $DatabaseExportPath -Force
    } finally {
        Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    }

    $sources = @($DatabaseExportPath, (Join-Path $DataRoot 'files'))
    $repoConfig = Join-Path $LocalRepository 'config'
    if (-not (Test-Path -LiteralPath $repoConfig)) { Invoke-Restic $LocalRepository @('init') }
    Invoke-Restic $LocalRepository (@('--quiet', 'backup', '--tag', 'mona-dent', '--host', $env:COMPUTERNAME) + $sources)
    Invoke-Restic $LocalRepository @('forget', '--keep-last', '3', '--prune')
    Write-BackupLog 'SUCCESS: encrypted local database and patient-file snapshot completed.'

    $removableRoot = Get-Property 'app.backup.removable-directory'
    if (-not $removableRoot) {
        $backupVolumes = @(Get-Volume -FileSystemLabel 'MonaDentBackup' -ErrorAction SilentlyContinue |
            Where-Object { $_.DriveLetter })
        if ($backupVolumes.Count -eq 1) {
            $removableRoot = '{0}:\' -f $backupVolumes[0].DriveLetter
        } elseif ($backupVolumes.Count -gt 1) {
            Write-BackupLog 'WARNING: local backup succeeded; multiple MonaDentBackup volumes are connected. Configure one removable-drive path explicitly.'
        }
    }
    if (-not $removableRoot) {
        if ($backupVolumes.Count -le 1) { Write-BackupLog 'WARNING: local backup succeeded, but no MonaDentBackup drive is connected.' }
    } elseif (-not (Test-Path -LiteralPath $removableRoot -PathType Container)) {
        Write-BackupLog "WARNING: local backup succeeded; removable drive is not available at '$removableRoot'."
    } else {
        $removableRepository = Join-Path $removableRoot 'MonaDentRestic'
        New-Item -ItemType Directory -Force -Path $removableRepository | Out-Null
        if (-not (Test-Path -LiteralPath (Join-Path $removableRepository 'config'))) { Invoke-Restic $removableRepository @('init') }
        Invoke-Restic $removableRepository (@('--quiet', 'backup', '--tag', 'mona-dent', '--host', $env:COMPUTERNAME) + $sources)
        Invoke-Restic $removableRepository @('forget', '--keep-last', '3', '--prune')
        Write-BackupLog "SUCCESS: removable-drive snapshot completed at '$removableRepository'."
    }
} catch {
    Write-BackupLog "ERROR: $($_.Exception.Message)"
    exit 1
} finally {
    if ($staging -and (Test-Path -LiteralPath $staging)) { Remove-Item -LiteralPath $staging -Recurse -Force -ErrorAction SilentlyContinue }
    if (Test-Path -LiteralPath $DatabaseExportPath) { Remove-Item -LiteralPath $DatabaseExportPath -Force -ErrorAction SilentlyContinue }
}
