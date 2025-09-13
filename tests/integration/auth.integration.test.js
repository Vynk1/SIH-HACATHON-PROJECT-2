const request = require('supertest');
const { createTestApp } = require('../helpers/testApp');
const User = require('../../models/User');

const app = createTestApp();

describe('Auth Integration Tests', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        full_name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        password: 'password123',
        role: 'patient'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.full_name).toBe(userData.full_name);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.role).toBe(userData.role);
      expect(response.body.user).not.toHaveProperty('password');

      // Verify user was created in database
      const savedUser = await User.findOne({ email: userData.email });
      expect(savedUser).toBeTruthy();
      expect(savedUser.full_name).toBe(userData.full_name);
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com'
          // Missing full_name and password
        })
        .expect(400);

      expect(response.body.message).toBe('name, email and password required');
    });

    it('should return 409 for duplicate email', async () => {
      // First registration
      const userData = {
        full_name: 'John Doe',
        email: 'duplicate@example.com',
        password: 'password123'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Attempt duplicate registration
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          full_name: 'Jane Doe',
          email: 'duplicate@example.com',
          password: 'password456'
        })
        .expect(409);

      expect(response.body.message).toBe('Email already registered');
    });

    it('should normalize email to lowercase', async () => {
      const userData = {
        full_name: 'John Doe',
        email: 'JOHN.DOE@EXAMPLE.COM',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.user.email).toBe('john.doe@example.com');

      const savedUser = await User.findOne({ email: 'john.doe@example.com' });
      expect(savedUser).toBeTruthy();
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      await request(app)
        .post('/api/auth/register')
        .send({
          full_name: 'Test User',
          email: 'test.user@example.com',
          password: 'password123'
        });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test.user@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test.user@example.com');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 400 for missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com'
          // Missing password
        })
        .expect(400);

      expect(response.body.message).toBe('email and password required');
    });

    it('should return 401 for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 401 for invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test.user@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should handle case-insensitive email login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'TEST.USER@EXAMPLE.COM',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.user.email).toBe('test.user@example.com');
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken;
    let userId;

    beforeEach(async () => {
      // Register and get token
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          full_name: 'Auth Test User',
          email: 'auth.test@example.com',
          password: 'password123'
        });

      authToken = registerResponse.body.token;
      userId = registerResponse.body.user._id;
    });

    it('should return user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body._id).toBe(userId);
      expect(response.body.full_name).toBe('Auth Test User');
      expect(response.body.email).toBe('auth.test@example.com');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 401 without token', async () => {
      await request(app)
        .get('/api/auth/me')
        .expect(401);
    });

    it('should return 401 with invalid token', async () => {
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('Health endpoint', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('ok');
    });
  });
});