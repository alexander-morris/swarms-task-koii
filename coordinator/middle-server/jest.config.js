module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '@_koii/create-task-cli': '<rootDir>/src/tests/mocks/koii.ts',
    '@_koii/web3.js': '<rootDir>/src/tests/mocks/koii.ts'
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  }
};
