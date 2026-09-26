import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js';

/**
 * Middleware to protect user routes
 */
export const protectUser = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.userType !== 'user' && !decoded.isUser) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - User token required'
      });
    }

    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    next();
  } catch (error) {
    console.error('Auth Error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized - Invalid token: ' + error.message
    });
  }
};

/**
 * Middleware to protect admin routes
 */
export const protectAdmin = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.userType !== 'admin' && !decoded.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - Admin token required'
      });
    }

    req.admin = await Admin.findById(decoded.id).select('-password');
    if (!req.admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    if (!req.admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Admin account is inactive'
      });
    }

    next();
  } catch (error) {
    console.error('Auth Error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized - Invalid token'
    });
  }
};

/**
 * Authorize based on role
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({ 
        success: false,
        message: `Role ${req.admin?.role} is not authorized` 
      });
    }
    next();
  };
};

/**
 * Check permission
 */
export const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!req.admin.permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: 'Permission denied'
      });
    }

    next();
  };
};

/**
 * Extract token from Authorization header
 */
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return null;
  }

  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.substring(7);
};

// Keep old export for backward compatibility
export const protect = protectUser;