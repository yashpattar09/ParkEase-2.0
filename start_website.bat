@echo off
echo ================================================
echo ParkEase Website Launcher
echo ================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js is installed!
echo.

REM Navigate to backend directory
cd /d "%~dp0backend"

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
)

echo Dependencies are ready!
echo.

REM Start the server
echo Starting ParkEase server...
echo.
echo ================================================
echo Server is running on http://localhost:3000
echo Press Ctrl+C to stop the server
echo ================================================
echo.

REM Start server and open browser
start "" "http://localhost:3000"
node server.js

pause
