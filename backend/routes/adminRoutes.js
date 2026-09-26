import express from 'express';
import {
  adminLogin,
  registerAdmin,
  getDashboardAnalytics,
  getAdminComplaints,
  getComplaintDetail
} from '../controllers/adminController.js';

import { updateComplaintStatus } from '../controllers/complaintController.js';

import {
  protectAdmin,
  authorize,
  checkPermission
} from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route
router.post('/login', adminLogin);

// Protected routes
router.post(
  '/register',
  protectAdmin,
  authorize('National'),
  registerAdmin
);

// Dashboard routes
router.get(
  '/dashboard/analytics',
  protectAdmin,
  checkPermission('view_analytics'),
  getDashboardAnalytics
);

router.get(
  '/complaints',
  protectAdmin,
  checkPermission('view_complaints'),
  getAdminComplaints
);

router.get(
  '/complaint/:complaintId',
  protectAdmin,
  checkPermission('view_complaints'),
  getComplaintDetail
);

// Update complaint status
router.put(
  '/update-status/:complaintId',
  protectAdmin,
  checkPermission('update_status'),
  updateComplaintStatus
);

export default router;