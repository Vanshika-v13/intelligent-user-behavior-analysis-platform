export default {
  testEnvironment: 'node',
  maxWorkers: 1,
  globalSetup: '<rootDir>/tests/setup.js',
  globalTeardown: '<rootDir>/tests/teardown.js',
  setupFilesAfterEnv: ['<rootDir>/tests/testEnv.js'],
  clearMocks: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/utils/testAnalytics.js',
    '!src/utils/seedDatabase.js',
    '!src/utils/seedCourses.js',
    '!src/utils/seedUsers.js',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      functions: 80,
      lines: 80,
    },
  },
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  transform: {},
}
