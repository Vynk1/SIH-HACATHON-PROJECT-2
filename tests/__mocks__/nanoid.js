// Mock for nanoid to avoid ES module issues in Jest
module.exports = {
  nanoid: jest.fn(() => 'mock-nanoid-id'),
  customAlphabet: jest.fn(() => () => 'mock-custom-id')
};
