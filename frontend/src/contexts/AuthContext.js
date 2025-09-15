import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);
      
      console.log('AuthContext: Attempting login for:', email);
      const response = await authAPI.login({ email, password });
      console.log('AuthContext: Login response received:', response.status);
      
      const { token, user: userData } = response.data;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      console.log('AuthContext: Login successful for:', userData.full_name);
      return { success: true };
    } catch (err) {
      console.error('AuthContext: Login error:', err);
      let message = 'Login failed';
      
      if (err.response) {
        message = err.response.data?.message || `Server error: ${err.response.status}`;
        console.error('AuthContext: Server error response:', err.response.data);
      } else if (err.request) {
        message = 'Network error - unable to connect to server';
        console.error('AuthContext: Network error:', err.request);
      } else {
        message = err.message || 'Unknown error occurred';
      }
      
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError('');
      setLoading(true);
      
      console.log('AuthContext: Attempting registration for:', userData.email);
      const response = await authAPI.register(userData);
      console.log('AuthContext: Registration response received:', response.status);
      
      const { token, user: newUser } = response.data;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      console.log('AuthContext: Registration successful for:', newUser.full_name);
      return { success: true };
    } catch (err) {
      console.error('AuthContext: Registration error:', err);
      let message = 'Registration failed';
      
      if (err.response) {
        message = err.response.data?.message || `Server error: ${err.response.status}`;
        console.error('AuthContext: Server error response:', err.response.data);
      } else if (err.request) {
        message = 'Network error - unable to connect to server';
        console.error('AuthContext: Network error:', err.request);
      } else {
        message = err.message || 'Unknown error occurred';
      }
      
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError('');
  };

  const clearError = () => {
    setError('');
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
