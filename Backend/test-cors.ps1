# CORS Test Script for E-Learning Platform (PowerShell)
# This script tests CORS configuration for your deployed backend

Write-Host "🔍 Testing CORS Configuration..." -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Backend URL (update this with your actual Render URL)
$BACKEND_URL = "https://e-learning-platform-1-oupq.onrender.com"
$FRONTEND_URL = "https://e-learning-platform-v2.netlify.app"

Write-Host "Backend URL: $BACKEND_URL" -ForegroundColor Yellow
Write-Host "Frontend URL: $FRONTEND_URL" -ForegroundColor Yellow
Write-Host ""

# Test 1: Preflight request (OPTIONS)
Write-Host "1. Testing OPTIONS preflight request..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$BACKEND_URL/api/courses" -Method OPTIONS -Headers @{
        "Origin" = $FRONTEND_URL
        "Access-Control-Request-Method" = "GET"
        "Access-Control-Request-Headers" = "Content-Type,Authorization"
    } -UseBasicParsing
    
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    $response.Headers | Where-Object { $_.Key -like "*Access-Control*" } | ForEach-Object {
        Write-Host "$($_.Key): $($_.Value)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. Testing actual GET request..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$BACKEND_URL/api/courses" -Method GET -Headers @{
        "Origin" = $FRONTEND_URL
        "Content-Type" = "application/json"
    } -UseBasicParsing
    
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    $response.Headers | Where-Object { $_.Key -like "*Access-Control*" } | ForEach-Object {
        Write-Host "$($_.Key): $($_.Value)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ CORS test completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Expected results:" -ForegroundColor Yellow
Write-Host "- Access-Control-Allow-Origin should include your Netlify URL" -ForegroundColor White
Write-Host "- Access-Control-Allow-Methods should include GET,POST,PUT,DELETE,OPTIONS" -ForegroundColor White
Write-Host "- Access-Control-Allow-Headers should include * or specific headers" -ForegroundColor White
Write-Host "- Access-Control-Allow-Credentials should be true" -ForegroundColor White
