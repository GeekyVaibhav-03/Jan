# Admin Dashboard - Complete Setup & Features Guide

## ✅ Features Implemented

### 1. **Admin Login Portal** (`/admin/login`)
- Secure authentication for admin users
- Email and password verification
- Beautiful gradient UI with lock icon
- Error handling and validation
- Persistent session management

### 2. **Admin Dashboard** (`/admin/dashboard`)
- **Header Section**
  - Admin name and role display
  - Admin area/jurisdiction info
  - Logout button
  - Admin zone information bar

- **Statistics Cards**
  - Total Grievances count
  - Pending grievances
  - In-Progress grievances
  - Resolved grievances
  - Rejected grievances

- **Analytics & Visualizations**
  - **Priority Distribution Chart** (Pie Chart)
    - High Priority grievances
    - Medium Priority grievances
    - Low Priority grievances
  
  - **Department Distribution** (Bar Chart)
    - Grievances by department
    - Visual department breakdown

  - **7-Day Trend Line Chart**
    - Daily grievance submissions
    - Trend analysis

### 3. **Citizen Information Display**
- Full citizen name
- Mobile number
- Email address
- Masked Aadhaar number (last 4 digits visible)
- Location details (State, District)
- Submitted date and time

### 4. **Complaint Management Table**
- Filterable by Status (All, Pending, In-Progress, Resolved, Rejected)
- Shows:
  - Tracking ID
  - Citizen Name
  - Phone Number
  - Complaint Title
  - Department
  - Priority Level (Color-coded)
  - Current Status (Color-coded)
  - Quick View Action Button

### 5. **Complaint Detail Modal**
- Complete complaint information
- Citizen metadata display
- Location information
- Full complaint description
- Attached images (if any)
- Action timeline with history
- Status update form
- Ability to:
  - Change complaint status
  - Add remarks/notes
  - Add resolution details (when resolving)
  - Send status updates to citizens

### 6. **Complaint Resolution Features**
- Update complaint status (Pending → In-Progress → Resolved/Rejected)
- Add action remarks
- Add detailed resolution explanation
- Automatic email notification to citizen
- Action log tracking

---

## 🚀 How to Use

### Step 1: Admin Login
1. Click "Admin" button in navbar
2. Go to `/admin/login`
3. Enter admin email and password
4. Dashboard loads automatically

### Step 2: View Dashboard Statistics
- See summary cards for all complaint statuses
- Review graphs and charts
- Analyze 7-day trend

### Step 3: Manage Complaints
1. View all complaints in the table
2. Use filter buttons to view specific statuses
3. Click "View" button for complaint details
4. In the modal:
   - Review citizen information
   - Review complaint details
   - Check action timeline
   - Update status as needed

### Step 4: Resolve Complaints
1. Click "View" on a complaint
2. In the modal, select new status:
   - **In-Progress**: When you start handling
   - **Resolved**: When issue is solved (requires resolution details)
   - **Rejected**: If complaint cannot be resolved
3. Add remarks about the action
4. For resolved complaints, add resolution explanation
5. Click "Update Status"
6. Citizen receives email notification

---

## 📁 Files Created/Modified

### New Files Created:
```
frontend/src/pages/AdminLogin.jsx              - Admin login page
frontend/src/pages/AdminDashboard.jsx          - Main admin dashboard
frontend/src/components/ComplaintDetailModal.jsx - Complaint detail & resolution modal
```

### Files Modified:
```
frontend/src/App.jsx                           - Added admin routes
frontend/src/context/AuthContext.jsx           - Enhanced with admin auth support
frontend/src/components/Navbar.jsx             - Added admin login link
backend/routes/adminRoutes.js                  - Added update-status route
backend/controllers/complaintController.js     - Enhanced updateComplaintStatus function
```

---

## 🔐 Admin Roles & Permissions

The system supports multiple admin roles with different access levels:

### National Admin
- View all complaints across all states/districts
- Manage all admins
- Full analytics access
- Can resolve any complaint

### State Admin
- View complaints for assigned state
- Manual review capabilities
- Update status
- View analytics for state

### District Admin
- View complaints for assigned district
- Manual review capabilities
- Update status
- View district analytics

### Department Admin
- View complaints for assigned department
- Update status
- View department analytics

---

## 📊 Dashboard Statistics

### Real-time Metrics:
- **Total Grievances**: Count of all complaints
- **Pending**: Awaiting assignment/action
- **In-Progress**: Currently being handled
- **Resolved**: Successfully resolved
- **Rejected**: Cannot be resolved

### Charts Available:
1. **Priority Distribution**: Shows percentage of High/Medium/Low priority complaints
2. **Department Distribution**: Shows which departments handle most complaints
3. **7-Day Trend**: Shows daily submission trends

---

## 🔗 API Endpoints Used

```
POST   /api/admin/login                 - Admin authentication
GET    /api/admin/complaints            - Get complaints list (with filters)
GET    /api/admin/complaint/:id         - Get single complaint detail
PUT    /api/admin/update-status/:id     - Update complaint status
GET    /api/admin/dashboard/analytics   - Get dashboard statistics
```

---

## 💡 Key Features Explained

### Filtering System
- **Status Filter**: Quick-select buttons for different statuses
- **Role-based Filtering**: Automatically filters complaints based on admin's jurisdiction

### Citizen Information Privacy
- Aadhaar numbers are masked (only last 4 digits visible)
- Full contact details available for communication
- Address information captured

### Status Workflow
```
Pending → In-Progress → Resolved/Rejected
                    ↓
                 Rejected
```

### Notification System
- Automatic email sent when status is updated
- Citizen receives resolution details
- Timeline updated for each action

---

## 📝 Test Admin Credentials

Create a test admin with these details:
```
Email: admin@jansathi.gov.in
Password: Admin@123
Role: National
```

Or use your existing admin credentials from the database.

---

## ⚙️ Configuration

### To Add More Statistics:
Edit `AdminDashboard.jsx` and modify the `calculateStats()` function to include additional metrics.

### To Customize Colors:
- Modify the `COLORS` array in `AdminDashboard.jsx`
- Update Tailwind color classes throughout components

### To Add More Features:
- Extend `ComplaintDetailModal.jsx` with additional fields
- Add new routes in `adminRoutes.js`
- Create new analytics in admin controller

---

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Color-Coded Status**: Easy visual identification
- **Smooth Animations**: Hover effects and transitions
- **Modal Interface**: Clear separation of concerns
- **Loading States**: Visual feedback during data fetching
- **Error Handling**: User-friendly error messages
- **Success Notifications**: Confirmation of actions

---

## 📱 Mobile Responsive

- Dashboard adapts to mobile screens
- Table scrolls horizontally on small screens
- Modal is touch-friendly
- All buttons are large enough for touch interaction

---

## 🔄 Workflow Example

1. **Citizen lodges complaint** → Status: Pending
2. **Admin sees it in dashboard** → Priority: Medium, Department: Water Supply
3. **Admin clicks View** → Reviews complaint details
4. **Admin updates status to In-Progress** → Adds remark "Assigned to field team"
5. **Citizen gets email** → Knows complaint is being handled
6. **Field team resolves issue** → Admin updates to Resolved
7. **Admin adds resolution details** → "Pipeline repaired successfully"
8. **Citizen gets final email** → Complaint closed

---

## 🚨 Important Notes

- Admin authentication is required for dashboard access
- All changes are logged in the action timeline
- Citizens receive automatic notifications for status updates
- Role-based access control is enforced
- Data is persisted to MongoDB

---

## 📞 Support

For issues or additional features, refer to:
- GitHub Issues
- System Administrator
- Helpline: 1800-11-2026

---

**Last Updated**: 2026-06-13
**Version**: 2.0
**Status**: Production Ready ✅
