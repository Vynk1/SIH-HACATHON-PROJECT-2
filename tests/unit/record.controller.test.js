const MedicalRecord = require('../../models/MedicalRecord');
const recordController = require('../../controller/record.controller');

// Mock the MedicalRecord model
jest.mock('../../models/MedicalRecord');

describe('Record Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      user: { id: 'user123' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('createRecord', () => {
    it('should create a new medical record successfully', async () => {
      req.body = {
        title: 'Blood Test Results',
        description: 'Annual blood work',
        date: '2024-01-15',
        category: 'report',
        visibility: 'private'
      };

      const mockRecord = {
        _id: 'record123',
        title: 'Blood Test Results',
        description: 'Annual blood work',
        date: '2024-01-15',
        category: 'report',
        visibility: 'private',
        patient_id: 'user123',
        created_at: new Date()
      };

      MedicalRecord.create = jest.fn().mockResolvedValue(mockRecord);

      await recordController.createRecord(req, res);

      expect(MedicalRecord.create).toHaveBeenCalledWith({
        ...req.body,
        patient_id: 'user123'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockRecord);
    });

    it('should return 400 for missing required fields', async () => {
      req.body = {
        description: 'Missing title'
      };

      await recordController.createRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Title and description are required'
      });
    });

    it('should handle server errors', async () => {
      req.body = {
        title: 'Test Record',
        description: 'Test Description'
      };

      MedicalRecord.create = jest.fn().mockRejectedValue(new Error('Database error'));

      await recordController.createRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server error'
      });
    });
  });

  describe('getRecords', () => {
    it('should get paginated records for user', async () => {
      req.query = {
        page: '1',
        limit: '10',
        category: 'report'
      };

      const mockRecords = [
        { _id: 'record1', title: 'Record 1' },
        { _id: 'record2', title: 'Record 2' }
      ];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockRecords)
      };

      MedicalRecord.find = jest.fn().mockReturnValue(mockQuery);
      MedicalRecord.countDocuments = jest.fn().mockResolvedValue(25);

      await recordController.getRecords(req, res);

      expect(MedicalRecord.find).toHaveBeenCalledWith({
        patient_id: 'user123',
        category: 'report'
      });
      expect(res.json).toHaveBeenCalledWith({
        records: mockRecords,
        totalPages: 3,
        currentPage: 1,
        totalRecords: 25
      });
    });

    it('should handle server errors', async () => {
      MedicalRecord.find = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });

      await recordController.getRecords(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server error'
      });
    });
  });

  describe('getRecord', () => {
    it('should get a specific record by ID', async () => {
      req.params.id = 'record123';

      const mockRecord = {
        _id: 'record123',
        title: 'Test Record',
        patient_id: 'user123'
      };

      const mockQuery = {
        populate: jest.fn().mockResolvedValue(mockRecord)
      };

      MedicalRecord.findOne = jest.fn().mockReturnValue(mockQuery);

      await recordController.getRecord(req, res);

      expect(MedicalRecord.findOne).toHaveBeenCalledWith({
        _id: 'record123',
        patient_id: 'user123'
      });
      expect(res.json).toHaveBeenCalledWith(mockRecord);
    });

    it('should return 404 if record not found', async () => {
      req.params.id = 'nonexistent';

      const mockQuery = {
        populate: jest.fn().mockResolvedValue(null)
      };

      MedicalRecord.findOne = jest.fn().mockReturnValue(mockQuery);

      await recordController.getRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Record not found'
      });
    });
  });

  describe('updateRecord', () => {
    it('should update a record successfully', async () => {
      req.params.id = 'record123';
      req.body = {
        title: 'Updated Title',
        description: 'Updated Description'
      };

      const mockUpdatedRecord = {
        _id: 'record123',
        title: 'Updated Title',
        description: 'Updated Description',
        patient_id: 'user123'
      };

      MedicalRecord.findOneAndUpdate = jest.fn().mockResolvedValue(mockUpdatedRecord);

      await recordController.updateRecord(req, res);

      expect(MedicalRecord.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'record123', patient_id: 'user123' },
        req.body,
        { new: true, runValidators: true }
      );
      expect(res.json).toHaveBeenCalledWith(mockUpdatedRecord);
    });

    it('should return 404 if record not found', async () => {
      req.params.id = 'nonexistent';
      req.body = { title: 'Updated' };

      MedicalRecord.findOneAndUpdate = jest.fn().mockResolvedValue(null);

      await recordController.updateRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Record not found'
      });
    });
  });

  describe('deleteRecord', () => {
    it('should delete a record successfully', async () => {
      req.params.id = 'record123';

      const mockRecord = { _id: 'record123', patient_id: 'user123' };
      MedicalRecord.findOneAndDelete = jest.fn().mockResolvedValue(mockRecord);

      await recordController.deleteRecord(req, res);

      expect(MedicalRecord.findOneAndDelete).toHaveBeenCalledWith({
        _id: 'record123',
        patient_id: 'user123'
      });
      expect(res.json).toHaveBeenCalledWith({
        message: 'Record deleted successfully'
      });
    });

    it('should return 404 if record not found', async () => {
      req.params.id = 'nonexistent';

      MedicalRecord.findOneAndDelete = jest.fn().mockResolvedValue(null);

      await recordController.deleteRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Record not found'
      });
    });
  });
});