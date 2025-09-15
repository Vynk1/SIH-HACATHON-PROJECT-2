const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const authController = require('../../controller/auth.controller');

// Mock dependencies
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      user: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      req.body = {
        full_name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        password: 'password123'
      };

      const mockUser = {
        _id: 'user123',
        full_name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'patient'
      };

      // Mock User.findOne to return null (user doesn't exist)
      User.findOne = jest.fn().mockResolvedValue(null);
      
      // Mock bcrypt.hash
      bcrypt.hash.mockResolvedValue('hashedpassword123');
      
      // Mock User.create
      User.create = jest.fn().mockResolvedValue(mockUser);
      
      // Mock jwt.sign
      jwt.sign.mockReturnValue('mocked-jwt-token');

      await authController.register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'john.doe@example.com' });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(User.create).toHaveBeenCalledWith({
        full_name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        password: 'hashedpassword123',
        role: 'patient'
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 'user123', role: 'patient' },
        'test-secret-key',
        { expiresIn: '7d' }
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        token: 'mocked-jwt-token',
        user: {
          _id: 'user123',
          full_name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'patient'
        }
      });
    });

    it('should return 400 if required fields are missing', async () => {
      req.body = {
        email: 'john.doe@example.com'
        // Missing full_name and password
      };

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'name, email and password required'
      });
    });

    it('should return 409 if email already exists', async () => {
      req.body = {
        full_name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      };

      const existingUser = {
        _id: 'existing123',
        email: 'john.doe@example.com'
      };

      User.findOne = jest.fn().mockResolvedValue(existingUser);

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email already registered'
      });
    });

    it('should handle server errors', async () => {
      req.body = {
        full_name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      };

      User.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server error'
      });
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      req.body = {
        email: 'john.doe@example.com',
        password: 'password123'
      };

      const mockUser = {
        _id: 'user123',
        full_name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashedpassword123',
        role: 'patient'
      };

      User.findOne = jest.fn().mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mocked-jwt-token');

      await authController.login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'john.doe@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword123');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 'user123', role: 'patient' },
        'test-secret-key',
        { expiresIn: '7d' }
      );
      expect(res.json).toHaveBeenCalledWith({
        token: 'mocked-jwt-token',
        user: {
          _id: 'user123',
          full_name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'patient'
        }
      });
    });

    it('should return 400 if email or password is missing', async () => {
      req.body = {
        email: 'john.doe@example.com'
        // Missing password
      };

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'email and password required'
      });
    });

    it('should return 401 if user not found', async () => {
      req.body = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      User.findOne = jest.fn().mockResolvedValue(null);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials'
      });
    });

    it('should return 401 if password is incorrect', async () => {
      req.body = {
        email: 'john.doe@example.com',
        password: 'wrongpassword'
      };

      const mockUser = {
        _id: 'user123',
        password: 'hashedpassword123'
      };

      User.findOne = jest.fn().mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials'
      });
    });
  });

  describe('me', () => {
    it('should return user profile successfully', async () => {
      req.user = { id: 'user123' };

      const mockUser = {
        _id: 'user123',
        full_name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'patient'
      };

      const mockSelect = jest.fn().mockResolvedValue(mockUser);
      User.findById = jest.fn().mockReturnValue({ select: mockSelect });

      await authController.me(req, res);

      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(mockSelect).toHaveBeenCalledWith('-password');
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 401 if user not authenticated', async () => {
      req.user = {}; // Empty object instead of null

      await authController.me(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authenticated'
      });
    });

    it('should return 404 if user not found', async () => {
      req.user = { id: 'nonexistent123' };

      const mockSelect = jest.fn().mockResolvedValue(null);
      User.findById = jest.fn().mockReturnValue({ select: mockSelect });

      await authController.me(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User not found'
      });
    });

    it('should handle server errors', async () => {
      req.user = { id: 'user123' };

      const mockSelect = jest.fn().mockRejectedValue(new Error('Database error'));
      User.findById = jest.fn().mockReturnValue({ select: mockSelect });

      await authController.me(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server error'
      });
    });
  });
});