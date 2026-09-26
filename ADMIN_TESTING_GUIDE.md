# Admin Dashboard - Quick Testing Guide

## 🎯 Quick Start

### Prerequisites
- Backend server running on `http://localhost:5000`
- Frontend running on `http://localhost:5173` (Vite dev server)
- MongoDB with test data

### Step-by-Step Testing

#### 1️⃣ Start the Application
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### 2️⃣ Access Admin Login
- Open browser: `http://localhost:5173/admin/login`
- You should see a beautiful gradient login page with:
  - Lock icon
  - "Admin Portal" heading
  - Email and password fields
  - Login button

#### 3️⃣ Login with Admin Credentials
**Sample Admin:**
- Email: `admin@jansathi.gov.in`
- Password: `Admin@123`

*If you don't have an admin, create one in MongoDB:*
```javascript
// In MongoDB shell
db.admins.insertOne({
  name: "Test Admin",
  email: "admin@jansathi.gov.in",
  password: "hashedpassword", // Must be bcrypt hashed
  role: "National",
  phoneNumber: "9876543210",
  isActive: true,
  permissions: [
    "view_complaints",
    "assign_complaints",
    "manual_review",
    "update_status",
    "manage_admins",
    "view_analytics"
  ]
})
```

#### 4️⃣ Dashboard Overview
After login, you should see:
- ✅ Header with "Admin Dashboard" title
- ✅ Admin info bar with Name, Role, Area
- ✅ 5 Stats cards (Total, Pending, In-Progress, Resolved, Rejected)
- ✅ 3 Charts (Priority Pie, Department Bar, 7-Day Trend Line)
- ✅ Complaints table with data

#### 5️⃣ Test Filtering
Click filter buttons:
- "All" - Shows all complaints
- "Pending" - Shows only pending
- "In-Progress" - Shows in-progress
- "Resolved" - Shows resolved
- "Rejected" - Shows rejected

#### 6️⃣ View Complaint Details
1. Click any "View" button in the table
2. Modal should open showing:
   - Tracking ID and current status
   - **Citizen Information**:
     - Name, Phone, Email, Aadhaar (masked)
   - **Location Details**:
     - State, District
   - **Complaint Description**:
     - Title, Full description, Image (if any)
   - **Action Timeline**:
     - History of all status changes
   - **Status Update Form**:
     - Dropdown to change status
     - Text area for remarks
     - Update button

#### 7️⃣ Test Complaint Resolution
1. Select a Pending complaint
2. Change status to "In-Progress"
3. Add remark: "Assigned to field officer"
4. Click "Update Status"
5. Should see success message ✅
6. Citizen should receive email notification

#### 8️⃣ Test Full Resolution
1. Select an "In-Progress" complaint
2. Change status to "Resolved"
3. Add remark: "Resolved successfully"
4. Add resolution details: "Issue fixed as per protocol"
5. Click "Update Status"
6. Should see success message ✅
7. Check that resolved date is recorded

#### 9️⃣ Test Navbar Integration
- "Admin" button should appear when logged in
- After login, navbar should show "Admin Dashboard" button
- Logout button should clear session and redirect to home

#### 🔟 Test Logout
1. Click "Logout" button
2. Should redirect to home page
3. Admin button should reappear
4. localStorage should be cleared

---

## 📊 Expected Test Results

### Login Page ✅
- [x] Page loads at `/admin/login`
- [x] Form validation works
- [x] Error message shows for wrong credentials
- [x] Success redirects to `/admin/dashboard`

### Dashboard Page ✅
- [x] Loads at `/admin/dashboard`
- [x] Shows admin info correctly
- [x] Statistics cards show correct counts
- [x] Charts render without errors
- [x] Table loads with complaint data
- [x] Filters work correctly
- [x] View button opens modal

### Complaint Modal ✅
- [x] Modal displays full complaint info
- [x] Citizen information is visible and correct
- [x] Action timeline shows history
- [x] Status dropdown works
- [x] Update button submits data
- [x] Success message appears
- [x] Modal closes after update
- [x] List refreshes with new status

### Citizen Information ✅
- [x] Full name displays
- [x] Phone number displays
- [x] Email displays
- [x] Aadhaar is masked (XXXX-XXXX-1234)
- [x] Location shows state and district

### Email Notifications ✅
- [x] Email sent when status updated
- [x] Email includes tracking ID
- [x] Email includes new status
- [x] Email includes remarks
- [x] Check email service configuration

---

## 🐛 Troubleshooting

### Issue: Admin Login Page Won't Load
**Solution**: 
- Check backend is running: `npm start` in backend folder
- Check frontend is running: `npm run dev` in frontend folder
- Check VITE_API_URL in `.env` file

### Issue: Complaints Not Showing
**Solution**:
- Check MongoDB is running
- Check sample complaints exist in DB
- Check admin role has view_complaints permission
- Check network tab in browser dev tools for API errors

### Issue: Charts Not Rendering
**Solution**:
- Check recharts package is installed: `npm install recharts`
- Check component imports are correct
- Clear browser cache

### Issue: Modal Won't Open
**Solution**:
- Check console for JavaScript errors
- Check ComplaintDetailModal component is imported
- Check complaint data structure matches expectations

### Issue: Update Status Failed
**Solution**:
- Check backend is accepting requests
- Check admin token is valid
- Check complaint ID is valid
- Check user has update_status permission
- Check server logs for errors

---

## 🔍 Manual API Testing

### Test Login Endpoint
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jansathi.gov.in","password":"Admin@123"}'
```

### Test Get Complaints
```bash
curl -X GET http://localhost:5000/api/admin/complaints \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Update Status
```bash
curl -X PUT http://localhost:5000/api/admin/update-status/COMPLAINT_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"status":"In-Progress","remarks":"Assigned to team"}'
```

---

## ✨ Features to Test

- [x] Admin login with valid credentials
- [x] Admin login with invalid credentials (error handling)
- [x] Dashboard loads with data
- [x] Statistics calculate correctly
- [x] Charts render with data
- [x] Filtering works
- [x] Complaint modal opens
- [x] Citizen info displays correctly
- [x] Status can be updated
- [x] Action timeline updates
- [x] Email notification sent
- [x] Logout clears session
- [x] Responsive on mobile
- [x] Error messages display properly
- [x] Loading states show

---

## 🎓 Learning Resources

### Key Components:
1. **AdminLogin.jsx** - Login page logic
2. **AdminDashboard.jsx** - Main dashboard and statistics
3. **ComplaintDetailModal.jsx** - Complaint detail view and update form
4. **Navbar.jsx** - Navigation with admin links

### Key Files Modified:
1. **App.jsx** - Routes for admin pages
2. **AuthContext.jsx** - Admin authentication state
3. **adminRoutes.js** - Backend admin endpoints
4. **complaintController.js** - Update status logic

---

## 📈 Performance Testing

- Check dashboard loads in < 2 seconds
- Check charts render smoothly
- Check filtering is instant
- Check modal opens smoothly
- Check form submission is fast

---

## 🎬 Demo Scenario

**Scenario**: Resolve a citizen complaint from start to finish

1. Admin logs in
2. Sees 50 pending complaints
3. Filters to show only High Priority
4. Clicks on a water supply complaint
5. Reads full complaint details
6. Changes status to "In-Progress"
7. Later, field team completes work
8. Admin changes status to "Resolved"
9. Adds resolution details
10. Citizen receives email
11. Admin sees resolved count increased

---

## ✅ Sign-Off Checklist

- [ ] Admin login works
- [ ] Dashboard displays correctly
- [ ] Statistics are accurate
- [ ] Charts render without errors
- [ ] Complaints list shows data
- [ ] Filtering works for all statuses
- [ ] Modal opens and displays complaint
- [ ] Citizen information visible and correct
- [ ] Status can be updated
- [ ] Success message appears
- [ ] Email notification sent to citizen
- [ ] Action log updates
- [ ] Logout works
- [ ] Mobile responsive
- [ ] No console errors

---

**Testing Status**: Ready for QA ✅
**Last Updated**: 2026-06-13
