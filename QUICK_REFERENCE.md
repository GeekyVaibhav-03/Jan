# JanSathi Development Quick Reference

## 🚀 Quick Start

### 1. Clone & Setup
```bash
# Backend
cd backend
npm install
cp .env.example .env
# Update MongoDB URI and JWT_SECRET in .env
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### 2. Default Endpoints
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`
- API Base: `http://localhost:5000/api`

---

## 📁 File Structure Guide

### Critical Files for Frontend
```
frontend/src/
├── context/AuthContext.jsx         ← Global auth provider
├── pages/
│   ├── login.jsx                   ← Auth (login + register)
│   ├── Home.jsx                    ← Landing page
│   ├── LodgeForm.jsx               ← 4-step form
│   └── TrackStatus.jsx             ← Status tracking
└── data/locations.js               ← State/district data
```

### Critical Files for Backend
```
backend/
├── models/
│   ├── User.js                     ← User schema
│   └── Complaint.js                ← Complaint schema
├── controllers/
│   ├── authController.js           ← Auth logic
│   └── complaintController.js      ← Grievance logic
├── routes/
│   ├── authRoutes.js               ← /api/auth/*
│   └── complaintRoutes.js          ← /api/complaints/*
└── middleware/
    └── authMiddleware.js           ← JWT verification
```

---

## 🔐 Authentication Flow

### Registration
```
User enters data → LodgeForm/login.jsx → 
  POST /api/auth/register → 
    AuthContext.register() → 
      localStorage stores token/user → 
        redirect to home
```

### Login
```
User enters credentials → login.jsx → 
  POST /api/auth/login → 
    AuthContext.login() → 
      sets Authorization header → 
        redirect to home
```

### Protected Routes
- `/lodge-form` - Requires authentication
- `/track` - Public (no auth required)
- `/admin/*` - Requires admin role

---

## 📋 Data Validation Patterns

### Frontend Validation (Real-time)
```javascript
// Mobile: exactly 10 digits
/^[0-9]{10}$/

// Aadhaar: exactly 12 digits
/^[0-9]{12}$/

// Email: standard format
/^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Name: 3-50 chars
value.length >= 3 && value.length <= 50
```

### Backend Validation (Mongoose Schema)
- Email: `unique`, `lowercase`, `match`
- Mobile: `match: /^[0-9]{10}$/`
- Aadhaar: `match: /^[0-9]{12}$/`

---

## 🎯 Key API Endpoints

### Auth
```
POST /api/auth/register
  Body: {name, email, mobile, aadhaar, password, state, district}
  Response: {success, user, token}

POST /api/auth/login
  Body: {email, password}
  Response: {success, user, token}
```

### Grievances
```
POST /api/complaints/lodge
  Headers: Authorization: Bearer <token>
  Body: {state, district, department, description, title}
  Response: {success, trackingId}

GET /api/complaints/track/:trackingId
  Response: {success, complaint}
  Complaint has: trackingId, status, actionLog[], etc.
```

---

## 🛠️ Common Tasks

### Add New Department
Edit: `frontend/src/pages/LodgeForm.jsx`
```javascript
const DEPARTMENTS = [
  'Water Supply',
  'Electricity',
  'Roads',
  'Waste Management',
  'Public Health',
  'General',
  'YOUR_NEW_DEPT'  // Add here
];
```

### Update Colors
Search in files for:
- `#1e3a8a` → Replace with new blue
- `#f97316` → Replace with new orange
Use Tailwind classes: `from-blue-900`, `text-orange-500`, etc.

### Change SLA Days
In: `backend/models/Complaint.js`
```javascript
expectedResolutionDate: {
  type: Date,
  default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Change 30 here
}
```

### Add New States/Districts
Edit: `frontend/src/data/locations.js`
```javascript
const locationData = {
  'Maharashtra': ['Mumbai', 'Pune', '...'],
  'YOUR_STATE': ['District1', 'District2']
}
```

---

## 🧪 Testing Scenarios

### Test User Registration
1. Open `http://localhost:5173`
2. Click "Login/Register"
3. Fill form (use test data below)
4. Should redirect to home and show user name

**Test Data:**
- Name: John Doe
- Email: john@example.com
- Mobile: 9876543210
- Aadhaar: 123456789012
- Password: Test@123

### Test Lodge Grievance
1. Must be logged in
2. Click "Lodge Grievance Now"
3. Select state → district
4. Enter department (autocomplete works)
5. Enter description (20+ chars)
6. Submit → Get tracking ID

### Test Track Grievance
1. Go to Track page
2. Enter tracking ID from previous test
3. Should show status and timeline

### Test Voice Input
1. On LodgeForm Step 2
2. Click mic button
3. Say something (browser should show "Listening...")
4. Stop speaking
5. Text should appear in description field

---

## 🐛 Common Issues & Fixes

### "Cannot find module 'locationData'"
**Fix:** Ensure `frontend/src/data/locations.js` exists with exported object

### "Invalid Tracking ID" error
**Fix:** Verify database has the complaint with exact tracking ID match

### Speech recognition not working
**Fix:** 
- Must be HTTPS in production
- Check browser supports Web Speech API
- Check microphone permissions

### API 404 errors
**Fix:** Verify backend is running on port 5000 and API routes are mounted

### "State is required" validation error
**Fix:** Ensure locationData object has that state name spelled correctly

---

## 🎨 Styling Guide

### Tailwind Color Tokens
```javascript
Primary Blue:    from-blue-900, text-blue-900, bg-blue-900
Secondary Blue:  from-indigo-100, bg-indigo-50
Accent Orange:   from-orange-500, text-orange-600, hover:text-orange-700
Success Green:   bg-green-100, text-green-700
Warning Yellow:  bg-yellow-100, text-yellow-700
Error Red:       bg-red-100, text-red-700
```

### Component Patterns
```javascript
// Header cards
className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-6 text-white"

// Input fields
className="w-full px-6 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"

// Buttons
className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 text-white px-6 py-3 rounded-lg font-bold"

// Cards
className="bg-white rounded-2xl shadow-lg p-8"
```

---

## 📊 Database Schema Summary

### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  mobile: String (unique, 10 digits),
  aadhaar: String (unique, 12 digits),
  password: String (hashed),
  state: String,
  district: String,
  otp: {code: String, expiresAt: Date},
  isEmailVerified: Boolean,
  preferredLanguage: String (en/hi/hinglish),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Complaint Schema
```javascript
{
  _id: ObjectId,
  trackingId: String (unique, uppercase),
  user: ObjectId (ref: User),
  title: String,
  description: String (min 20),
  state: String,
  district: String,
  department: String (enum),
  priority: String (Low/Medium/High),
  status: String (Pending/In-Progress/Resolved/Rejected),
  submittedAt: Date,
  expectedResolutionDate: Date (30 days from submission),
  citizenMetadata: {
    name, phone, email, aadhaar, address
  },
  actionLog: [{
    action: String,
    status: String,
    remarks: String,
    updatedBy: ObjectId (ref: Admin),
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔑 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/jansathi
JWT_SECRET=your-secret-key-here-min-32-chars
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 📱 Mobile Responsiveness Classes

All pages use responsive Tailwind breakpoints:
```javascript
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
px-4 md:px-8 lg:px-12
text-sm md:text-base lg:text-lg
w-full md:max-w-2xl lg:max-w-4xl
```

Mobile-first approach: Default is mobile, `md:` for tablet, `lg:` for desktop

---

## 🔐 Security Checklist

- [ ] JWT_SECRET is >32 random characters
- [ ] Database connection uses connection pooling
- [ ] All user inputs validated on server
- [ ] Passwords hashed with bcrypt (salt 10)
- [ ] CORS enabled only for frontend domain
- [ ] Rate limiting on auth endpoints
- [ ] HTTPS in production
- [ ] Sensitive data not logged
- [ ] SQL injection prevention (using Mongoose)
- [ ] XSS protection (React escapes by default)

---

## 📈 Performance Optimizations

1. **Database:**
   - Use compound indexes (already configured)
   - Lazy load non-critical data
   - Paginate large result sets

2. **Frontend:**
   - Code splitting with React Router
   - Image optimization
   - Lazy load heavy components
   - Memoize expensive computations

3. **API:**
   - Implement caching headers
   - Compress responses (gzip)
   - Use pagination (not fetching all records)

---

## 🚀 Deployment

### Heroku (Quick)
```bash
# Backend
heroku create jansathi-api
heroku config:set MONGODB_URI=...
heroku config:set JWT_SECRET=...
git push heroku main

# Frontend (Vercel)
npm run build
vercel
```

### Docker
```bash
docker build -t jansathi-backend .
docker run -p 5000:5000 jansathi-backend
```

---

## 📚 File Dependencies Map

```
AuthContext.jsx
  ├── uses: axios, localStorage
  ├── used by: All protected pages
  └── exports: useAuth hook

login.jsx
  ├── uses: AuthContext, locationData
  ├── used by: App routing
  └── provides: /login route

LodgeForm.jsx
  ├── uses: AuthContext, locationData, Web Speech API
  ├── used by: Home (Lodge Grievance button)
  └── provides: /lodge-form route

TrackStatus.jsx
  ├── uses: axios (direct API call)
  ├── used by: Home (Track Status button)
  └── provides: /track route

Home.jsx
  ├── uses: AuthContext, LodgeForm, TrackStatus links
  ├── used by: Root route /
  └── provides: Landing page

Models (User.js, Complaint.js)
  ├── used by: All controllers
  ├── used by: API endpoints
  └── requires: MongoDB connection
```

---

## 💡 Pro Tips

1. **Debug Auth Issues:** Check browser console → Application → localStorage for tokens
2. **Test Voice Recognition:** Use console to check `window.SpeechRecognition` exists
3. **Check API Calls:** Open Network tab in DevTools to see request/response
4. **Mock Data:** Use postman.co to test backend endpoints without frontend
5. **Mobile Testing:** Use Chrome DevTools device emulation
6. **Performance:** Use React DevTools Profiler to find slow components

---

## 📞 Quick Support

**Can't login?**
- Check email is registered
- Verify password (case-sensitive)
- Check localStorage wasn't cleared

**Voice not working?**
- Need HTTPS in production
- Check microphone permissions
- Try different browser

**Can't find grievance?**
- Verify tracking ID is exact match (case-insensitive backend)
- Check complaint was submitted (should see in My Complaints)
- Try searching with exact ID from email

---

**Last Updated:** May 16, 2026  
**Version:** 1.0 Production Ready
