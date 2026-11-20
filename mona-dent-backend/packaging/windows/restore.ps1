param()

$ErrorActionPreference = 'Stop'

$installDrive = [IO.Path]::GetPathRoot([IO.Path]::GetFullPath($PSScriptRoot))
$dataRoot = Join-Path $installDrive 'MonaDentData'
$serviceConfigurationPath = Join-Path $PSScriptRoot '..\MonaDentService.xml'
if (Test-Path -LiteralPath $serviceConfigurationPath) {
    try {
        [xml]$serviceConfiguration = Get-Content -LiteralPath $serviceConfigurationPath -Raw
        $filesSetting = @($serviceConfiguration.service.env | Where-Object { $_.name -eq 'MONA_DENT_FILES_DIRECTORY' } | Select-Object -First 1)
        if ($filesSetting.Count -gt 0 -and $filesSetting[0].value) {
            $configuredDataRoot = Split-Path -Parent ([string]$filesSetting[0].value)
            if ([IO.Path]::GetFileName($configuredDataRoot) -in @('MonaDent', 'MonaDentData')) { $dataRoot = $configuredDataRoot }
        }
    } catch { }
}
$configPath = Join-Path $dataRoot 'application.properties'
$resticExecutable = Join-Path $PSScriptRoot 'restic.exe'
$logPath = Join-Path $dataRoot 'logs\restore.log'

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
[System.Windows.Forms.Application]::EnableVisualStyles()

$principal = [Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    $scriptPath = Join-Path $PSScriptRoot 'restore-launcher.ps1'
    $arguments = '-NoProfile -ExecutionPolicy Bypass -STA -File "{0}"' -f $scriptPath
    Start-Process -FilePath 'powershell.exe' -Verb RunAs -ArgumentList $arguments
    exit
}

function Read-Property([string]$Name) {
    $propertyLine = Get-Content -LiteralPath $configPath -ErrorAction Stop |
        Where-Object { $_ -match "^$([regex]::Escape($Name))=" } | Select-Object -First 1
    if (-not $propertyLine) { return '' }
    return $propertyLine.Substring($Name.Length + 1).Trim()
}

function Invoke-Restic([string[]]$ResticArguments) {
    $commandArguments = @('--repo', $repositoryTextBox.Text.Trim(), '--password-file', $keyTextBox.Text.Trim()) + $ResticArguments
    $output = & $resticExecutable @commandArguments 2>&1
    $exitCode = $LASTEXITCODE
    if ($exitCode -ne 0) {
        $details = ($output | ForEach-Object { [string]$_ }) -join [Environment]::NewLine
        throw "Mona Dent could not read this backup. Check that the drive and recovery key are correct.`r`n`r`n$details"
    }
    return ($output -join [Environment]::NewLine)
}

function Set-Status([string]$Message) {
    $statusLabel.Text = $Message
    $form.Refresh()
    [System.Windows.Forms.Application]::DoEvents()
    if (Test-Path -LiteralPath (Split-Path -Parent $logPath)) {
        Add-Content -LiteralPath $logPath -Value "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message" -Encoding UTF8
    }
}

function Get-PostgreSqlBin {
    $postgresService = Get-CimInstance -ClassName Win32_Service -Filter "Name='MonaDentPostgreSQL'" -ErrorAction SilentlyContinue
    if (-not $postgresService) { throw 'Mona Dent PostgreSQL is not installed. Install Mona Dent before restoring this backup.' }
    $postgresExecutable = [regex]::Match($postgresService.PathName, '(?i)^\s*"?(.+?\\pg_ctl\.exe)"?(?:\s|$)').Groups[1].Value
    if (-not $postgresExecutable) { throw 'Mona Dent could not locate its PostgreSQL tools.' }
    return Split-Path -Parent $postgresExecutable
}

function Stop-MonaDentApplicationService {
    $serviceName = 'MonaDent'
    $service = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
    if (-not $service) { throw 'The Mona Dent application service was not found. Reinstall Mona Dent before restoring.' }
    if ($service.Status -eq 'Stopped') { return }

    # Ask WinSW and the Service Control Manager to stop it cleanly first.
    if (Test-Path -LiteralPath $wrapper) {
        $wrapperOutput = & $wrapper stop 2>&1
        foreach ($line in $wrapperOutput) { Add-Content -LiteralPath $logPath -Value "WinSW stop: $line" -Encoding UTF8 }
    }
    try { Stop-Service -Name $serviceName -Force -ErrorAction Stop } catch {
        Add-Content -LiteralPath $logPath -Value "Stop-Service: $($_.Exception.Message)" -Encoding UTF8
    }
    & sc.exe stop $serviceName 2>&1 | ForEach-Object {
        Add-Content -LiteralPath $logPath -Value "sc stop: $_" -Encoding UTF8
    }

    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        $service = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
        if (-not $service -or $service.Status -eq 'Stopped') { return }
        Start-Sleep -Seconds 1
    }

    # If WinSW is hung, stop its process tree and verify the service has exited
    # before any clinic files or database tables are modified.
    $serviceDetails = Get-CimInstance -ClassName Win32_Service -Filter "Name='$serviceName'" -ErrorAction SilentlyContinue
    if ($serviceDetails -and $serviceDetails.ProcessId -gt 0) {
        $killOutput = & taskkill.exe /PID ([string]$serviceDetails.ProcessId) /T /F 2>&1
        foreach ($line in $killOutput) { Add-Content -LiteralPath $logPath -Value "taskkill: $line" -Encoding UTF8 }
    }
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        $service = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
        if (-not $service -or $service.Status -eq 'Stopped') { return }
        Start-Sleep -Seconds 1
    }
    throw "Mona Dent could not stop its application service (current state: $($service.Status)). No restore was started; the database and patient files were not changed."
}

$form = New-Object System.Windows.Forms.Form
$form.Text = 'Restore Mona Dent from Backup'
$form.StartPosition = 'CenterScreen'
$form.Size = New-Object System.Drawing.Size(720, 455)
$form.MinimumSize = New-Object System.Drawing.Size(720, 455)
$form.Font = New-Object System.Drawing.Font('Segoe UI', 9)

$introLabel = New-Object System.Windows.Forms.Label
$introLabel.Location = New-Object System.Drawing.Point(22, 18)
$introLabel.Size = New-Object System.Drawing.Size(660, 58)
$introLabel.Text = 'This wizard restores clinic records and patient files from an encrypted backup. Connect the backup drive, choose the recovery key saved separately, then select a backup date.'
$form.Controls.Add($introLabel)

$repositoryLabel = New-Object System.Windows.Forms.Label
$repositoryLabel.Location = New-Object System.Drawing.Point(22, 92)
$repositoryLabel.Size = New-Object System.Drawing.Size(180, 22)
$repositoryLabel.Text = 'Backup drive folder:'
$form.Controls.Add($repositoryLabel)

$repositoryTextBox = New-Object System.Windows.Forms.TextBox
$repositoryTextBox.Location = New-Object System.Drawing.Point(22, 116)
$repositoryTextBox.Size = New-Object System.Drawing.Size(540, 25)
$localRepository = Join-Path $dataRoot 'backups\local-repository'
$labeledVolumes = @(Get-Volume -FileSystemLabel 'MonaDentBackup' -ErrorAction SilentlyContinue | Where-Object { $_.DriveLetter })
if ($labeledVolumes.Count -eq 1) {
    $externalRepository = Join-Path ('{0}:\' -f $labeledVolumes[0].DriveLetter) 'MonaDentRestic'
    if (Test-Path -LiteralPath $externalRepository) { $repositoryTextBox.Text = $externalRepository }
}
if (-not $repositoryTextBox.Text -and (Test-Path -LiteralPath $localRepository)) { $repositoryTextBox.Text = $localRepository }
$form.Controls.Add($repositoryTextBox)

$repositoryBrowseButton = New-Object System.Windows.Forms.Button
$repositoryBrowseButton.Location = New-Object System.Drawing.Point(572, 114)
$repositoryBrowseButton.Size = New-Object System.Drawing.Size(110, 28)
$repositoryBrowseButton.Text = 'Browse...'
$repositoryBrowseButton.Add_Click({
    $dialog = New-Object System.Windows.Forms.FolderBrowserDialog
    $dialog.Description = 'Choose MonaDentRestic on the backup drive, or the local-repository folder on this PC.'
    $dialog.ShowNewFolderButton = $false
    if ($dialog.ShowDialog($form) -eq [System.Windows.Forms.DialogResult]::OK) { $repositoryTextBox.Text = $dialog.SelectedPath }
})
$form.Controls.Add($repositoryBrowseButton)

$keyLabel = New-Object System.Windows.Forms.Label
$keyLabel.Location = New-Object System.Drawing.Point(22, 157)
$keyLabel.Size = New-Object System.Drawing.Size(650, 22)
$keyLabel.Text = 'Recovery key file (the original key saved when this backup was made):'
$form.Controls.Add($keyLabel)

$keyTextBox = New-Object System.Windows.Forms.TextBox
$keyTextBox.Location = New-Object System.Drawing.Point(22, 181)
$keyTextBox.Size = New-Object System.Drawing.Size(540, 25)
$localKey = Join-Path $dataRoot 'backups\recovery-key.txt'
if (Test-Path -LiteralPath $localKey) { $keyTextBox.Text = $localKey }
$form.Controls.Add($keyTextBox)

$keyBrowseButton = New-Object System.Windows.Forms.Button
$keyBrowseButton.Location = New-Object System.Drawing.Point(572, 179)
$keyBrowseButton.Size = New-Object System.Drawing.Size(110, 28)
$keyBrowseButton.Text = 'Choose key...'
$keyBrowseButton.Add_Click({
    $dialog = New-Object System.Windows.Forms.OpenFileDialog
    $dialog.Title = 'Choose the original Mona Dent recovery key'
    $dialog.Filter = 'Recovery key (recovery-key.txt)|recovery-key.txt|Text files (*.txt)|*.txt|All files (*.*)|*.*'
    $dialog.CheckFileExists = $true
    if ($dialog.ShowDialog($form) -eq [System.Windows.Forms.DialogResult]::OK) { $keyTextBox.Text = $dialog.FileName }
})
$form.Controls.Add($keyBrowseButton)

$listButton = New-Object System.Windows.Forms.Button
$listButton.Location = New-Object System.Drawing.Point(22, 225)
$listButton.Size = New-Object System.Drawing.Size(170, 32)
$listButton.Text = 'Find available backups'
$form.Controls.Add($listButton)

$snapshotLabel = New-Object System.Windows.Forms.Label
$snapshotLabel.Location = New-Object System.Drawing.Point(22, 270)
$snapshotLabel.Size = New-Object System.Drawing.Size(640, 22)
$snapshotLabel.Text = 'Choose the backup to restore:'
$form.Controls.Add($snapshotLabel)

$snapshotCombo = New-Object System.Windows.Forms.ComboBox
$snapshotCombo.Location = New-Object System.Drawing.Point(22, 294)
$snapshotCombo.Size = New-Object System.Drawing.Size(660, 28)
$snapshotCombo.DropDownStyle = [System.Windows.Forms.ComboBoxStyle]::DropDownList
$form.Controls.Add($snapshotCombo)

$statusLabel = New-Object System.Windows.Forms.Label
$statusLabel.Location = New-Object System.Drawing.Point(22, 335)
$statusLabel.Size = New-Object System.Drawing.Size(660, 38)
$statusLabel.Text = 'Your current database and files will be replaced by the selected backup.'
$form.Controls.Add($statusLabel)

$restoreButton = New-Object System.Windows.Forms.Button
$restoreButton.Location = New-Object System.Drawing.Point(532, 380)
$restoreButton.Size = New-Object System.Drawing.Size(150, 32)
$restoreButton.Text = 'Restore selected backup'
$restoreButton.Enabled = $false
$form.Controls.Add($restoreButton)

$listButton.Add_Click({
    try {
        if (-not (Test-Path -LiteralPath $resticExecutable)) { throw 'The Mona Dent backup program is missing. Reinstall Mona Dent before restoring.' }
        if (-not (Test-Path -LiteralPath $repositoryTextBox.Text -PathType Container)) { throw 'Choose the MonaDentRestic folder on your backup drive.' }
        if (-not (Test-Path -LiteralPath $keyTextBox.Text -PathType Leaf)) { throw 'Choose the recovery key file saved separately from the PC and backup drive.' }
        Set-Status 'Checking the backup drive and recovery key...'
        $snapshotJson = Invoke-Restic @('--json', 'snapshots')
        $snapshotResult = ConvertFrom-Json $snapshotJson
        $snapshots = if ($snapshotResult -is [array]) { @($snapshotResult) } else { @($snapshotResult.snapshots) }
        if ($snapshots.Count -eq 0) { throw 'No backups were found in that folder.' }
        $snapshotCombo.Items.Clear()
        $script:snapshotLookup = @{}
        foreach ($snapshot in ($snapshots | Sort-Object -Property time -Descending)) {
            $timestamp = ([DateTimeOffset]::Parse($snapshot.time)).ToLocalTime().ToString('ddd, d MMM yyyy  h:mm tt')
            $hostName = if ($snapshot.hostname) { $snapshot.hostname } else { 'this PC' }
            $display = "$timestamp | $hostName | $($snapshot.id.Substring(0, 8))"
            [void]$snapshotCombo.Items.Add($display)
            $script:snapshotLookup[$display] = $snapshot
        }
        $snapshotCombo.SelectedIndex = 0
        $restoreButton.Enabled = $true
        Set-Status "Found $($snapshots.Count) backup(s). Choose the date you want to recover."
    } catch {
        $restoreButton.Enabled = $false
        [System.Windows.Forms.MessageBox]::Show($_.Exception.Message, 'Could not find backups', 'OK', 'Error') | Out-Null
        Set-Status 'Check the selected drive and recovery key, then try again.'
    }
})

$restoreButton.Add_Click({
    if ($snapshotCombo.SelectedIndex -lt 0) { return }
    $snapshot = $script:snapshotLookup[[string]$snapshotCombo.SelectedItem]
    $timestamp = ([DateTimeOffset]::Parse($snapshot.time)).ToLocalTime().ToString('dddd, d MMMM yyyy h:mm tt')
    $confirmation = [System.Windows.Forms.MessageBox]::Show(
        "Restore the backup from $timestamp?`r`n`r`nThis replaces all current clinic records and patient files with the selected backup. Any newer changes will be lost.",
        'Confirm restore', 'YesNo', 'Warning'
    )
    if ($confirmation -ne [System.Windows.Forms.DialogResult]::Yes) { return }

    $restoreButton.Enabled = $false
    $listButton.Enabled = $false
    $repositoryBrowseButton.Enabled = $false
    $keyBrowseButton.Enabled = $false
    $restoreStage = Join-Path $dataRoot ('.restore-' + [guid]::NewGuid().ToString('N'))
    $rollbackDump = Join-Path $restoreStage 'current-database.backup'
    $oldFiles = Join-Path $restoreStage 'previous-files'
    $newFiles = Join-Path $restoreStage 'restored-files'
    $filesMoved = $false
    $databaseChanged = $false
    $restoreAttempted = $false
    $rollbackFailed = $false
    $databaseUser = ''
    $databasePassword = ''
    $databaseName = 'clinic_db'
    $pgBin = ''
    $backupTaskDisabled = $false
    $wrapper = Join-Path $PSScriptRoot '..\MonaDentService.exe'
    $backupTaskName = 'MonaDent Daily Backup'

    try {
        if (-not (Test-Path -LiteralPath $configPath)) { throw 'Mona Dent configuration is missing. Reinstall Mona Dent before restoring.' }
        $databaseUser = Read-Property 'spring.datasource.username'
        $databasePassword = Read-Property 'spring.datasource.password'
        if (-not $databaseUser -or -not $databasePassword) { throw 'Mona Dent database settings are incomplete. Contact support before continuing.' }
        $pgBin = Get-PostgreSqlBin
        $pgRestore = Join-Path $pgBin 'pg_restore.exe'
        $pgDump = Join-Path $pgBin 'pg_dump.exe'
        if (-not (Test-Path -LiteralPath $pgRestore) -or -not (Test-Path -LiteralPath $pgDump)) { throw 'Mona Dent PostgreSQL restore tools are missing. Reinstall Mona Dent before restoring.' }

        New-Item -ItemType Directory -Force -Path (Split-Path -Parent $logPath) | Out-Null
        New-Item -ItemType Directory -Path $restoreStage | Out-Null
        $postgresService = Get-Service -Name 'MonaDentPostgreSQL' -ErrorAction Stop
        if ($postgresService.Status -ne 'Running') {
            Set-Status 'Starting the database service...'
            Set-Service -Name 'MonaDentPostgreSQL' -StartupType Automatic
            Start-Service -Name 'MonaDentPostgreSQL'
            $postgresService.WaitForStatus('Running', [TimeSpan]::FromSeconds(60))
        }

        Set-Status 'Reading the selected backup. This may take several minutes; keep this window open...'
        [void](Invoke-Restic @('restore', $snapshot.id, '--target', $restoreStage))
        $dumpFiles = @(Get-ChildItem -LiteralPath $restoreStage -Filter 'clinic_db.backup' -File -Recurse)
        if ($dumpFiles.Count -ne 1) { throw 'The selected backup does not contain exactly one database copy.' }
        $restoredDump = $dumpFiles[0].FullName
        $restoredDataRoot = $dumpFiles[0].Directory
        while ($restoredDataRoot -and $restoredDataRoot.Name -notin @('MonaDentData', 'MonaDent')) {
            $restoredDataRoot = $restoredDataRoot.Parent
        }
        if (-not $restoredDataRoot) { throw 'The backup folder layout is not recognized; no current data was changed.' }
        $restoredFiles = Join-Path $restoredDataRoot.FullName 'files'
        if (-not (Test-Path -LiteralPath $restoredFiles -PathType Container)) { throw 'The selected backup is missing the patient files folder; no current data was changed.' }
        $archiveCheck = & $pgRestore --list $restoredDump 2>&1
        if ($LASTEXITCODE -ne 0) { throw 'The database copy in this backup could not be opened; no current data was changed.' }

        Set-Status 'Preparing a safety copy of the current database...'
        $currentDatabaseSaved = $false
        $env:PGPASSWORD = $databasePassword
        try {
            $dumpOutput = & $pgDump --host 127.0.0.1 --port 5432 --username $databaseUser --format custom --file $rollbackDump $databaseName 2>&1
            $currentDatabaseSaved = $LASTEXITCODE -eq 0 -and (Test-Path -LiteralPath $rollbackDump) -and (Get-Item -LiteralPath $rollbackDump).Length -gt 0
        } finally { Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue }
        if (-not $currentDatabaseSaved) {
            $continueWithoutCopy = [System.Windows.Forms.MessageBox]::Show(
                "Mona Dent could not make a safety copy of the current database. A restore failure may require support to repair it. Continue with the selected backup?`r`n`r`n$($dumpOutput -join ' ')",
                'Current database could not be copied', 'YesNo', 'Warning'
            )
            if ($continueWithoutCopy -ne [System.Windows.Forms.DialogResult]::Yes) { throw 'Restore canceled. Your current files were not changed.' }
        }

        $backupTask = Get-ScheduledTask -TaskName $backupTaskName -ErrorAction SilentlyContinue
        if ($backupTask) {
            Disable-ScheduledTask -TaskName $backupTaskName -ErrorAction Stop | Out-Null
            $backupTaskDisabled = $true
        }
        Stop-ScheduledTask -TaskName $backupTaskName -ErrorAction SilentlyContinue

        Set-Status 'Stopping Mona Dent while records and files are restored...'
        if (-not (Test-Path -LiteralPath $wrapper)) { throw 'Mona Dent service controls are missing. Reinstall Mona Dent before restoring.' }
        Stop-MonaDentApplicationService

        $liveFiles = Join-Path $dataRoot 'files'
        if (Test-Path -LiteralPath $liveFiles) {
            Move-Item -LiteralPath $liveFiles -Destination $oldFiles
            $filesMoved = $true
        }
        Copy-Item -LiteralPath $restoredFiles -Destination $newFiles -Recurse -Force
        Move-Item -LiteralPath $newFiles -Destination $liveFiles

        Set-Status 'Restoring clinic records...'
        $env:PGPASSWORD = $databasePassword
        try {
            $restoreAttempted = $true
            $databaseChanged = $currentDatabaseSaved
            $databaseOutput = & $pgRestore --host 127.0.0.1 --port 5432 --username $databaseUser --dbname $databaseName `
                --clean --if-exists --exit-on-error --no-owner --no-privileges $restoredDump 2>&1
            if ($LASTEXITCODE -ne 0) { throw "Database restore failed. $($databaseOutput -join ' ')" }
        } finally { Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue }

        Set-Status 'Starting Mona Dent and checking the restored service...'
        if (Test-Path -LiteralPath $wrapper) { & $wrapper start | Out-Null }
        $appReady = $false
        $lastStartupError = 'The app has not responded yet.'
        for ($attempt = 0; $attempt -lt 90; $attempt++) {
            $appService = Get-Service -Name 'MonaDent' -ErrorAction SilentlyContinue
            if ($appService -and $appService.Status -eq 'Running') {
                try {
                    $response = Invoke-WebRequest -Uri 'http://127.0.0.1:8080/' -TimeoutSec 2 -UseBasicParsing
                    if ($response.StatusCode -eq 200) { $appReady = $true; break }
                    $lastStartupError = "The app returned HTTP $($response.StatusCode)."
                } catch { $lastStartupError = $_.Exception.Message }
            } else {
                $serviceState = if ($appService) { [string]$appService.Status } else { 'missing' }
                $lastStartupError = "Mona Dent service state: $serviceState."
            }
            if ($attempt % 5 -eq 0) { Set-Status "Waiting for Mona Dent to finish starting... (up to 6 minutes)" }
            Start-Sleep -Seconds 2
        }
        if (-not $appReady) {
            foreach ($applicationLog in @(
                (Join-Path $dataRoot 'logs\application-error.log'),
                (Join-Path $dataRoot 'logs\MonaDent.wrapper.log'),
                (Join-Path $dataRoot 'logs\MonaDent.out.log')
            )) {
                if (Test-Path -LiteralPath $applicationLog) {
                    Add-Content -LiteralPath $logPath -Value "--- Last lines from $applicationLog ---" -Encoding UTF8
                    Get-Content -LiteralPath $applicationLog -Tail 40 | Add-Content -LiteralPath $logPath -Encoding UTF8
                }
            }
            throw "Mona Dent did not become ready within 6 minutes. Last check: $lastStartupError. Automatic rollback will be attempted; see '$logPath' for startup details."
        }
        if (Test-Path -LiteralPath $oldFiles) { Remove-Item -LiteralPath $oldFiles -Recurse -Force }

        Remove-Item -LiteralPath $restoreStage -Recurse -Force
        [System.Windows.Forms.MessageBox]::Show('Mona Dent has been restored from the selected backup. Open Mona Dent and check that records and patient files are present.', 'Restore complete', 'OK', 'Information') | Out-Null
        Set-Status 'Restore completed. Check the app and confirm the recovered records.'
    } catch {
        $failure = $_.Exception.Message
        if ($filesMoved -and (Test-Path -LiteralPath $oldFiles)) {
            try {
                $liveFiles = Join-Path $dataRoot 'files'
                if (Test-Path -LiteralPath $liveFiles) { Remove-Item -LiteralPath $liveFiles -Recurse -Force }
                Move-Item -LiteralPath $oldFiles -Destination $liveFiles
            } catch {
                $rollbackFailed = $true
                $failure += "`r`nThe previous patient files could not be moved back automatically. Keep the folder '$restoreStage' and contact support."
            }
        }
        if ($databaseChanged -and (Test-Path -LiteralPath $rollbackDump) -and $pgBin) {
            try {
                $env:PGPASSWORD = $databasePassword
                & (Join-Path $pgBin 'pg_restore.exe') --host 127.0.0.1 --port 5432 --username $databaseUser --dbname $databaseName `
                    --clean --if-exists --exit-on-error --no-owner --no-privileges $rollbackDump 2>&1 | Out-Null
                if ($LASTEXITCODE -ne 0) { throw 'PostgreSQL did not accept the safety copy.' }
            } catch {
                $rollbackFailed = $true
                $failure += "`r`nAutomatic database rollback also failed. Keep the folder '$restoreStage' and contact support immediately."
            }
            finally { Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue }
        } elseif ($restoreAttempted) {
            $rollbackFailed = $true
            $failure += "`r`nA safety copy of the previous database was not available. Keep the folder '$restoreStage' and contact support before using Mona Dent."
        }
        if (Test-Path -LiteralPath $wrapper) { & $wrapper start | Out-Null }
        [System.Windows.Forms.MessageBox]::Show($failure, 'Restore could not finish', 'OK', 'Error') | Out-Null
        Set-Status 'Restore stopped. Review the message above; the backup itself was not changed.'
    } finally {
        if (Test-Path -LiteralPath $restoreStage) {
            # Keep staged data if automatic rollback failed so support can recover it.
            if ($rollbackFailed) {
                Add-Content -LiteralPath $logPath -Value "Restore staging retained at $restoreStage" -Encoding UTF8
            } else {
                Remove-Item -LiteralPath $restoreStage -Recurse -Force -ErrorAction SilentlyContinue
            }
        }
        if ($backupTaskDisabled) { Enable-ScheduledTask -TaskName $backupTaskName -ErrorAction SilentlyContinue | Out-Null }
        $restoreButton.Enabled = $true
        $listButton.Enabled = $true
        $repositoryBrowseButton.Enabled = $true
        $keyBrowseButton.Enabled = $true
    }
})

$form.Add_Shown({ $form.Activate() })
$form.Add_FormClosing({
    if (-not $restoreButton.Enabled -and -not $listButton.Enabled) { $_.Cancel = $true }
})
[void]$form.ShowDialog()
