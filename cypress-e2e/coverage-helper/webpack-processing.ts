import webpack from '@cypress/webpack-preprocessor';
import type { Configuration } from 'webpack';
import FileObject = Cypress.FileObject;

const debug = require('debug')('cyt:plugin');

type TSConfig = {
  tsRawConfigPath?: string;
};

type WebPackPreprocessorConfig = {
  webpackOptions: Configuration;
  watchOptions: Record<string, unknown>;
};

type WebPackPreprocessorConfigFull = WebPackPreprocessorConfig & TSConfig;

const wpConf: {
  config: WebPackPreprocessorConfigFull | undefined;
} = {
  config: undefined,
};

/**
 * Additional webpack configuration can be made by calling this before configureEnv in plugins/index
 * @param options
 *  - tsRawConfigPath - optional, typescript file path (used is esbuild-loader when set)
 *  - configFn - optional function to override original configuration
 */
export const configureWebpack = (options?: {
  tsRawConfigPath?: string;
  configFn?: (originalOptions: Configuration) => Configuration;
}): WebPackPreprocessorConfigFull => {
  const path = require('path');
  const original: Configuration = require(path.join(__dirname, 'webpack.config'))();

  wpConf.config = {
    webpackOptions: options?.configFn?.(original) ?? original,
    watchOptions: {},
    tsRawConfigPath: options?.tsRawConfigPath,
  };

  return wpConf.config;
};

// export for testing
export const addEsbuildLoader = (file: FileObject, options: WebPackPreprocessorConfigFull): Configuration => {
  const path = require('path');
  const { webpackOptions } = options;

  // if there are no rules defined or it's not an array, we can't add to them
  if (!webpackOptions.module || !webpackOptions.module.rules || !Array.isArray(webpackOptions.module.rules)) {
    return webpackOptions;
  }

  // if we find ts-loader configured, don't add it again
  // if (hasTsLoader(rules)) return

  // node will try to load a projects tsconfig.json instead of the node
  // package using require('tsconfig'), so we alias it as 'tsconfig-package'
  const configFile = options.tsRawConfigPath ?? require('tsconfig-package').findSync(path.dirname(file.filePath));

  webpackOptions.module.rules.push({
    test: /\.tsx?$/,
    // for faster loading, not applicable with babel
    loader: 'esbuild-loader',
    options: {
      loader: 'ts',
      target: 'es2015',
      tsconfigRaw: require(configFile),
    },
  });

  const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
  const exts = ['.ts', '.tsx', '.js'];

  const plugin = new TsconfigPathsPlugin({
    configFile,
    silent: true,
  });

  if (!webpackOptions.resolve) {
    webpackOptions.resolve = {
      extensions: exts,
      plugins: [plugin],
    };
  } else {
    webpackOptions.resolve.extensions = webpackOptions.resolve.extensions
      ? webpackOptions.resolve.extensions.concat(['.ts', '.tsx'])
      : exts;

    webpackOptions.resolve.plugins = [
      ...(webpackOptions.resolve.plugins ? [...webpackOptions.resolve.plugins, plugin] : [plugin]),
    ];
  }

  webpackOptions.cache = false;

  return webpackOptions;
};

export const webpackPreprocessor = () => async (file: FileObject): Promise<string> => {
  debug(file);

  const conf = wpConf.config ?? configureWebpack({});

  const opts = addEsbuildLoader(file, conf);

  debug('---- WEBPACK CONFIGURATION ---');

  try {
    debug(JSON.stringify(conf, null, '  '));
  } catch (e) {
    debug('could not stringify');
  }

  const outJS = await webpack({ ...conf, webpackOptions: opts })(file);

  debug(`Out JS bundle: ${outJS}`);

  return outJS;
};
