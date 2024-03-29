module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
  ],
  coveragePathIgnorePatterns: [
    "node_modules",
    "test-config",
    ".interface.ts",
    ".protocols.ts",
    ".mock.ts",
    ".model.ts",
    ".d.ts",
    "index.ts",
    "server.ts",
    "app.ts",
    "env.ts",
    "express.route.adapter.ts",
    "express.middleware.adapter.ts",
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
  moduleNameMapper: {
  "@/(.*)": "<rootDir>/src/$1"
  }
}
