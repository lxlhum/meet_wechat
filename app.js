var app = require('koa')()
var koa = require('koa-router')()
var logger = require('koa-logger')
var json = require('koa-json')
var views = require('koa-views')

app.use(views('views', {
  root: __dirname + '/views',
  default: 'ejs'
}));
app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(require('koa-static')(__dirname + '/public'));

app.use(koa.routes());

require('./routers')(koa);

app.on('error', function(err, ctx){
  logger.error('server error', err, ctx);
});

module.exports = app;
