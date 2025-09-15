# 🎯 Swasthya Health Card - DEMO MODE

## 🚀 **Quick Start for Hackathon Demo**

### **Step 1: Start Demo Server**
```bash
npm run demo
```
This will start the simplified demo server on port 5000.

### **Step 2: Start Frontend (in another terminal)**
```bash
npm run client
```
This will start the React frontend on port 3000.

**OR** Start both together:
```bash
npm run demo-dev
```

---

## 🎯 **Demo Login Credentials**

Use these pre-loaded accounts for immediate demo:

### **Patient Account 1**
- **Email**: `rajesh@demo.com`
- **Password**: `demo123`
- **User**: Dr. Rajesh Kumar (Diabetic patient with sample data)

### **Patient Account 2**  
- **Email**: `priya@demo.com`
- **Password**: `demo123`
- **User**: Priya Sharma (Asthma patient with sample data)

### **Healthcare Provider Account**
- **Email**: `amit@demo.com`
- **Password**: `demo123`
- **User**: Dr. Amit Verma (Healthcare provider)

---

## 🌐 **Demo URLs**

- **Frontend**: http://localhost:3000
- **API Health**: http://localhost:5000/health
- **Emergency Demo**: http://localhost:5000/e/EMG001

---

## 📋 **Demo Features to Show**

### **1. User Authentication**
- Login with demo credentials (instant login)
- No complex registration needed

### **2. Health Profile Management**
- View pre-loaded health profiles
- Edit profile information
- See allergies, medications, contacts

### **3. Medical Records**
- View existing sample medical records
- Add new medical records
- Edit/delete records
- Filter by type/date

### **4. QR Code & Emergency Access**
- View personal QR code
- Test emergency access via short URL
- Demo: http://localhost:5000/e/EMG001

### **5. Dashboard Features**
- Health statistics
- Recent records
- Quick actions

---

## 🎪 **Demo Script for Presentation**

### **Opening (1 min)**
"Hi, I'm presenting **Swasthya Health Card** - a digital health record system for Indian healthcare."

### **User Login (30 sec)**
1. Open http://localhost:3000
2. Login with `rajesh@demo.com` / `demo123`
3. "This is Dr. Rajesh Kumar, a diabetic patient"

### **Dashboard Tour (1 min)**  
1. Show dashboard with health stats
2. "Here we can see his health overview - diabetes, hypertension"
3. Show recent medical records

### **Health Profile (1 min)**
1. Go to Profile section
2. "Complete health profile with allergies, medications, emergency contacts"
3. Show comprehensive medical information

### **Medical Records (1.5 min)**
1. Go to Records section  
2. "Here are his medical records - blood tests, prescriptions"
3. Add a new record live
4. "Healthcare providers can add verified records"

### **Emergency Feature (1 min)**
1. Go to QR Code section
2. "This is the key feature - emergency access"
3. Open http://localhost:5000/e/EMG001 in new tab
4. "First responders can scan QR code to get critical info instantly"
5. "No login needed - immediate access to allergies, medications, contacts"

### **Closing (30 sec)**
"This solves the problem of accessing medical records during emergencies, especially important in Indian healthcare where paper records are common."

---

## ⚡ **Quick Demo Tips**

### **Pre-Demo Setup**
1. Have both terminals ready with servers running
2. Open browser tabs for frontend and emergency URL
3. Login with Dr. Rajesh's account
4. Keep emergency URL ready: http://localhost:5000/e/EMG001

### **Key Points to Highlight**
- **Instant Access**: No complex setup, works immediately
- **Emergency Focus**: QR code provides critical info without login
- **Complete Solution**: Profile + Records + Emergency access
- **Indian Healthcare**: Addresses paper record problems
- **Privacy**: Different visibility levels (private/shared/emergency)

### **Common Issues & Solutions**
- **Port conflicts**: Change PORT in demo-server.js if needed
- **CORS issues**: Both localhost:3000 and 3001 are allowed
- **Data reset**: Restart demo server to reset all data

---

## 🔄 **Data Reset**

The demo uses in-memory storage. To reset all data:
```bash
# Stop the demo server (Ctrl+C)
npm run demo
# Fresh start with original sample data
```

---

## 🎯 **Perfect for Hackathon Because:**

✅ **No Database Setup** - Uses in-memory storage  
✅ **Instant Login** - Pre-loaded demo accounts  
✅ **Sample Data** - Rich medical records ready to show  
✅ **No Dependencies** - Works offline  
✅ **Fast Demo** - 5-minute complete showcase  
✅ **Real Functionality** - All features working  

---

## 🏆 **Demo Success Checklist**

- [ ] Demo server starts without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] Can login with demo credentials
- [ ] Dashboard shows health data
- [ ] Medical records load properly
- [ ] Can add/edit records
- [ ] QR code page displays
- [ ] Emergency URL works: http://localhost:5000/e/EMG001
- [ ] Emergency page shows critical health info

**You're ready to impress the judges! 🚀**