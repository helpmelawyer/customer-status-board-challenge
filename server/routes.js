/**
 * Main application routes
 */

const pug = require('pug');
const path = require('path');
const express = require('express');

const throttle = (T = 1000) => new Promise(resolve => setTimeout(resolve, T));

const generate = require('./components/generate-dummy-data');

const { progresses, cards } = generate();
console.log('Data generated');


function _buildContext(env) {
  const _context = {
    title: ({
      staging: '[STAGING] 헬프미 어드민',
      development: '[DEV] 헬프미 어드민',
      production: '헬프미 어드민',
    })[env] || '[?] 헬프미 어드민',
  };

  _context.backend = {
    hosts: {
      main: 'http://customer-status-board-challenge.help-me.kr:5001',
      fallback: 'hostnameAlt',
    },
    domain: env === 'production' ? '.help-me.kr' : '',
  };

  return _context;
}


module.exports = function (app, compiler = null) {

  const env = app.get('env');
  console.info('NODE_ENV: ' + env);

  const router = express.Router();
  // GET /api/progresses
  router.get('/api/progresses', async function (req, res) {
    const { skip = -1, limit = -1 } = req.query;
    await throttle(1000);
    if (limit > 0) {
      return res.json(progresses.slice(Math.max(0, skip), limit));
    } else {
      return res.json(progresses);
    }
  });

  // GET /api/task-cards
  router.get('/api/task-cards', async function (req, res, id) {
    const { skip = -1, limit = -1, progressId } = req.query;
    await throttle(1000);

    const filteredCards = progressId ? cards.filter(card => card.ref.progress === Number(progressId)) : cards;
    if (limit > 0) {
      return res.json(filteredCards.slice(Math.max(0, skip), limit));
    } else {
      return res.json(filteredCards);
    }
  });
  app.use(router);


  // Set-Cookie 헤더를 이용해서 로그아웃
  app.all('/logout', function (req, res) {
    res.clearCookie('token');
    res.clearCookie('helpme_session');
    return res.sendStatus(204);
  });

  // favicon
  app.get('/favicon.ico', function (req, res) {
    return res.sendFile(path.join(__dirname, '..', 'client', 'assets', 'favicon.ico'));
  });


  // All other routes should redirect to the index.html
  switch (env) {
    case 'production':
    case 'staging':
      app.get('*', function response(req, res) {
        return res.render(app.get('indexPath') + '/index', _buildContext(env));
      });

      break;
    case 'development':
    case 'test':
    case 'localhost':
    default:

      app.get('*', function response(req, res, next) {
        const filename = path.join(compiler.outputPath, 'index.pug');
        compiler.outputFileSystem.readFile(filename, function (err, result) {
          if (err) {
            return next(err);
          }

          res.set('content-type', 'text/html');
          res.send(pug.render(result.toString(), _buildContext(env)));
          res.end();

        });
      });

      break;
  }
};

