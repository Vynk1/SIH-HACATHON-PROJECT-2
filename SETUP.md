# Swasthya Health Card - Complete Setup Guide

This is a comprehensive digital health card system with a Node.js/Express backend and React frontend, featuring emergency QR code access, medical record management, and user authentication.

## 🎯 Project Overview

**Swasthya Health Card** is a digital healthcare management system that provides:

- **User Authentication** - JWT-based auth system with roles (patient, provider, admin)
- **Health Profile Management** - Personal health info, allergies, medications, emergency contacts
- **Medical Records** - Upload, organize, and manage medical documents with file attachments
- **Emergency QR Access** - Public QR code for first responders to access critical health information
- **Responsive Design** - Modern React frontend with Tailwind CSS

## 🏗️ Architecture

```
├── Backend (Node.js + Express + MongoDB)
│   ├── Authentication & Authorization (JWT)
│   ├── Health Profile Management
│   ├── Medical Records CRUD
│   ├── File Upload (Cloudinary)
│   ├── Public Emergency Access API
│   └── Admin Dashboard APIs
│
└── Frontend (React + Tailwind CSS)
    ├── Authentication Pages
    ├── Dashboard
    ├── Health Profile Management
    ├── Medical Records Interface
    ├── QR Code Generator
    └── Emergency Access Page
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16+ recommended)
- **MongoDB** (local or cloud instance)
- **Cloudinary Account** (for file uploads)

### 1. One-Command Setup (Recommended)

```bash
# Navigate to project root
cd SIH-HACATHON-PROJECT-2-main

# Install all dependencies (both backend and frontend)
npm run install-all

# Start both backend and frontend servers simultaneously
npm run dev
```

This will start:
- **Backend API** on `http://localhost:5000`
- **Frontend App** on `http://localhost:3000`

### 2. Alternative: PowerShell Quick Start (Windows)

```powershell
# Run the automated setup script
.\start.ps1
```

### 3. Manual Setup (if needed)

```bash
# Backend only
npm install
npm run server

# Frontend only (in separate terminal)
cd frontend
npm install
npm start
```

## 🔧 Environment Setup

Create and configure the `.env` file in the project root:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Database Configuration
MONGO_URI=mongodb://localhost:27017
# For MongoDB Atlas: MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net
MONGO_DB=swasthya_health_card

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES=7d

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5
```

## 🗄️ Database Setup

The application uses MongoDB. You can use either:

1. **Local MongoDB:**
   ```bash
   # Install MongoDB Community Edition
   # Start MongoDB service
   mongod
   ```

2. **MongoDB Atlas (Cloud):**
   - Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create cluster and get connection string
   - Update `MONGO_URI` in `.env`

## ☁️ Cloudinary Setup

1. Create free account at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret from dashboard
3. Update the Cloudinary configuration in `.env`

## 📱 Features Overview

### 🔐 Authentication System
- **Registration/Login** with JWT tokens
- **Role-based access** (patient, provider, admin)
- **Protected routes** and API endpoints

### 👤 Health Profile Management
- **Personal Information** (DOB, blood type, height, weight)
- **Medical Information** (allergies, chronic conditions, medications)
- **Emergency Contacts** with relationship and notes
- **Primary Physician** information
- **Public Emergency Summary** for QR code access

### 📋 Medical Records
- **CRUD Operations** for medical records
- **File Attachments** (PDF, images) via Cloudinary
- **Categorization** by type (prescription, report, diagnosis, treatment)
- **Search and Filtering** capabilities
- **Visibility Controls** (private, shared, emergency public)

### 🆘 Emergency QR System
- **Unique Public ID** generation for each user
- **QR Code Generation** for emergency access
- **Public Emergency Page** accessible without authentication
- **Emergency Access Logging** for security

### 📊 Dashboard
- **Health Statistics** overview
- **Quick Actions** for common tasks
- **Recent Records** preview
- **Profile Completion** status

## 🎨 UI/UX Features

- **Responsive Design** - Works on mobile, tablet, and desktop
- **Modern Interface** - Clean, healthcare-appropriate design
- **Accessibility** - Proper color contrast and semantic HTML
- **Loading States** - Skeleton screens and loading indicators
- **Error Handling** - User-friendly error messages

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### User Profile
- `GET /api/user/me` - Get user profile
- `POST /api/user/me/health` - Update health profile
- `GET /api/user/me/public-id` - Get public emergency ID

### Medical Records
- `GET /api/records` - List records (with filtering)
- `POST /api/records` - Create new record
- `GET /api/records/:id` - Get specific record
- `PATCH /api/records/:id` - Update record
- `DELETE /api/records/:id` - Delete record

### File Management
- `POST /api/files/upload` - Upload file to Cloudinary
- `DELETE /api/files/:id` - Delete file

### Public Emergency Access
- `GET /api/public/e/:publicId` - Get emergency data (no auth required)

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Rate Limiting** to prevent abuse
- **Input Validation** and sanitization
- **File Upload Security** with type and size restrictions
- **Emergency Access Logging** for audit trails
- **CORS Protection** for cross-origin requests

## 🧪 Testing the Application

### 1. User Registration and Login
1. Visit `http://localhost:3000/register`
2. Create a new account
3. Login with your credentials

### 2. Health Profile Setup
1. Navigate to Profile section
2. Fill in personal information, allergies, medications
3. Add emergency contacts
4. Save the profile

### 3. Medical Records
1. Go to Records section
2. Add a new medical record
3. Upload a file (PDF or image)
4. Test search and filtering

### 4. Emergency QR Code
1. Visit QR Code section
2. View your emergency QR code
3. Copy the emergency URL
4. Test emergency access in incognito mode

### 5. Emergency Access (Public)
1. Open `http://localhost:3000/e/YOUR_PUBLIC_ID` in incognito mode
2. Verify emergency information displays correctly
3. Test with different devices/screen sizes

## 🚨 Emergency Access Demo

The emergency access feature is designed for first responders:

1. **Generate QR Code** - Users get a unique QR code
2. **Emergency Scan** - Responders scan the QR code
3. **Instant Access** - Critical information displays immediately
4. **No Authentication Required** - Works without login
5. **Mobile Optimized** - Designed for mobile devices in emergency situations

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- **Mobile Phones** (320px+)
- **Tablets** (768px+)
- **Desktop** (1024px+)
- **Large Screens** (1440px+)

## 🛠️ Development Tips

### Frontend Development
```bash
# Run in development mode
cd frontend && npm start

# Build for production
cd frontend && npm run build
```

### Backend Development
```bash
# Run with nodemon for auto-restart
npm run dev

# Run in production mode
npm start
```

### Available Scripts

From the project root directory, you can run:

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend
- `npm run install-all` - Install dependencies for both frontend and backend
- `npm run install-client` - Install only frontend dependencies
- `npm run build` - Build frontend for production
- `npm start` - Start backend in production mode

### Common Issues

1. **CORS Errors:** Ensure `FRONTEND_URL` in `.env` matches your frontend URL (http://localhost:3000)
2. **MongoDB Connection:** Check MongoDB is running and connection string is correct
3. **File Uploads:** Verify Cloudinary credentials are correct
4. **JWT Errors:** Ensure `JWT_SECRET` is set in environment
5. **Port Conflicts:** Make sure ports 3000 and 5000 are available
6. **Dependencies:** Run `npm run install-all` if you encounter missing module errors

## 🌟 Key Features Implemented

✅ **Complete Backend API** - All endpoints functional  
✅ **React Frontend** - Modern UI with Tailwind CSS  
✅ **User Authentication** - Registration, login, JWT tokens  
✅ **Health Profile Management** - Comprehensive health data  
✅ **Medical Records CRUD** - Full record management  
✅ **File Upload System** - Cloudinary integration  
✅ **Emergency QR Access** - Public emergency information  
✅ **Responsive Design** - Mobile-first approach  
✅ **Error Handling** - Proper error messages and validation  
✅ **Security Features** - Rate limiting, auth middleware  

## 🚀 Production Deployment

For production deployment:

1. **Backend:** Deploy to services like Heroku, AWS, or DigitalOcean
2. **Frontend:** Deploy to Vercel, Netlify, or AWS S3
3. **Database:** Use MongoDB Atlas for production
4. **Environment:** Update all environment variables for production
5. **Security:** Use strong JWT secrets, enable HTTPS

## 📞 Support

This is a complete, production-ready healthcare management system suitable for:
- **Hospitals and Clinics**
- **Individual Health Management**
- **Emergency Medical Services**
- **Healthcare Providers**

The system includes all necessary features for a comprehensive digital health card solution with emergency access capabilities.
