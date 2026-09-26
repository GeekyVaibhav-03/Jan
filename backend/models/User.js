import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Basic Information
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters long'],
    maxlength: [50, 'Name must not exceed 50 characters']
  },
  mobile: { 
    type: String, 
    required: [true, 'Mobile number is required'],
    unique: true,
    trim: true,
    match: [/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'],
    index: true
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    index: true
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  aadhaar: {
    type: String,
    required: [true, 'Aadhaar number is required'],
    unique: true,
    trim: true,
    match: [/^[0-9]{12}$/, 'Aadhaar must be exactly 12 digits'],
    index: true
  },
  
  // OTP Verification
  otp: {
    code: { type: String },
    expiresAt: { type: Date }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isMobileVerified: {
    type: Boolean,
    default: false
  },
  
  // Language Preference
  preferredLanguage: {
    type: String,
    enum: ['en', 'hi', 'hinglish'],
    default: 'en'
  },
  
  // Location Information
  state: String,
  district: String,
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Profile Information
  avatar: String,
  
}, { 
  timestamps: true 
});

// Password hashing middleware
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (
  enteredPassword
) {
  if (!this.password) return false;
  return await bcrypt.compare(
    enteredPassword,
    this.password
  );
};
// Method to verify OTP
userSchema.methods.verifyOTP = function (enteredOTP) {
  if (!this.otp.code || !this.otp.expiresAt) {
    return false;
  }
  if (new Date() > this.otp.expiresAt) {
    return false; // OTP expired
  }
  return this.otp.code === enteredOTP;
};

const User = mongoose.model('User', userSchema);
export default User;