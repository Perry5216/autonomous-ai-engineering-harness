@echo off
title Antigravity Chat Looper
pwsh -NoProfile -ExecutionPolicy Bypass -File "C:\Users\5216p\ezEngine\scripts\loop-chat.ps1" %*
if %ERRORLEVEL% NEQ 0 (
    powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Users\5216p\ezEngine\scripts\loop-chat.ps1" %*
)
pause
