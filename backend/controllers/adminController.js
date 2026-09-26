import Admin from '../models/Admin.js';
import Complaint from '../models/Complaint.js';
import { generateToken } from '../utils/helpers.js';
import jwt from 'jsonwebtoken';

/**
 * Register admin (National admin only)
 */
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role, assignedState, assignedDistrict, assignedDepartment, phoneNumber } = req.body;

    // Only National admin can register new admins
    if (req.admin.role !== 'National') {
      return res.status(403).json({
        success: false,
        message: 'Only National admin can register new admins'
      });
    }

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    const admin = new Admin({
      name,
      email,
      password,
      role,
      assignedState: role !== 'National' ? assignedState : undefined,
      assignedDistrict: role === 'District' ? assignedDistrict : undefined,
      assignedDepartment: role === 'Department' ? assignedDepartment : undefined,
      phoneNumber,
      permissions: getDefaultPermissions(role)
    });

    await admin.save();

    return res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin Registration Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error registering admin: ' + error.message
    });
  }
};

/**
 * Admin login
 */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await admin.matchPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Admin account is inactive'
      });
    }

    // Update last login
    admin.lastLoginAt = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id, 'admin');

    return res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        assignedState: admin.assignedState,
        assignedDistrict: admin.assignedDistrict,
        assignedDepartment: admin.assignedDepartment,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error during login: ' + error.message
    });
  }
};

/**
 * Get admin dashboard analytics
 */
export const getDashboardAnalytics = async (req, res) => {
  try {
    const admin = req.admin;
    
    // Build query based on admin role
    let complaintQuery = {};
    
    if (admin.role === 'State') {
      complaintQuery.state = admin.assignedState;
    } else if (admin.role === 'District') {
      complaintQuery.state = admin.assignedState;
      complaintQuery.district = admin.assignedDistrict;
    } else if (admin.role === 'Department') {
      complaintQuery.department = admin.assignedDepartment;
    }

    // Get total complaints
    const totalComplaints = await Complaint.countDocuments(complaintQuery);

    // Get complaints by status
    const byStatus = await Complaint.aggregate([
      { $match: complaintQuery },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get complaints by priority
    const byPriority = await Complaint.aggregate([
      { $match: complaintQuery },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Get complaints by department
    const byDepartment = await Complaint.aggregate([
      { $match: complaintQuery },
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    // Get pending complaints
    const pendingComplaints = await Complaint.countDocuments({
      ...complaintQuery,
      status: { $in: ['Submitted', 'Under Review', 'Assigned', 'In Progress'] }
    });

    // Get resolved complaints
    const resolvedComplaints = await Complaint.countDocuments({
      ...complaintQuery,
      status: 'Resolved'
    });

    // Get manual review pending
    const manualReviewPending = await Complaint.countDocuments({
      ...complaintQuery,
      needsManualReview: true,
      status: 'Under Review'
    });

    // Calculate resolution rate
    const resolutionRate = totalComplaints > 0 
      ? Math.round((resolvedComplaints / totalComplaints) * 100) 
      : 0;

    return res.status(200).json({
      success: true,
      analytics: {
        totalComplaints,
        pendingComplaints,
        resolvedComplaints,
        manualReviewPending,
        resolutionRate,
        byStatus: formatAggregateData(byStatus),
        byPriority: formatAggregateData(byPriority),
        byDepartment: formatAggregateData(byDepartment)
      }
    });
  } catch (error) {
    console.error('Dashboard Analytics Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching analytics: ' + error.message
    });
  }
};

/**
 * Get all complaints for admin dashboard
 */
export const getAdminComplaints = async (req, res) => {
  try {
    const admin = req.admin;
    const { status, priority, department, page = 1, limit = 20 } = req.query;

    // Build query based on admin role
    let query = {};
    
    if (admin.role === 'State') {
      query.state = admin.assignedState;
    } else if (admin.role === 'District') {
      query.state = admin.assignedState;
      query.district = admin.assignedDistrict;
    } else if (admin.role === 'Department') {
      query.department = admin.assignedDepartment;
    }

    // Add filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (department && admin.role === 'National') query.department = department;

    const complaints = await Complaint.find(query)
      .populate('user', 'name email mobile')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Complaint.countDocuments(query);

    return res.status(200).json({
      success: true,
      complaints,
      pagination: {
        current: page,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get Admin Complaints Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching complaints: ' + error.message
    });
  }
};

/**
 * Get single complaint detail for admin
 */
export const getComplaintDetail = async (req, res) => {
  try {
    const { complaintId } = req.params;

    const complaint = await Complaint.findById(complaintId)
      .populate('user', 'name email mobile state district')
      .populate('actionLog.updatedBy', 'name email role');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    return res.status(200).json({
      success: true,
      complaint
    });
  } catch (error) {
    console.error('Get Complaint Detail Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching complaint: ' + error.message
    });
  }
};

/**
 * Helper: Get default permissions by role
 */
function getDefaultPermissions(role) {
  const defaultPermissions = {
    'National': [
      'view_complaints',
      'assign_complaints',
      'manual_review',
      'update_status',
      'manage_admins',
      'view_analytics'
    ],
    'State': [
      'view_complaints',
      'assign_complaints',
      'manual_review',
      'update_status',
      'view_analytics'
    ],
    'District': [
      'view_complaints',
      'manual_review',
      'update_status',
      'view_analytics'
    ],
    'Department': [
      'view_complaints',
      'update_status',
      'view_analytics'
    ]
  };

  return defaultPermissions[role] || [];
}

/**
 * Helper: Format aggregate data
 */
function formatAggregateData(data) {
  return data.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});
}

// Legacy functions for backward compatibility
export const authAdmin = adminLogin;
export const createAdmin = registerAdmin;