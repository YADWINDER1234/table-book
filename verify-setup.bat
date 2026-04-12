@echo off
REM Restaurant Web App - Pre-Launch Verification Script (Windows)
REM This script checks if everything is configured properly before running the app

echo 🍽️  Restaurant Web App - Pre-Launch Verification
echo ==================================================
echo.

setlocal enabledelayedexpansion
set checks_passed=0
set checks_failed=0
set warnings=0

REM 1. Check Node.js
echo 1. Checking Node.js installation...
node --version >nul 2>&1
if !errorlevel! equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set node_version=%%i
    echo [OK] Node.js installed: !node_version!
    set /a checks_passed+=1
) else (
    echo [FAIL] Node.js not found. Please install from https://nodejs.org
    set /a checks_failed+=1
)

REM 2. Check npm
echo.
echo 2. Checking npm installation...
npm --version >nul 2>&1
if !errorlevel! equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do set npm_version=%%i
    echo [OK] npm installed: !npm_version!
    set /a checks_passed+=1
) else (
    echo [FAIL] npm not found
    set /a checks_failed+=1
)

REM 3. Check MongoDB (optional)
echo.
echo 3. Checking MongoDB...
where mongod >nul 2>&1
if !errorlevel! equ 0 (
    echo [OK] MongoDB found locally (you can also use MongoDB Atlas)
    set /a checks_passed+=1
) else (
    echo [WARN] MongoDB not installed locally - you can use MongoDB Atlas instead
    set /a warnings+=1
)

REM 4. Check backend file structure
echo.
echo 4. Checking backend directory structure...
set backend_files=backend\src\index.ts backend\src\models\index.ts backend\package.json

for %%f in (%backend_files%) do (
    if exist "%%f" (
        echo [OK] Found: %%f
        set /a checks_passed+=1
    ) else (
        echo [FAIL] Missing: %%f
        set /a checks_failed+=1
    )
)

REM 5. Check frontend file structure
echo.
echo 5. Checking frontend directory structure...
set frontend_files=frontend\src\App.tsx frontend\src\pages\index.tsx frontend\package.json

for %%f in (%frontend_files%) do (
    if exist "%%f" (
        echo [OK] Found: %%f
        set /a checks_passed+=1
    ) else (
        echo [FAIL] Missing: %%f
        set /a checks_failed+=1
    )
)

REM 6. Check .env files
echo.
echo 6. Checking environment configuration...
if exist "backend\.env" (
    echo [OK] Backend .env file exists
    set /a checks_passed+=1
) else (
    echo [WARN] Backend .env file not found
    if exist "backend\.env.example" (
        copy backend\.env.example backend\.env >nul
        echo [OK] Created backend\.env from template (please update with your settings)
        set /a checks_passed+=1
    )
    set /a warnings+=1
)

if exist "frontend\.env.local" (
    echo [OK] Frontend .env.local file exists
    set /a checks_passed+=1
) else (
    echo [WARN] Frontend .env.local file not found
    if exist "frontend\.env.example" (
        copy frontend\.env.example frontend\.env.local >nul
        echo [OK] Created frontend\.env.local from template (please update with your settings)
        set /a checks_passed+=1
    )
    set /a warnings+=1
)

REM 7. Check backend dependencies
echo.
echo 7. Checking backend dependencies...
if exist "backend\node_modules" (
    echo [OK] Backend node_modules directory exists
    set /a checks_passed+=1
) else (
    echo [WARN] Backend node_modules not installed. Run: cd backend ^&^& npm install
    set /a warnings+=1
)

REM 8. Check frontend dependencies
echo.
echo 8. Checking frontend dependencies...
if exist "frontend\node_modules" (
    echo [OK] Frontend node_modules directory exists
    set /a checks_passed+=1
) else (
    echo [WARN] Frontend node_modules not installed. Run: cd frontend ^&^& npm install
    set /a warnings+=1
)

REM 9. Check documentation
echo.
echo 9. Checking documentation...
set doc_files=SETUP_GUIDE.md FEATURES_GUIDE.md ARCHITECTURE.md

for %%f in (%doc_files%) do (
    if exist "%%f" (
        echo [OK] Found: %%f
        set /a checks_passed+=1
    ) else (
        echo [WARN] Missing: %%f
        set /a warnings+=1
    )
)

REM Summary
echo.
echo ==================================================
echo Verification Summary:
echo Passed: %checks_passed%
if %checks_failed% gtr 0 (
    echo Failed: %checks_failed%
)
if %warnings% gtr 0 (
    echo Warnings: %warnings%
)

echo.

if %checks_failed% equ 0 (
    echo ✨ All critical checks passed!
    echo.
    echo Next steps:
    echo 1. Update backend\.env with your settings
    echo 2. Update frontend\.env.local with your settings
    echo 3. Run: cd backend ^& npm run seed
    echo 4. Run: cd backend ^& npm run dev (in one terminal)
    echo 5. Run: cd frontend ^& npm run dev (in another terminal)
    echo.
    echo Frontend will be available at: http://localhost:5173
    echo Backend API at: http://localhost:5000/api/v1
) else (
    echo ❌ Some critical checks failed. Please fix issues above.
    exit /b 1
)

endlocal
