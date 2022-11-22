// eslint-disable-next-line no-undef
const group = process.env.CYPRESS_GROUP ? `_${process.env.CYPRESS_GROUP}` : '';

// eslint-disable-next-line no-undef
module.exports = {
  extends: '@istanbuljs/nyc-config-typescript',
  all: true,
  reporter: ['json', 'lcov'],
  cache: false,
  'check-coverage': true,
  'report-dir': `./reports/coverage-cypress/cypress${group}`,
  include: ['**/src/'],
  // types for cypress
  exclude: [],
  'temp-dir': `./reports/coverage-cypress-temp/.nyc_output_cypress${group}`,
  branches: 80,
  lines: 80,
  functions: 80,
  statements: 90,
};
