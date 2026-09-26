# ⚡ JanSathi - Quick Start (5 Minutes)

## 🎯 TL;DR - Get Running NOW

### **Step 1: Configure Backend** (2 min)

```bash
cd backend
```

Create `.env` file in `backend/` folder:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/jansathi
GEMINI_API_KEY=your_api_key_here
```

Get your Gemini API key: https://makersuite.google.com/app/apikey

### **Step 2: Start Backend** (1 min)

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on http://localhost:5000
```

**Keep this running!**

### **Step 3: Start Frontend** (New Terminal, 2 min)

```bash
cd frontend
npm run dev
```

You should see:
```
Local: http://localhost:5173
```

### **Step 4: Open App**

- **Citizen Portal**: http://localhost:5173/
- **Admin Dashboard**: http://localhost:5173/admin

**Done! 🎉**

---

## ⚠️ Prerequisites

- ✅ Node.js 16+ installed (`node --version`)
- ✅ MongoDB running locally OR MongoDB Atlas connection
- ✅ Google Generative AI key (free from makersuite.google.com)

### **First Time Only**

```bash
# Install Node from nodejs.org

# Start MongoDB (if local):
mongod

# Or use MongoDB Atlas (cloud) - just update MONGO_URI in .env
```

---

## 🧪 Quick Test

### **Test Citizen Portal**
1. Go to http://localhost:5173/
2. Fill form:
   - Name: `Test User`
   - Phone: `9876543210`
   - Complaint: `Water pipeline broken`
3. Click "Fetch Location" 
4. Submit
5. See tracking ID like `JAN-862-A3X7K2`

### **Test Admin Dashboard**
1. Go to http://localhost:5173/admin
2. See summary cards with counts
3. See charts with complaint data
4. See data table with submitted complaint

---

## 🐛 If Something Goes Wrong

| Problem | Solution |
|---------|----------|
| "Cannot connect to backend" | Ensure `npm run dev` running in `/backend` on port 5000 |
| "MongoDB connection failed" | Run `mongod` or verify Atlas connection string in `.env` |
| "Gemini API error" | Verify API key in `.env` is correct and has quota |
| "Port 5000 in use" | Change `PORT` in `.env` or kill process using port 5000 |
| "Port 5173 in use" | Vite will auto-increment to 5174, just use that URL |

---

## 📁 Project Structure

```
janSathi_2.0/
├── backend/          ← Start: npm run dev
│   ├── .env         ← Create this with your credentials
│   ├── server.js
│   ├── models/      ← Database schemas
│   ├── controllers/ ← API logic
│   ├── services/    ← AI integration
│   └── routes/      ← API endpoints
│
└── frontend/         ← Start: npm run dev
    ├── src/
    │   ├── App.jsx
    │   ├── pages/
    │   │   ├── Home.jsx     ← Citizen portal
    │   │   └── Admin.jsx    ← Admin dashboard
    │   └── main.jsx
    └── vite.config.js
```

---

## 💾 Data Flow

```
Citizen Portal (http://localhost:5173)
    ↓
    └─→ [Axios POST] → Backend API (http://localhost:5000/api/complaints)
           ↓
           └─→ [MongoDB Save] → Database
                  ↓
                  └─→ [Gemini AI] → Classification
                         ↓
                         └─→ [Response] → Success Modal with Tracking ID

Admin Dashboard (http://localhost:5173/admin)
    ↓
    └─→ [Axios GET] → Backend API (http://localhost:5000/api/complaints)
           ↓
           └─→ [MongoDB Fetch] → All Complaints
                  ↓
                  └─→ [Recharts] → Charts & Table
```

---

## 🔑 Default Credentials (Environment)

```env
# You need to set these:
GEMINI_API_KEY=your_key_here        # Get from makersuite.google.com
MONGO_URI=mongodb://localhost:27017/jansathi  # Local MongoDB

# These are fixed:
PORT=5000                            # Backend port
Frontend Port: 5173                  # Vite default
```

---

## 🚀 Production URLs

Once deployed:
- Frontend: `https://yourdomain.com`
- Admin: `https://yourdomain.com/admin`
- API: `https://api.yourdomain.com`

---

## 📞 Need Help?

Read these files in order:
1. **This file** - Quick setup (you are here)
2. **SETUP_GUIDE.md** - Detailed troubleshooting
3. **README.md** - Full documentation
4. **COMPLETION_SUMMARY.md** - What was built

---

## ✅ Success Checklist

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] Can submit complaint on citizen portal
- [ ] Can see data on admin dashboard
- [ ] Got unique tracking ID after submission
- [ ] Charts showing on admin dashboard

If all checked ✅ → **You're ready to go!** 🚀

---

**Happy coding!** 

For issues: Check the browser console (F12) and terminal output for clues.
