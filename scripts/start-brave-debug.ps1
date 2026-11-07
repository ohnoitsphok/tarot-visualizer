$bravePaths = @(
    "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe",
    "$env:LOCALAPPDATA\BraveSoftware\Brave-Browser\Application\brave.exe"
)

$target = $bravePaths | Where-Object { Test-Path $_ } | Select-Object -First 1

if ($target) {
    Write-Host "Starting Brave with remote debugging on port 9222..." -ForegroundColor Cyan
    $profileDir = Join-Path $env:TEMP "brave-debug-profile"
    Start-Process $target -ArgumentList "--remote-debugging-port=9222", "--user-data-dir=`"$profileDir`""
} else {
    Write-Error "Brave browser executable not found."
    exit 1
}
