# JanSathi 2.0 - Complete Implementation Guide

## 📊 Project Status: Phase 1 Complete ✅

### What's Been Completed (Backend)

#### 1. **Database Models** ✅
- User model with OTP verification
- Complaint model with AI analysis & SLA
- Admin model with role-based permissions

#### 2. **Backend API Services** ✅
- **AI Service**: Gemini API integration for complaint classification
- **Email Service**: OTP & notification delivery
- **Auth Middleware**: JWT protection, role-based access

#### 3. **API Endpoints** (14 endpoints) ✅
- Authentication (register, login, OTP verify, password reset)
- Complaint lodging and tracking  
- Admin dashboard with analytics
- Location data (states/districts)

#### 4. **Smart Features** ✅
- AI-powered complaint routing (if confidence < 75% → manual review)
- Multi-level admin hierarchy (National, State, District, Department)
- SLA tracking based on priority
- Email notifications on complaint status changes

---

## 🎯 Immediate Next Steps (Priority Order)

### Step 1: Setup Frontend Environment (15 mins)
```bash
cd frontend
npm install axios lucide-react react-icons
```

### Step 2: Create .env for Frontend
Create `frontend/.env`:
```
VITE_API_URL=http://localhost:5000
```

### Step 3: Create vite.config.js configuration
The file already exists and is configured.

### Step 4: Update main.jsx
Current file needs to wrap App with AuthProvider:
```jsx
import { AuthProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
```

---

## 📱 Frontend Pages Status

### ✅ Completed
1. **Register.jsx** - Full user registration form
2. **login.jsx** - User login (updated)
3. **AuthContext.jsx** - Auth state management

### ⏳ To Create (in this order)

#### 1. **VerifyOTP.jsx** (10 mins)
- Accept 6-digit OTP
- Verify and redirect to dashboard
- Resend OTP option

#### 2. **AdminLogin.jsx** (10 mins)
- Similar to Login but for admins
- Set admin context instead of user

#### 3. **LodgeForm.jsx** (30 mins)
Key features:
- Title and description fields
- State/District dropdown (fetch from API)
- Language selector (English, Hindi, Hinglish)
- Image upload (optional)
- GPS location toggle
- Multilingual placeholder text
- AI analysis loading state

#### 4. **TrackStatus.jsx** (15 mins)
- Tracking ID input
- Display complaint status timeline
- Show expected resolution date
- Department info

#### 5. **Dashboard.jsx** (20 mins)
User view:
- Recent complaints list
- Quick status of each
- Lodge new complaint button

#### 6. **AdminDashboard.jsx** (40 mins)
- 4 metric cards (Total, Pending, Resolved, Manual Review)
- 3 charts (By Status, By Priority, By Department)
- Complaints table with filters
- Bulk actions

#### 7. **AdminComplaintsDetail.jsx** (15 mins)
- Full complaint details
- Action log timeline
- Status update dropdown
- Manual assignment modal

---

## 🔧 Code Templates Needed

### API Service/Interceptor
Create `frontend/src/services/api.js`:
```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
```

### API Calls Module
Create `frontend/src/services/complaintService.js`:
```javascript
import API from './api';

export const complaintService = {
  lodgeComplaint: (data) => API.post('/complaints/lodge', data),
  getMyComplaints: (params) => API.get('/complaints/my-complaints', { params }),
  trackComplaint: (trackingId) => API.get(`/complaints/track/${trackingId}`),
  getComplaintDetail: (trackingId) => API.get(`/complaints/detail/${trackingId}`),
  // ... more methods
};
```

---

## 🎨 UI Components Needed

### Shared Components
1. **StatCard.jsx** - For dashboard metrics
2. **ComplaintTable.jsx** - Reusable complaints table
3. **StatusBadge.jsx** - Status indicator
4. **PriorityBadge.jsx** - Priority indicator
5. **Timeline.jsx** - Action log timeline

---

## 🧪 Testing Checklist

### Backend Testing
- [ ] Start MongoDB: `mongod`
- [ ] Start server: `npm run dev` in backend/
- [ ] Test health: `GET http://localhost:5000/api/health`
- [ ] Register user: `POST http://localhost:5000/api/auth/register`
- [ ] Verify OTP flow
- [ ] Lodge complaint and check AI analysis
- [ ] Verify admin dashboard endpoints

### Frontend Testing
- [ ] Start dev server: `npm run dev` in frontend/
- [ ] User registration flow
- [ ] User login flow
- [ ] Lodge complaint (with AI processing)
- [ ] Track complaint
- [ ] Admin login
- [ ] Admin dashboard displays analytics
- [ ] Admin can update complaint status

---

## 🚀 Quick Start Commands

### Terminal 1 - MongoDB
```bash
mongod
```

### Terminal 2 - Backend
```bash
cd backend
npm install
npm run dev
```

### Terminal 3 - Frontend
```bash
cd frontend
npm install
npm run dev
```

### Test APIs with cURL/Postman
```bash
# Register
POST http://localhost:5000/api/auth/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "password": "password123",
  "confirmPassword": "password123"
}

# Lodge Complaint
POST http://localhost:5000/api/complaints/lodge
Header: Authorization: Bearer <token>
Body: {
  "title": "Water supply not working",
  "description": "No water from tap for 2 days",
  "state": "Maharashtra",
  "district": "Mumbai",
  "language": "en"
}
```

---

## 📝 Important Configuration Notes

### Gemini API Setup
1. Get key: https://makersuite.google.com/app/apikey
2. Add to `backend/.env`:
```
GEMINI_API_KEY=your_key_here
```
3. Model used: `gemini-pro`

### Email/OTP Setup
To enable email for OTP:
1. Get Gmail app password (enable 2FA)
2. Add to `backend/.env`:
```
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```
3. For development, you can disable email sending in the code

### JWT Secret
Generate a random string and add to `backend/.env`:
```
JWT_SECRET=your_random_32_char_secret_string_here
```

---

## 🎯 Design Standards

### Colors (Government Theme)
- Primary Blue: #002B5C
- Accent Orange: #FF9900
- Success Green: #28a745
- Warning Red: #dc3545
- Background: #f4f4f4

### Typography
- Headings: Bold, dark gray (#1a1a1a)
- Body: Regular, medium gray (#666)
- Accent: Blue for links

### Components
- Card-based layouts
- Government office aesthetic
- Clean, professional look
- Responsive (mobile-first)

---

## 📊 Database Sample Data

### States/Districts
Already included in `backend/utils/helpers.js`
Contains mapping for all 28 Indian states and their districts

### Test Admin User
Create manually via MongoDB or API:
```json
{
  "name": "Admin User",
  "email": "admin@jansathi.gov",
  "password": "admin123",
  "role": "National",
  "isActive": true
}
```

---

## 🔐 Security Reminders

1. **Never commit .env files** - Already in .gitignore
2. **Use HTTPS in production**
3. **Change JWT_SECRET in production**
4. **Validate all inputs on backend**
5. **Use rate limiting on public APIs**
6. **Enable CORS only for frontend domain**

---

## 📞 Support

For Gemini API issues: https://ai.google.dev/
For MongoDB issues: https://docs.mongodb.com/
For Express issues: https://expressjs.com/

---

## ⭐ Key Features Summary

✅ **AI-Powered Classification** - Automatic routing
✅ **Multi-level Admin** - Hierarchical access control
✅ **Real-time Tracking** - Track complaints by ID
✅ **Email Notifications** - Status updates
✅ **Manual Review** - For low confidence cases
✅ **SLA Management** - Priority-based deadlines
✅ **Secure Authentication** - JWT + OTP
✅ **Responsive Design** - Works on all devices
✅ **Scalable Architecture** - Ready for production
✅ **Comprehensive Logging** - Action history

---

*Last Updated: 2026-05-13*
*Status: Ready for frontend development*
