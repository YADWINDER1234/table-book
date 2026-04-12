@echo off
REM Restaurant Web App - Quick Start Script (Windows)
REM This script automatically installs dependencies and starts both backend and frontend

echo 🍽️  Restaurant Web App - Quick Start
echo ====================================
echo.

REM Check if backend .env exists
if not exist "backend\.env" (
    echo Creating backend\.env from template...
    copy backend\.env.example backend\.env >nul
    echo [OK] Created backend\.env
    echo Please update backend\.env with your settings (MONGODB_URI, Stripe keys, etc.)
)

REM Check if frontend .env.local exists
if not exist "frontend\.env.local" (
    echo Creating frontend\.env.local from template...
    copy frontend\.env.example frontend\.env.local >nul
    echo [OK] Created frontend\.env.local
    echo Please update frontend\.env.local with your Stripe key
)

echo.
echo Installing backend dependencies...
cd backend
if not exist "node_modules" (
    call npm install >nul 2>&1
    if !errorlevel! equ 0 (
        echo [OK] Backend dependencies installed
    ) else (
        echo [FAIL] Failed to install backend dependencies
        exit /b 1
    )
) else (
    echo [OK] Backend dependencies already installed
)
cd ..

echo.
echo Installing frontend dependencies...
cd frontend
if not exist "node_modules" (
    call npm install >nul 2>&1
    if !errorlevel! equ 0 (
        echo [OK] Frontend dependencies installed
    ) else (
        echo [FAIL] Failed to install frontend dependencies
        exit /b 1
    )
) else (
    echo [OK] Frontend dependencies already installed
)
cd ..

echo.
echo Starting Backend...
echo Backend will run on http://localhost:5000
echo Backend seed data can be loaded with: npm run seed (from backend directory)
echo.
start "Backend Server" cmd /k "cd backend & npm run dev"

echo.
timeout /t 3 /nobreak

echo.
echo Starting Frontend...
echo Frontend will run on http://localhost:5173
echo.
start "Frontend Server" cmd /k "cd frontend & npm run dev"

echo.
echo ==================================================
echo ✨ Restaurant Web App is starting!
echo ==================================================
echo.
echo Backend:  http://localhost:5000/api/v1
echo Frontend: http://localhost:5173
echo.
echo Two new windows should open for backend and frontend servers.
echo Close those windows to stop the servers.
echo.
pause
