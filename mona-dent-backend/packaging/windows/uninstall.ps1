param(
    [string]$InstallDirectory,
    [switch]$FinalizeAfterUninstaller,
    [int]$UninstallerProcessId = 0,
    [string]$UninstallerPath
)

$ErrorActionPreference = 'Stop'

$installDirectoryIsMonaDent = $InstallDirectory -and (
    $FinalizeAfterUninstaller -or
    (Test-Path -LiteralPath (Join-Path $InstallDirectory 'MonaDentService.exe')) -or
    (Test-Path -LiteralPath (Join-Path $InstallDirectory '_installer\uninstall.ps1'))
)
if ($installDirectoryIsMonaDent) {
    $InstallDirectory = [IO.Path]::GetFullPath($InstallDirectory).TrimEnd('\')
    if ($InstallDirectory -eq [IO.Path]::GetPathRoot($InstallDirectory).TrimEnd('\')) {
        throw "Refusing to remove a drive root: '$InstallDirectory'."
    }
    $protectedDirectories = @(
        [Environment]::GetFolderPath([Environment+SpecialFolder]::Windows),
        [Environment]::GetFolderPath([Environment+SpecialFolder]::ProgramFiles),
        [Environment]::GetFolderPath([Environment+SpecialFolder]::CommonApplicationData),
        $env:ProgramFiles,
        ${env:ProgramFiles(x86)},
        $env:ProgramW6432,
        $env:USERPROFILE
    ) | Where-Object { $_ } | ForEach-Object { [IO.Path]::GetFullPath($_).TrimEnd('\') }
    if ($protectedDirectories -contains $InstallDirectory) {
        throw "Refusing to remove a protected system directory: '$InstallDirectory'."
    }
} else {
    $InstallDirectory = $null
}

$programFilesRoots = @(
    $env:ProgramFiles,
    ${env:ProgramFiles(x86)},
    $env:ProgramW6432
) | Where-Object { $_ } | ForEach-Object { [IO.Path]::GetFullPath($_).TrimEnd('\') } | Select-Object -Unique
$programFilesProductRoots = @($programFilesRoots | ForEach-Object { Join-Path $_ 'Mona Dent' } | Select-Object -Unique)
$programFilesCleanupRoots = @($programFilesProductRoots | Where-Object {
    -not $InstallDirectory -or (
        -not $_.Equals($InstallDirectory, [StringComparison]::OrdinalIgnoreCase) -and
        -not $InstallDirectory.StartsWith($_ + '\', [StringComparison]::OrdinalIgnoreCase) -and
        -not $_.StartsWith($InstallDirectory + '\', [StringComparison]::OrdinalIgnoreCase)
    )
})
$productRoots = @($InstallDirectory) + $programFilesProductRoots
$productRoots = @($productRoots | Where-Object { $_ } | Select-Object -Unique)

function Test-PathInProductRoot([string]$Path) {
    if (-not $Path) { return $false }
    foreach ($root in $productRoots) {
        if ($root -and $root.Length -gt 3) {
            $fullRoot = [IO.Path]::GetFullPath($root).TrimEnd('\')
            $rootIndex = $Path.IndexOf($fullRoot, [StringComparison]::OrdinalIgnoreCase)
            if ($rootIndex -ge 0) {
                $characterAfterRoot = $rootIndex + $fullRoot.Length
                if ($characterAfterRoot -eq $Path.Length -or $Path[$characterAfterRoot] -in @('\', '"')) { return $true }
            }
        }
    }
    return $false
}

function Remove-DirectoryCompletely([string]$Path) {
    if (-not $Path) { return }
    $fullPath = [IO.Path]::GetFullPath($Path).TrimEnd('\')
    if (-not (Test-Path -LiteralPath $fullPath)) { return }
    if ($fullPath -eq [IO.Path]::GetPathRoot($fullPath).TrimEnd('\')) {
        throw "Refusing to remove a drive root: '$fullPath'."
    }

    # These paths are selected from Mona Dent's install/data roots, never by a
    # broad drive scan. Take ownership first because PostgreSQL owns its files.
    & icacls.exe $fullPath /setowner '*S-1-5-32-544' /T /C /Q 2>&1 | Out-Null
    & icacls.exe $fullPath /grant:r '*S-1-5-32-544:(OI)(CI)F' '*S-1-5-18:(OI)(CI)F' /T /C /Q 2>&1 | Out-Null
    Remove-Item -LiteralPath $fullPath -Recurse -Force -ErrorAction Stop
    if (Test-Path -LiteralPath $fullPath) {
        throw "Could not completely remove '$fullPath'."
    }
}

if ($FinalizeAfterUninstaller) {
    for ($attempt = 0; $attempt -lt 120; $attempt++) {
        $processStillRunning = $UninstallerProcessId -gt 0 -and (Get-Process -Id $UninstallerProcessId -ErrorAction SilentlyContinue)
        $uninstallerStillRunning = $false
        if ($UninstallerPath) {
            $uninstallerStillRunning = [bool](Get-CimInstance -ClassName Win32_Process -ErrorAction SilentlyContinue |
                Where-Object { $_.ExecutablePath -and $_.ExecutablePath.Equals($UninstallerPath, [StringComparison]::OrdinalIgnoreCase) } |
                Select-Object -First 1)
        }
        if (-not $processStillRunning -and -not $uninstallerStillRunning) { break }
        Start-Sleep -Seconds 1
    }

    $finalizeSucceeded = $false
    try {
        Remove-DirectoryCompletely $InstallDirectory
        foreach ($root in $programFilesProductRoots) {
            Remove-DirectoryCompletely $root
        }
        $finalizeSucceeded = $true
    } finally {
        Remove-Item -LiteralPath $PSCommandPath -Force -ErrorAction SilentlyContinue
        if ($finalizeSucceeded) {
            Remove-Item -LiteralPath (Join-Path $env:TEMP 'MonaDent-uninstall.log') -Force -ErrorAction SilentlyContinue
        }
    }
    exit 0
}

$dataRoot = Join-Path $env:ProgramData 'MonaDent'
$logPath = Join-Path $env:TEMP 'MonaDent-uninstall.log'

function Write-UninstallLog([string]$Message) {
    Add-Content -LiteralPath $logPath -Value "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message" -Encoding UTF8
}

trap {
    try { Write-UninstallLog "ERROR: $($_.Exception.Message)" } catch { }
    throw $_
}

Write-UninstallLog 'Complete Mona Dent removal started.'
$serviceDetails = @(Get-CimInstance -ClassName Win32_Service -ErrorAction SilentlyContinue)
$monaDentServices = @($serviceDetails | Where-Object {
    $servicePath = $_.PathName
    $_.Name -match '(?i)^MonaDent' -or (Test-PathInProductRoot $servicePath)
})

function Get-PostgreSqlServicePaths($Service) {
    if (-not $Service.PathName) { return $null }
    $exeMatch = [regex]::Match($Service.PathName, '(?i)^\s*"?(.+?\\pg_ctl\.exe)"?(?:\s|$)')
    $dataMatch = [regex]::Match($Service.PathName, '(?i)(?:^|\s)-D\s+(?:"([^"]+)"|(\S+))')
    if (-not $exeMatch.Success -or -not $dataMatch.Success) { return $null }
    $dataPath = if ($dataMatch.Groups[1].Success) { $dataMatch.Groups[1].Value } else { $dataMatch.Groups[2].Value }
    [pscustomobject]@{
        Executable = [IO.Path]::GetFullPath($exeMatch.Groups[1].Value)
        DataDirectory = [IO.Path]::GetFullPath($dataPath)
    }
}

$postgresDataDirectories = @($monaDentServices | ForEach-Object {
    $postgresPaths = Get-PostgreSqlServicePaths $_
    if ($postgresPaths) { $postgresPaths.DataDirectory }
}) + @((Join-Path $env:ProgramData 'MonaDent\PostgreSQL\data'))
$postgresDataDirectories = @($postgresDataDirectories | Where-Object { $_ } | Select-Object -Unique)

function Test-IsMonaDentPostgreSqlProcess($Process) {
    if ($Process.Name -notmatch '(?i)^postgres(?:\.exe)?$') { return $false }
    if (Test-PathInProductRoot $Process.ExecutablePath) { return $true }
    if (-not $Process.CommandLine) { return $false }
    foreach ($dataDirectory in $postgresDataDirectories) {
        if ($Process.CommandLine.IndexOf($dataDirectory, [StringComparison]::OrdinalIgnoreCase) -ge 0) { return $true }
    }
    return $false
}

function Get-ProcessTreeIds([int[]]$RootProcessIds, $ProcessSnapshot) {
    $allIds = @($RootProcessIds | Where-Object { $_ -gt 0 } | Select-Object -Unique)
    $frontier = @($allIds)
    while ($frontier.Count -gt 0) {
        $children = @($ProcessSnapshot | Where-Object { $_.ParentProcessId -in $frontier } | ForEach-Object { [int]$_.ProcessId } |
            Where-Object { $_ -gt 0 -and $_ -notin $allIds } | Select-Object -Unique)
        if ($children.Count -eq 0) { break }
        $allIds += $children
        $frontier = $children
    }
    return $allIds
}

function Stop-ProcessTrees([int[]]$RootProcessIds, [string]$Reason) {
    $snapshot = @(Get-CimInstance -ClassName Win32_Process -ErrorAction SilentlyContinue)
    $treeIds = @(Get-ProcessTreeIds $RootProcessIds $snapshot)
    foreach ($processId in ($treeIds | Where-Object { $_ -ne $PID } | Select-Object -Unique -Reverse)) {
        try {
            Stop-Process -Id $processId -Force -ErrorAction Stop
            Write-UninstallLog "Force-stopped process PID $processId ($Reason)."
        } catch {
            if (Get-Process -Id $processId -ErrorAction SilentlyContinue) {
                Write-UninstallLog "Could not stop PID $processId ($Reason): $($_.Exception.Message)"
            }
        }
    }
}

foreach ($service in $monaDentServices) {
    $postgresPaths = Get-PostgreSqlServicePaths $service
    if ($postgresPaths -and (Test-Path -LiteralPath $postgresPaths.Executable)) {
        Write-UninstallLog "Requesting a clean PostgreSQL shutdown: '$($postgresPaths.Executable)' stop -D '$($postgresPaths.DataDirectory)' -m fast -w."
        $pgCtlOutput = & $postgresPaths.Executable stop -D $postgresPaths.DataDirectory -m fast -w -t 60 2>&1
        $pgCtlExitCode = $LASTEXITCODE
        foreach ($line in $pgCtlOutput) { Write-UninstallLog "pg_ctl stop: $line" }
        if ($pgCtlExitCode -ne 0) {
            Write-UninstallLog "pg_ctl stop returned $pgCtlExitCode; requesting shutdown through the Windows service manager."
        }
    }

    try {
        $current = Get-Service -Name $service.Name -ErrorAction SilentlyContinue
        if ($current -and $current.Status -ne 'Stopped') {
            Stop-Service -Name $service.Name -Force -ErrorAction Stop
        }
    } catch {
        Write-UninstallLog "Could not stop service '$($service.Name)' through PowerShell: $($_.Exception.Message)"
    }
    $serviceStopOutput = & sc.exe stop $service.Name 2>&1
    foreach ($line in $serviceStopOutput) { Write-UninstallLog "sc stop: $line" }
    for ($attempt = 0; $attempt -lt 90; $attempt++) {
        $current = Get-Service -Name $service.Name -ErrorAction SilentlyContinue
        if (-not $current -or $current.Status -eq 'Stopped') { break }
        Start-Sleep -Seconds 1
    }
    $current = Get-Service -Name $service.Name -ErrorAction SilentlyContinue
    if ($current -and $current.Status -ne 'Stopped') {
        $serviceDetails = Get-CimInstance -ClassName Win32_Service -Filter "Name='$($service.Name)'" -ErrorAction SilentlyContinue
        if ($serviceDetails -and $serviceDetails.ProcessId -gt 0) {
            Stop-ProcessTrees @([int]$serviceDetails.ProcessId) "service $($service.Name) would not stop"
        }
        for ($attempt = 0; $attempt -lt 30; $attempt++) {
            $current = Get-Service -Name $service.Name -ErrorAction SilentlyContinue
            if (-not $current -or $current.Status -eq 'Stopped') { break }
            Start-Sleep -Seconds 1
        }
        $current = Get-Service -Name $service.Name -ErrorAction SilentlyContinue
        if ($current -and $current.Status -ne 'Stopped') {
            throw "PostgreSQL service '$($service.Name)' did not stop (current state: $($current.Status)); database files were left in place."
        }
    }
    Write-UninstallLog "Verified service '$($service.Name)' is stopped."
}

# Stop Mona Dent and PostgreSQL processes by executable path. Exclude this
# cleanup process and its Inno Setup parent; the finalizer removes {app} after
# the uninstaller exits.
$processes = @(Get-CimInstance -ClassName Win32_Process -ErrorAction SilentlyContinue)
$currentProcess = $processes | Where-Object { $_.ProcessId -eq $PID } | Select-Object -First 1
$excludedProcessIds = @($PID, [int]$currentProcess.ParentProcessId)
$serviceProcessIds = @($monaDentServices | Where-Object { $_.ProcessId -gt 0 } | ForEach-Object { [int]$_.ProcessId })
$serviceTreeIds = @(Get-ProcessTreeIds $serviceProcessIds $processes)
$matchingProcesses = @($processes | Where-Object {
    $_.ProcessId -notin $excludedProcessIds -and
    ($_.Name -match '(?i)^MonaDent' -or
        (Test-PathInProductRoot $_.ExecutablePath) -or
        (Test-IsMonaDentPostgreSqlProcess $_) -or
        $_.ProcessId -in $serviceTreeIds)
})
if ($matchingProcesses.Count -gt 0) {
    $matchedProcessIds = @($matchingProcesses | ForEach-Object { [int]$_.ProcessId })
    Stop-ProcessTrees $matchedProcessIds 'Mona Dent application or database cleanup'
}
for ($attempt = 0; $attempt -lt 30; $attempt++) {
    $remainingProcesses = @(Get-CimInstance -ClassName Win32_Process -ErrorAction SilentlyContinue | Where-Object {
        $_.ProcessId -notin $excludedProcessIds -and
        ($_.Name -match '(?i)^MonaDent' -or
            (Test-PathInProductRoot $_.ExecutablePath) -or
            (Test-IsMonaDentPostgreSqlProcess $_) -or
            $_.ProcessId -in $serviceTreeIds)
    })
    if ($remainingProcesses.Count -eq 0) { break }
    $remainingProcessIds = @($remainingProcesses | ForEach-Object { [int]$_.ProcessId })
    Stop-ProcessTrees $remainingProcessIds 'remaining Mona Dent process'
    Start-Sleep -Seconds 1
}
if ($remainingProcesses.Count -gt 0) {
    $remainingDescription = ($remainingProcesses | ForEach-Object { "$($_.Name) (PID $($_.ProcessId))" }) -join ', '
    throw "Mona Dent processes are still running: $remainingDescription. Their files were kept."
}

foreach ($service in $monaDentServices) {
    $deleteOutput = & sc.exe delete $service.Name 2>&1
    $deleteExitCode = $LASTEXITCODE
    foreach ($line in $deleteOutput) { Write-UninstallLog "sc delete: $line" }
    if ($deleteExitCode -ne 0) {
        throw "Could not remove stopped Windows service '$($service.Name)' (sc.exe exit code $deleteExitCode). Database and application folders were left in place."
    }
}

$finalProcessCheck = @(Get-CimInstance -ClassName Win32_Process -ErrorAction SilentlyContinue | Where-Object {
    $_.Name -match '(?i)^MonaDent' -or
    (Test-PathInProductRoot $_.ExecutablePath) -or
    (Test-IsMonaDentPostgreSqlProcess $_) -or
    $_.ProcessId -in $serviceTreeIds
})
if ($finalProcessCheck.Count -gt 0) {
    $stillRunning = ($finalProcessCheck | ForEach-Object { "$($_.Name) (PID $($_.ProcessId))" }) -join ', '
    throw "Mona Dent or PostgreSQL processes are still running: $stillRunning. Their files have not been deleted."
}
foreach ($service in $monaDentServices) {
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        if (-not (Get-Service -Name $service.Name -ErrorAction SilentlyContinue)) { break }
        Start-Sleep -Seconds 1
    }
    if (Get-Service -Name $service.Name -ErrorAction SilentlyContinue) {
        throw "Windows service '$($service.Name)' is still present; its files have been kept so they are not removed while active."
    }
    Write-UninstallLog "Removed service '$($service.Name)'."
}

try {
    Get-NetFirewallRule -DisplayName 'Mona Dent application' -ErrorAction SilentlyContinue |
        Remove-NetFirewallRule -ErrorAction SilentlyContinue
} catch { }

# Remove per-user settings, logs, and shortcuts for every local profile.
$profiles = @(Get-CimInstance -ClassName Win32_UserProfile -ErrorAction SilentlyContinue |
    Where-Object { $_.LocalPath -and (Test-Path -LiteralPath $_.LocalPath) } |
    ForEach-Object { $_.LocalPath })
$profiles += @($env:USERPROFILE)
$profiles = @($profiles | Where-Object { $_ } | Select-Object -Unique)
foreach ($profile in $profiles) {
    foreach ($relativePath in @(
        'AppData\Local\MonaDent',
        'AppData\LocalLow\MonaDent',
        'AppData\Roaming\MonaDent',
        'AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Mona Dent'
    )) {
        Remove-DirectoryCompletely (Join-Path $profile $relativePath)
    }
    Get-ChildItem -LiteralPath (Join-Path $profile 'AppData\Local\Temp') -Filter 'MonaDent*' -Force -ErrorAction SilentlyContinue |
        ForEach-Object { Remove-Item -LiteralPath $_.FullName -Recurse -Force -ErrorAction SilentlyContinue }
    Remove-Item -LiteralPath (Join-Path $profile 'Desktop\Mona Dent.lnk') -Force -ErrorAction SilentlyContinue
}
Remove-Item -LiteralPath (Join-Path $env:PUBLIC 'Desktop\Mona Dent.lnk') -Force -ErrorAction SilentlyContinue
Remove-DirectoryCompletely (Join-Path $env:ProgramData 'Microsoft\Windows\Start Menu\Programs\Mona Dent')

Remove-DirectoryCompletely $dataRoot
foreach ($root in $programFilesCleanupRoots) {
    Remove-DirectoryCompletely $root
}

foreach ($temporaryPath in @(
    (Join-Path $env:TEMP 'MonaDent-postgresql-install-debug.log'),
    (Join-Path $env:TEMP 'MonaDent-postgresql-repair-debug.log'),
    (Join-Path $env:TEMP 'install-postgresql.log'),
    (Join-Path $env:TEMP 'MonaDent-uninstall.log')
)) {
    Remove-Item -LiteralPath $temporaryPath -Force -ErrorAction SilentlyContinue
}

# Inno Setup is still running from the application folder. Copy this script to
# TEMP and let a small finalizer remove that folder after the uninstaller exits.
$uninstallerProcessId = [int]$currentProcess.ParentProcessId
$finalizerScript = Join-Path $env:TEMP "MonaDent-FinalizeUninstall-$PID.ps1"
Copy-Item -LiteralPath $PSCommandPath -Destination $finalizerScript -Force
$finalizerArguments = '-NoProfile -ExecutionPolicy Bypass -File "{0}" -FinalizeAfterUninstaller -UninstallerProcessId {1} -UninstallerPath "{2}" -InstallDirectory "{3}"' -f $finalizerScript, $uninstallerProcessId, $UninstallerPath, $InstallDirectory
Start-Process -FilePath 'powershell.exe' -ArgumentList $finalizerArguments -WindowStyle Hidden | Out-Null
Write-UninstallLog 'Mona Dent data, services, processes, and shared folders were removed; the finalizer will remove the active install folder after uninstall exits.'
