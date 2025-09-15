const User = require('../../models/User');
const HealthProfile = require('../../models/HealthProfile');
const EmergencyAccessLog = require('../../models/EmergencyAccessLog');
const publicController = require('../../controller/public.controller');

// Mock the models
jest.mock('../../models/User');
jest.mock('../../models/HealthProfile');
jest.mock('../../models/EmergencyAccessLog');

describe('Public Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('getEmergencyData', () => {
    it('should get emergency data successfully', async () => {
      req.params.publicId = 'emergency123';
      req.headers['x-forwarded-for'] = '192.168.1.1';

      const mockUser = {
        _id: 'user123',
        full_name: 'John Doe',
        phone: '+1234567890',
        public_emergency_id: 'emergency123'
      };

      const mockHealthProfile = {
        user_id: 'user123',
        blood_group: 'O+',
        height: '175',
        weight: '70',
        allergies: ['peanuts'],
        chronic_conditions: ['hypertension'],
        current_medications: ['lisinopril'],
        emergency_contacts: [
          {
            name: 'Jane Doe',
            relationship: 'spouse',
            phone: '+1234567891'
          }
        ],
        emergency_summary: 'Diabetic, allergic to peanuts'
      };

      const mockSelectQuery = {
        select: jest.fn().mockResolvedValue(mockUser)
      };

      User.findOne = jest.fn().mockReturnValue(mockSelectQuery);
      HealthProfile.findOne = jest.fn().mockResolvedValue(mockHealthProfile);
      EmergencyAccessLog.create = jest.fn().mockResolvedValue({});

      await publicController.getEmergencyData(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ public_emergency_id: 'emergency123' });
      expect(HealthProfile.findOne).toHaveBeenCalledWith({ user_id: 'user123' });
      expect(EmergencyAccessLog.create).toHaveBeenCalledWith({
        public_emergency_id: 'emergency123',
        accessed_at: expect.any(Date),
        ip_address: '192.168.1.1'
      });
      expect(res.json).toHaveBeenCalledWith({
        user: {
          full_name: 'John Doe',
          phone: '+1234567890'
        },
        health_profile: mockHealthProfile
      });
    });

    it('should return 404 if emergency ID not found', async () => {
      req.params.publicId = 'nonexistent';

      const mockSelectQuery = {
        select: jest.fn().mockResolvedValue(null)
      };

      User.findOne = jest.fn().mockReturnValue(mockSelectQuery);

      await publicController.getEmergencyData(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Emergency data not found'
      });
    });

    it('should handle server errors', async () => {
      req.params.publicId = 'emergency123';

      const mockSelectQuery = {
        select: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      User.findOne = jest.fn().mockReturnValue(mockSelectQuery);

      await publicController.getEmergencyData(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server error'
      });
    });

    it('should use default IP address if headers not available', async () => {
      req.params.publicId = 'emergency123';
      req.headers = {}; // No IP headers

      const mockUser = {
        _id: 'user123',
        full_name: 'John Doe',
        phone: '+1234567890',
        public_emergency_id: 'emergency123'
      };

      const mockSelectQuery = {
        select: jest.fn().mockResolvedValue(mockUser)
      };

      User.findOne = jest.fn().mockReturnValue(mockSelectQuery);
      HealthProfile.findOne = jest.fn().mockResolvedValue(null);
      EmergencyAccessLog.create = jest.fn().mockResolvedValue({});

      await publicController.getEmergencyData(req, res);

      expect(EmergencyAccessLog.create).toHaveBeenCalledWith({
        public_emergency_id: 'emergency123',
        accessed_at: expect.any(Date),
        ip_address: 'unknown'
      });
    });
  });

  describe('getSharedData', () => {
    it('should handle share token functionality', async () => {
      // This test would depend on the ShareToken model and implementation
      // For now, we'll test basic structure
      req.params.token = 'share-token-123';

      // Mock implementation would go here once ShareToken functionality is implemented
      await publicController.getSharedData(req, res);

      // Basic expectations would be added based on actual implementation
      expect(res.status).toHaveBeenCalledWith(501);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Shared data functionality not implemented yet'
      });
    });
  });
});