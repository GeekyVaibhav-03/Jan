import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import '../config/env.js';

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required in backend/.env');
  }

  return process.env.JWT_SECRET;
};

/**
 * Generate JWT Token
 */
export const generateToken = (id, userType = 'user') => {
  return jwt.sign(
    { id, userType },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRY || '30d' }
  );
};

/**
 * Verify JWT Token
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch (error) {
    return null;
  }
};

/**
 * Generate unique Tracking ID for complaints
 */
export const generateTrackingId = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = nanoid(8).toUpperCase();
  return `JS-${year}${month}${day}-${random}`;
};

/**
 * Generate OTP (6 digits)
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Calculate SLA deadline based on priority
 */
export const calculateSLADeadline = (priority = 'Medium') => {
  const now = new Date();
  let hours = 72; // Default: Medium

  switch (priority) {
    case 'High':
      hours = 48;
      break;
    case 'Medium':
      hours = 72;
      break;
    case 'Low':
      hours = 120; // 5 days
      break;
    default:
      hours = 72;
  }

  const deadline = new Date(now.getTime() + hours * 60 * 60 * 1000);
  return deadline;
};

/**
 * Get Department-wise state and district mapping
 */
export const departmentMapping = {
  'Water Department': {
    keywords: ['water', 'tap', 'supply', 'pipeline', 'drinking water', 'water crisis', 'no water'],
    priority: 'High'
  },
  'Electricity Department': {
    keywords: ['electricity', 'power', 'light', 'bill', 'meter', 'voltage', 'blackout', 'current'],
    priority: 'High'
  },
  'Road & Transport': {
    keywords: ['road', 'pothole', 'street', 'highway', 'traffic', 'transport', 'vehicle', 'lane', 'pavement'],
    priority: 'Medium'
  },
  'Sanitation': {
    keywords: ['garbage', 'waste', 'dirty', 'trash', 'drainage', 'sewer', 'cleaning', 'hygiene'],
    priority: 'High'
  },
  'Health Department': {
    keywords: ['health', 'hospital', 'clinic', 'doctor', 'medical', 'disease', 'sanitary', 'health facility'],
    priority: 'High'
  },
  'Public Services': {
    keywords: ['public', 'government', 'office', 'service', 'application', 'document', 'license', 'permit'],
    priority: 'Medium'
  }
};

/**
 * Get Indian States and Districts mapping (Sample)
 */
export const locationsData = {
  'Andhra Pradesh': ['Visakhapatnam', 'Krishna', 'Guntur', 'Chittoor', 'Nellore'],
  'Bihar': ['Patna', 'East Champaran', 'West Champaran', 'Muzaffarpur', 'Madhubani'],
  'Chhattisgarh': ['Raipur', 'Bilaspur', 'Durg', 'Rajnandgaon', 'Raigarh'],
  'Goa': ['North Goa', 'South Goa'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
  'Haryana': ['Faridabad', 'Gurgaon', 'Hisar', 'Rohtak', 'Panipat'],
  'Himachal Pradesh': ['Kangra', 'Mandi', 'Solan', 'Shimla', 'Kullu'],
  'Jharkhand': ['Ranchi', 'Dhanbad', 'Giridih', 'West Singhbhum', 'Bokaro'],
  'Karnataka': ['Bangalore', 'Mysore', 'Belgaum', 'Mangalore', 'Hubballi'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Alappuzha'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Aurangabad', 'Nashik'],
  'Manipur': ['Imphal', 'Bishnupur', 'Thoubal', 'Senapati'],
  'Meghalaya': ['Shillong', 'Tura', 'Jowai'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Saiha'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Sambalpur', 'Berhampur'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Ajmer', 'Bhilwara'],
  'Sikkim': ['Gangtok', 'Pelling', 'Namchi'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'],
  'Telangana': ['Hyderabad', 'Secunderabad', 'Warangal', 'Karimnagar', 'Khammam'],
  'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Rishikesh', 'Nainital', 'Almora'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Darjeeling', 'Siliguri']
};

/**
 * Get all states
 */
export const getStates = () => {
  return Object.keys(locationsData).sort();
};

/**
 * Get districts for a state
 */
export const getDistricts = (state) => {
  return locationsData[state] || [];
};

/**
 * Determine priority escalation rules
 */
export const determinePriority = (keywords = [], category = '') => {
  const urgentKeywords = ['emergency', 'critical', 'urgent', 'danger', 'hazard', 'health', 'injury', 'accident'];
  const foundUrgent = urgentKeywords.some(kw => 
    keywords.some(k => k.toLowerCase().includes(kw))
  );

  if (foundUrgent || category === 'Health Department' || category === 'Sanitation') {
    return 'High';
  }

  const standardKeywords = ['water', 'electricity', 'gas'];
  const foundStandard = standardKeywords.some(kw =>
    keywords.some(k => k.toLowerCase().includes(kw))
  );

  return foundStandard ? 'Medium' : 'Low';
};
