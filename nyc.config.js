const reportDir = process.env.COV_REPORT_DIR ?? 'coverage-nyc';
const tempDir = process.env.COV_TEMP ?? 'reports/.nyc_output';

module.exports = {
  "all": true,
  "reporter": ['json', 'lcov'],
  "include": ['**/src/**', '**/cypress/**/*.*', '**/*.ts', ],
  "exclude": ['*.*', 'lib', 'tests', 'reports', 'cypress/e2e', 'cypress/plugins',  'cypress/*.*'],
  "sourceMap": false,
  "instrument": false,
  "report-dir": reportDir,
  "temp-dir": tempDir
};