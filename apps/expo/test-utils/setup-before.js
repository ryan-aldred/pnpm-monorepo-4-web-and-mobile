// Mock the problematic polyfills before anything else loads
jest.mock('@react-native/js-polyfills/error-guard', () => ({
  ErrorUtils: {
    setGlobalHandler: jest.fn(),
    getGlobalHandler: jest.fn(),
  },
}));
