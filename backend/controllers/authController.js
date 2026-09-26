import User from '../models/User.js';
import { generateToken } from '../utils/helpers.js';

/**
 * Register User
 */
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      aadhaar,
      password,
      confirmPassword,
      state,
      district,
      language
    } = req.body;

    // Validation
    if (
      !name ||
      !email ||
      !mobile ||
      !aadhaar ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Password match check
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      $or: [
        { email },
        { mobile },
        { aadhaar }
      ]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          'User with this email, mobile or Aadhaar already exists'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      mobile,
      aadhaar,
      password,
      state: state || null,
      district: district || null,
      preferredLanguage: language || 'en'
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        aadhaar: user.aadhaar,
        state: user.state,
        district: user.district
      }
    });

  } catch (error) {
    console.error('Registration Error:', error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Login User
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Match password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        aadhaar: user.aadhaar,
        state: user.state,
        district: user.district
      }
    });

  } catch (error) {
    console.error('Login Error:', error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Verify OTP
 */
export const verifyOTP = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'OTP verification disabled temporarily'
  });
};

/**
 * Resend OTP
 */
export const resendOTP = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Resend OTP disabled temporarily'
  });
};

/**
 * Get User Profile
 */
export const getUserProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update User Profile
 */
export const updateUserProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Forgot Password
 */
export const forgotPassword = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Forgot password temporarily disabled'
  });
};

/**
 * Reset Password
 */
export const resetPassword = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Reset password temporarily disabled'
  });
};