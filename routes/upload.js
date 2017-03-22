var router = require('koa-router')();
var path = require('path');
var mdPath = 'markdown';
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({uploadDir: "./upload_tmp"});
var fs = require("fs");
var file = fs.readdirSync(mdPath);

router.post('/',multipartMiddleware, function *(next) {
    try {
        //console.log(req.files);
        var file = req.files.file;
        var fileName = file.originalFilename;
        var fileTmpPath = file.path;
    }
    catch (e)
    {
        console.log(e.message);
    }

    if(file.ws.closed == true) {
        try {
            var newPath = path.join(mdPath, fileName);
            fs.renameSync(fileTmpPath, newPath);
        } catch(err) {
            res.status(err.status || 500);
            yield this.render('error', {
                message: err.message || "server error",
                error: err
            });
        }
        res.send(newPath);
    }
});

module.exports = router;
