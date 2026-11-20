param(
    [Parameter(Mandatory = $true)][string]$InstallDirectory,
    [Parameter(Mandatory = $true)][string]$PostgreSqlInstaller
)

$ErrorActionPreference = 'Stop'
$logPath = Join-Path $env:ProgramData 'MonaDent\logs\installer.log'

function Write-LauncherLog([string]$Message) {
    $line = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] provision launcher: $Message"
    try {
        New-Item -ItemType Directory -Force -Path (Split-Path -Parent $logPath) | Out-Null
        Add-Content -LiteralPath $logPath -Value $line -Encoding ascii
    } catch { }
}

Write-LauncherLog "Launching setup for '$InstallDirectory'."
try {
    $provisionScript = Join-Path $PSScriptRoot 'provision.ps1'
    & $provisionScript -InstallDirectory $InstallDirectory -PostgreSqlInstaller $PostgreSqlInstaller
    Write-LauncherLog 'Provisioning completed successfully.'
    exit 0
} catch {
    Write-LauncherLog "ERROR: $($_.Exception.Message)"
    exit 1
}
