import path from 'path';
import { instrumentSync } from '../coverage-helper/instrument';
import { configureWebpack, webpackPreprocessor } from '../coverage-helper/webpack-processing';
import { configureEnv } from '../../src/plugins';

const coverage = process.env.COVERAGE || process.env.CYPRESS_COVERAGE;
const cwd = process.cwd();
const instrumented = path.join(cwd, 'instrumented');
const src = path.join(cwd, 'src');
const tsConfigCoverage = path.join(__dirname, '../tsconfig.cov.json');
const reportsPath = process.env.REPORTS_PATH || path.join(cwd, 'reports');
const reports = path.join(`${reportsPath}/coverage-cypress`);

// returns plugins path
const instrumentApp = () => {
  // eslint-disable-next-line no-console
  console.log('Coverage setup: ');
  // eslint-disable-next-line no-console
  console.log(`  Reports path: ${reports}`);
  instrumentSync(path.resolve(src), instrumented, reports);
};

const registerCoverage = (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
  // eslint-disable-next-line no-console
  console.log(`CODE COVERAGE CYPRESS: ${coverage}`);

  let coverageTsConfig = undefined;

  if (coverage) {
    coverageTsConfig = tsConfigCoverage;
    instrumentApp();

    const fs = require('fs');

    if (!fs.existsSync(coverageTsConfig)) {
      throw new Error(`Tsconfig for coverage not exist: file ${coverageTsConfig}`);
    }

    console.log(`Using tsconfig: ${coverageTsConfig}`);
    config.env.COVERAGE = coverage;

    require('@cypress/code-coverage/task')(on, config);
  }

  configureWebpack({
    tsRawConfigPath: coverageTsConfig,
  });

  on('file:preprocessor', webpackPreprocessor());
};

export const setupNode = (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
): Cypress.PluginConfigOptions => {
  registerCoverage(on, config);

  // use plugins methods
  configureEnv(on, config);

  console.log('CYPRESS ENV:');
  console.log(config.env);

  // It's IMPORTANT to return the config object
  // with any changed environment variables
  return config;
};
