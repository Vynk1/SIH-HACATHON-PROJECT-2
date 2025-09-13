import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Home, User, FileText, QrCode, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/dashboard" className="navbar-brand">
          <div className="flex items-center">
            <Heart className="h-8 w-8 mr-2" />
            Swasthya
          </div>
        </Link>

        <div className="navbar-nav">
          <Link 
            to="/dashboard" 
            className={`flex items-center ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <Home className="h-4 w-4 mr-1" />
            Dashboard
          </Link>
          <Link 
            to="/profile" 
            className={`flex items-center ${isActive('/profile') ? 'active' : ''}`}
          >
            <User className="h-4 w-4 mr-1" />
            Profile
          </Link>
          <Link 
            to="/records" 
            className={`flex items-center ${isActive('/records') ? 'active' : ''}`}
          >
            <FileText className="h-4 w-4 mr-1" />
            Records
          </Link>
          <Link 
            to="/qr" 
            className={`flex items-center ${isActive('/qr') ? 'active' : ''}`}
          >
            <QrCode className="h-4 w-4 mr-1" />
            QR Code
          </Link>
        </div>

        <div className="navbar-user">
          <span className="navbar-user-name">
            {user?.full_name || user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
