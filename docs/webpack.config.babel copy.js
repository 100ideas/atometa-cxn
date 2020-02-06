/* eslint-disable */

// TODO take inspiration from https://github.com/coryhouse/react-slingshot/blob/master/webpack.config.dev.js

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: ['./src/index'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
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
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules|packages/,
        // loaders: ['react-hot-loader/webpack','babel-loader'],
        loaders: ['babel-loader'],
        // use: 'babel-loader',
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'src'),
        loaders: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }, {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src'),
        loaders: [
          "style-loader",
          "css-loader"
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      react: 'react',
      // 'react-dom': '@hot-loader/react-dom',
      'babel-core': '@babel/core',
      '@': path.resolve(__dirname, 'src')
    },
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
    // new HtmlWebpackPlugin(), 
    new webpack.NamedModulesPlugin(),
    // new CopyPlugin([
    //   { from: 'node_modules/vscode-icons-js-example/docs/icons/', to: 'assets/icons/vscode' },
    //   // { from: 'other', to: 'public' },
    // ])
  ],
};
