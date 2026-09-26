import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Context & Components
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages - Yahan naye imports add kiye hain
import Home from './pages/Home';
import LodgeForm from './pages/LodgeForm';
import TrackStatus from './pages/TrackStatus';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

import { BASE_URL } from './config/api';

// --- AXIOS GLOBAL CONFIGURATION ---
axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

const AppContent = () => {
  const { user, admin } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        
        {/* 1. Home Page (PGPortal Style Content & Stats) */}
        <Route path="/" element={<Home />} />
        
        {/* 2. Lodge Form (Separate page for registering complaint) */}
        <Route path="/lodge-form" element={<LodgeForm />} />
        
        {/* 3. Track Status */}
        <Route path="/track" element={<TrackStatus />} />
        
        {/* USER LOGIN: Agar logged in hai toh dashboard bhej do */}
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/dashboard" />} 
        />

        {/* ADMIN LOGIN: Agar admin logged in hai toh dashboard bhej do */}
        <Route 
          path="/admin/login" 
          element={!admin ? <AdminLogin /> : <Navigate to="/admin/dashboard" />} 
        />

        <Route
          path="/admin"
          element={<Navigate to={admin ? '/admin/dashboard' : '/admin/login'} replace />}
        />

        {/* --- PROTECTED ROUTES: Only for Admins --- */}
        <Route path="/admin/dashboard" element={admin ? <AdminDashboard /> : <Navigate to="/admin/login" />} />

        {/* --- PROTECTED ROUTES: Only for Users --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* 404 Redirect - Home par bhej dega agar route na mile */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;