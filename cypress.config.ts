import path from 'path';
import { defineConfig } from 'cypress';
import { instrumentSync } from './cypress/coverage-helper/instrument';
import { webpackPreprocessor } from './src/plugins/webpack-processing';

const coverage = process.env.COVERAGE || process.env.CYPRESS_COVERAGE;

const cwd = process.cwd();
const pluginsPath = 'plugins';
const sourcesRoot = 'src';
const instrumented = path.join(cwd, 'instrumented');
const src = path.join(cwd, sourcesRoot);
const tsConfigCoverage = 'cypress/tsconfig.cov.json';
const reportsPath = process.env.REPORTS_PATH || path.join(cwd, 'reports');

// returns plugins path
const instrumentApp = (): string => {
  const reports = path.join(`${reportsPath}/coverage-cypress`);
  // eslint-disable-next-line no-console
  console.log('Coverage setup: ');
  // eslint-disable-next-line no-console
  console.log(`  Reports path: ${reports}`);
  instrumentSync(path.resolve(src), instrumented, reports);

  return `${coverage ? instrumented : src}/${pluginsPath}`;
};

const registerCoverage = (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
  // eslint-disable-next-line no-console
  console.log(`CODE COVERAGE CYPRESS: ${coverage}`);

  let plugins = require(`./${sourcesRoot}/${pluginsPath}`); // to have correct resolving intelisense
  let coverageTsConfig: string | undefined;

  if (coverage) {
    const modulePath = instrumentApp();
    plugins = require(modulePath);

    const fs = require('fs');
    coverageTsConfig = path.join(__dirname, tsConfigCoverage);

    if (!fs.existsSync(coverageTsConfig)) {
      throw new Error(`Tsconfig for coverage not exist: file ${coverageTsConfig}`);
    }

    console.log(coverageTsConfig);
    config.env.COVERAGE = coverage;

    require('@cypress/code-coverage/task')(on, config);
  }

  plugins.configureWebpack({
    tsRawConfigPath: coverageTsConfig,
  });

  return plugins;
};

export default defineConfig({
  defaultCommandTimeout: 1000,
  e2e: {
    setupNodeEvents(on, config) {
      const plugins = registerCoverage(on, config);

      // use plugins methods
      plugins.configureEnv(on, config);

      console.log('CYPRESS ENV:');
      console.log(config.env);

      // It's IMPORTANT to return the config object
      // with any changed environment variables
      return config;
    },

    video: false,
  },
});
