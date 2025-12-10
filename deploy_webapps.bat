
@echo off
setlocal ENABLEEXTENSIONS
cd /d %~dp0

REM --- Configuration ---
set "FRONTEND_DIR=apps\frontend"
set "BACKEND_DIR=apps\backend"
set "SHARED_DIR=packages\shared"
set "WEBAPPS_DIR=webapps"
set "SERVER_DIR=%WEBAPPS_DIR%\server"
set "PUBLIC_DIR=%WEBAPPS_DIR%\public"
set "ENV_FILE=%FRONTEND_DIR%\.env"
set "ENV_PROD=%FRONTEND_DIR%\.env.prod"
set "ENV_DEV=%FRONTEND_DIR%\.env.dev"

REM --- Pre-checks ---
echo [INFO] Current dir: %cd%
where pnpm || (echo [ERROR] pnpm not found in PATH & goto :fail)
if not exist "%FRONTEND_DIR%" (echo [ERROR] Missing: %FRONTEND_DIR% & goto :fail)
if not exist "%BACKEND_DIR%" (echo [ERROR] Missing: %BACKEND_DIR% & goto :fail)
if not exist "%SHARED_DIR%"   (echo [ERROR] Missing: %SHARED_DIR%   & goto :fail)
if not exist "%ENV_PROD%"     (echo [ERROR] Missing: %ENV_PROD%     & goto :fail)
if not exist "%ENV_DEV%"      (echo [ERROR] Missing: %ENV_DEV%      & goto :fail)

echo [INFO] Pre-checks OK.

REM --- 1) Set frontend .env to production ---
echo [STEP] Copy .env.prod -^> .env
copy /Y "%ENV_PROD%" "%ENV_FILE%" >nul || goto :fail

REM --- 2) Build steps ---
echo [STEP] pnpm run shared:build
call pnpm run shared:build || goto :fail

echo [STEP] pnpm run frontend:build
call pnpm run frontend:build || goto :fail

echo [STEP] pushd %BACKEND_DIR%
pushd "%BACKEND_DIR%" || goto :fail

echo [STEP] pnpm prisma generate
call pnpm prisma generate || (popd & goto :fail)

echo [STEP] pnpm run build
call pnpm run build || (popd & goto :fail)

popd

REM --- 3) Stage artifacts ---
echo [STEP] Clean and recreate webapps
if exist "%WEBAPPS_DIR%" rmdir /S /Q "%WEBAPPS_DIR%"
mkdir "%PUBLIC_DIR%" || goto :fail
mkdir "%SERVER_DIR%" || goto :fail
mkdir "%SERVER_DIR%\dist" || goto :fail
mkdir "%SERVER_DIR%\node_modules" || goto :fail

echo [STEP] Copy frontend dist -^> webapps\public
xcopy "%FRONTEND_DIR%\dist" "%PUBLIC_DIR%" /s /i /y || goto :fail

echo [STEP] Copy backend dist -^> webapps\server\dist
xcopy "%BACKEND_DIR%\dist" "%SERVER_DIR%\dist" /s /i /y || goto :fail

echo [STEP] Copy Prisma client -^> server\node_modules
for /f "delims=" %%i in ('dir /b "node_modules\.pnpm\@prisma+client*"') do (
  xcopy "node_modules\.pnpm\%%i\node_modules" "%SERVER_DIR%\node_modules" /s /i /y || goto :fail
)

echo [STEP] Copy shared -^> @pxa-re-management\shared
mkdir "%SERVER_DIR%\node_modules\@pxa-re-management" >nul 2>nul
xcopy "%SHARED_DIR%" "%SERVER_DIR%\node_modules\@pxa-re-management\shared" /s /i /y || goto :fail

echo [STEP] Copy backend package.json -^> server
copy /Y "%BACKEND_DIR%\package.json" "%SERVER_DIR%" >nul || goto :fail

echo [INFO] Build artifacts staged under '%WEBAPPS_DIR%'.

REM --- 4) Restore frontend .env to development ---
echo [STEP] Restore .env.dev -^> .env
copy /Y "%ENV_DEV%" "%ENV_FILE%" >nul || goto :fail

echo [SUCCESS] Deployment steps completed.
exit /b 0

:fail
  echo [FAILED] Deployment aborted.
  exit /b 1
