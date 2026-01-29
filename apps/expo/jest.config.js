module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test-utils/setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-navigation|@react-native|expo|@expo|@monorepo|zustand)/)',
  ],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1',
    '^@monorepo/ui$': '<rootDir>/../../packages/ui/src',
    '^@monorepo/core$': '<rootDir>/../../packages/core/src',
    '^@monorepo/types$': '<rootDir>/../../packages/types/src',
    '^@monorepo/config-testing$': '<rootDir>/../../packages/config/testing/src',
    '^@monorepo/config-testing/(.*)$':
      '<rootDir>/../../packages/config/testing/src/$1',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/mocks/fileMock.js',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['**/tests/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    '!app/**/*.d.ts',
    '!app/_layout.tsx',
    '!**/node_modules/**',
  ],
};
