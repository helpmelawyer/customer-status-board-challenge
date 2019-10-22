
const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const send = require('koa-send');
const r = require('koa-route');
const json = require('koa-json');

const generate = require('./generate-dummy-data');

const throttle = (T = 1000) => new Promise(resolve => setTimeout(resolve, T));

const data = generate();
console.log('Data generated');

const app = new Koa();
const root = path.join(__dirname, '..', 'src');
const htmlFile = fs.readFileSync(path.join(root, 'index.html'));

function serveFavicon(ctx) {
  return send(ctx, path.join(root, 'favicon.ico'));
}

function serveStaticFile(ctx) {
  return send(ctx, ctx.path, { root });
}

app.use(json());
app.use(r.get('/favicon.ico', serveFavicon));
app.use(r.get('*.css', serveStaticFile));
app.use(r.get('*.js', serveStaticFile));
app.use(r.get('/assets/**/*', serveStaticFile));

// GET /api/progresses
app.use(r.get('/api/progresses', async function (ctx) {
  await throttle(1000);
  ctx.body = data.map(d => ({ ...d, tasks: undefined }));
}));

// GET /api/progresses/:id/tasks
app.use(r.get('/api/progresses/:id/tasks', async function (ctx, id) {
  const progress = data.find(d => d.id === id);
  if (!progress) {
    ctx.status = 404;
    return;
  }
  await throttle(1000);
  ctx.body = progress.tasks;
}));

app.use(async ctx => {
  ctx.status = 200;
  ctx.type = 'html';
  ctx.body = htmlFile;
});


app.listen(process.env.PORT || 3000);
app.on('error', function (err) {
  console.log(err.stack);
});