module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/main/**/*.ts",
  ],
  coveragePathIgnorePatterns: [
    "node_modules",
    "test-config",
    ".interface.ts",
    ".protocols.ts",
    ".model.ts",
    "index.ts",
    "server.ts",
    "app.ts",
  ],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  roots: ["<rootDir>/src"],
  testEnvironment: "jest-environment-node",
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
  transform: {
    ".+\\.ts$": "ts-jest",
  },
  preset: '@shelf/jest-mongodb',
}
