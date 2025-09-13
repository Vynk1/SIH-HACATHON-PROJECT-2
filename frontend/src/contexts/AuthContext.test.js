import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import * as api from '../services/api';

// Mock the API
jest.mock('../services/api');
const mockAuthAPI = api.authAPI;

// Test component that uses the auth context
const TestComponent = () => {
  const { user, loading, error, login, register, logout, clearError } = useAuth();
  
  return (
    <div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'null'}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error}</div>
      <button onClick={() => login('test@example.com', 'password')} data-testid="login-btn">
        Login
      </button>
      <button onClick={() => register({ email: 'test@example.com', password: 'password', full_name: 'Test User' })} data-testid="register-btn">
        Register
      </button>
      <button onClick={logout} data-testid="logout-btn">
        Logout
      </button>
      <button onClick={clearError} data-testid="clear-error-btn">
        Clear Error
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should throw error when useAuth is used outside AuthProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');
    
    consoleSpy.mockRestore();
  });

  it('should provide initial state', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('');
  });

  it('should load user from localStorage on mount', async () => {
    const mockUser = { _id: '123', email: 'test@example.com', full_name: 'Test User' };
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token';
      if (key === 'user') return JSON.stringify(mockUser);
      return null;
    });

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
    });
  });

  it('should handle corrupted localStorage data', async () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token';
      if (key === 'user') return 'invalid-json';
      return null;
    });

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    // Should clear localStorage and not set user
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    expect(screen.getByTestId('user')).toHaveTextContent('null');
  });

  it('should handle successful login', async () => {
    const mockUser = { _id: '123', email: 'test@example.com', full_name: 'Test User' };
    mockAuthAPI.login.mockResolvedValue({
      data: {
        token: 'mock-token',
        user: mockUser
      }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByTestId('login-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
    });
    
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-token');
    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
  });

  it('should handle login failure', async () => {
    mockAuthAPI.login.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByTestId('login-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials');
    });
    
    expect(screen.getByTestId('user')).toHaveTextContent('null');
  });

  it('should handle successful registration', async () => {
    const mockUser = { _id: '123', email: 'test@example.com', full_name: 'Test User' };
    mockAuthAPI.register.mockResolvedValue({
      data: {
        token: 'mock-token',
        user: mockUser
      }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByTestId('register-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
    });
    
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-token');
    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
  });

  it('should handle registration failure', async () => {
    mockAuthAPI.register.mockRejectedValue({
      response: { data: { message: 'Email already exists' } }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByTestId('register-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Email already exists');
    });
    
    expect(screen.getByTestId('user')).toHaveTextContent('null');
  });

  it('should handle logout', async () => {
    const mockUser = { _id: '123', email: 'test@example.com', full_name: 'Test User' };
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token';
      if (key === 'user') return JSON.stringify(mockUser);
      return null;
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
    });

    await act(async () => {
      screen.getByTestId('logout-btn').click();
    });

    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
  });

  it('should clear error', async () => {
    mockAuthAPI.login.mockRejectedValue({
      response: { data: { message: 'Login failed' } }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Trigger login error
    await act(async () => {
      screen.getByTestId('login-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Login failed');
    });

    // Clear error
    await act(async () => {
      screen.getByTestId('clear-error-btn').click();
    });

    expect(screen.getByTestId('error')).toHaveTextContent('');
  });
});