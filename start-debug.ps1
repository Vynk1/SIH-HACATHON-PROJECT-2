# PowerShell script to start and debug the application
Write-Host "🚀 Starting Swasthya Health Card Application Debug Mode" -ForegroundColor Cyan

# Check if Node.js is installed
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if backend dependencies are installed
Write-Host "📦 Checking backend dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "📥 Installing backend dependencies..." -ForegroundColor Yellow
    npm install
}

# Check if frontend dependencies are installed
Write-Host "📦 Checking frontend dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "📥 Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
}

# Start backend server in background
Write-Host "🔧 Starting backend server..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm run server
}

# Wait a bit for server to start
Start-Sleep -Seconds 5

# Test backend connectivity
Write-Host "🔍 Testing backend connectivity..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method GET -TimeoutSec 10
    Write-Host "✅ Backend server is running and healthy!" -ForegroundColor Green
    Write-Host "   Database status: $($health.database)" -ForegroundColor Cyan
    Write-Host "   Server status: $($health.status)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Backend server is not responding!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "🔧 Attempting to restart backend..." -ForegroundColor Yellow
    Stop-Job $backendJob -Force
    Remove-Job $backendJob -Force
    exit 1
}

Write-Host ""
Write-Host "🧪 TESTING AUTHENTICATION ENDPOINTS" -ForegroundColor Magenta
Write-Host "=" * 50 -ForegroundColor Gray

# Test Registration
Write-Host "1️⃣ Testing Registration..." -ForegroundColor Yellow
$testUser = @{
    full_name = "Debug Test User"
    email = "debug.test.$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
    password = "DebugTest123"
    role = "patient"
} | ConvertTo-Json

$headers = @{ "Content-Type" = "application/json" }

try {
    $registerResult = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $testUser -Headers $headers
    Write-Host "✅ Registration test passed!" -ForegroundColor Green
    $testUserData = $testUser | ConvertFrom-Json
    
    # Test Login
    Write-Host "2️⃣ Testing Login..." -ForegroundColor Yellow
    $loginData = @{
        email = $testUserData.email
        password = $testUserData.password
    } | ConvertTo-Json
    
    $loginResult = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginData -Headers $headers
    Write-Host "✅ Login test passed!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Authentication test failed!" -ForegroundColor Red
    Write-Host "   Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🌐 Starting frontend server..." -ForegroundColor Yellow
Write-Host "Frontend will be available at: http://localhost:3000 (or another port if 3000 is taken)" -ForegroundColor Cyan

# Start frontend
Set-Location frontend
Write-Host ""
Write-Host "🎯 FRONTEND STARTING - Watch for any errors in the console below:" -ForegroundColor Magenta
Write-Host "=" * 60 -ForegroundColor Gray

# Start frontend (this will block)
npm start