import mongoose from 'mongoose';

const citizenMetadataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  aadhaar: { type: String, required: true },
  address: { type: String }
}, { _id: false });

const actionLogSchema = new mongoose.Schema({
  action: { 
    type: String, 
    required: true,
    enum: ['Created', 'Assigned', 'Updated', 'Resolved', 'Rejected', 'ManualReview', 'Escalated', 'Pending', 'In-Progress', 'Under Review']
  },
  updatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin'
  },
  remarks: { type: String },
  status: { 
    type: String,
    enum: ['Pending', 'Under Review', 'Assigned', 'In-Progress', 'Resolved', 'Rejected'],
    default: 'Pending'
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
}, { _id: true });

const complaintSchema = new mongoose.Schema({
  // User Reference & Citizen Metadata
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  citizenMetadata: {
    type: citizenMetadataSchema,
    required: true
  },
  
  // Unique Tracking ID
  trackingId: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true,
    uppercase: true
  },
  
  // Complaint Content
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true 
  },
  
  // Multilingual Support
  language: {
    type: String,
    enum: ['en', 'hi', 'hinglish'],
    default: 'en'
  },
  
  // Location Information
  state: { 
    type: String, 
    required: true, 
    index: true 
  },
  district: { 
    type: String, 
    required: true, 
    index: true 
  },
  
  // Media Attachments
  imageUrl: String,
  attachments: [String],
  
  // AI Classification & Analysis
  aiAnalysis: {
    intent: String,
    category: String,
    keywords: [String],
    confidence: {
      type: Number,
      min: 0,
      max: 100
    },
    rawResponse: mongoose.Schema.Types.Mixed
  },
  
  // Department Routing
  department: { 
    type: String, 
    index: true,
    enum: [
      'Water Supply',
      'Electricity', 
      'Roads',
      'Waste Management',
      'Public Health',
      'General'
    ]
  },
  
  departmentAssignedAt: Date,
  
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
    index: true
  },
  
  priorityReason: String,
  
  // Routing Confidence & Manual Review
  routingConfidence: {
    type: Number,
    min: 0,
    max: 100
  },
  
  needsManualReview: {
    type: Boolean,
    default: false
  },
  
  manualReviewReason: String,
  
  // Status Tracking
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Assigned', 'In-Progress', 'Resolved', 'Rejected'],
    default: 'Pending',
    index: true
  },
  
  // Resolution Information
  resolutionDetails: String,
  resolvedAt: {
    type: Date,
    default: null
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  
  // Timestamps for SLAs
  submittedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  expectedResolutionDate: Date,
  
  // Action History with Timeline
  actionLog: [actionLogSchema]
  
}, { 
  timestamps: true
});

// Compound Indexes for Performance
complaintSchema.index({ state: 1, district: 1, department: 1, status: 1 });
complaintSchema.index({ user: 1, submittedAt: -1 });
complaintSchema.index({ priority: 1, status: 1 });
complaintSchema.index({ trackingId: 1, status: 1 });
complaintSchema.index({ needsManualReview: 1, status: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;