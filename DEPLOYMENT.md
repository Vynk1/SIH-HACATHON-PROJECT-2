# 🚀 Swasthya Health Card - Production Deployment Guide

## ✅ **All Issues Fixed & Production Ready**

Your SIH Hackathon project has been successfully upgraded with production-ready features:

### 🔧 **Issues Fixed**

1. ✅ **MongoDB Connection** - Enhanced with retry logic, proper error handling, and connection monitoring
2. ✅ **Environment Variables** - Production-ready configuration with `.env.example` template  
3. ✅ **Comprehensive Logging** - Winston logger with file rotation, structured logging, and error tracking
4. ✅ **API Documentation** - Complete Swagger/OpenAPI documentation with interactive UI

---

## 🏗️ **Production Setup**

### 1. **Database Setup**

#### Option A: MongoDB Atlas (Recommended)
1. Create a MongoDB Atlas account at https://cloud.mongodb.com
2. Create a new cluster
3. Create a database user with appropriate permissions
4. Update your `.env` file:
```bash
MONGO_URI=mongodb+srv://username:password@cluster-name.mongodb.net/
MONGO_DB=swasthya_health_card
```

#### Option B: Local MongoDB
```bash
# Install MongoDB locally
MONGO_URI=mongodb://localhost:27017/swasthya_health_card
```

### 2. **Environment Configuration**

Create a production `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

**Critical Settings to Update:**

```bash
# Production Environment
NODE_ENV=production
PORT=5000

# Security (CHANGE THESE!)
JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters_long
SESSION_SECRET=your_super_secure_session_secret_key

# Database
MONGO_URI=your_mongodb_connection_string
MONGO_DB=swasthya_health_card

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
FRONTEND_URL=https://your-frontend-domain.com

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs/

# Security Headers & CORS
CORS_ORIGIN=https://your-frontend-domain.com
```

### 3. **Install Dependencies**

```bash
npm install --production
```

### 4. **Start the Server**

```bash
# Development
npm run dev

# Production  
npm start
```

---

## 📚 **API Documentation**

### **Interactive Swagger UI**
- **URL**: `http://localhost:5000/api-docs`
- **Features**: 
  - Interactive API testing
  - JWT authentication support
  - Request/response examples
  - Schema definitions

### **OpenAPI Specification**
- **JSON**: `http://localhost:5000/api-docs.json`
- **Use with**: Postman, Insomnia, API clients

### **Health Check**
- **URL**: `http://localhost:5000/health`
- **Returns**: Server status, database connectivity, API endpoints

---

## 🔒 **Security Features**

### **Authentication**
- JWT-based authentication
- Secure password hashing (bcrypt)
- Token expiration handling
- Role-based access control

### **Rate Limiting**
- Authentication endpoints: 5 attempts per 15 minutes
- General endpoints: 100 requests per 15 minutes
- Configurable via environment variables

### **CORS Protection**
- Configurable allowed origins
- Secure headers enabled
- Credentials support

### **Input Validation**
- Mongoose schema validation
- Email normalization
- Required field validation

---

## 📝 **Logging System**

### **Log Levels**
- `error`: Error conditions
- `warn`: Warning conditions  
- `info`: Informational messages
- `debug`: Debug information

### **Log Files** (in `./logs/` directory)
- `app-YYYY-MM-DD.log`: General application logs
- `error-YYYY-MM-DD.log`: Error logs only
- Automatic rotation and cleanup

### **Structured Logging**
```json
{
  "timestamp": "2024-01-15 10:30:45",
  "level": "info",
  "message": "User Action",
  "meta": {
    "action": "login",
    "userId": "64f8b123456789abc",
    "requestId": "req-123",
    "ip": "192.168.1.1"
  }
}
```

---

## 🚀 **Deployment Options**

### **1. Railway/Heroku**
```bash
# Add environment variables in platform dashboard
# Deploy directly from GitHub
```

### **2. DigitalOcean/AWS/GCP**
```bash
# Install Node.js and MongoDB
# Clone repository
# Set environment variables
# Run with PM2:
npm install -g pm2
pm2 start server.js --name "swasthya-api"
```

### **3. Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 🔍 **Monitoring & Health Checks**

### **Health Endpoint**
```bash
GET /health
```
**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "environment": "production",
  "version": "1.0.0",
  "database": "connected",
  "endpoints": {
    "auth": "/api/auth",
    "user_profile": "/api/user",
    "medical_records": "/api/records",
    "files": "/api/files",
    "public_emergency": "/api/public",
    "admin": "/api/admin"
  }
}
```

### **Log Monitoring**
- Real-time error tracking
- Request/response logging
- Performance metrics
- Security event logging

---

## 🧪 **Testing**

### **Run Tests**
```bash
# Backend unit tests
npm test

# Backend integration tests  
npm run test:watch

# Test coverage
npm run test:coverage
```

### **API Testing with Swagger**
1. Visit `http://localhost:5000/api-docs`
2. Click "Authorize" and enter JWT token
3. Test endpoints interactively

---

## 📊 **Performance Optimization**

### **Database Optimization**
- Connection pooling (max 10 connections)
- Query optimization with indexes
- Mongoose lean queries where appropriate

### **Logging Optimization**
- File rotation (max 20MB per file)
- Automatic cleanup (14 days retention)
- Structured JSON logging

### **Security Optimization**
- JWT token management
- Rate limiting
- Input sanitization

---

## 🐛 **Troubleshooting**

### **MongoDB Connection Issues**
```bash
# Check connection string
# Verify database user permissions
# Check network connectivity
# Review logs in ./logs/error-*.log
```

### **Authentication Issues**
```bash
# Verify JWT_SECRET is set
# Check token expiration
# Review rate limiting logs
```

### **File Upload Issues**
```bash
# Verify Cloudinary credentials
# Check file size limits
# Review upload middleware logs
```

---

## ✅ **Production Checklist**

- [ ] MongoDB Atlas setup and connection tested
- [ ] All environment variables configured
- [ ] JWT secrets changed from defaults
- [ ] Cloudinary credentials configured
- [ ] CORS origins configured for production domain
- [ ] SSL/HTTPS enabled
- [ ] Log monitoring configured
- [ ] Rate limiting configured appropriately
- [ ] Health checks working
- [ ] API documentation accessible
- [ ] Frontend-backend integration tested
- [ ] Error monitoring setup (optional: Sentry)
- [ ] Backup strategy implemented

---

## 📞 **Support**

Your SIH project is now production-ready with enterprise-grade features:

- ✅ **Professional logging system**
- ✅ **Comprehensive API documentation**  
- ✅ **Robust error handling**
- ✅ **Security best practices**
- ✅ **Production-ready database connection**

**Happy deploying! 🎉**