module.exports = {
  testEnvironment: '@skatejs/ssr/jest',
  setupFilesAfterEnv: ['./test/unit/setup.ts'],
  transformIgnorePatterns:[],
  transform:{
    "^.+\\\\node_modules\\\\lit-element\\\\.*?\\\\*?\.js$": "ts-jest",
    "^.+\\node_modules\\lit-element\\.*?\\*?\.js$": "ts-jest",
    "^.+\/node_modules\/lit-element\/.*?\/*?\.js$": "ts-jest",
    "^.+\\\\node_modules\\\\lit-html\\\\.*?\\\\*?\.js$": "ts-jest",
    "^.+\\node_modules\\lit-html\\.*?\\*?\.js$": "ts-jest",
    "^.+\/node_modules\/lit-html\/.*?\/*?\.js$" : "ts-jest",
    "^.+\\.ts$": "ts-jest",
    "^.+\.ts$": "ts-jest"
  }
};