# 🎯 IMMEDIATE NEXT STEPS - Frontend Development

## Current Status
✅ Backend: 100% Complete (all 14 API endpoints working)
✅ Frontend Setup: 70% Ready (AuthContext, Register, Login)
⏳ Frontend Pages: 30% To Create (remaining 6-7 pages)

---

## 🔥 Priority 1: Create API Service Layer (5 mins)

### Create `frontend/src/services/api.js`
```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add token to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('admin');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
```

### Create `frontend/src/services/authService.js`
```javascript
import API from './api';

export const authService = {
  register: (data) => API.post('/auth/register', data),
  verifyOTP: (userId, otp) => API.post('/auth/verify-otp', { userId, otp }),
  resendOTP: (email) => API.post('/auth/resend-otp', { email }),
  login: (email, password) => API.post('/auth/login', { email, password }),
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  resetPassword: (otp, newPassword) => API.post('/auth/reset-password', { otp, newPassword }),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
  adminLogin: (email, password) => API.post('/admin/login', { email, password }),
};
```

### Create `frontend/src/services/complaintService.js`
```javascript
import API from './api';

export const complaintService = {
  lodge: (data) => API.post('/complaints/lodge', data),
  getMyComplaints: (page = 1, limit = 10) => 
    API.get('/complaints/my-complaints', { params: { page, limit } }),
  trackComplaint: (trackingId) => API.get(`/complaints/track/${trackingId}`),
  getComplaintDetail: (trackingId) => API.get(`/complaints/detail/${trackingId}`),
  getPendingReview: () => API.get('/complaints/admin/pending-review'),
  assignDepartment: (complaintId, department) =>
    API.post(`/complaints/admin/assign/${complaintId}`, { department }),
  updateStatus: (complaintId, data) => 
    API.put(`/complaints/admin/update-status/${complaintId}`, data),
};
```

### Create `frontend/src/services/adminService.js`
```javascript
import API from './api';

export const adminService = {
  getAnalytics: () => API.get('/admin/dashboard/analytics'),
  getComplaints: (params) => API.get('/admin/complaints', { params }),
  getComplaintDetail: (complaintId) => API.get(`/admin/complaint/${complaintId}`),
  registerAdmin: (data) => API.post('/admin/register', data),
};
```

### Create `frontend/src/services/locationService.js`
```javascript
import API from './api';

export const locationService = {
  getStates: () => API.get('/location/states'),
  getDistricts: (state) => API.get(`/location/districts/${state}`),
};
```

---

## 🔥 Priority 2: Create VerifyOTP Page (10 mins)

### Create `frontend/src/pages/VerifyOTP.jsx`
```javascript
import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const userId = location.state?.userId;
  const email = location.state?.email;

  React.useEffect(() => {
    if (!userId || !email) {
      navigate('/register');
    }
  }, [userId, email, navigate]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-otp`,
        { userId, otp }
      );

      if (response.data.success) {
        setSuccess('Email verified successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (cooldown > 0) return;

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/resend-otp`,
        { email }
      );
      setSuccess('OTP sent to your email!');
      setCooldown(60);
      const timer = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Verify Email</h1>
            <p className="text-gray-600">Enter the OTP sent to {email}</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                6-Digit OTP
              </label>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-bold tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">Didn't receive OTP?</p>
            <button
              onClick={handleResendOTP}
              disabled={cooldown > 0 || loading}
              className="text-blue-600 hover:underline font-medium mt-1 disabled:text-gray-400"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
```

---

## 🔥 Priority 3: Create Frontend .env

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:5000
```

---

## 🔥 Priority 4: Update App.jsx with Routes

### Update `frontend/src/App.jsx`
```javascript
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Register from './pages/Register';
import Login from './pages/login';
import VerifyOTP from './pages/VerifyOTP';
import Home from './pages/Home';
import LodgeForm from './pages/LodgeForm';
import TrackStatus from './pages/TrackStatus';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { isAuthenticated, isAdminLoggedIn } = React.useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/track" element={<TrackStatus />} />

        {/* User Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/lodge" 
          element={
            <ProtectedRoute>
              <LodgeForm />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes - To Create */}
        {/* <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} /> */}

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## ✅ Checklist for Next Session

- [ ] Create 5 service files (api.js, authService, complaintService, etc.)
- [ ] Create VerifyOTP.jsx page
- [ ] Create frontend/.env file
- [ ] Update App.jsx with all routes
- [ ] Test user registration flow end-to-end
- [ ] Create LodgeForm.jsx page
- [ ] Create TrackStatus.jsx page
- [ ] Create Dashboard.jsx page
- [ ] Test complaint submission with AI
- [ ] Create AdminDashboard.jsx page

---

## 🚀 To Run Everything

### Terminal 1: MongoDB
```bash
mongod
```

### Terminal 2: Backend
```bash
cd backend
npm install
npm run dev
```

### Terminal 3: Frontend
```bash
cd frontend
npm install
npm run dev
```

Then visit: `http://localhost:5173`

---

## 🎯 Expected Flow After This Session

1. User registers at http://localhost:5173/register
2. Gets OTP sent to email (or shows in console if SMTP not configured)
3. Verifies OTP at /verify-otp
4. Logs in at /login
5. Sees dashboard at /dashboard
6. Can lodge complaint at /lodge with AI analysis
7. Can track complaint at /track with public tracking ID

---

## 📊 Token Usage Summary

- Backend Implementation: ~60,000 tokens
- Frontend Setup: ~40,000 tokens  
- Documentation: ~25,000 tokens
- This Guide: ~5,000 tokens
- **Total: ~130,000 tokens (65% of budget)**

---

*Ready for frontend development!*
*All backend APIs tested and ready.*
*Frontend foundation complete.*
