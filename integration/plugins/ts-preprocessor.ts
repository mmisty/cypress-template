import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import path from 'path';
import type { Configuration } from 'webpack';

export const preprocessor = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const webpack = require('webpack');
  const tsconfigPath = path.resolve(__dirname, '../tsconfig.json');

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const wp = require('@cypress/webpack-preprocessor');

  const webpackOptions: Configuration = {
    resolve: {
      extensions: ['.ts', '.js'],
      fallback: {
        fs: false,
        tls: false,
        net: false,
        path: require.resolve('path-browserify'),
        zlib: false,
        http: false,
        https: false,
        module: false,
        stream: false,
        crypto: false,
        constants: false,
        util: false,
        url: false,
        assert: false,
        os: false,
      },
      plugins: [
        // to resolve paths from tsconfig (i.e.cy-local)
        new TsconfigPathsPlugin({
          configFile: tsconfigPath,
          silent: true,
        }),
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.[jt]s$/,
          use: {
            loader: 'coverage-istanbul-loader',
            options: { esModules: true },
          },
          enforce: 'post',
          exclude: /node_modules|\.spec\.[tj]s$/,
        },
        {
          test: /\.tsx?$/,
          // for faster loading, not applicable with babel
          loader: 'esbuild-loader',
          options: {
            loader: 'ts',
            target: 'es2015',
            // tsconfigRaw:
          },
        },
      ],
    },
    cache: false,
    stats: 'verbose',
    devtool: process.env.DEBUG ? 'inline-source-map' : false,
  };

  const options = {
    webpackOptions,
  };

  return wp(options);
};
