# PowerShell script to start both backend and frontend
Write-Host "🚀 Starting Swasthya Health Card Application" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

# Check if backend is already running
if (Test-Port 5000) {
    Write-Host "✅ Backend server already running on port 5000" -ForegroundColor Yellow
} else {
    Write-Host "🔧 Starting backend server..." -ForegroundColor Cyan
    Start-Process "powershell" -ArgumentList "-Command", "cd '$PSScriptRoot'; npm start" -WindowStyle Normal
    
    # Wait for backend to start
    $backendStarted = $false
    $timeout = 30
    $elapsed = 0
    
    while (-not $backendStarted -and $elapsed -lt $timeout) {
        Start-Sleep -Seconds 2
        $elapsed += 2
        if (Test-Port 5000) {
            $backendStarted = $true
            Write-Host "✅ Backend server started successfully!" -ForegroundColor Green
        } else {
            Write-Host "⏳ Waiting for backend to start... ($elapsed/$timeout seconds)" -ForegroundColor Yellow
        }
    }
    
    if (-not $backendStarted) {
        Write-Host "❌ Backend failed to start within $timeout seconds" -ForegroundColor Red
        exit 1
    }
}

# Check if frontend is already running
if (Test-Port 5178) {
    Write-Host "✅ Frontend server already running on port 5178" -ForegroundColor Yellow
} else {
    Write-Host "🔧 Starting frontend server..." -ForegroundColor Cyan
    Start-Process "powershell" -ArgumentList "-Command", "cd '$PSScriptRoot/frontend'; npm start" -WindowStyle Normal
    
    # Wait for frontend to start
    Start-Sleep -Seconds 5
    if (Test-Port 5178) {
        Write-Host "✅ Frontend server started successfully!" -ForegroundColor Green
    } else {
        Write-Host "⏳ Frontend is starting... (this may take a minute)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🌐 Application URLs:" -ForegroundColor Green
Write-Host "   Frontend: http://localhost:5178" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "   API Test: http://localhost:5000/health" -ForegroundColor Cyan
Write-Host "   Debug:    http://localhost:5178/debug" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Demo Accounts (all use password: demo123):" -ForegroundColor Green
Write-Host "   - rajesh.kumar@demo.com (Dr. Rajesh Kumar)" -ForegroundColor Cyan
Write-Host "   - anita.sharma@demo.com (Ms. Anita Sharma)" -ForegroundColor Cyan
Write-Host "   - amit.patel@demo.com (Mr. Amit Patel)" -ForegroundColor Cyan
Write-Host "   - sunita.verma@demo.com (Mrs. Sunita Verma)" -ForegroundColor Cyan
Write-Host "   - sanjay.gupta@demo.com (Mr. Sanjay Gupta)" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔧 Troubleshooting:" -ForegroundColor Yellow
Write-Host "   - Check browser console for errors" -ForegroundColor White
Write-Host "   - Visit /debug route to test API connectivity" -ForegroundColor White
Write-Host "   - Ensure both servers are running" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop this script (servers will continue running)" -ForegroundColor Yellow

# Keep script running
try {
    while ($true) {
        Start-Sleep -Seconds 30
        
        # Check if servers are still running
        $backendOk = Test-Port 5000
        $frontendOk = Test-Port 5178
        
        if ($backendOk -and $frontendOk) {
            Write-Host "$(Get-Date -Format 'HH:mm:ss') - ✅ Both servers running" -ForegroundColor Green
        } else {
            if (-not $backendOk) {
                Write-Host "$(Get-Date -Format 'HH:mm:ss') - ❌ Backend server not responding" -ForegroundColor Red
            }
            if (-not $frontendOk) {
                Write-Host "$(Get-Date -Format 'HH:mm:ss') - ❌ Frontend server not responding" -ForegroundColor Red
            }
        }
    }
} catch {
    Write-Host "🛑 Monitoring stopped" -ForegroundColor Yellow
}