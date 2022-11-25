import {TsconfigPathsPlugin} from "tsconfig-paths-webpack-plugin";
import path from 'path';
const  wp = require("@cypress/webpack-preprocessor");

const webpackOptions = {
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({
      configFile: path.resolve(__dirname,'../tsconfig.json')
    })]
  }
  ,
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      },
     
      {
        test: /\.[jt]s$/,
        use: {
          loader: 'istanbul-instrumenter-loader',
          options: { esModules: true }
        },
        enforce: 'post',
        exclude: /node_modules|\.spec\.[tj]s$/,
      }
    ]
  }
}
const options = {
  webpackOptions
}
module .exports = wp(options);