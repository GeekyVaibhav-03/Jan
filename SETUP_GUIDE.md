# 🚀 JanSathi 2.0 - Complete Setup Guide

## ✅ What's Included

This production-ready MVP includes:

### **Backend (Node.js + Express + MongoDB)**
- ✅ Express server running on port 5000
- ✅ MongoDB models for complaint storage
- ✅ Google Generative AI integration (Gemini 1.5 Flash)
- ✅ RESTful API endpoints
- ✅ Complaint classification and routing logic
- ✅ Error handling and validation

### **Frontend (React + Vite)**
- ✅ Citizen portal with form validation
- ✅ Location geolocation integration  
- ✅ Admin dashboard with analytics
- ✅ Bar charts (Complaints by Department)
- ✅ Pie charts (Priority Distribution)
- ✅ Real-time data table with filtering
- ✅ Light theme with Tailwind CSS
- ✅ Responsive design for mobile & desktop

---

## 🛠️ Prerequisites (One-Time Setup)

### 1. **Install Node.js**
- Download from [nodejs.org](https://nodejs.org/)
- Verify: `node --version` and `npm --version`

### 2. **Install MongoDB**

**Option A: Local Installation**
- Download from [mongodb.com/download](https://www.mongodb.com/try/download/community)
- Install and ensure MongoDB service is running
- Test: `mongosh` should connect to local database

**Option B: MongoDB Atlas (Cloud - Recommended)**
- Sign up at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster (M0 tier)
- Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/jansathi`

### 3. **Get Google Generative AI Key**
- Visit [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
- Sign in with Google account
- Click "Create API Key"
- Copy the key

---

## 📦 Installation Steps

### **Step 1: Navigate to Backend Directory**

```bash
cd backend
```

### **Step 2: Install Backend Dependencies**

```bash
npm install
```

Expected output: ~113 packages installed

### **Step 3: Create and Configure `.env` File**

Create a new file called `.env` in the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/jansathi
GEMINI_API_KEY=paste_your_api_key_here
```

**Or for MongoDB Atlas:**

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jansathi?retryWrites=true&w=majority
GEMINI_API_KEY=paste_your_api_key_here
```

### **Step 4: Start Backend Server**

```bash
npm run dev
```

Expected output:
```
✅ MongoDB Connected to: [hostname]
🚀 JanSathi Server running on http://localhost:5000
```

**Keep this terminal running!**

### **Step 5: (New Terminal) Navigate to Frontend**

```bash
cd frontend
```

### **Step 6: Install Frontend Dependencies (Already Done)**

```bash
npm install
```

### **Step 7: Start Frontend Development Server**

```bash
npm run dev
```

Expected output:
```
Local:   http://localhost:5173/
```

---

## 🌐 Accessing the Application

### **Citizen Portal**
- **URL**: http://localhost:5173/
- **Features**:
  - Submit complaints with details
  - Fetch current location
  - Get instant AI classification
  - Receive tracking ID

### **Admin Dashboard**
- **URL**: http://localhost:5173/admin
- **Features**:
  - Summary cards (Total, Critical, Resolved)
  - Department-wise complaint chart
  - Priority distribution pie chart
  - Complete complaint listing
  - Real-time refresh

---

## 🧪 Testing the System

### **Test Complaint 1: Water Issue**
1. Go to http://localhost:5173/
2. Fill form:
   - Name: "Rajesh Kumar"
   - Phone: "9876543210"
   - Complaint: "Water pipeline broken near my house for 2 weeks"
3. Click "Fetch Location" (grant permission)
4. Submit
5. You should see:
   - ✅ Success message
   - Tracking ID: `JAN-862-XXXXXX`
   - Category: "Water Supply"
   - Priority: "High" or "Critical"

### **Test Complaint 2: Electricity**
1. Submit: "Street light outside my house is not working"
2. Expected:
   - Category: "Electricity"
   - Priority: "Medium"

### **View Admin Dashboard**
1. Go to http://localhost:5173/admin
2. You should see:
   - Summary cards with counts
   - Bar chart showing complaints by department
   - Pie chart showing priority distribution
   - Table with both test complaints

---

## 📊 API Testing (Optional)

### **Submit Complaint via cURL**

```bash
curl -X POST http://localhost:5000/api/complaints \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "9123456789",
    "rawText": "Broken street light",
    "lat": 28.6139,
    "lng": 77.2090
  }'
```

### **Get All Complaints**

```bash
curl http://localhost:5000/api/complaints
```

---

## 🐛 Troubleshooting

### **Error: "Cannot find module" during backend start**

```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### **Error: "MongoError: connect ECONNREFUSED"**

**Solution 1**: Ensure MongoDB is running
```bash
# For local MongoDB:
mongod  # Start MongoDB service

# Or verify connection string for Atlas
```

**Solution 2**: Check `.env` file
- Verify `MONGO_URI` is correct
- No spaces around `=` sign

### **Error: "Gemini API key invalid"**

- Verify key in `.env` file is correct
- Check key hasn't been regenerated
- Ensure API is enabled in Google Cloud Console

### **Frontend shows "Failed to submit complaint"**

- Ensure backend is running on http://localhost:5000
- Check browser console for errors (F12)
- Verify `.env` in backend has correct MongoDB URI

### **Port 5000 or 5173 already in use**

```bash
# Find process using port 5000:
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process or change PORT in backend .env
```

---

## 🏗️ Project Structure Reference

```
janSathi_2.0/
│
├── backend/
│   ├── controllers/
│   │   └── complaintController.js      ← API logic
│   ├── models/
│   │   └── Complaint.js                 ← Database schema
│   ├── services/
│   │   └── nlpService.js                ← AI classification
│   ├── routes/
│   │   └── complaintRoutes.js           ← API endpoints
│   ├── server.js                        ← Express app
│   ├── package.json
│   ├── .env                             ← Config (create this)
│   ├── .env.example                     ← Template
│   └── node_modules/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx                 ← Citizen portal
│   │   │   └── Admin.jsx                ← Admin dashboard
│   │   ├── App.jsx                      ← Router
│   │   ├── main.jsx                     ← Entry point
│   │   ├── index.css                    ← Tailwind
│   │   └── assets/
│   ├── public/
│   ├── vite.config.js
│   ├── tailwind.config.js               ← Tailwind config
│   ├── package.json
│   └── node_modules/
│
└── README.md                            ← Full documentation
```

---

## 📱 Feature Summary

### **Citizen Features**
- ✅ Simple form-based complaint submission
- ✅ Automatic GPS location capture
- ✅ Real-time AI classification
- ✅ Instant tracking ID generation
- ✅ Visual confirmation with priority display

### **Admin Features**
- ✅ Live dashboard with key metrics
- ✅ Department-wise analytics
- ✅ Priority-based visualization
- ✅ Complete complaint history
- ✅ One-click data refresh

### **Technical Features**
- ✅ No TypeScript (pure JavaScript ES6+)
- ✅ Light theme only (professional gov-tech style)
- ✅ Responsive design (mobile & desktop)
- ✅ Real-time API integration
- ✅ Error handling & validation
- ✅ Production-ready code

---

## 🚀 Production Deployment (Future)

When ready to deploy:

### **Backend Deployment**
- Deploy to: Heroku, Railway, AWS EC2, Azure, GCP
- Use MongoDB Atlas (cloud)
- Set environment variables in platform
- Use `npm start` instead of `npm run dev`

### **Frontend Deployment**
- Build: `npm run build`
- Deploy to: Vercel, Netlify, GitHub Pages, AWS S3
- Update API URL in code to production backend

---

## 📞 Support & Contact

- **Team ID**: 862
- **Project**: JanSathi - AI-Based Citizen Grievance Classification
- **Version**: 2.0 (MVP)

---

## 🎉 You're All Set!

Your JanSathi MVP is ready to use. Start with:

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
cd frontend
npm run dev

# Open http://localhost:5173 in browser
```

Happy coding! 🚀
