# CORS Test Script for E-Learning Platform (PowerShell)
Write-Host "Testing CORS Configuration..." -ForegroundColor Cyan

$BACKEND_URL = "https://e-learning-platform-1-oupq.onrender.com"
$FRONTEND_URL = "https://e-learning-platform-v2.netlify.app"

Write-Host "Backend URL: $BACKEND_URL"
Write-Host "Frontend URL: $FRONTEND_URL"
Write-Host ""

# Test OPTIONS request
Write-Host "Testing OPTIONS preflight request..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$BACKEND_URL/api/courses" -Method OPTIONS -Headers @{
        "Origin" = $FRONTEND_URL
        "Access-Control-Request-Method" = "GET"
    } -UseBasicParsing
    
    Write-Host "Status: $($response.StatusCode)"
    $response.Headers | Where-Object { $_.Key -like "*Access-Control*" } | ForEach-Object {
        Write-Host "$($_.Key): $($_.Value)"
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "CORS test completed!"
