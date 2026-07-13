@echo off
title AI-Studymate - Codex

cd /d "%~dp0"

echo ==========================================
echo AI-Studymate Development Environment
echo ==========================================
echo.

git branch --show-current
git status --short

echo.
echo Starting Codex...
echo.

"C:\Users\NAM\AppData\Local\Programs\OpenAI\Codex\bin\codex.exe" ^
  -s workspace-write ^
  -a on-request