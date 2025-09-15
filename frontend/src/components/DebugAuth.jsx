import React, { useState } from 'react';
import { authAPI } from '../services/api';

const DebugAuth = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
  };

  const testRegistration = async () => {
    setLoading(true);
    addLog('Testing registration...', 'info');
    
    try {
      const testUser = {
        full_name: 'Debug Test User',
        email: 'debug.test@example.com',
        phone: '1234567890',
        password: 'DebugTest123'
      };
      
      const response = await authAPI.register(testUser);
      addLog(`Registration success! Token: ${response.data.token ? 'Yes' : 'No'}`, 'success');
      addLog(`User: ${response.data.user.full_name}`, 'success');
      
      // Try login immediately
      const loginResponse = await authAPI.login({ 
        email: testUser.email, 
        password: testUser.password 
      });
      addLog(`Login success! Token: ${loginResponse.data.token ? 'Yes' : 'No'}`, 'success');
      
    } catch (error) {
      console.error('Registration/Login error:', error);
      addLog(`Registration failed: ${error.message}`, 'error');
      if (error.response) {
        addLog(`Status: ${error.response.status}`, 'error');
        addLog(`Response: ${JSON.stringify(error.response.data)}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    addLog('Testing login with demo user...', 'info');
    
    try {
      const response = await authAPI.login({ 
        email: 'rajesh.kumar@demo.com', 
        password: 'demo123' 
      });
      addLog(`Login success! Token: ${response.data.token ? 'Yes' : 'No'}`, 'success');
      addLog(`User: ${response.data.user.full_name}`, 'success');
    } catch (error) {
      console.error('Login error:', error);
      addLog(`Login failed: ${error.message}`, 'error');
      if (error.response) {
        addLog(`Status: ${error.response.status}`, 'error');
        addLog(`Response: ${JSON.stringify(error.response.data)}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔧 Authentication Debug Tool</h1>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={testRegistration}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Registration
        </button>
        <button
          onClick={testLogin}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test Login (Demo User)
        </button>
        <button
          onClick={clearLogs}
          disabled={loading}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
        >
          Clear Logs
        </button>
      </div>

      {loading && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
          ⏳ Testing in progress...
        </div>
      )}

      <div className="bg-gray-100 rounded-lg p-4 h-96 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-3">Debug Logs:</h2>
        {logs.length === 0 ? (
          <p className="text-gray-500 italic">Click a test button to see logs...</p>
        ) : (
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div
                key={index}
                className={`text-sm ${
                  log.type === 'error' 
                    ? 'text-red-600' 
                    : log.type === 'success' 
                    ? 'text-green-600' 
                    : 'text-blue-600'
                }`}
              >
                <span className="text-gray-400">[{log.timestamp}]</span> {log.message}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800">API Configuration Info:</h3>
        <p className="text-sm text-blue-600 mt-2">
          <strong>Base URL:</strong> {process.env.REACT_APP_API_URL || 'Using proxy/default'}
        </p>
        <p className="text-sm text-blue-600">
          <strong>Node Environment:</strong> {process.env.NODE_ENV}
        </p>
        <p className="text-sm text-blue-600">
          <strong>Current Host:</strong> {window.location.origin}
        </p>
      </div>
    </div>
  );
};

export default DebugAuth;