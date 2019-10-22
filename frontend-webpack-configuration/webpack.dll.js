/* eslint-disable */
// SEE: http://engineering.invisionapp.com/post/optimizing-webpack/

var path = require('path');
var webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const __PRODUCTION = process.env.NODE_ENV === 'production';
// builds sourcemap when
// if BUILD_SOURCEMAP is false?
// if not production?
const __BUILD_SOURCEMAP = !__PRODUCTION || (process.env.BUILD_SOURCEMAP || false);


const config = {
  entry: {
    vendor: [path.join(process.cwd(), 'client', 'vendor.js')]
  },
  output: {
    path: path.join(process.cwd(), 'dist', 'client', 'dll'),
    filename: '[name]-[hash].dll.js',
    library: '[name]_[hash]'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      use: [{
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: ['@babel/preset-env'],
        },
      }],
    }, {
      test: /\.s?css$/,
      use: ExtractTextPlugin.extract([
        'css-loader?sourceMap',
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
            config: {
              path: __dirname,
            },
          },
        },
        'sass-loader?sourceMap&includePaths[]=node_modules',
      ]),
    }, {
      test: /\.(jpe?g|png|gif)$/,
      use: 'url-loader?limit=1024'
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: 'url-loader?limit=1024&mimetype=application/font-woff&name=[name]-[hash].[ext]'
    }, {
      test: /\.(ttf|otf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: 'url-loader?limit=1024'
    }],
  },
  devtool: __PRODUCTION ? undefined : 'source-map',
  plugins: [
    new webpack.DllPlugin({
      path: path.join(process.cwd(), 'dist', 'client', 'dll', '[name]-manifest.json'),
      name: '[name]_[hash]',
      context: path.resolve(process.cwd(), 'client'),
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractTextPlugin('style-[hash].dll.css'),
    new webpack.ProvidePlugin({
      'window.jQuery': 'jquery',
    }),
  ],
  node: {
    // SEE: https://github.com/webpack-contrib/css-loader/issues/447
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(...[
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new UglifyJSPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
        },
      },
      sourceMap: __BUILD_SOURCEMAP,
    }),
  ]);
}

module.exports = config;