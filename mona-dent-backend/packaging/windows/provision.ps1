param(
    [Parameter(Mandatory = $true)][string]$InstallDirectory,
    [Parameter(Mandatory = $true)][string]$PostgreSqlInstaller
)

$ErrorActionPreference = 'Stop'
# PowerShell 7 can promote native stderr output to terminating errors. The
# installer checks native exit codes explicitly so it can log recoverable
# per-file icacls errors and report the actual PostgreSQL startup result.
if (Test-Path variable:PSNativeCommandUseErrorActionPreference) {
    $PSNativeCommandUseErrorActionPreference = $false
}
$SelectedDriveRoot = [IO.Path]::GetPathRoot([IO.Path]::GetFullPath($InstallDirectory))
$LegacyDataRoot = Join-Path $env:ProgramData 'MonaDent'
$ServiceName = 'MonaDentPostgreSQL'
$DataRoot = Join-Path $SelectedDriveRoot 'MonaDentData'
if (Test-Path -LiteralPath (Join-Path $LegacyDataRoot 'application.properties')) {
    $legacyDriveRoot = [IO.Path]::GetPathRoot([IO.Path]::GetFullPath($LegacyDataRoot))
    if ($legacyDriveRoot.Equals($SelectedDriveRoot, [StringComparison]::OrdinalIgnoreCase)) {
        # Existing installs on this same volume keep their established paths;
        # the app and all persistent data still remain on the selected disk.
        $DataRoot = $LegacyDataRoot
    }
}
$ConfigPath = Join-Path $DataRoot 'application.properties'
$BootstrapPath = Join-Path $DataRoot 'database-bootstrap.properties'
$ProgramFilesRoot = if ([Environment]::Is64BitOperatingSystem -and $env:ProgramW6432) {
    $env:ProgramW6432
} else {
    $env:ProgramFiles
}
$PostgreSqlRoot = Join-Path $DataRoot 'PostgreSQLRuntime'
$PostgreSqlData = Join-Path $DataRoot 'PostgreSQL\data'
$existingPostgresService = Get-CimInstance -ClassName Win32_Service -Filter "Name='$ServiceName'" -ErrorAction SilentlyContinue
if ((Test-Path -LiteralPath $ConfigPath) -and $existingPostgresService) {
    $serviceExecutable = [regex]::Match($existingPostgresService.PathName, '(?i)^\s*"?(.+?\\pg_ctl\.exe)"?(?:\s|$)').Groups[1].Value
    $serviceDataMatch = [regex]::Match($existingPostgresService.PathName, '(?i)(?:^|\s)-D\s+(?:"([^"]+)"|(\S+))')
    if ($serviceExecutable) { $PostgreSqlRoot = Split-Path -Parent (Split-Path -Parent $serviceExecutable) }
    if ($serviceDataMatch.Success) {
        $PostgreSqlData = if ($serviceDataMatch.Groups[1].Success) { $serviceDataMatch.Groups[1].Value } else { $serviceDataMatch.Groups[2].Value }
    }
}
$PostgreSqlServiceAccount = 'MonaDentPostgres'
$PostgreSqlBin = Join-Path $PostgreSqlRoot 'bin'
$LogDirectory = Join-Path $env:ProgramData 'MonaDent\logs'
$InstallLog = Join-Path $LogDirectory 'installer.log'

function Write-InstallLog([string]$Message) {
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $line = "[$timestamp] $Message"
    try {
        New-Item -ItemType Directory -Force -Path $LogDirectory | Out-Null
        Add-Content -LiteralPath $InstallLog -Value $line -Encoding ascii
    } catch { }
}

trap {
    try { Write-InstallLog "ERROR: $($_.Exception.Message)" } catch { }
    throw $_
}

function Grant-InstallerAccess([string]$Path) {
    & icacls.exe $Path /grant '*S-1-5-18:(OI)(CI)F' '*S-1-5-32-544:(OI)(CI)F' | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Could not grant the Windows installer access to '$Path'."
    }
}

function Remove-OrphanedFreshInstall {
    if (Test-Path -LiteralPath (Join-Path $PostgreSqlData 'PG_VERSION')) {
        throw "A PostgreSQL data cluster already exists under '$PostgreSqlData', but the Mona Dent configuration is missing. Setup stopped to preserve the database and backups; restore the saved configuration or recover the database before retrying."
    }
    $patientFiles = Join-Path $DataRoot 'files'
    if (Test-Path -LiteralPath $patientFiles) {
        $storedPatientFiles = Get-ChildItem -LiteralPath $patientFiles -Force -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($storedPatientFiles) {
            throw "Patient files already exist under '$patientFiles', but the Mona Dent configuration is missing. Setup stopped to preserve clinic data."
        }
    }
    $existingBackups = Join-Path $DataRoot 'backups'
    if (Test-Path -LiteralPath $existingBackups) {
        $storedBackups = Get-ChildItem -LiteralPath $existingBackups -Force -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($storedBackups) {
            throw "Backups already exist under '$existingBackups', but the Mona Dent configuration is missing. Setup stopped to preserve them."
        }
    }

    $serviceDetails = Get-CimInstance -ClassName Win32_Service -Filter "Name='$ServiceName'" -ErrorAction SilentlyContinue
    if ($serviceDetails) {
        $orphanDataPath = $null
        $serviceExecutable = [regex]::Match($serviceDetails.PathName, '(?i)^\s*"?(.+?\\pg_ctl\.exe)"?(?:\s|$)').Groups[1].Value
        $serviceDataPathMatch = [regex]::Match($serviceDetails.PathName, '(?i)(?:^|\s)-D\s+(?:"([^"]+)"|(\S+))')
        $orphanRuntimeRoot = $null
        if ($serviceExecutable) {
            $orphanRuntimeRoot = Split-Path -Parent (Split-Path -Parent $serviceExecutable)
            $programRoots = @($env:ProgramFiles, ${env:ProgramFiles(x86)}, $env:ProgramW6432) | Where-Object { $_ }
            $isLegacyMonaDentRuntime = @($programRoots | Where-Object {
                $prefix = [IO.Path]::GetFullPath((Join-Path $_ 'Mona Dent')).TrimEnd('\') + '\'
                [IO.Path]::GetFullPath($orphanRuntimeRoot).StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase)
            }).Count -gt 0
            $isSelectedDriveMonaDentRuntime = [IO.Path]::GetFullPath($orphanRuntimeRoot).Equals(
                [IO.Path]::GetFullPath($PostgreSqlRoot), [StringComparison]::OrdinalIgnoreCase)
            if (-not $isLegacyMonaDentRuntime -and -not $isSelectedDriveMonaDentRuntime) { $orphanRuntimeRoot = $null }
        }

        if ($serviceExecutable -and $serviceDataPathMatch.Success -and (Test-Path -LiteralPath $serviceExecutable)) {
            $orphanDataPath = if ($serviceDataPathMatch.Groups[1].Success) { $serviceDataPathMatch.Groups[1].Value } else { $serviceDataPathMatch.Groups[2].Value }
            Write-InstallLog "Stopping orphaned PostgreSQL using '$serviceExecutable' and data '$orphanDataPath'."
            $stopOutput = & $serviceExecutable stop -D $orphanDataPath -m fast -w -t 60 2>&1
            foreach ($line in $stopOutput) { Write-InstallLog "pg_ctl stop: $line" }
        }

        $service = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
        if ($service -and $service.Status -ne 'Stopped') {
            Stop-Service -Name $ServiceName -Force -ErrorAction Stop
        }
        & sc.exe stop $ServiceName 2>&1 | ForEach-Object { Write-InstallLog "sc stop: $_" }
        for ($attempt = 0; $attempt -lt 90; $attempt++) {
            $service = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
            if (-not $service -or $service.Status -eq 'Stopped') { break }
            Start-Sleep -Seconds 1
        }
        $service = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
        if ($service -and $service.Status -ne 'Stopped') {
            throw "Orphaned PostgreSQL service '$ServiceName' will not stop. The existing database was kept; stop the service manually and retry setup."
        }

        if ($orphanDataPath) {
            $orphanDataPath = [IO.Path]::GetFullPath($orphanDataPath)
            $orphanPostgresProcesses = @(Get-CimInstance -ClassName Win32_Process -ErrorAction SilentlyContinue | Where-Object {
                $_.Name -match '(?i)^postgres(?:\.exe)?$' -and $_.CommandLine -and
                $_.CommandLine.IndexOf($orphanDataPath, [StringComparison]::OrdinalIgnoreCase) -ge 0
            })
            foreach ($postgresProcess in $orphanPostgresProcesses) {
                Stop-Process -Id $postgresProcess.ProcessId -Force -ErrorAction Stop
                Write-InstallLog "Stopped orphaned PostgreSQL process PID $($postgresProcess.ProcessId) for '$orphanDataPath'."
            }
            for ($attempt = 0; $attempt -lt 15; $attempt++) {
                $remainingPostgresProcesses = @(Get-CimInstance -ClassName Win32_Process -ErrorAction SilentlyContinue | Where-Object {
                    $_.Name -match '(?i)^postgres(?:\.exe)?$' -and $_.CommandLine -and
                    $_.CommandLine.IndexOf($orphanDataPath, [StringComparison]::OrdinalIgnoreCase) -ge 0
                })
                if ($remainingPostgresProcesses.Count -eq 0) { break }
                Start-Sleep -Seconds 1
            }
            if ($remainingPostgresProcesses.Count -gt 0) {
                throw "PostgreSQL processes still use '$orphanDataPath'; the data was not removed."
            }
        }

        $deleteOutput = & sc.exe delete $ServiceName 2>&1
        $deleteCode = $LASTEXITCODE
        foreach ($line in $deleteOutput) { Write-InstallLog "sc delete: $line" }
        if ($deleteCode -ne 0) { throw "Could not remove orphaned PostgreSQL service '$ServiceName' (exit code $deleteCode)." }
        for ($attempt = 0; $attempt -lt 30; $attempt++) {
            if (-not (Get-Service -Name $ServiceName -ErrorAction SilentlyContinue)) { break }
            Start-Sleep -Seconds 1
        }
        if (Get-Service -Name $ServiceName -ErrorAction SilentlyContinue) {
            throw "Orphaned PostgreSQL service '$ServiceName' is still being removed. Retry setup after Windows releases it."
        }
        foreach ($installationRegistryRoot in @(
            'HKLM:\SOFTWARE\PostgreSQL\Installations',
            'HKLM:\SOFTWARE\WOW6432Node\PostgreSQL\Installations'
        )) {
            if (-not (Test-Path -LiteralPath $installationRegistryRoot)) { continue }
            foreach ($installationKey in (Get-ChildItem -LiteralPath $installationRegistryRoot -ErrorAction SilentlyContinue)) {
                $installation = Get-ItemProperty -LiteralPath $installationKey.PSPath -ErrorAction SilentlyContinue
                $registeredBase = [string]$installation.'Base Directory'
                $registeredData = [string]$installation.'Data Directory'
                $isMonaDentBase = $registeredBase -and ($registeredBase -match '(?i)\\Mona Dent\\PostgreSQL(?:Runtime)?$')
                $isMonaDentData = $registeredData -and [IO.Path]::GetFullPath($registeredData).StartsWith(
                    [IO.Path]::GetFullPath($DataRoot).TrimEnd('\') + '\', [StringComparison]::OrdinalIgnoreCase)
                if ($isMonaDentBase -or $isMonaDentData) {
                    Remove-Item -LiteralPath $installationKey.PSPath -Recurse -Force -ErrorAction Stop
                    Write-InstallLog "Removed stale PostgreSQL registration '$($installationKey.PSChildName)' for Mona Dent."
                }
            }
        }
        if ($orphanRuntimeRoot -and (Test-Path -LiteralPath $orphanRuntimeRoot)) {
            & icacls.exe $orphanRuntimeRoot /setowner '*S-1-5-32-544' /T /C /Q 2>&1 | Out-Null
            & icacls.exe $orphanRuntimeRoot /grant:r '*S-1-5-32-544:(OI)(CI)F' '*S-1-5-18:(OI)(CI)F' /T /C /Q 2>&1 | Out-Null
            Remove-Item -LiteralPath $orphanRuntimeRoot -Recurse -Force -ErrorAction Stop
            Write-InstallLog "Removed orphaned PostgreSQL runtime '$orphanRuntimeRoot'."
        }
        Write-InstallLog "Removed orphaned PostgreSQL service '$ServiceName'."
    }

    if (Test-Path -LiteralPath $DataRoot) {
        & icacls.exe $DataRoot /setowner '*S-1-5-32-544' /T /C /Q 2>&1 | Out-Null
        & icacls.exe $DataRoot /grant:r '*S-1-5-32-544:(OI)(CI)F' '*S-1-5-18:(OI)(CI)F' /T /C /Q 2>&1 | Out-Null
        Remove-Item -LiteralPath $DataRoot -Recurse -Force -ErrorAction Stop
    }
    New-Item -ItemType Directory -Force -Path $DataRoot, $PostgreSqlData, (Join-Path $DataRoot 'files'), (Join-Path $DataRoot 'backups'), $LogDirectory | Out-Null
    & icacls.exe $DataRoot /inheritance:r /grant:r '*S-1-5-18:(OI)(CI)F' '*S-1-5-32-544:(OI)(CI)F' | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "Could not secure the recreated Mona Dent data directory '$DataRoot'." }
    Grant-InstallerAccess (Join-Path $DataRoot 'backups')
    Grant-InstallerAccess (Join-Path $DataRoot 'files')
    Grant-InstallerAccess $LogDirectory
    Write-InstallLog 'Removed orphaned Mona Dent data and prepared clean folders on the selected drive.'
}

function Repair-ConfigAccess {
    if (-not (Test-Path -LiteralPath $ConfigPath)) { return }

    try {
        Get-Content -LiteralPath $ConfigPath -ErrorAction Stop | Out-Null
        return
    } catch [System.UnauthorizedAccessException] {
        Write-InstallLog 'Repairing access to the saved application configuration.'
    }

    # Previous installer versions applied ACL changes recursively to the whole
    # data directory. Repair only this secret config file so PostgreSQL's data
    # directory ACLs and other existing data remain untouched.
    & takeown.exe /F $ConfigPath /A | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Could not take ownership of '$ConfigPath' to repair its permissions."
    }
    & icacls.exe $ConfigPath /inheritance:r /grant:r '*S-1-5-18:F' '*S-1-5-32-544:F' | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Could not repair permissions on '$ConfigPath'."
    }
    Get-Content -LiteralPath $ConfigPath -ErrorAction Stop | Out-Null
}

function Resolve-PostgreSqlInstallation([string]$ServicePathName) {
    $serviceExecutable = [regex]::Match($ServicePathName, '(?i)^\s*"([^"]+\\pg_ctl\.exe)"').Groups[1].Value
    if (-not $serviceExecutable) {
        $serviceExecutable = [regex]::Match($ServicePathName, '(?i)^\s*(.+?\\pg_ctl\.exe)(?:\s|$)').Groups[1].Value
    }
    if (-not $serviceExecutable) {
        throw "Could not find pg_ctl.exe in PostgreSQL service command: $ServicePathName"
    }

    $script:PostgreSqlBin = Split-Path -Parent $serviceExecutable
    $script:PostgreSqlRoot = Split-Path -Parent $script:PostgreSqlBin

    $missingServerFiles = @('pg_ctl.exe', 'postgres.exe') |
        Where-Object { -not (Test-Path -LiteralPath (Join-Path $script:PostgreSqlBin $_)) }
    $runtimeIncomplete = -not (Test-Path -LiteralPath (Join-Path $script:PostgreSqlRoot 'lib')) -or
        -not (Test-Path -LiteralPath (Join-Path $script:PostgreSqlRoot 'share'))
    if ($missingServerFiles.Count -eq 0 -and -not $runtimeIncomplete) { return }

    if (-not (Test-Path -LiteralPath $PostgreSqlInstaller)) {
        throw "The PostgreSQL runtime is incomplete under '$script:PostgreSqlRoot', and the bundled installer is unavailable. Existing database files were left untouched."
    }

    $missingRuntimeParts = @('bin\pg_ctl.exe', 'bin\postgres.exe', 'lib', 'share') |
        Where-Object { -not (Test-Path -LiteralPath (Join-Path $script:PostgreSqlRoot $_)) }
    Write-InstallLog "PostgreSQL runtime is incomplete ($($missingRuntimeParts -join ', ')); repairing it with a complete side-by-side installation."
    Install-PostgreSqlRuntimeRepair
}

function Install-PostgreSqlRuntimeRepair {
    $repairRoot = Join-Path $DataRoot 'PostgreSQLRuntime'
    $repairData = Join-Path (Join-Path $DataRoot 'PostgreSQL') 'repair-bootstrap-data'
    $repairService = 'MonaDentPostgreSQLRepair'

    # Remove artifacts from the previous repair installer. The new repair
    # extracts binaries only and never creates a temporary PostgreSQL service
    # or touches the live data directory.
    $existingRepairService = Get-Service -Name $repairService -ErrorAction SilentlyContinue
    if ($existingRepairService) {
        if ($existingRepairService.Status -ne 'Stopped') { Stop-Service -Name $repairService -Force }
        & sc.exe delete $repairService | Out-Null
        if ($LASTEXITCODE -ne 0) { throw "Could not remove the previous temporary service '$repairService'." }
        for ($attempt = 0; $attempt -lt 30; $attempt++) {
            if (-not (Get-Service -Name $repairService -ErrorAction SilentlyContinue)) { break }
            Start-Sleep -Seconds 1
        }
        if (Get-Service -Name $repairService -ErrorAction SilentlyContinue) {
            throw "Previous temporary service '$repairService' is still being removed."
        }
    }
    if (Test-Path -LiteralPath $repairData) {
        Remove-Item -LiteralPath $repairData -Recurse -Force -ErrorAction SilentlyContinue
    }

    $requiredRuntimePaths = @('bin\pg_ctl.exe', 'bin\postgres.exe', 'lib', 'share')
    $runtimeReady = $true
    foreach ($requiredPath in $requiredRuntimePaths) {
        if (-not (Test-Path -LiteralPath (Join-Path $repairRoot $requiredPath))) { $runtimeReady = $false }
    }

    if (-not $runtimeReady) {
        if (Test-Path -LiteralPath $repairRoot) {
            Remove-Item -LiteralPath $repairRoot -Recurse -Force
        }
        $repairDebugTrace = Join-Path $env:TEMP 'MonaDent-postgresql-repair-debug.log'
        Remove-Item -LiteralPath $repairDebugTrace -Force -ErrorAction SilentlyContinue
        $arguments = @(
            '--mode', 'unattended',
            '--unattendedmodeui', 'none',
            '--debuglevel', '4',
            '--debugtrace', "`"$repairDebugTrace`"",
            '--extract-only', '1',
            '--enable-components', 'server,commandlinetools',
            '--prefix', "`"$repairRoot`""
        )
        Write-InstallLog "Extracting PostgreSQL binaries under '$repairRoot'; no database cluster or temporary service will be created."
        $repairLog = Join-Path $LogDirectory 'postgresql-repair-installer.log'
        $temporaryInstallerLog = Join-Path $env:TEMP 'install-postgresql.log'
        Remove-Item -LiteralPath $temporaryInstallerLog -Force -ErrorAction SilentlyContinue
        $installProcess = $null
        $elapsedSeconds = 0
        try {
            $installProcess = Start-Process -FilePath $PostgreSqlInstaller -ArgumentList $arguments -WindowStyle Hidden -PassThru
            while (-not $installProcess.WaitForExit(15000)) {
                $elapsedSeconds += 15
                if ($elapsedSeconds % 60 -eq 0) {
                    Write-InstallLog "PostgreSQL binary extraction is still running ($elapsedSeconds seconds elapsed)."
                }
                if ($elapsedSeconds -ge 1800) {
                    & taskkill.exe /PID $installProcess.Id /T /F | Out-Null
                    throw 'PostgreSQL binary extraction exceeded 30 minutes. Existing database files were left untouched.'
                }
            }
        } finally {
            if ($installProcess -and $installProcess.ExitCode -eq 0) {
                Remove-Item -LiteralPath @($repairDebugTrace, $temporaryInstallerLog) -Force -ErrorAction SilentlyContinue
            } else {
                $diagnosticParts = foreach ($diagnosticPath in @($repairDebugTrace, $temporaryInstallerLog)) {
                    if (Test-Path -LiteralPath $diagnosticPath) {
                        "=== $diagnosticPath ===`r`n$(Get-Content -LiteralPath $diagnosticPath -Raw)"
                    }
                }
                if ($diagnosticParts) {
                    Set-Content -LiteralPath $repairLog -Value ($diagnosticParts -join "`r`n") -Encoding ascii
                    Write-InstallLog "Saved PostgreSQL repair diagnostics to '$repairLog'."
                } else {
                    Write-InstallLog 'PostgreSQL binary extraction did not produce its expected diagnostic files.'
                }
                Remove-Item -LiteralPath @($repairDebugTrace, $temporaryInstallerLog) -Force -ErrorAction SilentlyContinue
            }
        }
        if ($installProcess.ExitCode -ne 0) {
            throw "PostgreSQL binary extraction failed with exit code $($installProcess.ExitCode). Existing database files were left untouched. Review '$repairLog'."
        }

        foreach ($requiredPath in $requiredRuntimePaths) {
            if (-not (Test-Path -LiteralPath (Join-Path $repairRoot $requiredPath))) {
                throw "PostgreSQL runtime repair completed without '$requiredPath'. Existing database files were left untouched."
            }
        }
    }

    $script:PostgreSqlRoot = $repairRoot
    $script:PostgreSqlBin = Join-Path $repairRoot 'bin'
    $serviceCommand = '"{0}" runservice -N "{1}" -D "{2}" -w' -f (Join-Path $script:PostgreSqlBin 'pg_ctl.exe'), $ServiceName, $PostgreSqlData
    Write-InstallLog "Updating PostgreSQL service '$ServiceName' command to: $serviceCommand"
    $serviceDetails = Get-CimInstance -ClassName Win32_Service -Filter "Name='$ServiceName'" -ErrorAction Stop
    $serviceTypeCode = switch -CaseSensitive ([string]$serviceDetails.ServiceType) {
        'Own Process' { 16 }
        'Share Process' { 32 }
        'Kernel Driver' { 1 }
        'File System Driver' { 2 }
        'Adapter' { 4 }
        'Recognizer Driver' { 8 }
        default { [uint32]::Parse([string]$serviceDetails.ServiceType) }
    }
    $errorControlCode = switch -CaseSensitive ([string]$serviceDetails.ErrorControl) {
        'Ignore' { 0 }
        'Normal' { 1 }
        'Severe' { 2 }
        'Critical' { 3 }
        default { [uint32]::Parse([string]$serviceDetails.ErrorControl) }
    }

    $changeResult = Invoke-CimMethod -InputObject $serviceDetails -MethodName Change -Arguments @{
        DisplayName = $serviceDetails.DisplayName
        PathName = $serviceCommand
        ServiceType = [uint32]$serviceTypeCode
        ErrorControl = [uint32]$errorControlCode
        StartMode = $serviceDetails.StartMode
        DesktopInteract = [bool]$serviceDetails.DesktopInteract
        StartName = $serviceDetails.StartName
        StartPassword = $null
        LoadOrderGroup = $serviceDetails.LoadOrderGroup
        LoadOrderGroupDependencies = $null
        ServiceDependencies = $serviceDetails.Dependencies
    } -ErrorAction Stop
    Write-InstallLog "Windows service configuration API returned $($changeResult.ReturnValue)."
    if ($changeResult.ReturnValue -ne 0) {
        throw "Windows could not change service '$ServiceName' (Win32_Service.Change return code $($changeResult.ReturnValue)). Existing database files were left untouched."
    }
    $serviceDetails = Get-CimInstance -ClassName Win32_Service -Filter "Name='$ServiceName'" -ErrorAction Stop
    if ($serviceDetails.PathName -ne $serviceCommand) {
        throw "Could not point PostgreSQL service '$ServiceName' to '$repairRoot'. Current service path is '$($serviceDetails.PathName)'. Existing database files were left untouched."
    }

    Write-InstallLog "PostgreSQL service now uses the complete runtime at '$repairRoot' and the existing database directory."
}

function Repair-PostgreSqlDataAccess {
    if (-not (Test-Path -LiteralPath $PostgreSqlData)) {
        throw "PostgreSQL data directory was not found: $PostgreSqlData"
    }

    $serviceDetails = Get-CimInstance -ClassName Win32_Service -Filter "Name='$ServiceName'" -ErrorAction Stop
    if (-not $serviceDetails -or -not $serviceDetails.StartName) {
        throw "Could not determine the Windows account used by PostgreSQL service '$ServiceName'."
    }
    Resolve-PostgreSqlInstallation $serviceDetails.PathName

    $serviceAccount = $serviceDetails.StartName
    try {
        $serviceSid = ([System.Security.Principal.NTAccount]::new($serviceAccount)).Translate([System.Security.Principal.SecurityIdentifier]).Value
    } catch [System.Security.Principal.IdentityNotMappedException] {
        # The previous installer created PostgreSQL's Windows account as
        # .\postgres. If that local account was removed, use the built-in
        # Local Service identity so the existing database can still be opened.
        Write-InstallLog "Windows account '$serviceAccount' no longer exists; switching PostgreSQL to the built-in Local Service account."
        & sc.exe config $ServiceName 'obj=' 'NT AUTHORITY\LocalService'
        if ($LASTEXITCODE -ne 0) {
            throw "Could not switch PostgreSQL service '$ServiceName' to Local Service."
        }
        $serviceAccount = 'NT AUTHORITY\LocalService'
        $serviceSid = 'S-1-5-19'
    }

    Write-InstallLog "Ensuring PostgreSQL service account '$serviceAccount' can access its data directory."
    $serviceSidObject = [System.Security.Principal.SecurityIdentifier]::new($serviceSid)
    $dataInheritance = [System.Security.AccessControl.InheritanceFlags]::ContainerInherit -bor [System.Security.AccessControl.InheritanceFlags]::ObjectInherit
    $pathsToRepair = @((Get-Item -LiteralPath $PostgreSqlData -ErrorAction Stop))
    $pathsToRepair += Get-ChildItem -LiteralPath $PostgreSqlData -Force -Recurse -ErrorAction Stop

    foreach ($item in $pathsToRepair) {
        $itemInheritance = if ($item.PSIsContainer) { $dataInheritance } else { [System.Security.AccessControl.InheritanceFlags]::None }
        try {
            $itemAcl = Get-Acl -LiteralPath $item.FullName -ErrorAction Stop
            $itemRule = [System.Security.AccessControl.FileSystemAccessRule]::new(
                $serviceSidObject,
                [System.Security.AccessControl.FileSystemRights]::FullControl,
                $itemInheritance,
                [System.Security.AccessControl.PropagationFlags]::None,
                [System.Security.AccessControl.AccessControlType]::Allow
            )
            $itemAcl.SetAccessRule($itemRule)
            Set-Acl -LiteralPath $item.FullName -AclObject $itemAcl -ErrorAction Stop
        } catch {
            throw "Could not grant PostgreSQL service account '$serviceAccount' access to '$($item.FullName)': $($_.Exception.Message)"
        }
    }

    # Parent folders are protected separately from the database files.
    foreach ($parentDirectory in @($DataRoot, (Split-Path -Parent $PostgreSqlData))) {
        try {
            $parentAcl = Get-Acl -LiteralPath $parentDirectory -ErrorAction Stop
            $parentRule = [System.Security.AccessControl.FileSystemAccessRule]::new(
                $serviceSidObject,
                [System.Security.AccessControl.FileSystemRights]::ReadAndExecute,
                [System.Security.AccessControl.InheritanceFlags]::None,
                [System.Security.AccessControl.PropagationFlags]::None,
                [System.Security.AccessControl.AccessControlType]::Allow
            )
            $parentAcl.SetAccessRule($parentRule)
            Set-Acl -LiteralPath $parentDirectory -AclObject $parentAcl -ErrorAction Stop
        } catch {
            throw "Could not grant PostgreSQL traverse access to '$parentDirectory': $($_.Exception.Message)"
        }
    }
}

function Start-PostgreSqlService {
    try {
        # Uninstall disables this service while preserving the database. Re-enable
        # it automatically whenever Mona Dent is installed or upgraded again.
        Set-Service -Name $ServiceName -StartupType Automatic -ErrorAction Stop
        Start-Service -Name $ServiceName -ErrorAction Stop
    } catch {
        Write-InstallLog "PostgreSQL service start failed: $($_.Exception.Message)"
        $serviceDetails = Get-CimInstance -ClassName Win32_Service -Filter "Name='$ServiceName'" -ErrorAction SilentlyContinue
        if ($serviceDetails) {
            Write-InstallLog "PostgreSQL service details: state=$($serviceDetails.State); account=$($serviceDetails.StartName); Win32ExitCode=$($serviceDetails.ExitCode); ServiceExitCode=$($serviceDetails.ServiceSpecificExitCode)."
        }

        foreach ($eventLog in @('System', 'Application')) {
            try {
                $events = Get-WinEvent -FilterHashtable @{ LogName = $eventLog; StartTime = (Get-Date).AddMinutes(-5) } -MaxEvents 50 -ErrorAction Stop |
                    Where-Object { $_.Message -match [regex]::Escape($ServiceName) -or $_.ProviderName -match 'PostgreSQL|Service Control Manager' } |
                    Select-Object -First 8
                foreach ($event in $events) {
                    $message = ($event.Message -replace '\s+', ' ').Trim()
                    Write-InstallLog "Windows $eventLog event $($event.Id): $message"
                }
            } catch { }
        }

        foreach ($logDirectory in @((Join-Path $PostgreSqlData 'log'), (Join-Path $PostgreSqlData 'pg_log'))) {
            $latestLog = Get-ChildItem -LiteralPath $logDirectory -File -ErrorAction SilentlyContinue |
                Sort-Object LastWriteTime -Descending |
                Select-Object -First 1
            if ($latestLog) { Write-InstallLog "Latest PostgreSQL server log: $($latestLog.FullName)" }
        }
        throw 'PostgreSQL could not start. See the Windows event details and PostgreSQL log path above.'
    }
}

trap {
    try { Write-InstallLog "ERROR: $($_.Exception.Message)" } catch { }
    throw $_
}

function New-Secret([int]$ByteCount = 32) {
    $bytes = [byte[]]::new($ByteCount)
    $generator = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    try { $generator.GetBytes($bytes) } finally { $generator.Dispose() }
    # Keep the password argument free of shell-sensitive punctuation while
    # meeting Windows local-account complexity requirements (upper, lower,
    # and numeric characters). The remaining random hex retains 256-bit entropy.
    return 'Aa7' + (([BitConverter]::ToString($bytes) -replace '-', '').ToLowerInvariant())
}

function Test-PasswordMeetsWindowsComplexity([string]$Password) {
    $classes = 0
    if ($Password -cmatch '[A-Z]') { $classes++ }
    if ($Password -cmatch '[a-z]') { $classes++ }
    if ($Password -match '\d') { $classes++ }
    if ($Password -match '[^A-Za-z0-9]') { $classes++ }
    return $classes -ge 3
}

function Invoke-Psql([string]$Sql, [string]$Database, [string]$Password) {
    $env:PGPASSWORD = $Password
    try {
        & (Join-Path $PostgreSqlBin 'psql.exe') -h 127.0.0.1 -p 5432 -U postgres -d $Database -v ON_ERROR_STOP=1 -c $Sql
        if ($LASTEXITCODE -ne 0) { throw "PostgreSQL command failed while configuring database '$Database'." }
    } finally {
        Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    }
}

$null = New-Item -ItemType Directory -Force -Path $LogDirectory
Write-InstallLog "Setup started. Selected drive: '$SelectedDriveRoot'. Data root: '$DataRoot'."

$otherDataRoots = @([IO.DriveInfo]::GetDrives() | Where-Object {
    $_.DriveType -eq [IO.DriveType]::Fixed -and $_.IsReady
} | ForEach-Object { Join-Path $_.RootDirectory.FullName 'MonaDentData' } | Where-Object {
    -not [IO.Path]::GetFullPath($_).Equals([IO.Path]::GetFullPath($DataRoot), [StringComparison]::OrdinalIgnoreCase) -and
    (Test-Path -LiteralPath (Join-Path $_ 'application.properties'))
})
$legacyConfigExists = Test-Path -LiteralPath (Join-Path $LegacyDataRoot 'application.properties')
$legacyIsSelectedDataRoot = [IO.Path]::GetFullPath($DataRoot).Equals([IO.Path]::GetFullPath($LegacyDataRoot), [StringComparison]::OrdinalIgnoreCase)
if ($otherDataRoots.Count -gt 0 -or ($legacyConfigExists -and -not $legacyIsSelectedDataRoot)) {
    $existingDataLocation = if ($otherDataRoots.Count -gt 0) { $otherDataRoots[0] } else { $LegacyDataRoot }
    throw "An existing Mona Dent installation has data at '$existingDataLocation'. Setup will not create a second, empty database on '$SelectedDriveRoot'; install on the original drive or migrate the existing data first."
}

New-Item -ItemType Directory -Force -Path $DataRoot, $PostgreSqlData, (Join-Path $DataRoot 'files'), (Join-Path $DataRoot 'backups'), (Join-Path $DataRoot 'logs') | Out-Null
& icacls.exe $DataRoot /inheritance:r /grant:r '*S-1-5-18:(OI)(CI)F' '*S-1-5-32-544:(OI)(CI)F' | Out-Null
if ($LASTEXITCODE -ne 0) { throw "Could not secure the Mona Dent data directory '$DataRoot'." }
Grant-InstallerAccess (Join-Path $DataRoot 'backups')
Grant-InstallerAccess (Join-Path $DataRoot 'files')
Grant-InstallerAccess $LogDirectory
Repair-ConfigAccess
Write-InstallLog 'Mona Dent setup started.'
Write-InstallLog "PowerShell process architecture: $([IntPtr]::Size * 8)-bit; PostgreSQL install root: '$PostgreSqlRoot'."

$backupRoot = Join-Path $DataRoot 'backups'
$recoveryKeyPath = Join-Path $backupRoot 'recovery-key.txt'
$localResticConfig = Join-Path $backupRoot 'local-repository\config'
if (-not (Test-Path -LiteralPath $recoveryKeyPath)) {
    if (Test-Path -LiteralPath $localResticConfig) {
        throw 'An encrypted backup repository exists but its recovery key is missing. Refusing to replace the key.'
    }
    $recoveryBytes = [byte[]]::new(32)
    $recoveryGenerator = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    try { $recoveryGenerator.GetBytes($recoveryBytes) } finally { $recoveryGenerator.Dispose() }
    $recoveryKey = [BitConverter]::ToString($recoveryBytes).Replace('-', '').ToLowerInvariant()
    Set-Content -LiteralPath $recoveryKeyPath -Value $recoveryKey -Encoding ascii -NoNewline
    & icacls.exe $recoveryKeyPath /inheritance:r /grant:r '*S-1-5-18:F' '*S-1-5-32-544:F' | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'Could not secure the encrypted-backup recovery key.' }
}

$backupScript = Join-Path $InstallDirectory '_installer\backup.ps1'
$resticExecutable = Join-Path $InstallDirectory '_installer\restic.exe'
if (-not (Test-Path -LiteralPath $backupScript) -or -not (Test-Path -LiteralPath $resticExecutable)) {
    throw 'The encrypted backup program or scheduled backup script is missing from the installation.'
}

$postgresService = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
if (-not (Test-Path $ConfigPath)) {
    Write-InstallLog 'Preparing the first-install database setup.'
    if ($postgresService -and -not (Test-Path $BootstrapPath)) {
        Write-InstallLog "Found orphaned PostgreSQL service '$ServiceName' with no saved Mona Dent configuration; resetting the incomplete installation for a clean first install."
        Remove-OrphanedFreshInstall
        $postgresService = $null
    }

    if (Test-Path $BootstrapPath) {
        $bootstrap = Get-Content $BootstrapPath
        $superPassword = ($bootstrap | Where-Object { $_ -like 'superPassword=*' } | Select-Object -First 1) -replace '^superPassword=', ''
        $appPassword = ($bootstrap | Where-Object { $_ -like 'appPassword=*' } | Select-Object -First 1) -replace '^appPassword=', ''
        if (-not $superPassword -or -not $appPassword) { throw 'The protected first-install database setup file is incomplete.' }
        if (-not (Test-PasswordMeetsWindowsComplexity $superPassword)) {
            Write-InstallLog 'Replacing the saved bootstrap password because it does not meet Windows service-account password complexity requirements.'
            $superPassword = New-Secret
            $appPassword = New-Secret
            @("superPassword=$superPassword", "appPassword=$appPassword") | Set-Content -Path $BootstrapPath -Encoding ascii
            & icacls.exe $BootstrapPath /inheritance:r /grant:r '*S-1-5-18:F' '*S-1-5-32-544:F' | Out-Null
            if ($LASTEXITCODE -ne 0) { throw 'Could not secure the refreshed first-install database setup file.' }
        }
    } else {
        $superPassword = New-Secret
        $appPassword = New-Secret
        @("superPassword=$superPassword", "appPassword=$appPassword") | Set-Content -Path $BootstrapPath -Encoding ascii
        & icacls.exe $BootstrapPath /inheritance:r /grant:r '*S-1-5-18:F' '*S-1-5-32-544:F' | Out-Null
    }

    if (-not $postgresService) {
        if (-not (Test-Path $PostgreSqlInstaller)) {
            throw "The offline PostgreSQL installer is missing: $PostgreSqlInstaller"
        }

        $existingServiceAccount = Get-CimInstance -ClassName Win32_UserAccount `
            -Filter "LocalAccount=True AND Name='$PostgreSqlServiceAccount'" -ErrorAction SilentlyContinue |
            Select-Object -First 1
        if ($existingServiceAccount) {
            Write-InstallLog "Resetting the existing Mona Dent PostgreSQL Windows account '$PostgreSqlServiceAccount' to the protected first-install password so a retry can validate it."
            try {
                $localServiceAccount = [ADSI]("WinNT://./$PostgreSqlServiceAccount,user")
                $localServiceAccount.SetPassword($superPassword)
                $localServiceAccount.SetInfo()
            } catch {
                throw "Could not reset the existing Mona Dent PostgreSQL Windows account '$PostgreSqlServiceAccount': $($_.Exception.Message)"
            }
        }

        $postgresDebugTrace = Join-Path $env:TEMP 'MonaDent-postgresql-install-debug.log'
        Remove-Item -LiteralPath $postgresDebugTrace -Force -ErrorAction SilentlyContinue
        $windowsSystemDirectory = [Environment]::GetFolderPath([Environment+SpecialFolder]::System)
        $windowsWow64Directory = Join-Path $env:WINDIR 'SysWOW64'
        $hasX64VcRuntime = (Test-Path (Join-Path $windowsSystemDirectory 'vcruntime140.dll')) -and
            (Test-Path (Join-Path $windowsSystemDirectory 'msvcp140.dll'))
        $hasX86VcRuntime = (Test-Path (Join-Path $windowsWow64Directory 'vcruntime140.dll')) -and
            (Test-Path (Join-Path $windowsWow64Directory 'msvcp140.dll'))
        $arguments = @(
            '--mode', 'unattended',
            '--unattendedmodeui', 'none',
            '--debuglevel', '4',
            '--debugtrace', "`"$postgresDebugTrace`"",
            '--enable-components', 'server,commandlinetools',
            '--prefix', "`"$PostgreSqlRoot`"",
            '--datadir', "`"$PostgreSqlData`"",
            '--serverport', '5432',
            '--enable_acledit', '1',
            '--servicename', $ServiceName,
            '--superaccount', 'postgres',
            '--superpassword', $superPassword,
            # Keep the Windows service account distinct from PostgreSQL's
            # database superuser and from accounts left by other installations.
            '--serviceaccount', $PostgreSqlServiceAccount,
            '--servicepassword', $superPassword
        )
        if ($hasX64VcRuntime -and $hasX86VcRuntime) {
            $arguments += @('--install_runtimes', '0')
            Write-InstallLog 'Both 32-bit and 64-bit Visual C++ runtimes are already installed; skipping the bundled runtime installers.'
        }
        Write-InstallLog 'Starting the bundled PostgreSQL installer.'
        $process = $null
        try {
            $process = Start-Process -FilePath $PostgreSqlInstaller -ArgumentList $arguments -WindowStyle Hidden -PassThru
            $elapsedSeconds = 0
            while (-not $process.WaitForExit(15000)) {
                $elapsedSeconds += 15
                if ($elapsedSeconds % 60 -eq 0) {
                    Write-InstallLog "PostgreSQL installer is still running ($elapsedSeconds seconds elapsed)."
                }
                if ($elapsedSeconds -ge 1800) {
                    & taskkill.exe /PID $process.Id /T /F | Out-Null
                    throw 'PostgreSQL setup exceeded 30 minutes and was stopped.'
                }
            }
            if ($process.ExitCode -ne 0) { throw "PostgreSQL setup failed with exit code $($process.ExitCode)." }
            Write-InstallLog 'Bundled PostgreSQL installer completed.'
        } finally {
            $diagnosticPaths = @(
                (Join-Path $env:TEMP 'install-postgresql.log'),
                $postgresDebugTrace
            )
            if ($process -and $process.ExitCode -eq 0) {
                Remove-Item -LiteralPath $diagnosticPaths -Force -ErrorAction SilentlyContinue
            } else {
                $diagnosticParts = foreach ($diagnosticPath in $diagnosticPaths) {
                    if (Test-Path -LiteralPath $diagnosticPath) {
                        $diagnosticText = Get-Content -LiteralPath $diagnosticPath -Raw
                        if ($superPassword) { $diagnosticText = $diagnosticText.Replace($superPassword, '[REDACTED]') }
                        "=== $diagnosticPath ===`r`n$diagnosticText"
                    }
                }
                if ($diagnosticParts) {
                    Set-Content -Path (Join-Path $LogDirectory 'postgresql-installer.log') -Value ($diagnosticParts -join "`r`n") -Encoding ascii
                    Write-InstallLog "Saved PostgreSQL installer diagnostics to '$(Join-Path $LogDirectory 'postgresql-installer.log')'."
                } else {
                    Write-InstallLog 'PostgreSQL installer did not produce its expected diagnostic files.'
                }
                Remove-Item -LiteralPath $diagnosticPaths -Force -ErrorAction SilentlyContinue
            }
        }
        $postgresService = Get-Service -Name $ServiceName -ErrorAction Stop
    }

    Write-InstallLog 'Waiting for the PostgreSQL service.'
    $postgresService = Get-Service -Name $ServiceName -ErrorAction Stop
    if ($postgresService.Status -eq 'Running') {
        Write-InstallLog 'Stopping PostgreSQL before repairing its data permissions.'
        Stop-Service -Name $ServiceName -Force
    }
    Repair-PostgreSqlDataAccess
    Start-PostgreSqlService

    $ready = $false
    for ($attempt = 0; $attempt -lt 60; $attempt++) {
        & (Join-Path $PostgreSqlBin 'pg_isready.exe') -h 127.0.0.1 -p 5432 | Out-Null
        if ($LASTEXITCODE -eq 0) { $ready = $true; break }
        Start-Sleep -Seconds 2
    }
    if (-not $ready) { throw 'PostgreSQL did not become ready in time.' }
    Write-InstallLog 'PostgreSQL is ready.'

    Invoke-Psql "DO `$setup`$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'mona_dent_app') THEN ALTER ROLE mona_dent_app LOGIN PASSWORD '$appPassword'; ELSE CREATE ROLE mona_dent_app LOGIN PASSWORD '$appPassword'; END IF; END `$setup`$;" 'postgres' $superPassword
    $env:PGPASSWORD = $superPassword
    try {
        $databaseExists = (& (Join-Path $PostgreSqlBin 'psql.exe') -h 127.0.0.1 -p 5432 -U postgres -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = 'clinic_db'")
        if ($LASTEXITCODE -ne 0) { throw 'Could not check whether the Mona Dent database already exists.' }
    } finally {
        Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    }
    if (-not ($databaseExists -match '1')) {
        Invoke-Psql 'CREATE DATABASE clinic_db OWNER mona_dent_app;' 'postgres' $superPassword
    }
    Write-InstallLog 'Mona Dent database and application role are ready.'

    $secretBytes = [byte[]]::new(32)
    $generator = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    try { $generator.GetBytes($secretBytes) } finally { $generator.Dispose() }
    $jwtSecret = [Convert]::ToBase64String($secretBytes)

    @(
        'spring.datasource.url=jdbc:postgresql://localhost:5432/clinic_db'
        'spring.datasource.username=mona_dent_app'
        "spring.datasource.password=$appPassword"
        "security.jwt.secret-key=$jwtSecret"
        "app.files.directory=$((Join-Path $DataRoot 'files').Replace('\', '/'))"
        'app.backup.removable-directory='
        'server.address=0.0.0.0'
    ) | Set-Content -Path $ConfigPath -Encoding ascii
    Remove-Item $BootstrapPath -Force -ErrorAction SilentlyContinue
    Write-InstallLog 'Created the Mona Dent application configuration.'
} else {
    Write-InstallLog 'Existing installation detected; backing up before upgrade.'
    if (-not $postgresService) { throw "Mona Dent configuration exists, but PostgreSQL service '$ServiceName' is missing. No database files were changed." }
    $postgresService = Get-Service -Name $ServiceName -ErrorAction Stop
    if ($postgresService.Status -eq 'Running') {
        Write-InstallLog 'Stopping PostgreSQL before repairing its data permissions.'
        Stop-Service -Name $ServiceName -Force
    }
    Repair-PostgreSqlDataAccess
    Start-PostgreSqlService

    $ready = $false
    for ($attempt = 0; $attempt -lt 60; $attempt++) {
        $readyOutput = & (Join-Path $PostgreSqlBin 'pg_isready.exe') -h 127.0.0.1 -p 5432 2>&1
        if ($LASTEXITCODE -eq 0) { $ready = $true; break }
        Start-Sleep -Seconds 2
    }
    if (-not $ready) {
        foreach ($line in $readyOutput) { Write-InstallLog "pg_isready: $line" }
        $serviceStatus = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
        if ($serviceStatus) { Write-InstallLog "PostgreSQL Windows service state: $($serviceStatus.Status)." }
        throw 'PostgreSQL did not become ready for the upgrade backup. The database was not changed.'
    }

    $properties = Get-Content $ConfigPath
    if (-not ($properties | Where-Object { $_ -like 'spring.datasource.password=*' } | Select-Object -First 1)) {
        throw 'The saved database password is missing. Existing database files were left untouched.'
    }
    if (-not ($properties | Where-Object { $_ -like 'app.backup.removable-directory=*' } | Select-Object -First 1)) {
        Add-Content -Path $ConfigPath -Value 'app.backup.removable-directory=' -Encoding ascii
    }
    $upgradeBackupOutput = & (Join-Path $PSHOME 'powershell.exe') -NoProfile -ExecutionPolicy Bypass `
        -File $backupScript -DataRoot $DataRoot -ResticExecutable $resticExecutable 2>&1
    $upgradeBackupExitCode = $LASTEXITCODE
    foreach ($line in $upgradeBackupOutput) { Write-InstallLog "pre-upgrade backup: $line" }
    if ($upgradeBackupExitCode -ne 0) {
        throw "Encrypted backup failed with exit code $upgradeBackupExitCode. The application upgrade was stopped before migrations ran."
    }
    Write-InstallLog 'Encrypted database and patient-file backup completed before upgrade.'

}

$backupProperty = Get-Content $ConfigPath | Where-Object { $_ -like 'app.backup.removable-directory=*' } | Select-Object -First 1
if (-not $backupProperty) {
    Add-Content -Path $ConfigPath -Value 'app.backup.removable-directory=' -Encoding ascii
}
$backupStatusPath = Join-Path $backupRoot 'backup-status.txt'
if (-not (Test-Path -LiteralPath $backupStatusPath)) {
    Set-Content -LiteralPath $backupStatusPath -Value "Backups have not run yet. Check '$backupRoot\backup.log'." -Encoding UTF8
}
$backupInstructionsPath = Join-Path $backupRoot 'BACKUP-SETUP.txt'
@(
    'Mona Dent automatic backups',
    '',
    'The app saves encrypted snapshots on this PC every day and when Windows starts.',
    'To add an off-site removable copy, label one external drive MonaDentBackup and connect it when the backup runs. Disconnect it after a successful run and store it separately from this PC.',
    'The backup job runs daily at 5:00 PM and at startup, keeping the latest 3 snapshots in each repository. To run it after connecting the drive, open Task Scheduler and choose MonaDent Daily Backup > Run.',
    'To use another path, set app.backup.removable-directory in this folder''s parent application.properties file.',
    '',
    'Save the recovery key from recovery-key.txt in a secure place separate from this PC and the removable drive.',
    'Without the recovery key, encrypted backups cannot be restored. Do not store its only copy on the backup drive.',
    '',
    'Latest result: backup-status.txt. Detailed log: backup.log.'
) | Set-Content -LiteralPath $backupInstructionsPath -Encoding UTF8
& icacls.exe $backupInstructionsPath /inheritance:r /grant:r '*S-1-5-18:F' '*S-1-5-32-544:F' | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Could not secure the backup instructions file.' }

@('[InternetShortcut]', 'URL=http://127.0.0.1:8080') |
    Set-Content -Path (Join-Path $InstallDirectory 'MonaDent.url') -Encoding ascii
Write-InstallLog 'Created or refreshed the Mona Dent desktop shortcut URL.'

if (Test-Path $PostgreSqlInstaller) {
    Remove-Item $PostgreSqlInstaller -Force
}

$serviceWrapper = Join-Path $InstallDirectory 'MonaDentService.exe'
$serviceConfig = Join-Path $InstallDirectory 'MonaDentService.xml'
$xmlData = [System.Security.SecurityElement]::Escape($DataRoot)
@"
<service>
  <id>MonaDent</id>
  <name>Mona Dent Application</name>
  <description>Mona Dent clinic application service</description>
  <executable>%BASE%\app\MonaDent.exe</executable>
  <arguments>--spring.config.additional-location=file:$($xmlData.Replace('\', '/'))/application.properties</arguments>
  <workingdirectory>%BASE%\app</workingdirectory>
  <logpath>$xmlData\logs</logpath>
  <log mode="roll-by-size"><sizeThreshold>10240</sizeThreshold><keepFiles>8</keepFiles></log>
  <env name="MONA_DENT_FILES_DIRECTORY" value="$xmlData\files" />
  <onfailure action="restart" delay="10 sec" />
  <startmode>Automatic</startmode>
</service>
"@ | Set-Content -Path $serviceConfig -Encoding utf8

& $serviceWrapper stop 2>$null
& $serviceWrapper uninstall 2>$null
& $serviceWrapper install
if ($LASTEXITCODE -ne 0) { throw 'Could not register the Mona Dent Windows service.' }
Write-InstallLog 'Mona Dent service registered.'
& $serviceWrapper start
if ($LASTEXITCODE -ne 0) { throw 'Could not start the Mona Dent Windows service.' }
Write-InstallLog 'Mona Dent service started.'

$applicationReady = $false
for ($attempt = 0; $attempt -lt 90; $attempt++) {
    try {
        $response = Invoke-WebRequest -Uri 'http://127.0.0.1:8080/' -TimeoutSec 2 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            $applicationReady = $true
            break
        }
    } catch { }
    if (-not $applicationReady) { Start-Sleep -Seconds 2 }
}
if (-not $applicationReady) {
    throw "Mona Dent service started, but the web app did not respond at http://127.0.0.1:8080/. Check '$LogDirectory' for service logs."
}
Write-InstallLog 'Mona Dent web app is responding at http://127.0.0.1:8080/.'

$powerShellExecutable = Join-Path $PSHOME 'powershell.exe'
$backupArguments = "-NoProfile -ExecutionPolicy Bypass -File `"$backupScript`" -DataRoot `"$DataRoot`" -ResticExecutable `"$resticExecutable`""
$backupAction = New-ScheduledTaskAction -Execute $powerShellExecutable -Argument $backupArguments
$backupTriggers = @(
    (New-ScheduledTaskTrigger -Daily -At '5:00PM'),
    (New-ScheduledTaskTrigger -AtStartup)
)
$backupSettings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries `
    -ExecutionTimeLimit (New-TimeSpan -Hours 6) -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 10) -MultipleInstances IgnoreNew
$backupPrincipal = New-ScheduledTaskPrincipal -UserId 'SYSTEM' -LogonType ServiceAccount -RunLevel Highest
Register-ScheduledTask -TaskName 'MonaDent Daily Backup' -Action $backupAction -Trigger $backupTriggers `
    -Settings $backupSettings -Principal $backupPrincipal -Force | Out-Null
Write-InstallLog 'Registered the encrypted backup job (17:00 and at computer startup; keeps the latest 3 snapshots per repository).'
Start-ScheduledTask -TaskName 'MonaDent Daily Backup'
Write-InstallLog 'Started the first scheduled backup run.'

try {
    if (-not (Get-NetFirewallRule -DisplayName 'Mona Dent application' -ErrorAction SilentlyContinue)) {
        New-NetFirewallRule -DisplayName 'Mona Dent application' -Direction Inbound -Protocol TCP -LocalPort 8080 -Action Allow -Profile Domain,Private | Out-Null
    }
} catch {
    Write-InstallLog "Firewall rule could not be created automatically: $_"
}

Write-InstallLog 'Mona Dent setup completed.'
