var md = require('./routes/markdown');
var upload = require('./routes/upload');

module.exports = function(koa){
    koa.use('/', md.routes(), md.allowedMethods());
    koa.use('/upload', upload.routes(), upload.allowedMethods());
};

