/* eslint-disable */
// SEE: https://github.com/geniuscarrier/webpack-angular-es6
// SEE: https://github.com/christianalfoni/webpack-express-boilerplate

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const path = require('path');
const webpack = require('webpack');

const __PRODUCTION = process.env.NODE_ENV === 'production';
// builds sourcemap when
// if BUILD_SOURCEMAP is false?
// if not production?
const __BUILD_SOURCEMAP = !__PRODUCTION || (process.env.BUILD_SOURCEMAP || false);

const config = {
  entry: {
    app: [ path.join(process.cwd(), 'client/app.js'), ...(__PRODUCTION ? [] : ['webpack-hot-middleware/client?reload=true']) ],
  },
  output: {
    path: path.join(process.cwd(), 'dist', 'client'),
    filename: __PRODUCTION ? '[name]-[hash].min.js' : '[name].js',
    publicPath: '/'
  },
  cache: true,
  devtool: __PRODUCTION ? undefined : 'eval-source-map',
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.(scss|js)/,
      use: 'import-glob-loader'
    }, {
      enforce: 'pre',
      test: /\.js$/,
      use: 'baggage-loader?[file].html&[file].css'
    }, {
      test: /\.jsx?$/,
      exclude: /(node_modules)/,
      use: [{
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: ['@babel/preset-env'],
          plugins: [['@babel/plugin-proposal-decorators', { legacy: true }], '@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-object-rest-spread', 'angularjs-annotate'],
        },
      }],
    }, {
      test: /\.s?css$/,
      exclude: /(node_modules)/,
      use: __PRODUCTION ?
      /* production */ ExtractTextPlugin.extract([
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
        'sass-loader?sourceMap&includePaths[]=node_modules'
      ]) :
      /* development */ [
        'style-loader',
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
      ],
    }, {
      test: /\.html$/,
      use: ['ngtemplate-loader', 'html-loader?minimize=true'],
    }, {
      // pug (without index.pug)
      test: /\.pug$/,
      exclude: /index\.pug/,
      use: ['ngtemplate-loader', 'html-loader?minimize=true', 'pug-html-loader'],
    }, {
      test: /\.md$/,
      use: ['ngtemplate-loader', 'html-loader?minimize=true', 'showdown-markdown-loader?tables=true&customizedHeaderId=true&openLinksInNewWindow=true'],
    }, {
      test: /\.(jpe?g|png|gif)$/,
      exclude: /(node_modules)/,
      use: 'url-loader?limit=1024'
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: 'url-loader?limit=1024&mimetype=application/font-woff&name=[name]-[hash].[ext]'
    }, {
      test: /\.(ttf|otf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: 'url-loader?limit=1024'
    }]
  },
  plugins: [
    //Typically you'd have plenty of other plugins here as well
    new webpack.DllReferencePlugin({
      context: path.join(process.cwd(), 'client'),
      manifest: require(path.join(process.cwd(), 'dist/client/dll/vendor-manifest.json')),
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      filename: 'index.pug',
      template: path.join(process.cwd(), 'client', 'index.pug'),
      hash: false,
    }),
    new PreloadWebpackPlugin({
      rel: 'preload',
      include: 'allAssets',
      as: 'font',
      fileWhitelist: [/(NotoSansKR-(Medium|DemiLight)-Hangul.+\.woff2|(NanumSquareR|NanumSquareB).+\.woff2?)/],
    }),
    new ExtractTextPlugin('[name]-[hash].min.css'),
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {
        preset: ['default', {
          discardComments: {
              removeAll: true,
          },
        }],
      },
      canPrint: true,
    }),
    new AddAssetHtmlPlugin([
      { filepath: path.resolve(process.cwd(), `./dist/client/dll/*.dll.css`), hash: false, typeOfAsset: 'css', includeSourcemap: __BUILD_SOURCEMAP },
      { filepath: path.resolve(process.cwd(), `./dist/client/dll/*.dll.js`), hash: false, includeSourcemap: __BUILD_SOURCEMAP },
    ]),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.ProvidePlugin({
      _: 'lodash',
      moment: 'moment',
    }),
  ],
  resolve: {
    extensions: ['.js', '.css', '.html', '.pug'],
    modules: [
      path.resolve('./client'),
      path.resolve('./node_modules')
    ],
    alias: {
      '~assets': path.join(process.cwd(), 'client/assets'),
      '~app': path.join(process.cwd(), 'client/app'),
      '~vendor': path.join(process.cwd(), 'client/vendor.js'),
    },
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};

////////////////////////////////////////////

if (__PRODUCTION) {

  /**
   * production plugins
   */
  config.plugins.push(...[
    new StatsPlugin('webpack.stats.json', {
      source: false,
      modules: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new UglifyJSPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
        },
      },
      sourceMap: !__PRODUCTION,
    }),
    // copy sitemap.xml, robots.txt, favicon.ico....
    new CopyWebpackPlugin([{
      from: path.join(process.cwd(), './client/*'),
      to: path.join(process.cwd(), 'dist'),
      ignore: ['*.js', '*.pug'],
    }]),
    new CompressionPlugin({
      test: /\.(svg|png|jpe?g|gif|woff(2)?|ttf|otf|svg|css|js)$/,
      threshold: 10240,
      minRatio: 0.8
		}),
  ]);

} else {

  /**
   * development plugins
   */
  config.plugins.push(...[
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
  ]);

}

module.exports = config;