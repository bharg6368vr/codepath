@echo off
title CodePath Platform - Stop All Services
echo Stopping all CodePath background services...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":4000" ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5001" ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
echo Done. All CodePath ports (5173, 4000, 5001) are freed!
pause
