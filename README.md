# JanSathi 2.0 - AI-Based Citizen Grievance Classification System

## 🎯 Project Overview

JanSathi is a production-ready MVP that uses AI (Google Generative AI) to automatically classify and route citizen complaints to the appropriate government departments. The system features:

- **Citizen Portal**: Submit complaints with location tagging
- **AI Classification**: Automatic categorization and priority assignment  
- **Admin Dashboard**: Real-time analytics, charts, and complaint tracking
- **Professional UI**: Clean light theme using Tailwind CSS

## 🏗️ Architecture

```
JanSathi 2.0/9
├── backend/           # Node.js + Express + MongoDB
│   ├── models/        # Mongoose schemas
│   ├── controllers/   # API logic
│   ├── services/      # AI service (Gemini)
│   ├── routes/        # API endpoints
│   ├── server.js      # Express server
│   ├── .env          # Environment variables
│   └── package.json
│
└── frontend/          # React + Vite
    ├── src/
    │   ├── pages/     # Home (Citizen) & Admin
    │   ├── App.jsx    # Router setup
    │   └── main.jsx   # Entry point
    ├── vite.config.js
    └── package.json
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ (with npm)
- **MongoDB** running locally or Atlas connection string
- **Google API Key** for Generative AI
- **Git** (optional)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file with your credentials
# COPY the template below and add your actual values:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/jansathi
# GEMINI_API_KEY=your_api_key_here

# Start development server with hot reload
npm run dev

# Or start production server
npm start
```

**Backend runs on**: `http://localhost:5000`

### Frontend Setup

```bash
cd frontend

# Install dependencies (already done)
npm install

# Start development server
npm run dev

# Build for production
npm build
```

**Frontend runs on**: `http://localhost:5173` (Vite default)

---

## 📋 Environment Variables

Create a `.env` file in the `backend/` folder:

```env
# Server Config
PORT=5000

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/jansathi
JWT_SECRET=replace_with_a_strong_random_secret
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jansathi

# Google Generative AI
GEMINI_API_KEY=your_google_api_key_here
```

### Getting Your API Keys

#### Google Generative AI Key:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy and paste into `.env`

#### MongoDB Setup:
- **Local**: Ensure MongoDB is running on `localhost:27017`
- **Atlas**: Sign up at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas), create cluster, get connection string

---

## 📱 Usage Guide

### Citizen Portal (`/`)

1. **Enter Details**:
   - Full name
   - Phone number  
   - Complaint description (Hindi, English, or Hinglish)

2. **Add Location** (Optional):
   - Click "Fetch Location" to capture GPS coordinates
   - Your location will be tagged to the complaint

3. **Submit**:
   - AI instantly classifies the complaint
   - Receive a unique **Tracking ID** (e.g., `JAN-862-A3X7K2`)
   - See priority and assigned department

### Admin Dashboard (`/admin`)

**Features**:
- **Summary Cards**: Total complaints, critical issues, resolved count
- **Bar Chart**: Complaints by department (Electricity, Water, Roads, Sanitation, General)
- **Pie Chart**: Priority distribution (Low, Medium, High, Critical)
- **Data Table**: All complaints with tracking IDs, categories, and priorities
- **Real-time Updates**: Refresh button to fetch latest data

---

## 🤖 AI Classification Details

### Categories
- Electricity
- Water Supply
- Sanitation
- Roads
- Public Services

### Priority Levels
- **Low**: Minor issues, no urgency
- **Medium**: Standard complaints, routine handling
- **High**: Urgent issues, requires prompt action
- **Critical**: Emergency situations, immediate escalation

### How It Works
1. Citizen submits complaint text in any language
2. Google Generative AI (Gemini 1.5 Flash) analyzes the text
3. AI returns structured JSON with:
   - Category
   - Priority
   - Sentiment
   - Department assignment
4. Complaint saved to MongoDB with classification
5. Admin dashboard displays real-time analytics

---

## 🗄️ Database Schema

### Complaint Model
```javascript
{
  trackingId: String (unique),
  citizenDetails: {
    name: String,
    phone: String
  },
  grievance: {
    rawText: String,
    languageDetected: String,
    isVoiceInput: Boolean
  },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  aiAnalysis: {
    category: String,
    priority: String,
    sentiment: String,
    departmentAssigned: String
  },
  status: String (default: "Pending"),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🔌 API Endpoints

### POST `/api/complaints`
**Submit a new complaint**

Request:
```json
{
  "name": "Rajesh Kumar",
  "phone": "9876543210",
  "rawText": "Water pipeline broken near my house",
  "lat": 28.6139,
  "lng": 77.2090,
  "address": "New Delhi",
  "isVoiceInput": false
}
```

Response:
```json
{
  "success": true,
  "message": "Complaint registered and routed successfully.",
  "trackingId": "JAN-862-A3X7K2",
  "data": { ...complaint object... }
}
```

### GET `/api/complaints`
**Fetch all complaints (Admin Dashboard)**

Response:
```json
{
  "success": true,
  "count": 42,
  "data": [ ...array of complaints... ]
}
```

---

## 🎨 UI/UX Design

### Color Scheme (Light Theme)
- **Primary**: Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Critical**: Red (#dc2626)
- **Background**: Gray (#f3f4f6)
- **Cards**: White (#ffffff)

### Typography
- **Headings**: Bold, 24-48px
- **Body**: Regular, 14-16px
- **Mono**: Tracking IDs in `font-mono`

---

## 🚨 Troubleshooting

### "Backend not running" error
- Ensure `npm run dev` is running in `/backend`
- Check that port 5000 is available
- Verify `.env` file exists with correct values

### MongoDB connection failed
- Ensure MongoDB is running locally: `mongod`
- OR verify Atlas connection string is correct
- Check network access if using Atlas

### Gemini API errors
- Verify API key is valid and has quota remaining
- Check Google AI Studio dashboard for rate limits
- Ensure internet connection is active

### Frontend not loading
- Ensure `npm run dev` is running in `/frontend`  
- Check http://localhost:5173
- Clear browser cache if UI doesn't update

---

## 📦 Tech Stack

**Backend**:
- Node.js 16+ with ES6 modules
- Express.js 5
- MongoDB 6+ with Mongoose
- Google Generative AI SDK
- CORS for cross-origin requests

**Frontend**:
- React 19 with Hooks
- Vite build tool
- React Router v7
- Tailwind CSS 4
- Recharts for analytics
- Lucide React for icons
- Framer Motion for animations
- Axios for HTTP requests

---

## 📝 Notes

- **No TypeScript**: Pure JavaScript ES6+ for faster development
- **Light Theme Only**: Professional government-tech aesthetic
- **Production Ready**: Full error handling, validation, and API integration
- **Scalable**: Can be extended with user authentication, notifications, etc.

---

## 🤝 Support

For issues or improvements:
1. Check the troubleshooting section above
2. Verify `.env` file configuration
3. Ensure all dependencies are installed: `npm install`
4. Restart both backend and frontend servers

---

## 📄 License

Built for Team ID 862 - JanSathi Initiative

---

**Last Updated**: May 2026  
**Version**: 2.0 (MVP)
