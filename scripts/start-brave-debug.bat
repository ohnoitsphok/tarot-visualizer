@echo off
set "BRAVE_PATH=C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"
if not exist "%BRAVE_PATH%" (
    set "BRAVE_PATH=%LOCALAPPDATA%\BraveSoftware\Brave-Browser\Application\brave.exe"
)
if exist "%BRAVE_PATH%" (
    echo Starting Brave with remote debugging on port 9222...
    start "" "%BRAVE_PATH%" --remote-debugging-port=9222 --user-data-dir="%TEMP%\brave-debug-profile"
) else (
    echo Brave browser executable not found.
    exit /b 1
)
