module.exports = {
 // preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: "@skatejs/ssr/jest",
  setupFilesAfterEnv: ['./test/unit/setup.ts'],
  /*transformIgnorePatterns:[
   "^!node_modules\\lit-element\\",
    "^[^.]+$|\\.(?!(ts|tsx)$)([^.]+$)",
  ]*/
  transformIgnorePatterns:[],
  transform:{
    "^.+\\\\node_modules\\\\lit-element\\\\.*?\\\\*?\.js$": "<rootDir>/node_modules/ts-jest/preprocessor.js",
    "^.+\\.ts$": "<rootDir>/node_modules/ts-jest/preprocessor.js"
  }
};