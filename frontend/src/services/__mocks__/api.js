// Mock implementation of API services for testing
const mockAxios = {
  create: jest.fn(() => mockAxios),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  },
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn()
};

// Mock API functions
export const authAPI = {
  register: jest.fn(),
  login: jest.fn(),
  getProfile: jest.fn(),
};

export const userAPI = {
  getMyProfile: jest.fn(),
  updateHealthProfile: jest.fn(),
  getPublicId: jest.fn(),
};

export const recordsAPI = {
  getRecords: jest.fn(),
  getRecord: jest.fn(),
  createRecord: jest.fn(),
  updateRecord: jest.fn(),
  deleteRecord: jest.fn(),
};

export const filesAPI = {
  uploadFile: jest.fn(),
  deleteFile: jest.fn(),
};

export const publicAPI = {
  getEmergencyData: jest.fn(),
  getSharedData: jest.fn(),
};

export default mockAxios;