# Quick Start Script for JanConnect

Write-Host "🚀 Starting JanConnect..." -ForegroundColor Cyan

# Step 1: Kill existing process on port 5000
Write-Host "`n📌 Step 1: Checking for existing server on port 5000..." -ForegroundColor Yellow
$port5000Process = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($port5000Process) {
    Write-Host "   Found process $port5000Process on port 5000. Stopping it..." -ForegroundColor Yellow
    Stop-Process -Id $port5000Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "   ✓ Process stopped" -ForegroundColor Green
} else {
    Write-Host "   ✓ Port 5000 is available" -ForegroundColor Green
}

# Step 2: Start Backend Server
Write-Host "`n📌 Step 2: Starting Backend Server..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\server"
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "node server.js" -WindowStyle Normal
Start-Sleep -Seconds 3
Write-Host "   ✓ Backend server starting (check new window)" -ForegroundColor Green

# Step 3: Kill existing process on port 3000 (React)
Write-Host "`n📌 Step 3: Checking for existing client on port 3000..." -ForegroundColor Yellow
$port3000Process = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($port3000Process) {
    Write-Host "   Found process $port3000Process on port 3000. Stopping it..." -ForegroundColor Yellow
    Stop-Process -Id $port3000Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "   ✓ Process stopped" -ForegroundColor Green
} else {
    Write-Host "   ✓ Port 3000 is available" -ForegroundColor Green
}

# Step 4: Start Frontend Client
Write-Host "`n📌 Step 4: Starting Frontend Client..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\client"
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "npm start" -WindowStyle Normal
Write-Host "   ✓ Frontend client starting (check new window)" -ForegroundColor Green

Write-Host "`n✅ JanConnect is starting!" -ForegroundColor Green
Write-Host "`nℹ️  Two new windows opened:" -ForegroundColor Cyan
Write-Host "   1. Backend Server (http://localhost:5000)" -ForegroundColor White
Write-Host "   2. Frontend Client (http://localhost:3000)" -ForegroundColor White
Write-Host "`n⏳ Wait 10-15 seconds for both servers to fully start..." -ForegroundColor Yellow
Write-Host "`n🌐 Then open browser: http://localhost:3000/signup" -ForegroundColor Cyan

# Test endpoints after delay
Write-Host "`n⏰ Testing endpoints in 15 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host "`n🔍 Testing Backend Health..." -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET -ErrorAction Stop
    Write-Host "   ✓ Backend is healthy: $($health.message)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Backend health check failed" -ForegroundColor Red
}

Write-Host "`n🔍 Testing Agencies Endpoint..." -ForegroundColor Cyan
try {
    $agencies = Invoke-RestMethod -Uri "http://localhost:5000/api/agencies/public" -Method GET -ErrorAction Stop
    Write-Host "   ✓ Found $($agencies.Count) agencies" -ForegroundColor Green
    Write-Host "   First 3 agencies:" -ForegroundColor White
    $agencies | Select-Object -First 3 | ForEach-Object {
        Write-Host "      - $($_.name) ($($_.state))" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ✗ Agencies endpoint failed" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
}

Write-Host "`n🎉 Setup complete! Visit http://localhost:3000/signup to test" -ForegroundColor Green
