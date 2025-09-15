const User = require('../../models/User');
const HealthProfile = require('../../models/HealthProfile');
const cardController = require('../../controller/card.controller');

// Mock the models
jest.mock('../../models/User');
jest.mock('../../models/HealthProfile');
jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'mock-nanoid-id')
}));

describe('Card Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { id: 'user123' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('getMyProfile', () => {
    it('should get user profile with health data successfully', async () => {
      const mockUser = {
        _id: 'user123',
        full_name: 'John Doe',
        email: 'john@example.com',
        public_emergency_id: 'emergency123'
      };

      const mockHealthProfile = {
        user_id: 'user123',
        blood_group: 'O+',
        height: '175',
        weight: '70',
        allergies: ['peanuts'],
        chronic_conditions: ['hypertension'],
        current_medications: ['lisinopril']
      };

      const mockSelectQuery = {
        select: jest.fn().mockResolvedValue(mockUser)
      };

      User.findById = jest.fn().mockReturnValue(mockSelectQuery);
      HealthProfile.findOne = jest.fn().mockResolvedValue(mockHealthProfile);

      await cardController.getMyProfile(req, res);

      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(HealthProfile.findOne).toHaveBeenCalledWith({ user_id: 'user123' });
      expect(res.json).toHaveBeenCalledWith({
        user: mockUser,
        health_profile: mockHealthProfile
      });
    });

    it('should handle user not found', async () => {
      const mockSelectQuery = {
        select: jest.fn().mockResolvedValue(null)
      };

      User.findById = jest.fn().mockReturnValue(mockSelectQuery);

      await cardController.getMyProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User not found'
      });
    });

    it('should handle server errors', async () => {
      const mockSelectQuery = {
        select: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      User.findById = jest.fn().mockReturnValue(mockSelectQuery);

      await cardController.getMyProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server error'
      });
    });
  });

  describe('updateHealthProfile', () => {
    it('should create new health profile if none exists', async () => {
      req.body = {
        blood_group: 'A+',
        height: '180',
        weight: '75',
        allergies: ['shellfish'],
        chronic_conditions: [],
        current_medications: []
      };

      HealthProfile.findOne = jest.fn().mockResolvedValue(null);

      const mockNewProfile = {
        user_id: 'user123',
        ...req.body
      };

      HealthProfile.create = jest.fn().mockResolvedValue(mockNewProfile);

      await cardController.updateHealthProfile(req, res);

      expect(HealthProfile.findOne).toHaveBeenCalledWith({ user_id: 'user123' });
      expect(HealthProfile.create).toHaveBeenCalledWith({
        user_id: 'user123',
        ...req.body
      });
      expect(res.json).toHaveBeenCalledWith(mockNewProfile);
    });

    it('should update existing health profile', async () => {
      req.body = {
        blood_group: 'B+',
        height: '170',
        weight: '65'
      };

      const mockExistingProfile = {
        user_id: 'user123',
        blood_group: 'A+',
        save: jest.fn().mockResolvedValue(true)
      };

      HealthProfile.findOne = jest.fn().mockResolvedValue(mockExistingProfile);

      await cardController.updateHealthProfile(req, res);

      expect(mockExistingProfile.blood_group).toBe('B+');
      expect(mockExistingProfile.height).toBe('170');
      expect(mockExistingProfile.weight).toBe('65');
      expect(mockExistingProfile.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockExistingProfile);
    });

    it('should handle server errors', async () => {
      req.body = { blood_group: 'O+' };

      HealthProfile.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

      await cardController.updateHealthProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server error'
      });
    });
  });

  describe('getPublicId', () => {
    it('should return existing public emergency ID', async () => {
      const mockUser = {
        _id: 'user123',
        public_emergency_id: 'existing-id-123'
      };

      User.findById = jest.fn().mockResolvedValue(mockUser);

      await cardController.getPublicId(req, res);

      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(res.json).toHaveBeenCalledWith({
        public_id: 'existing-id-123'
      });
    });

    it('should generate new public emergency ID if none exists', async () => {
      const mockUser = {
        _id: 'user123',
        public_emergency_id: null,
        save: jest.fn().mockResolvedValue(true)
      };

      User.findById = jest.fn().mockResolvedValue(mockUser);

      await cardController.getPublicId(req, res);

      expect(mockUser.public_emergency_id).toBe('mock-nanoid-id');
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        public_id: 'mock-nanoid-id'
      });
    });

    it('should handle user not found', async () => {
      User.findById = jest.fn().mockResolvedValue(null);

      await cardController.getPublicId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User not found'
      });
    });

    it('should handle server errors', async () => {
      User.findById = jest.fn().mockRejectedValue(new Error('Database error'));

      await cardController.getPublicId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server error'
      });
    });
  });
});