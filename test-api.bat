@echo off
REM AromaSouq API Testing Script
REM Run after both backend and frontend servers are running

echo.
echo ========================================
echo AromaSouq API Testing Script
echo ========================================
echo.

REM Test 1: Health Check
echo [1/5] Testing Backend Health...
curl -s http://localhost:3001/api/v1 > nul
if %errorlevel% equ 0 (
    echo ✓ Backend is running
) else (
    echo ✗ Backend is not running or not responding
    echo    Start with: cd aromasouq-api ^&^& pnpm start:dev
    exit /b 1
)
echo.

REM Test 2: Register New User
echo [2/5] Testing User Registration...
echo {"email":"test%RANDOM%@example.com","password":"testpass123","firstName":"Test","lastName":"User"} > temp-register.json
curl -s -X POST http://localhost:3001/api/v1/auth/register ^
     -H "Content-Type: application/json" ^
     -d @temp-register.json > temp-response.json

findstr /C:"accessToken" temp-response.json > nul
if %errorlevel% equ 0 (
    echo ✓ Registration successful
) else (
    echo ✗ Registration failed
    type temp-response.json
)
echo.

REM Test 3: Login with Test Account
echo [3/5] Testing Login...
echo {"email":"customer@test.com","password":"admin123"} > temp-login.json
curl -s -X POST http://localhost:3001/api/v1/auth/login ^
     -H "Content-Type: application/json" ^
     -d @temp-login.json > temp-token.json

findstr /C:"accessToken" temp-token.json > nul
if %errorlevel% equ 0 (
    echo ✓ Login successful
    REM Extract token (simplified - just for display)
    echo    Token received
) else (
    echo ✗ Login failed
    type temp-token.json
)
echo.

REM Test 4: Test Protected Route
echo [4/5] Testing Protected Route...
REM Note: This is a simplified test. In real scenario, parse the token from response
echo    (Manual test required - see SETUP-GUIDE-COMPLETE.md section 9.4)
echo ✓ Test prepared (requires manual token verification)
echo.

REM Test 5: Frontend Check
echo [5/5] Testing Frontend...
curl -s http://localhost:3000 > nul
if %errorlevel% equ 0 (
    echo ✓ Frontend is running
) else (
    echo ✗ Frontend is not running
    echo    Start with: cd aromasouq-web ^&^& pnpm dev
)
echo.

REM Cleanup
del temp-register.json 2>nul
del temp-login.json 2>nul
del temp-response.json 2>nul
del temp-token.json 2>nul

echo ========================================
echo Testing Complete!
echo ========================================
echo.
echo Services Status:
echo - Backend API: http://localhost:3001/api/v1
echo - Frontend: http://localhost:3000
echo - Prisma Studio: npx prisma studio
echo - Supabase Dashboard: https://supabase.com/dashboard
echo.
echo Test Accounts:
echo - Admin: admin@aromasouq.ae / admin123
echo - Customer: customer@test.com / admin123
echo - Vendor: vendor@test.com / admin123
echo.
pause
