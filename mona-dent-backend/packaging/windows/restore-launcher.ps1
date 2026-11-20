$ErrorActionPreference = 'Stop'
$logPath = Join-Path $env:ProgramData 'MonaDent\logs\restore.log'
$restoreScript = Join-Path $PSScriptRoot 'restore.ps1'

try {
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $logPath) | Out-Null
    Add-Content -LiteralPath $logPath -Value "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Starting restore window." -Encoding UTF8
    if (-not (Test-Path -LiteralPath $restoreScript -PathType Leaf)) {
        throw "The restore program is missing: $restoreScript"
    }
    & $restoreScript
} catch {
    $details = $_ | Out-String
    try {
        New-Item -ItemType Directory -Force -Path (Split-Path -Parent $logPath) | Out-Null
        Add-Content -LiteralPath $logPath -Value "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] ERROR: $details" -Encoding UTF8
    } catch { }

    try {
        Add-Type -AssemblyName System.Windows.Forms
        [System.Windows.Forms.MessageBox]::Show(
            "The restore window could not start.`r`n`r`n$details`r`nDetails were saved to:`r`n$logPath",
            'Mona Dent Backup Restore',
            [System.Windows.Forms.MessageBoxButtons]::OK,
            [System.Windows.Forms.MessageBoxIcon]::Error
        ) | Out-Null
    } catch {
        Write-Error "The restore window could not start. See '$logPath'. $details"
        Read-Host 'Press Enter to close this window'
    }
}
