# 🏥 Swasthya Health Card – Complete Application

**Digital Healthcare Management System** with Node.js/Express backend and React frontend.  
Features emergency QR access, medical records management, and user authentication.

## ⚡ Quick Start

```bash
# Install all dependencies
npm run install-all

# Start both backend and frontend
npm run dev
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📦 Features
- 🔐 **JWT Authentication** (patient, provider, admin roles)
- 👤 **Health Profiles** (blood group, allergies, medications, emergency contacts)
- 📋 **Medical Records** (prescriptions, reports, file uploads)
- 🆘 **Emergency QR Access** (public access for first responders)
- ☁️ **File Uploads** (Cloudinary integration)
- 📱 **Responsive Design** (React + Tailwind CSS)
- 🔒 **Security Features** (rate limiting, CORS protection)

## 🏗️ Tech Stack
- **Backend:** Node.js, Express, MongoDB, JWT, Cloudinary
- **Frontend:** React, Tailwind CSS, React Router, Axios
- **Database:** MongoDB with Mongoose ODM

## 📁 Project Structure
```
├── backend files (controllers, models, routes, middleware)
├── frontend/ (React application)
├── .env (environment configuration)
└── start.ps1 (Windows quick start script)
```

## 🔧 Setup Requirements

1. **Node.js** (v16+ recommended)
2. **MongoDB** (local installation or MongoDB Atlas)
3. **Cloudinary Account** (for file uploads)

## 📖 Complete Setup Guide

For detailed setup instructions, environment configuration, and troubleshooting, see:
**[SETUP.md](./SETUP.md)**

## 🚀 Available Scripts

- `npm run dev` - Start both frontend and backend
- `npm run server` - Backend only
- `npm run client` - Frontend only
- `npm run install-all` - Install all dependencies

## 🆘 Emergency Access Demo

The application includes a unique emergency access feature:
1. Users generate a QR code with their health information
2. Emergency responders can scan the QR code
3. Critical health information displays instantly without login

**Test it:** Create a profile → Generate QR → Access `/e/YOUR_PUBLIC_ID`

---

*This is a complete, production-ready healthcare management system suitable for hospitals, clinics, and personal health management.*
