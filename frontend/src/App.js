import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import HealthProfile from './pages/HealthProfile';
import MedicalRecords from './pages/MedicalRecords';
import QRCode from './pages/QRCode';
import EmergencyAccess from './pages/EmergencyAccess';
import DebugAuth from './components/DebugAuth';
import './App.css';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes with layout */}
          <Route element={<Layout />}>
            <Route path="/" element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            } />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <HealthProfile />
              </ProtectedRoute>
            } />
            <Route path="/records" element={
              <ProtectedRoute>
                <MedicalRecords />
              </ProtectedRoute>
            } />
            <Route path="/qr" element={
              <ProtectedRoute>
                <QRCode />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Debug route (development only) */}
          <Route path="/debug" element={<DebugAuth />} />
          
          {/* Emergency access without layout */}
          <Route path="/e/:publicId" element={<EmergencyAccess />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
