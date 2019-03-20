module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: "@skatejs/ssr/jest",
  setupFilesAfterEnv: ['./test/unit/setup.ts'],
  transformIgnorePatterns:[
    "<rootDir>/^(?!test/).*/m",
  ]
};