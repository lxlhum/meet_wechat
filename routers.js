var index = require('./routes/index.js');
var wechat_check = require('./routes/wechat_check.js');

module.exports = function (router) {
    router.get('/', index);
    router.get('/wechat_check', wechat_check);
};