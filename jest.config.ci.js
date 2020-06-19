const jestConfig = require('./jest.config');

module.exports = Object.assign(jestConfig, {
  silent: true,
  reporters: [['jest-silent-reporter', { useDots: true }]],
});
