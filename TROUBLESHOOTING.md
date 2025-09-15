# 🔧 Authentication Issues Troubleshooting Guide

## Quick Fix Summary
Your authentication system **IS WORKING** on the backend! The issues you're experiencing are likely frontend-related or due to server configuration.

## 🎯 **IMMEDIATE SOLUTIONS**

### Option 1: Use the Debug Script (Recommended)
```powershell
# Run this in PowerShell as Administrator
.\start-debug.ps1
```

### Option 2: Manual Server Restart
1. **Stop all servers** (Ctrl+C in all terminal windows)
2. **Restart backend**:
   ```bash
   npm run server
   ```
3. **In a new terminal, restart frontend**:
   ```bash
   cd frontend
   npm start
   ```

## 🔍 **DIAGNOSIS RESULTS**

✅ **Backend Authentication**: WORKING
- Registration endpoint: ✅ Working
- Login endpoint: ✅ Working  
- Password validation: ✅ Working
- Database connection: ✅ Working

❓ **Potential Issues**:
- CORS configuration (fixed)
- Frontend-backend communication
- Port conflicts
- Browser cache

## 🛠️ **STEP-BY-STEP FIXES**

### 1. CORS Issues (FIXED)
- **Problem**: Frontend on port 5174, backend only allowed port 3000
- **Solution**: Updated server.js to allow multiple ports
- **Status**: ✅ Fixed

### 2. Validation Middleware (FIXED)
- **Problem**: HTML escaping was breaking normal input
- **Solution**: Updated sanitization to be less aggressive
- **Status**: ✅ Fixed

### 3. Test Everything Works
Open the debug page in your browser:
1. Navigate to project folder
2. Open `debug-frontend.html` in your browser
3. Test registration and login

## 🧪 **TESTING METHODS**

### Method 1: Browser Debug Page
1. Open `debug-frontend.html` in your browser
2. Fill in the registration form:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `Password123` (must have uppercase, lowercase, number)
3. Click "Register"
4. If successful, try login with same credentials

### Method 2: PowerShell Testing
```powershell
# Test Registration
$body = @{
    full_name = "Test User"
    email = "test@example.com" 
    password = "Password123"
    role = "patient"
} | ConvertTo-Json

$headers = @{ "Content-Type" = "application/json" }
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -Headers $headers
```

### Method 3: React Frontend
1. Ensure both servers are running
2. Go to http://localhost:3000 (or the port shown in terminal)
3. Click "Sign up here"
4. Fill the form with:
   - Full Name: `Test User`
   - Email: `unique@example.com`
   - Password: `Password123`
   - Confirm Password: `Password123`

## 🚨 **COMMON ISSUES & SOLUTIONS**

### Issue: "Registration Failed" 
**Solutions**:
1. Check password meets requirements (8+ chars, uppercase, lowercase, number)
2. Use unique email address
3. Check server is running on port 5000
4. Clear browser cache and localStorage

### Issue: "CORS Error"
**Solutions**:
1. Restart the backend server (the CORS fix is applied)
2. Check frontend URL in browser console
3. Verify server logs show CORS origins

### Issue: "Network Error"
**Solutions**:
1. Verify backend is running: http://localhost:5000/health
2. Check firewall isn't blocking ports 5000 or 3000
3. Try different browser

### Issue: "Login After Registration Fails"
**Solutions**:
1. Ensure you're using the exact same credentials
2. Check if email was normalized (converted to lowercase)
3. Try manual login test first

## 📋 **VALIDATION REQUIREMENTS**

### Password Requirements:
- ✅ Minimum 8 characters
- ✅ At least 1 uppercase letter (A-Z)
- ✅ At least 1 lowercase letter (a-z)  
- ✅ At least 1 number (0-9)

### Examples:
- ✅ `Password123`
- ✅ `MySecure1`
- ✅ `Test1234`
- ❌ `password` (no uppercase/numbers)
- ❌ `PASSWORD123` (no lowercase)
- ❌ `Test` (too short)

## 🔄 **IF STILL NOT WORKING**

### 1. Full Clean Reset
```bash
# Stop all servers
# Delete node_modules
rm -rf node_modules frontend/node_modules
# Reinstall everything
npm install
cd frontend && npm install && cd ..
# Restart
npm run server
# In new terminal:
cd frontend && npm start
```

### 2. Check Browser Developer Tools
1. Open F12 Developer Tools
2. Go to Network tab
3. Try registration
4. Look for red/failed requests
5. Check Console tab for JavaScript errors

### 3. Environment Variables
Ensure `.env` file exists with:
```
PORT=5000
MONGO_URI=mongodb+srv://alumni_admin:SPECTRA-X@alumni001.csb34gd.mongodb.net/
MONGO_DB=swasthya_health_card
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES=7d
FRONTEND_URL=http://localhost:3000
```

## 📞 **GET HELP**

If you're still having issues, please provide:
1. Error message from browser console (F12)
2. Server terminal output
3. Network requests from browser dev tools
4. Results from the debug HTML page test

## ✅ **SUCCESS INDICATORS**

You'll know it's working when:
1. ✅ Debug HTML page shows "Registration successful!"
2. ✅ Frontend registration redirects to dashboard
3. ✅ Login works with registered credentials
4. ✅ No CORS errors in browser console
5. ✅ Backend health endpoint returns status "ok"

---

**Remember**: The backend is working perfectly! The issue is likely just a frontend/CORS/caching problem that can be resolved with a proper restart and cache clear.