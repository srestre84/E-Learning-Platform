@echo off
REM 🚀 E-Learning Platform v2.0 - Production Deployment Script for Windows
REM Deploy Backend to Railway + Frontend to Vercel

echo 🎯 E-Learning Platform v2.0 - Production Deployment
echo ==================================================

REM Check if required tools are installed
echo 📋 Checking requirements...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed
    exit /b 1
)

where railway >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️ Railway CLI not found, installing...
    npm install -g @railway/cli
)

where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️ Vercel CLI not found, installing...
    npm install -g vercel
)

where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️ pnpm not found, installing...
    npm install -g pnpm
)

echo ✅ All requirements satisfied

REM Deploy Backend to Railway
echo 🚀 Deploying Backend to Railway...
cd Backend\Dev-learning-Platform

REM Build the application
echo 📦 Building backend...
call mvnw.cmd clean package -DskipTests

if %errorlevel% equ 0 (
    echo ✅ Backend build successful
) else (
    echo ❌ Backend build failed
    exit /b 1
)

REM Check if user is logged in to Railway
railway whoami >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️ Please login to Railway first:
    echo railway login
    echo railway link
    echo railway up
    pause
    exit /b 1
)

echo 🚀 Deploying to Railway...
railway up

cd ..\..

REM Wait a bit for backend to be ready
echo ⏳ Waiting for backend to be ready...
timeout /t 10 /nobreak >nul

REM Deploy Frontend to Vercel
echo 🎨 Deploying Frontend to Vercel...
cd Frontend

REM Install dependencies
echo 📦 Installing frontend dependencies...
call pnpm install

REM Build the application
echo 🏗️ Building frontend...
call pnpm run build

if %errorlevel% equ 0 (
    echo ✅ Frontend build successful
) else (
    echo ❌ Frontend build failed
    exit /b 1
)

REM Check if user is logged in to Vercel
vercel whoami >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️ Please login to Vercel first:
    echo vercel login
    echo vercel --prod
    pause
    exit /b 1
)

echo 🚀 Deploying to Vercel...
vercel --prod

cd ..

echo 🎉 Deployment completed successfully!
echo 📍 Backend: https://e-learning-platform-backend.railway.app
echo 📍 Frontend: https://e-learning-platform-v2.vercel.app
echo.
echo Press any key to continue...
pause >nul
