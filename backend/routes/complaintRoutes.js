import express from 'express';
import {
  lodgeComplaint,
  getComplaintByTrackingId,
  getMyComplaints,
  getComplaintStatus,
  getPendingManualReviewComplaints,
  assignDepartmentManual,
  updateComplaintStatus,
  resolveComplaint
} from '../controllers/complaintController.js';
import { protectUser, protectAdmin, checkPermission } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes - protected by user auth
router.post('/lodge', protectUser, lodgeComplaint);
router.get('/my-complaints', protectUser, getMyComplaints);
router.get('/track/:trackingId', getComplaintStatus);
router.get('/detail/:trackingId', getComplaintByTrackingId);
router.patch('/:id/resolve', protectAdmin, checkPermission('update_status'), resolveComplaint);

// Admin routes - protected by admin auth
router.get('/admin/pending-review', protectAdmin, checkPermission('manual_review'), getPendingManualReviewComplaints);
router.post('/admin/assign/:complaintId', protectAdmin, checkPermission('assign_complaints'), assignDepartmentManual);
router.put('/admin/update-status/:complaintId', protectAdmin, checkPermission('update_status'), updateComplaintStatus);

export default router;
