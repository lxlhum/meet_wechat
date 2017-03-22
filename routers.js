var index = require('./routes/index.js');

module.exports = function (router) {
    router.get('/', index);
};