
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

module.exports = function (app) {
  const env = app.get('env');

  app.set('views', path.join(__dirname, '..', '/server/views'));
  app.set('view engine', 'pug');


  // application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({
    extended: true,
    limit: '500kb',
    parameterLimit: 10000,
  }));
  // application/json
  app.use(bodyParser.json({
    limit: '500kb',
  }));

  app.use(cors());

  app.use('/assets', express.static(path.join(__dirname, '..', 'client', 'assets')));

  switch (env) {
    case 'production':
    case 'staging':

      app.use(express.static(path.join(__dirname, '..', 'client')));

      app.set('appPath', path.join(__dirname, '..', '/client'));
      app.set('indexPath', path.join(__dirname, '..', '/client'));

      require('./routes')(app);
      break;

    case 'development':
    case 'test':
    case 'localhost':
    default: {

      const webpack = require('webpack');
      const webpackConfig = require(path.join(process.env.WEBPACK_PATH, 'webpack.config.js'));

      const _distClientPath = path.join(__dirname, '..', 'dist', 'client');
      app.use(express.static(_distClientPath));


      const webpackMiddleware = require('webpack-dev-middleware');
      const webpackHotMiddleware = require('webpack-hot-middleware');

      const compiler = webpack(webpackConfig);
      const middleware = webpackMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        contentBase: _distClientPath,
        stats: {
          colors: true,
          hash: false,
          timings: true,
          chunks: false,
          chunkModules: false,
          modules: false,
        },
      });

      app.use(middleware);
      app.use(webpackHotMiddleware(compiler));
      app.set('appPath', 'client');
      app.set('indexPath', _distClientPath);

      require('./routes')(app, compiler);
    } break;
  }
};
