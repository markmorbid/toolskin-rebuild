@echo off
REM ===================================================================
REM  Toolskin Tree Explorer  -  double-click to launch
REM  All machinery lives in the _tree-explorer folder next to this file.
REM ===================================================================
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Node.js is not installed or not on PATH.
  echo   Get it from https://nodejs.org  then run this again.
  echo.
  pause
  exit /b 1
)
if not exist "_tree-explorer\launch.js" (
  echo.
  echo   Could not find _tree-explorer\launch.js next to this file.
  echo   Keep Tree-Explorer.bat and the _tree-explorer folder together.
  echo.
  pause
  exit /b 1
)
node "_tree-explorer\launch.js"
