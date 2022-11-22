const webpack = require('webpack');

const webPackConfig = () => ({
  mode: 'development',
  node: {
    global: true,
    __filename: true,
    __dirname: true,
  },
  module: {
    rules: [],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
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
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  stats: 'verbose',
  devtool: process.env.DEBUG ? 'inline-source-map' : false,
});
module.exports = webPackConfig;
