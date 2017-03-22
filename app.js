const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

const views = require('koa-views');
const json = require('koa-json');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');

app.use(views('views', {
  root: __dirname + '/views',
  extension: 'ejs'
}));
app.use(json());
app.use(logger());
app.use(bodyParser());

var index = require('./routes/index');

app.use(require('koa-static')(__dirname + '/public'));

require('./routers')(router);

app.use(router.routes())
   .use(router.allowedMethods());

app.on('error', function(err, ctx){
  console.log('server error', err, ctx);
});

module.exports = app;
