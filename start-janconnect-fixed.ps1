Write-Host "🚀 Starting JanConnect..." -ForegroundColor Cyan
Write-Host ""

# Kill existing processes
Write-Host "🧹 Cleaning up old processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start Backend
Write-Host "📦 Starting Backend Server..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd d:\SIH\JanConnect\server; Write-Host '🔧 Backend Server' -ForegroundColor Cyan; Write-Host ''; node server.js"

Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Test backend
Write-Host "🧪 Testing backend..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -TimeoutSec 5
    Write-Host "✅ Backend is running: $($health.message)" -ForegroundColor Green
    
    $agencies = Invoke-RestMethod -Uri "http://localhost:5000/api/agencies/public" -TimeoutSec 5
    Write-Host "✅ Agencies endpoint working: Found $($agencies.Count) agencies" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend test failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "⚠️  Check the backend terminal window for errors" -ForegroundColor Yellow
}

Write-Host ""

# Start Frontend
Write-Host "🎨 Starting Frontend Client..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd d:\SIH\JanConnect\client; Write-Host '💻 Frontend Client' -ForegroundColor Cyan; Write-Host ''; npm start"

Write-Host ""
Write-Host "✨ JanConnect Started!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Signup:   http://localhost:3000/signup" -ForegroundColor White
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Wait for browser to open automatically" -ForegroundColor White
Write-Host "   2. Navigate to http://localhost:3000/signup" -ForegroundColor White
Write-Host "   3. Press F12 to open browser console" -ForegroundColor White
Write-Host "   4. Select role 'Agency-User'" -ForegroundColor White
Write-Host "   5. Check if agency dropdown shows 16 agencies" -ForegroundColor White
Write-Host ""
Write-Host "🐛 Troubleshooting:" -ForegroundColor Yellow
Write-Host "   - If dropdown is empty, check browser console (F12)" -ForegroundColor White
Write-Host "   - Look for 'Fetching agencies from:' log" -ForegroundColor White
Write-Host "   - Check backend terminal for errors" -ForegroundColor White
Write-Host "   - Read: AGENCIES-FINAL-FIX.md" -ForegroundColor White
Write-Host ""
