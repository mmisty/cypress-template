// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  testMatch: [
    '**/src/**/(*.)+(spec|test).[t]s?(x)',
    '!**/cypress/**/*.(spec|test).ts',
    '!**/lib/**/*.*',
    '!**/instrumented/**/*.*',
  ],
  collectCoverage: false,
  transform: {
    '.(ts)$': [
      'ts-jest',
      {
        isolatedModules: true,
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js'],
  clearMocks: true,
  coverageDirectory: 'reports/coverage-jest',
  coverageReporters: ['text', 'lcov', 'cobertura', 'json'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'src/*.{ts,tsx}',
    'index.ts',
    '!**/lib/**',
    '!src/cypress/**',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/mocks.ts',
  ],
  testEnvironment: 'node',

  /* coverageThreshold: {
    global: {
      branches: 80, // temp
      functions: 80,
      lines: 80,
      statements: -10,
    },
  }, */
};
