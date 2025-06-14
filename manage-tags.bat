@echo off
echo QUANTUM TOOLS Tag Management System
echo --------------------------------
echo.
echo Available commands:
echo.
echo 1. Run Tag Audit Report
echo 2. Add Tag Manager to all pages
echo 3. Watch for new pages (continuous monitoring)
echo 4. Exit
echo.

:menu
set /p choice=Enter your choice (1-4): 

if "%choice%"=="1" goto audit
if "%choice%"=="2" goto add_tags
if "%choice%"=="3" goto watch
if "%choice%"=="4" goto end

echo Invalid choice. Try again.
echo.
goto menu

:audit
echo.
echo Running Tag Audit...
node tag-auditor.js
echo.
echo Press any key to return to the menu...
pause >nul
cls
goto start

:add_tags
echo.
echo Adding Tag Manager to all pages...
node tag-auto-manager.js
echo.
echo Press any key to return to the menu...
pause >nul
cls
goto start

:watch
echo.
echo Starting Tag Manager Watch Mode...
echo (Press Ctrl+C to stop)
echo.
node tag-auto-manager.js --watch
goto start

:end
echo.
echo Thank you for using the QUANTUM TOOLS Tag Management System!
echo.
timeout /t 2 >nul
exit

:start
echo QUANTUM TOOLS Tag Management System
echo --------------------------------
echo.
echo Available commands:
echo.
echo 1. Run Tag Audit Report
echo 2. Add Tag Manager to all pages
echo 3. Watch for new pages (continuous monitoring)
echo 4. Exit
echo.
goto menu
