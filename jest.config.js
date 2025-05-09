module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/tests/**/*.test.ts'],
  moduleNameMapper: {
    '@_koii/create-task-cli': '<rootDir>/middle-server/middle-server/src/tests/mocks/koii.ts',
    '@_koii/web3.js': '<rootDir>/middle-server/middle-server/src/tests/mocks/koii.ts'
  },
  setupFiles: ['<rootDir>/middle-server/middle-server/src/tests/setup.ts']
}; 