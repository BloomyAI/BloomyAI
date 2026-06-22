@echo off
echo Starting Bloomy AI...
echo.
echo Starting Next.js application (includes integrated backend)...
echo The backend API is now integrated into the Next.js app via API routes.
echo.
cd /d "%~dp0web"
call npm run dev
if errorlevel 1 (
    echo.
    echo Error occurred. Press any key to exit...
    pause
)
