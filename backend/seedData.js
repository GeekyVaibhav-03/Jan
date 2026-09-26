import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import './config/env.js';
import User from './models/User.js';
import Admin from './models/Admin.js';
import Complaint from './models/Complaint.js';

const seedComprehensiveData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/jansathi';
    console.log(`🔌 Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('🧹 Clearing old demo data...');
    await Complaint.deleteMany({});
    await User.deleteMany({});
    await Admin.deleteMany({});

    console.log('👤 Seeding Admins...');
    const hashedAdminPassword = await bcrypt.hash('Admin@123', 10);

    const admins = await Admin.insertMany([
      {
        name: 'Rajesh Verma (National Admin)',
        email: 'admin@jansathi.gov.in',
        password: hashedAdminPassword,
        role: 'National',
        phoneNumber: '9876543210',
        isActive: true,
        permissions: [
          'view_complaints',
          'assign_complaints',
          'manual_review',
          'update_status',
          'manage_admins',
          'view_analytics'
        ]
      },
      {
        name: 'Anand Mishra (State Director UP)',
        email: 'state.up@jansathi.gov.in',
        password: hashedAdminPassword,
        role: 'State',
        assignedState: 'Uttar Pradesh',
        phoneNumber: '9876543211',
        isActive: true,
        permissions: [
          'view_complaints',
          'assign_complaints',
          'update_status',
          'view_analytics'
        ]
      },
      {
        name: 'Sunil Saxena (District Collector)',
        email: 'district.lucknow@jansathi.gov.in',
        password: hashedAdminPassword,
        role: 'District',
        assignedState: 'Uttar Pradesh',
        assignedDistrict: 'Lucknow',
        phoneNumber: '9876543212',
        isActive: true,
        permissions: [
          'view_complaints',
          'assign_complaints',
          'update_status'
        ]
      },
      {
        name: 'Dr. Neha Gupta (Chief Engineer Water)',
        email: 'dept.water@jansathi.gov.in',
        password: hashedAdminPassword,
        role: 'Department',
        assignedState: 'Uttar Pradesh',
        assignedDepartment: 'Water Department',
        phoneNumber: '9876543213',
        isActive: true,
        permissions: [
          'view_complaints',
          'update_status'
        ]
      }
    ]);

    const nationalAdmin = admins[0];

    console.log('👥 Seeding Citizens / Users...');
    const hashedUserPassword = await bcrypt.hash('password123', 10);

    const users = await User.insertMany([
      {
        name: 'Ramesh Kumar (Citizen)',
        email: 'citizen@example.com',
        mobile: '9876543210',
        aadhaar: '123456789012',
        password: hashedUserPassword,
        state: 'Uttar Pradesh',
        district: 'Lucknow',
        preferredLanguage: 'en',
        isEmailVerified: true,
        isMobileVerified: true,
        isActive: true
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        mobile: '9823456781',
        aadhaar: '234567890123',
        password: hashedUserPassword,
        state: 'Maharashtra',
        district: 'Mumbai',
        preferredLanguage: 'en',
        isEmailVerified: true,
        isMobileVerified: true,
        isActive: true
      },
      {
        name: 'Amit Patel',
        email: 'amit.patel@example.com',
        mobile: '9812345678',
        aadhaar: '345678901234',
        password: hashedUserPassword,
        state: 'Gujarat',
        district: 'Ahmedabad',
        preferredLanguage: 'en',
        isEmailVerified: true,
        isMobileVerified: true,
        isActive: true
      },
      {
        name: 'Ananya Sen',
        email: 'ananya.sen@example.com',
        mobile: '9834567890',
        aadhaar: '456789012345',
        password: hashedUserPassword,
        state: 'West Bengal',
        district: 'Kolkata',
        preferredLanguage: 'en',
        isEmailVerified: true,
        isMobileVerified: true,
        isActive: true
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.singh@example.com',
        mobile: '9845678901',
        aadhaar: '567890123456',
        password: hashedUserPassword,
        state: 'Rajasthan',
        district: 'Jaipur',
        preferredLanguage: 'en',
        isEmailVerified: true,
        isMobileVerified: true,
        isActive: true
      }
    ]);

    const primaryCitizen = users[0];
    const priya = users[1];
    const amit = users[2];
    const ananya = users[3];
    const vikram = users[4];

    console.log('📋 Seeding Complaints with realistic timelines & AI analyses...');

    const now = new Date();
    const daysAgo = (d, hours = 0) => new Date(now.getTime() - (d * 24 * 60 * 60 * 1000) - (hours * 60 * 60 * 1000));
    const daysAhead = (d) => new Date(now.getTime() + (d * 24 * 60 * 60 * 1000));

    const complaintsData = [
      // --- CITIZEN: Ramesh Kumar (citizen@example.com) ---
      {
        user: primaryCitizen._id,
        citizenMetadata: {
          name: primaryCitizen.name,
          phone: primaryCitizen.mobile,
          email: primaryCitizen.email,
          aadhaar: primaryCitizen.aadhaar,
          address: 'Plot 42, Sector 14, Gomti Nagar, Lucknow, UP'
        },
        trackingId: 'JS-2026-WTR401',
        title: 'Severe drinking water contamination and foul odor',
        description: 'Tap water received in Gomti Nagar Sector 14 has dark discoloration and chemical odor since past 4 days. Multiple residents reported stomach infections. Immediate pipeline inspection required.',
        language: 'en',
        state: 'Uttar Pradesh',
        district: 'Lucknow',
        department: 'Water Supply',
        priority: 'High',
        priorityReason: 'Public health hazard: contaminated water supply',
        routingConfidence: 94,
        needsManualReview: false,
        status: 'Resolved',
        resolutionDetails: 'Municipal Jal Sansthan team replaced damaged underground pipe joint at Crossroad 4. Water test reports cleared for potable standards.',
        resolvedAt: daysAgo(1, 2),
        resolvedBy: nationalAdmin._id,
        submittedAt: daysAgo(5, 4),
        createdAt: daysAgo(5, 4),
        expectedResolutionDate: daysAgo(3),
        aiAnalysis: {
          intent: 'Water contamination emergency',
          category: 'Water Department',
          keywords: ['water', 'contamination', 'odor', 'health', 'pipeline'],
          confidence: 94
        },
        actionLog: [
          { action: 'Created', status: 'Pending', remarks: 'Grievance submitted by citizen', timestamp: daysAgo(5, 4) },
          { action: 'Assigned', status: 'Assigned', remarks: 'Assigned to Jal Sansthan Division 2', timestamp: daysAgo(4, 8), updatedBy: nationalAdmin._id },
          { action: 'In-Progress', status: 'In-Progress', remarks: 'Ground inspection team dispatched for water sampling', timestamp: daysAgo(3, 5), updatedBy: nationalAdmin._id },
          { action: 'Resolved', status: 'Resolved', remarks: 'Defective pipe repaired, fresh water purity verified', timestamp: daysAgo(1, 2), updatedBy: nationalAdmin._id }
        ]
      },
      {
        user: primaryCitizen._id,
        citizenMetadata: {
          name: primaryCitizen.name,
          phone: primaryCitizen.mobile,
          email: primaryCitizen.email,
          aadhaar: primaryCitizen.aadhaar,
          address: 'Main Market Road, Alambagh, Lucknow, UP'
        },
        trackingId: 'JS-2026-ELC812',
        title: 'Dangerous live wire exposed after thunderstorm near park gate',
        description: 'A 440V overhead distribution cable snapped and is dangling 4 feet above the pedestrian walkway near the children park gate. Serious electrocution risk.',
        language: 'en',
        state: 'Uttar Pradesh',
        district: 'Lucknow',
        department: 'Electricity',
        priority: 'High',
        priorityReason: 'Life threat: exposed live electrical conductor',
        routingConfidence: 98,
        needsManualReview: false,
        status: 'In-Progress',
        submittedAt: daysAgo(2, 6),
        createdAt: daysAgo(2, 6),
        expectedResolutionDate: daysAhead(1),
        aiAnalysis: {
          intent: 'Electrical wire hazard',
          category: 'Electricity Department',
          keywords: ['wire', 'exposed', 'electrocution', 'danger', 'power'],
          confidence: 98
        },
        actionLog: [
          { action: 'Created', status: 'Pending', remarks: 'Emergency grievance logged', timestamp: daysAgo(2, 6) },
          { action: 'Assigned', status: 'Assigned', remarks: 'Priority escalation to UPPCL Rapid Response Team', timestamp: daysAgo(2, 4), updatedBy: nationalAdmin._id },
          { action: 'In-Progress', status: 'In-Progress', remarks: 'Power isolated; line maintenance crew on site', timestamp: daysAgo(1, 2), updatedBy: nationalAdmin._id }
        ]
      },
      {
        user: primaryCitizen._id,
        citizenMetadata: {
          name: primaryCitizen.name,
          phone: primaryCitizen.mobile,
          email: primaryCitizen.email,
          aadhaar: primaryCitizen.aadhaar,
          address: 'Shaheed Path Link Road, Lucknow, UP'
        },
        trackingId: 'JS-2026-ROD109',
        title: 'Deep pothole cluster damaging vehicles near Shaheed Path flyover',
        description: 'Large series of potholes spanning 50 meters near flyover ramp. Causing extreme traffic slowdown and already caused two two-wheeler skidding incidents.',
        language: 'en',
        state: 'Uttar Pradesh',
        district: 'Lucknow',
        department: 'Roads',
        priority: 'Medium',
        priorityReason: 'Road safety hazard and traffic congestion',
        routingConfidence: 89,
        needsManualReview: false,
        status: 'Pending',
        submittedAt: daysAgo(1, 3),
        createdAt: daysAgo(1, 3),
        expectedResolutionDate: daysAhead(2),
        aiAnalysis: {
          intent: 'Damaged roadway repair',
          category: 'Road & Transport',
          keywords: ['pothole', 'road', 'flyover', 'accident', 'traffic'],
          confidence: 89
        },
        actionLog: [
          { action: 'Created', status: 'Pending', remarks: 'Grievance submitted, awaiting executive engineer review', timestamp: daysAgo(1, 3) }
        ]
      },
      {
        user: primaryCitizen._id,
        citizenMetadata: {
          name: primaryCitizen.name,
          phone: primaryCitizen.mobile,
          email: primaryCitizen.email,
          aadhaar: primaryCitizen.aadhaar,
          address: 'Sector B, Indiranagar, Lucknow, UP'
        },
        trackingId: 'JS-2026-WST334',
        title: 'Commercial garbage dumped into residential vacant plot',
        description: 'Local banquet hall repeatedly dumping food waste and plastic debris in open neighborhood plot. Stench and stray dog menace making life unlivable for neighbors.',
        language: 'en',
        state: 'Uttar Pradesh',
        district: 'Lucknow',
        department: 'Waste Management',
        priority: 'Medium',
        priorityReason: 'Sanitation and public nuisance',
        routingConfidence: 91,
        needsManualReview: false,
        status: 'In-Progress',
        submittedAt: daysAgo(3, 8),
        createdAt: daysAgo(3, 8),
        expectedResolutionDate: daysAhead(1),
        aiAnalysis: {
          intent: 'Illegal waste dumping complaint',
          category: 'Sanitation',
          keywords: ['garbage', 'dumping', 'waste', 'stench', 'sanitation'],
          confidence: 91
        },
        actionLog: [
          { action: 'Created', status: 'Pending', remarks: 'Complaint submitted with geo-tagged images', timestamp: daysAgo(3, 8) },
          { action: 'Assigned', status: 'Assigned', remarks: 'Sent to Nagar Nigam Sanitation Officer Ward 18', timestamp: daysAgo(2, 5), updatedBy: nationalAdmin._id },
          { action: 'In-Progress', status: 'In-Progress', remarks: 'Notice issued to violator; earth-mover scheduled for clearance', timestamp: daysAgo(1, 4), updatedBy: nationalAdmin._id }
        ]
      },
      {
        user: primaryCitizen._id,
        citizenMetadata: {
          name: primaryCitizen.name,
          phone: primaryCitizen.mobile,
          email: primaryCitizen.email,
          aadhaar: primaryCitizen.aadhaar,
          address: 'Near Community Health Centre, Mohanlalganj, Lucknow'
        },
        trackingId: 'JS-2026-HLT552',
        title: 'Vector-borne disease outbreak risk: Dengue fumigation required',
        description: 'Stagnant rainwater along open drains has created massive mosquito larvae breeding. 7 positive dengue cases reported in the colony this week. Urgent fogging and anti-larval spray needed.',
        language: 'en',
        state: 'Uttar Pradesh',
        district: 'Lucknow',
        department: 'Public Health',
        priority: 'High',
        priorityReason: 'Imminent outbreak risk: Dengue fever cases rising',
        routingConfidence: 95,
        needsManualReview: false,
        status: 'Under Review',
        submittedAt: daysAgo(0, 4),
        createdAt: daysAgo(0, 4),
        expectedResolutionDate: daysAhead(2),
        aiAnalysis: {
          intent: 'Public health epidemic prevention',
          category: 'Health Department',
          keywords: ['dengue', 'mosquito', 'health', 'fever', 'fumigation'],
          confidence: 95
        },
        actionLog: [
          { action: 'Created', status: 'Pending', remarks: 'High priority alert logged by citizen', timestamp: daysAgo(0, 4) },
          { action: 'Under Review', status: 'Under Review', remarks: 'CMO Office reviewing epidemiological data for cluster fumigation', timestamp: daysAgo(0, 2), updatedBy: nationalAdmin._id }
        ]
      },

      // --- CITIZEN: Priya Sharma (Mumbai, Maharashtra) ---
      {
        user: priya._id,
        citizenMetadata: {
          name: priya.name,
          phone: priya.mobile,
          email: priya.email,
          aadhaar: priya.aadhaar,
          address: 'SV Road, Andheri West, Mumbai, Maharashtra'
        },
        trackingId: 'JS-2026-WTR789',
        title: 'Low pressure water supply in multi-story residential society',
        description: 'Water pressure from municipal main has dropped by 80% over the last week. Water cannot reach overhead gravity tanks on 3rd floor and above.',
        language: 'en',
        state: 'Maharashtra',
        district: 'Mumbai',
        department: 'Water Supply',
        priority: 'Medium',
        priorityReason: 'Urban residential water shortage',
        routingConfidence: 92,
        needsManualReview: false,
        status: 'Resolved',
        resolutionDetails: 'BMC hydraulic department calibrated pressure booster pump on SV Road pipeline. Normal 2.5 bar pressure restored.',
        resolvedAt: daysAgo(2, 5),
        resolvedBy: nationalAdmin._id,
        submittedAt: daysAgo(6, 7),
        createdAt: daysAgo(6, 7),
        expectedResolutionDate: daysAgo(3),
        aiAnalysis: {
          intent: 'Water pressure deficiency',
          category: 'Water Department',
          keywords: ['water', 'pressure', 'supply', 'municipal', 'tank'],
          confidence: 92
        },
        actionLog: [
          { action: 'Created', status: 'Pending', remarks: 'Complaint registered', timestamp: daysAgo(6, 7) },
          { action: 'Assigned', status: 'Assigned', remarks: 'Assigned to K-West Ward Hydraulic Engineer', timestamp: daysAgo(5, 3), updatedBy: nationalAdmin._id },
          { action: 'In-Progress', status: 'In-Progress', remarks: 'Booster valve tuning initiated', timestamp: daysAgo(3, 4), updatedBy: nationalAdmin._id },
          { action: 'Resolved', status: 'Resolved', remarks: 'Pressure verified by society secretary', timestamp: daysAgo(2, 5), updatedBy: nationalAdmin._id }
        ]
      },
      {
        user: priya._id,
        citizenMetadata: {
          name: priya.name,
          phone: priya.mobile,
          email: priya.email,
          aadhaar: priya.aadhaar,
          address: 'Bandra Reclamation, Bandra West, Mumbai'
        },
        trackingId: 'JS-2026-ROD902',
        title: 'Broken pedestrian promenade tiles causing slip and fall injuries',
        description: 'Coastal promenade tiles have cracked and dislodged over a 30 meter stretch. Senior citizens frequently slip during morning walks.',
        language: 'en',
        state: 'Maharashtra',
        district: 'Mumbai',
        department: 'Roads',
        priority: 'Low',
        priorityReason: 'Pedestrian pavement infrastructure maintenance',
        routingConfidence: 87,
        needsManualReview: false,
        status: 'In-Progress',
        submittedAt: daysAgo(4, 2),
        createdAt: daysAgo(4, 2),
        expectedResolutionDate: daysAhead(3),
        aiAnalysis: {
          intent: 'Walkway pavement repair',
          category: 'Road & Transport',
          keywords: ['footpath', 'promenade', 'tiles', 'pedestrian', 'repair'],
          confidence: 87
        },
        actionLog: [
          { action: 'Created', status: 'Pending', remarks: 'Complaint logged', timestamp: daysAgo(4, 2) },
          { action: 'Assigned', status: 'Assigned', remarks: 'Work order approved for paver block refitting', timestamp: daysAgo(2, 1), updatedBy: nationalAdmin._id }
        ]
      },

      // --- CITIZEN: Amit Patel (Ahmedabad, Gujarat) ---
      {
        user: amit._id,
        citizenMetadata: {
          name: amit.name,
          phone: amit.mobile,
          email: amit.email,
          aadhaar: amit.aadhaar,
          address: 'Naroda Industrial Area, Ahmedabad, Gujarat'
        },
        trackingId: 'JS-2026-WST621',
        title: 'Illegal toxic chemical effluent discharge into storm drainage',
        description: 'Unidentified chemical processing unit discharging pungent acidic liquid into storm drain at night. Acrid fumes causing eye burning and throat irritation across residential colony.',
        language: 'en',
        state: 'Gujarat',
        district: 'Ahmedabad',
        department: 'Waste Management',
        priority: 'High',
        priorityReason: 'Severe environmental hazard: chemical effluent discharge',
        routingConfidence: 96,
        needsManualReview: false,
        status: 'In-Progress',
        submittedAt: daysAgo(5, 6),
        createdAt: daysAgo(5, 6),
        expectedResolutionDate: daysAhead(1),
        aiAnalysis: {
          intent: 'Toxic industrial effluent violation',
          category: 'Sanitation',
          keywords: ['chemical', 'effluent', 'toxic', 'pollution', 'drain'],
          confidence: 96
        },
        actionLog: [
          { action: 'Created', status: 'Pending', remarks: 'Environmental emergency lodged', timestamp: daysAgo(5, 6) },
          { action: 'Assigned', status: 'Assigned', remarks: 'Gujarat Pollution Control Board joint team assigned', timestamp: daysAgo(4, 3), updatedBy: nationalAdmin._id },
          { action: 'In-Progress', status: 'In-Progress', remarks: 'Effluent samples gathered for chemical chromatography analysis', timestamp: daysAgo(2, 6), updatedBy: nationalAdmin._id }
        ]
      },
      {
        user: amit._id,
        citizenMetadata: {
          name: amit.name,
          phone: amit.mobile,
          email: amit.email,
          aadhaar: amit.aadhaar,
          address: 'Drive-In Road, Thaltej, Ahmedabad, Gujarat'
        },
        trackingId: 'JS-2026-ELC415',
        title: 'Severe voltage fluctuations burning compressor units and fans',
        description: 'Voltage oscillating violently between 140V and 290V in Block C. Refrigerator compressor burnt out. Transformer neutral line fault suspected.',
        language: 'en',
        state: 'Gujarat',
        district: 'Ahmedabad',
        department: 'Electricity',
        priority: 'High',
        priorityReason: 'Equipment damage and fire safety risk from voltage surge',
        routingConfidence: 93,
        needsManualReview: false,
        status: 'Resolved',
        resolutionDetails: 'Torrent Power crew replaced rusted neutral earthing strip at local transformer. Output voltage stabilized at 230V +/- 3%.',
        resolvedAt: daysAgo(1, 6),
        resolvedBy: nationalAdmin._id,
        submittedAt: daysAgo(4, 5),
        createdAt: daysAgo(4, 5),
        expectedResolutionDate: daysAgo(2),
        aiAnalysis: {
          intent: 'Power distribution surge issue',
          category: 'Electricity Department',
          keywords: ['voltage', 'fluctuation', 'surge', 'transformer', 'electricity'],
          confidence: 93
        },
        actionLog: [
          { action: 'Created', status: 'Pending', remarks: 'Grievance created', timestamp: daysAgo(4, 5) },
          { action: 'Assigned', status: 'Assigned', remarks: 'Substation technical team dispatched', timestamp: daysAgo(3, 2), updatedBy: nationalAdmin._id },
          { action: 'Resolved', status: 'Resolved', remarks: 'Transformer earthing renewed and voltage tested normal', timestamp: daysAgo(1, 6), updatedBy: nationalAdmin._id }
        ]
      },

      // --- CITIZEN: Ananya Sen (Kolkata, West Bengal) ---
      {
        user: ananya._id,
        citizenMetadata: {
          name: ananya.name,
          phone: ananya.mobile,
          email: ananya.email,
          aadhaar: ananya.aadhaar,
          address: 'Kasba New Market, Kolkata, West Bengal'
        },
        trackingId: 'JS-2026-ROD505',
        title: 'Non-functional street lighting along 1.5 km corridor',
        description: 'Streetlights on the arterial stretch from Ruby Crossing toward Kasba have been dark for 2 weeks. Women commuters feel unsafe walking from metro station after dark.',
        language: 'en',
        state: 'West Bengal',
        district: 'Kolkata',
        department: 'Roads',
        priority: 'Medium',
        priorityReason: 'Night-time public safety and lighting infrastructure',
        routingConfidence: 91,
        needsManualReview: false,
        status: 'Resolved',
        resolutionDetails: 'KMC Lighting Department replaced blown feeder pillar circuit breaker and 18 LED street light fixtures.',
        resolvedAt: daysAgo(3, 4),
        resolvedBy: nationalAdmin._id,
        submittedAt: daysAgo(7, 3),
        createdAt: daysAgo(7, 3),
        expectedResolutionDate: daysAgo(4),
        aiAnalysis: {
          intent: 'Public illumination restoration',
          category: 'Road & Transport',
          keywords: ['streetlight', 'dark', 'safety', 'lights', 'road'],
          confidence: 91
        },
        actionLog: [
          { action: 'Created', status: 'Pending', remarks: 'Complaint submitted', timestamp: daysAgo(7, 3) },
          { action: 'Assigned', status: 'Assigned', remarks: 'Lighting department work order issued', timestamp: daysAgo(6, 1), updatedBy: nationalAdmin._id },
          { action: 'Resolved', status: 'Resolved', remarks: 'All streetlights tested illuminated', timestamp: daysAgo(3, 4), updatedBy: nationalAdmin._id }
        ]
      },
      {
        user: ananya._id,
        citizenMetadata: {
          name: ananya.name,
          phone: ananya.mobile,
          email: ananya.email,
          aadhaar: ananya.aadhaar,
          address: 'Gariahat Road, Kolkata, West Bengal'
        },
        trackingId: 'JS-2026-HLT711',
        title: 'Lack of anti-venom and basic tetanus shots at local dispensary',
        description: 'The municipal urban primary health centre has had zero stock of tetanus toxoid injections and primary emergency anti-venom for over 3 weeks.',
        language: 'en',
        state: 'West Bengal',
        district: 'Kolkata',
        department: 'Public Health',
        priority: 'High',
        priorityReason: 'Essential medicine stockout at primary healthcare centre',
        routingConfidence: 94,
        needsManualReview: false,
        status: 'Pending',
        submittedAt: daysAgo(0, 6),
        createdAt: daysAgo(0, 6),
        expectedResolutionDate: daysAhead(1),
        aiAnalysis: {
          intent: 'Healthcare medicine shortage',
          category: 'Health Department',
          keywords: ['medicine', 'hospital', 'dispensary', 'injection', 'health'],
          confidence: 94
        },
        actionLog: [
          { action: 'Created', status: 'Pending', remarks: 'Emergency health stock alert received', timestamp: daysAgo(0, 6) }
        ]
      },

      // --- CITIZEN: Vikram Singh (Jaipur, Rajasthan) ---
      {
        user: vikram._id,
        citizenMetadata: {
          name: vikram.name,
          phone: vikram.mobile,
          email: vikram.email,
          aadhaar: vikram.aadhaar,
          address: 'Sector 8, Mansarovar, Jaipur, Rajasthan'
        },
        trackingId: 'JS-2026-WST919',
        title: 'Overflowing municipal garbage hopper blocking pedestrian access',
        description: 'Community garbage dumper has not been lifted for 9 consecutive days. Trash spilling across both lanes of road. Cattle feeding on plastic bags.',
        language: 'en',
        state: 'Rajasthan',
        district: 'Jaipur',
        department: 'Waste Management',
        priority: 'High',
        priorityReason: 'Sanitation emergency: municipal waste pileup',
        routingConfidence: 97,
        needsManualReview: false,
        status: 'Resolved',
        resolutionDetails: 'Jaipur Greater Municipal Corporation deployed compactors. Entire container sanitized and daily pickup frequency restored.',
        resolvedAt: daysAgo(4, 1),
        resolvedBy: nationalAdmin._id,
        submittedAt: daysAgo(7, 8),
        createdAt: daysAgo(7, 8),
        expectedResolutionDate: daysAgo(5),
        aiAnalysis: {
          intent: 'Municipal waste clearance request',
          category: 'Sanitation',
          keywords: ['garbage', 'dumper', 'overflow', 'plastic', 'sanitation'],
          confidence: 97
        },
        actionLog: [
          { action: 'Created', status: 'Pending', remarks: 'Public grievance filed', timestamp: daysAgo(7, 8) },
          { action: 'Assigned', status: 'Assigned', remarks: 'Solid Waste Management Zone 4 alerted', timestamp: daysAgo(6, 2), updatedBy: nationalAdmin._id },
          { action: 'Resolved', status: 'Resolved', remarks: 'Compactor vehicle cleared 4 metric tons of accumulated waste', timestamp: daysAgo(4, 1), updatedBy: nationalAdmin._id }
        ]
      },
      {
        user: vikram._id,
        citizenMetadata: {
          name: vikram.name,
          phone: vikram.mobile,
          email: vikram.email,
          aadhaar: vikram.aadhaar,
          address: 'Ajmer Road Bypass, Jaipur, Rajasthan'
        },
        trackingId: 'JS-2026-ROD330',
        title: 'Damaged steel crash barrier on highway curve prone to rollover',
        description: 'Heavy truck collision last week crushed 20 meters of steel W-beam safety barrier on high embankment curve. Vehicles vulnerable to falling off bridge edge.',
        language: 'en',
        state: 'Rajasthan',
        district: 'Jaipur',
        department: 'Roads',
        priority: 'High',
        priorityReason: 'Highway safety barrier structural collapse',
        routingConfidence: 95,
        needsManualReview: false,
        status: 'In-Progress',
        submittedAt: daysAgo(2, 3),
        createdAt: daysAgo(2, 3),
        expectedResolutionDate: daysAhead(2),
        aiAnalysis: {
          intent: 'Highway barrier reconstruction',
          category: 'Road & Transport',
          keywords: ['highway', 'barrier', 'guardrail', 'accident', 'danger'],
          confidence: 95
        },
        actionLog: [
          { action: 'Created', status: 'Pending', remarks: 'Complaint filed with photo evidence', timestamp: daysAgo(2, 3) },
          { action: 'Assigned', status: 'Assigned', remarks: 'NHAI Project Directorate assigned', timestamp: daysAgo(1, 8), updatedBy: nationalAdmin._id },
          { action: 'In-Progress', status: 'In-Progress', remarks: 'Replacement W-beam posts delivered on site', timestamp: daysAgo(0, 5), updatedBy: nationalAdmin._id }
        ]
      },
      {
        user: vikram._id,
        citizenMetadata: {
          name: vikram.name,
          phone: vikram.mobile,
          email: vikram.email,
          aadhaar: vikram.aadhaar,
          address: 'Civil Lines, Jaipur, Rajasthan'
        },
        trackingId: 'JS-2026-GEN110',
        title: 'Encroachment of public footpath by unauthorized commercial kiosk',
        description: 'Newly installed permanent tin kiosk blocking footway right in front of Senior Citizen Park entrance. Pedestrians forced into busy traffic lane.',
        language: 'en',
        state: 'Rajasthan',
        district: 'Jaipur',
        department: 'General',
        priority: 'Medium',
        priorityReason: 'Public pathway illegal encroachment',
        routingConfidence: 85,
        needsManualReview: true,
        manualReviewReason: 'Requires verification of municipal vendor vending zone permit',
        status: 'Under Review',
        submittedAt: daysAgo(3, 1),
        createdAt: daysAgo(3, 1),
        expectedResolutionDate: daysAhead(3),
        aiAnalysis: {
          intent: 'Encroachment removal demand',
          category: 'Public Services',
          keywords: ['encroachment', 'footpath', 'kiosk', 'vendor', 'traffic'],
          confidence: 85
        },
        actionLog: [
          { action: 'Created', status: 'Pending', remarks: 'Submitted by citizen', timestamp: daysAgo(3, 1) },
          { action: 'Under Review', status: 'Under Review', remarks: 'Revenue inspector verifying hawker permit records', timestamp: daysAgo(1, 2), updatedBy: nationalAdmin._id }
        ]
      },
      {
        user: vikram._id,
        citizenMetadata: {
          name: vikram.name,
          phone: vikram.mobile,
          email: vikram.email,
          aadhaar: vikram.aadhaar,
          address: 'Old Sanganer Road, Jaipur, Rajasthan'
        },
        trackingId: 'JS-2026-REJ007',
        title: 'Private boundary wall dispute with neighboring tenant',
        description: 'Neighbor constructed 2 feet higher boundary wall than mutually agreed during plot purchase in 2018. Demand demolition.',
        language: 'en',
        state: 'Rajasthan',
        district: 'Jaipur',
        department: 'General',
        priority: 'Low',
        priorityReason: 'Private property civil dispute',
        routingConfidence: 78,
        needsManualReview: true,
        status: 'Rejected',
        resolutionDetails: 'Matter pertains to private property civil dispute between individual landowners. Does not fall under public grievance jurisdiction. Advised to seek civil court remedy.',
        resolvedAt: daysAgo(3, 2),
        resolvedBy: nationalAdmin._id,
        submittedAt: daysAgo(6, 4),
        createdAt: daysAgo(6, 4),
        expectedResolutionDate: daysAgo(4),
        aiAnalysis: {
          intent: 'Private dispute complaint',
          category: 'Other',
          keywords: ['boundary', 'wall', 'neighbor', 'property', 'dispute'],
          confidence: 78
        },
        actionLog: [
          { action: 'Created', status: 'Pending', remarks: 'Grievance submitted', timestamp: daysAgo(6, 4) },
          { action: 'Rejected', status: 'Rejected', remarks: 'Non-cognizable under public grievance portal: private civil title dispute', timestamp: daysAgo(3, 2), updatedBy: nationalAdmin._id }
        ]
      },
      {
        user: primaryCitizen._id,
        citizenMetadata: {
          name: primaryCitizen.name,
          phone: primaryCitizen.mobile,
          email: primaryCitizen.email,
          aadhaar: primaryCitizen.aadhaar,
          address: 'Rural Feeder Post 12, Malihabad, Lucknow, UP'
        },
        trackingId: 'JS-2026-ELC999',
        title: 'Burnt 25kVA agricultural irrigation transformer',
        description: 'Community transformer powering 14 tubewells caught fire during night peak hours. Mango orchard irrigation stalled during critical flowering season. Replacement required.',
        language: 'en',
        state: 'Uttar Pradesh',
        district: 'Lucknow',
        department: 'Electricity',
        priority: 'High',
        priorityReason: 'Critical agricultural power failure affecting farming livelihoods',
        routingConfidence: 96,
        needsManualReview: false,
        status: 'Pending',
        submittedAt: daysAgo(0, 1),
        createdAt: daysAgo(0, 1),
        expectedResolutionDate: daysAhead(1),
        aiAnalysis: {
          intent: 'Agricultural power transformer replacement',
          category: 'Electricity Department',
          keywords: ['transformer', 'agriculture', 'irrigation', 'burnt', 'electricity'],
          confidence: 96
        },
        actionLog: [
          { action: 'Created', status: 'Pending', remarks: 'Urgent agricultural grievance lodged', timestamp: daysAgo(0, 1) }
        ]
      }
    ];

    console.log(`Inserting ${complaintsData.length} demo complaints...`);
    await Complaint.insertMany(complaintsData);

    console.log('✅ Demo data seeding completed successfully!');
    console.log('====================================================');
    console.log('📊 SUMMARY OF SEEDED DEMO DATA:');
    console.log(`- Admins: 4`);
    console.log(`- Citizens/Users: 5`);
    console.log(`- Complaints: ${complaintsData.length}`);
    console.log('----------------------------------------------------');
    console.log('🔑 DEMO LOGIN CREDENTIALS:');
    console.log('ADMIN:');
    console.log('  Email:    admin@jansathi.gov.in');
    console.log('  Password: Admin@123');
    console.log('CITIZEN:');
    console.log('  Email:    citizen@example.com');
    console.log('  Password: password123');
    console.log('----------------------------------------------------');
    console.log('🔍 SAMPLE TRACKING IDs (try on /track):');
    console.log('  JS-2026-WTR401 (Water Supply - Resolved)');
    console.log('  JS-2026-ELC812 (Electricity - In-Progress)');
    console.log('  JS-2026-ROD109 (Roads - Pending)');
    console.log('  JS-2026-HLT552 (Public Health - Under Review)');
    console.log('  JS-2026-REJ007 (General - Rejected)');
    console.log('====================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during demo data seeding:', error);
    process.exit(1);
  }
};

seedComprehensiveData();
