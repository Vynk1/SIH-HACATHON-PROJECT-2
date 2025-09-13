import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: (credentials) => api.post('/api/auth/login', credentials),
  getProfile: () => api.get('/api/auth/me'),
};

// User/Profile API
export const userAPI = {
  getMyProfile: () => api.get('/api/user/me'),
  updateHealthProfile: (profileData) => api.post('/api/user/me/health', profileData),
  getPublicId: () => api.get('/api/user/me/public-id'),
};

// Medical Records API
export const recordsAPI = {
  getRecords: (params) => api.get('/api/records', { params }),
  getRecord: (id) => api.get(`/api/records/${id}`),
  createRecord: (recordData) => api.post('/api/records', recordData),
  updateRecord: (id, recordData) => api.patch(`/api/records/${id}`, recordData),
  deleteRecord: (id) => api.delete(`/api/records/${id}`),
};

// Files API
export const filesAPI = {
  uploadFile: (formData) => 
    api.post('/api/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  deleteFile: (id) => api.delete(`/api/files/${id}`),
};

// Public API
export const publicAPI = {
  getEmergencyData: (publicId) => api.get(`/api/public/e/${publicId}`),
  getSharedData: (token) => api.get(`/api/public/share/${token}`),
};

export default api;
