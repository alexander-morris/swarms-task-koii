export default {
  transform: { "^.+\\.tsx?$": ["babel-jest", { configFile: "./babel.config.js" }] },
  transformIgnorePatterns: ["/node_modules/(?!@babel/runtime)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  testMatch: ["**/tests/**/*.test.ts"],
  verbose: true,
  clearMocks: true,
  restoreMocks: true,
  testTimeout: 10000,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  }
};
