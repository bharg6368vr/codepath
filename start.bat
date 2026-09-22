@echo off
title CodePath Educational Platform - Launcher
cls
echo ====================================================
echo         CodePath Platform - One-Click Launcher
echo ====================================================
echo.
echo Cleaning up previous port bindings if any...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":4000" ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5001" ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

echo Starting all services (RAG AI + Node Server + React Client)...
echo.
cd /d "%~dp0\code_path"
node run-all.js
if errorlevel 1 (
    echo.
    echo An error occurred while launching. Retrying directly from root...
    cd /d "%~dp0"
    node run-all.js
)
pause
