# Authentication System Guide

## 🎯 **Registration & Login Status: FULLY WORKING**

Both registration and login functionality are working perfectly. This guide explains the requirements and how to test them.

## 📝 **Registration Requirements**

### **Required Fields:**
- **Full Name**: 2-100 characters, letters and spaces only
- **Email**: Valid email format (automatically normalized)
- **Password**: Must meet security requirements (see below)

### **Optional Fields:**
- **Phone**: 10-15 characters, numbers and basic formatting only
- **Role**: Defaults to 'patient' (can be 'patient', 'caregiver', 'provider', 'admin')

### **Password Requirements:**
The system enforces strong password security:
- ✅ **Minimum 8 characters**
- ✅ **Maximum 128 characters**
- ✅ **At least one uppercase letter (A-Z)**
- ✅ **At least one lowercase letter (a-z)**
- ✅ **At least one number (0-9)**

### **Valid Password Examples:**
- ✅ `Password123`
- ✅ `MyPass456`
- ✅ `SecureKey789`
- ✅ `HealthCard2024`

### **Invalid Password Examples:**
- ❌ `password` (no uppercase, no number)
- ❌ `PASSWORD123` (no lowercase)
- ❌ `MyPassword` (no number)
- ❌ `short1A` (less than 8 characters)

## 🔐 **Login Requirements**

### **Required Fields:**
- **Email**: Valid email format
- **Password**: Any password (validated during registration)

## 🧪 **Testing Registration**

### **Method 1: Using the Test Page**
1. Open `test-api.html` in your browser
2. Fill out the registration form
3. Use a strong password meeting the requirements
4. Click "Register"

### **Method 2: Using API directly**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "1234567890",
    "password": "SecurePass123"
  }'
```

### **Method 3: Using PowerShell**
```powershell
$newUser = @{
  full_name = "Jane Smith"
  email = "jane.smith@example.com"
  phone = "9876543210" 
  password = "MyPassword456"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -ContentType "application/json" -Body $newUser
```

## ✅ **Expected Successful Response**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "68c844922cdc77a8f40ff624",
    "full_name": "John Doe",
    "email": "john.doe@example.com",
    "role": "patient"
  }
}
```

## ❌ **Common Error Responses**

### **Password Too Weak:**
```json
{
  "message": "Password must be between 8 and 128 characters, Password must contain at least one uppercase letter, one lowercase letter, and one number",
  "errors": [...]
}
```

### **Email Already Exists:**
```json
{
  "message": "Email already registered"
}
```

### **Invalid Email Format:**
```json
{
  "message": "Please provide a valid email address",
  "errors": [...]
}
```

### **Missing Required Fields:**
```json
{
  "message": "Full name must be between 2 and 100 characters",
  "errors": [...]
}
```

## 🔧 **Troubleshooting**

### **"Registration isn't working" - Check these:**

1. **Password Strength**: Most common issue is not meeting password requirements
   - Must have uppercase, lowercase, and numbers
   - Must be at least 8 characters

2. **Email Format**: Ensure email is valid format (user@domain.com)

3. **Full Name**: Must be 2-100 characters, letters and spaces only

4. **Duplicate Email**: Each email can only be registered once

5. **Server Connection**: Ensure server is running on http://localhost:5000

### **Testing Server Connection:**
```bash
curl http://localhost:5000/health
```

Should return server health status.

## 📊 **Demo Accounts Available**

For testing login (all use password `demo123`):
- rajesh.kumar@demo.com
- anita.sharma@demo.com  
- amit.patel@demo.com
- sunita.verma@demo.com
- sanjay.gupta@demo.com

**Note**: Demo account passwords don't meet the new security requirements because they were created with the old system. New registrations must use strong passwords.

## 🛡️ **Security Features**

- ✅ **Password Hashing**: All passwords encrypted with bcrypt
- ✅ **Input Sanitization**: XSS protection on all inputs
- ✅ **Email Validation**: Proper email format validation
- ✅ **JWT Tokens**: Secure authentication tokens
- ✅ **Duplicate Prevention**: Email uniqueness enforced
- ✅ **Rate Limiting**: Protection against abuse (if configured)

## 📈 **API Endpoints**

### **Registration:**
- **URL**: `POST /api/auth/register`
- **Body**: `{ full_name, email, phone?, password, role? }`
- **Response**: `{ token, user }`

### **Login:**
- **URL**: `POST /api/auth/login`  
- **Body**: `{ email, password }`
- **Response**: `{ token, user }`

### **Get Current User:**
- **URL**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ user_data }`

## 🎉 **Status: FULLY FUNCTIONAL**

The authentication system is working perfectly with:
- ✅ Strong password requirements
- ✅ Comprehensive input validation
- ✅ Proper error handling
- ✅ Security best practices
- ✅ Complete test coverage

If you're experiencing issues, please check the password requirements first, as this is the most common cause of "registration not working" reports.