module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  transformIgnorePatterns: ['/node_modules/(?!name-of-lib-to-transform)'],
  automock: false,
  resetMocks: false,
  setupFiles: [
    './setupJest.js'
  ]
}
