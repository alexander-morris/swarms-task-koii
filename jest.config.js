/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/tests/**/*.test.ts'],
  moduleNameMapper: {
    '@_koii/create-task-cli': '<rootDir>/middle-server/middle-server/src/tests/mocks/koii.ts',
    '@_koii/web3.js': '<rootDir>/middle-server/middle-server/src/tests/mocks/koii.ts'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  }
}; 