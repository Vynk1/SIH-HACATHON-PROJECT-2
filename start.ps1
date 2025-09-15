# Swasthya Health Card - Quick Start Script
Write-Host "🏥 Starting Swasthya Health Card Application..." -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if MongoDB is running (optional)
Write-Host "⚠️  Make sure MongoDB is running and update .env file with correct MONGO_URI" -ForegroundColor Yellow

# Check if .env exists
if (Test-Path ".env") {
    Write-Host "✅ Environment file found" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env file not found. Please configure it with your MongoDB and Cloudinary settings." -ForegroundColor Yellow
}

# Install dependencies if needed
Write-Host "📦 Checking dependencies..." -ForegroundColor Blue

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    npm install
}

if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm run install-client
}

Write-Host ""
Write-Host "🚀 Starting both backend and frontend servers..." -ForegroundColor Green
Write-Host "Backend API: http://localhost:5000" -ForegroundColor Blue
Write-Host "Frontend App: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Start the application
npm run dev
