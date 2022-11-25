const reportDir = process.env.COVERAGE_REPORT_DIR ?? 'coverage-nyc';
const tempDir = process.env.COVERAGE_TEMP ?? 'reports/.nyc_output';

module.exports = {
  all: true,
  reporter: ['json', 'lcov'],
  include: ['**/src/**', '**/cypress/**/*.*', '**/*.ts'],
  exclude: ['*.*', 'lib', 'js-files-cypress', 'tests', 'reports', 'cypress/e2e', 'cypress/plugins', 'cypress/*.*'],
  sourceMap: false,
  instrument: false,
  'report-dir': reportDir,
  'temp-dir': tempDir,
};
