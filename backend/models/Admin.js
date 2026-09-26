import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  // Basic Information
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  
  // Role-based Access
  role: {
    type: String,
    enum: ['National', 'State', 'District', 'Department'],
    required: true,
    index: true
  },
  
  // Department Assignment (if Department role)
  assignedDepartment: {
    type: String,
    enum: [
      'Water Department',
      'Electricity Department',
      'Road & Transport',
      'Sanitation',
      'Health Department',
      'Public Services'
    ],
    required: function() { return this.role === 'Department'; }
  },
  
  // Geo-fencing fields
  assignedState: { 
    type: String, 
    required: function() { return this.role !== 'National'; } 
  },
  assignedDistrict: { 
    type: String, 
    required: function() { return this.role === 'District'; } 
  },
  
  // Contact Information
  phoneNumber: String,
  
  // Status
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  
  // Permissions
  permissions: [{
    type: String,
    enum: [
      'view_complaints',
      'assign_complaints',
      'manual_review',
      'update_status',
      'manage_admins',
      'view_analytics'
    ]
  }],
  
  // Last Login
  lastLoginAt: Date
  
}, { 
  timestamps: true,
  indexes: [
    { role: 1, isActive: 1 },
    { assignedState: 1 },
    { assignedDistrict: 1 }
  ]
});

// Password hashing middleware
// Password hashing middleware
adminSchema.pre('save', async function () {
  // 1. Removed 'next' from function arguments
  if (!this.isModified('password')) return; // 2. Just return, don't return next()
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // 3. Removed next() here
  } catch (error) {
    throw error; // 4. Throw the error instead of passing it to next()
  }
});
// Method to compare passwords
adminSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to check permission
adminSchema.methods.hasPermission = function (permission) {
  return this.permissions.includes(permission);
};

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;