import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock all the page components
jest.mock('./pages/Login', () => {
  return function MockLogin() {
    return <div data-testid="login-page">Login Page</div>;
  };
});

jest.mock('./pages/Register', () => {
  return function MockRegister() {
    return <div data-testid="register-page">Register Page</div>;
  };
});

jest.mock('./pages/Dashboard', () => {
  return function MockDashboard() {
    return <div data-testid="dashboard-page">Dashboard Page</div>;
  };
});

jest.mock('./pages/HealthProfile', () => {
  return function MockHealthProfile() {
    return <div data-testid="health-profile-page">Health Profile Page</div>;
  };
});

jest.mock('./pages/MedicalRecords', () => {
  return function MockMedicalRecords() {
    return <div data-testid="medical-records-page">Medical Records Page</div>;
  };
});

jest.mock('./pages/QRCode', () => {
  return function MockQRCode() {
    return <div data-testid="qr-code-page">QR Code Page</div>;
  };
});

jest.mock('./pages/EmergencyAccess', () => {
  return function MockEmergencyAccess() {
    return <div data-testid="emergency-access-page">Emergency Access Page</div>;
  };
});

jest.mock('./components/Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

// Mock the API
jest.mock('./services/api');

// Helper to render App with MemoryRouter
const renderAppWithRouter = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Public Routes (Unauthenticated)', () => {
    it('should render login page for /login route', () => {
      renderAppWithRouter(['/login']);
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('should render register page for /register route', () => {
      renderAppWithRouter(['/register']);
      expect(screen.getByTestId('register-page')).toBeInTheDocument();
    });

    it('should render emergency access page for /e/:publicId route', () => {
      renderAppWithRouter(['/e/emergency123']);
      expect(screen.getByTestId('emergency-access-page')).toBeInTheDocument();
    });

    it('should redirect unauthenticated user from protected routes to login', () => {
      renderAppWithRouter(['/dashboard']);
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
  });

  describe('Protected Routes (Authenticated)', () => {
    beforeEach(() => {
      // Mock authenticated user
      const mockUser = { _id: '123', email: 'test@example.com', full_name: 'Test User' };
      localStorage.getItem.mockImplementation((key) => {
        if (key === 'token') return 'mock-token';
        if (key === 'user') return JSON.stringify(mockUser);
        return null;
      });
    });

    it('should render dashboard page for authenticated user', async () => {
      renderAppWithRouter(['/dashboard']);
      
      // Wait for auth context to load
      await screen.findByTestId('navbar');
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });

    it('should render health profile page for /profile route', async () => {
      renderAppWithRouter(['/profile']);
      
      await screen.findByTestId('navbar');
      expect(screen.getByTestId('health-profile-page')).toBeInTheDocument();
    });

    it('should redirect authenticated user from public routes to dashboard', async () => {
      renderAppWithRouter(['/login']);
      
      await screen.findByTestId('navbar');
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });
  });
});
