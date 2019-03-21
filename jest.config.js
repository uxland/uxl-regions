module.exports = {
  testEnvironment: '@skatejs/ssr/jest',
  setupFilesAfterEnv: ['./test/unit/setup.ts'],
  transformIgnorePatterns:[],
  transform:{
    "^.+\\\\node_modules\\\\lit-element\\\\.*?\\\\*?\.js$": "<rootDir>/node_modules/ts-jest/preprocessor.js",
    "^.+\\node_modules\\lit-element\\.*?\\*?\.js$": "<rootDir>/node_modules/ts-jest/preprocessor.js",
    "^.+\/node_modules\/lit-element\/.*?\/*?\.js$": "<rootDir>/node_modules/ts-jest/preprocessor.js",
    "^.+\\\\node_modules\\\\lit-html\\\\.*?\\\\*?\.js$": "<rootDir>/node_modules/ts-jest/preprocessor.js",
    "^.+\\node_modules\\lit-html\\.*?\\*?\.js$": "<rootDir>/node_modules/ts-jest/preprocessor.js",
    "^.+\/node_modules\/lit-html\/.*?\/*?\.js$" : "<rootDir>/node_modules/ts-jest/preprocessor.js",
    "^.+\\.ts$": "<rootDir>/node_modules/ts-jest/preprocessor.js",
    "^.+\.ts$": "<rootDir>/node_modules/ts-jest/preprocessor.js"
  }
};