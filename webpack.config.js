/* eslint-disable */

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const env = process.env.NODE_ENV || 'development';
const dist = path.join(__dirname, 'dist');

module.exports = {
  mode: env,
  devtool: 'cheap-module-source-map',
  entry: [path.resolve(__dirname, 'src', 'index')],
  output: {
    path: dist,
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        include: path.resolve(__dirname, 'src'),
        use: [ 
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        include: path.resolve(__dirname, 'src'),
        use: [ 
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, 'src'), 
          path.resolve(__dirname,'node_modules/@pmmmwh/react-refresh-webpack-plugin/')],
        exclude: /node_modules|packages/,
        loaders: ['babel-loader'],
        // use: 'babel-loader',
      },
      {
        test: /\.s?css$/,
        include: path.resolve(__dirname, 'src'),
        loaders: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    // alias: {
    //   react: 'react',
    //   // 'react-dom': '@hot-loader/react-dom',
    //   'babel-core': '@babel/core',
    //   '@': path.resolve(__dirname, 'src')
    // },
    // avoid relative-imports!
    // hat-tip to 2015 https://moduscreate.com/blog/es6-es2015-import-no-relative-path-webpack/
    // but see https://webpack.js.org/configuration/resolve/#resolvemodules
    // for idiomatic usage in 2019
    // 
    // first entry in array is searched, then second, etc. 
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve('node_modules')
    ]
  },
  plugins: [
    // https://github.com/react-cosmos/react-cosmos/issues/1150
    new ReactRefreshPlugin({
      disableRefreshCheck: true
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.dev.html'),
      filename: 'index.html',
    }),
    new webpack.NamedModulesPlugin(),
  ],
};
