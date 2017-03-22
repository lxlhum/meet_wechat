var router = require('koa-router')();
var mdPath = 'markdown';
var marked = require('marked');
var fs = require("fs");
var properties_parser = require("properties-parser");


marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: true,
    sanitize: true,
    smartLists: true,
    smartypants: true
});


router.get('/',function* (next) {
    try {
        var file = fs.readdirSync(mdPath);
    }
    catch (e)
    {
        console.log(e.message);
    }

    yield this.render('markdown', {
        "mdFiles": file,
        "mdContent": "<h1 class='title_center'>Welcome to markdown-reader<div class='dropzone'>You can drop markdown file anywhere to upload<div></h1>",
        fileName: "",
        editor: false
    });
});

/* md page. */
router.get('markdown/:file',function* (next) {
    try {
        var file = fs.readdirSync(mdPath);
        var mdFile = fs.readFileSync(mdPath + "/" + this.params.file ,"utf-8");
        var html = marked(mdFile);
    }
    catch (e)
    {
        console.log(e.message);
    }

    yield this.render('markdown', {
        "mdFiles": file,
        "mdContent": html,
        "fileName": this.params.file,
        editor: false
    });
});

router.get('edit/:file',function* (next) {

    try {
        var file = fs.readdirSync(mdPath);
        var mdFile = fs.readFileSync(mdPath + "/" + this.params.file ,"utf-8");
        var html = marked(mdFile);
    }
    catch (e)
    {
        console.log(e.message);
    }

    yield this.render('markdown', {
        "mdFiles": file,
        "mdContent": mdFile,
        "fileName": this.params.file,
        editor: true
    });
});

router.get('delete/:file',function* (next) {
    try {
        fs.unlinkSync(mdPath + "/" + this.params.file);
    }
    catch (e)
    {
        console.log(e.message);
    }
    this.redirect('/');
});

/* setting */
router.get('settings',function* (next) {
    try {
        var editor = properties_parser.createEditor("settings.properties");
        var nightMode = editor.get("nightMode");
        var shrink = editor.get("shrink");
        var fontSize = editor.get("fontSize");
        // this.header('Content-Type', 'application/json;charset=utf-8');
        this.body={nightMode: nightMode, shrink: shrink, fontSize: fontSize};
    }catch (e)
    {
        console.log(e.message);
    }
});

router.post('settings/save',function* (next) {
    try {
        var editor = properties_parser.createEditor("settings.properties");
        editor.set(this.request.body.key, this.request.body.value);
        editor.save();
        this.body="save setting success";
    }catch (e)
    {
        console.log(e.message);
    }

});

router.get('download/:file',function* (next) {
    try {
        var fileName = this.params.file;

    }catch (e)
    {
        console.log(e.message);
    }

    // this.header('Content-Type', 'text/plain;charset=utf-8');
    // this.header('content-disposition', 'attachment; filename=' + fileName);

    if(typeof(fileName) != undefined || fileName != null) {
        var mdFile = fs.readFileSync( mdPath + "/" + fileName ,"utf-8");

        this.body=mdFile;
    } else {

        this.body='#Welcome to markdown-reader';
    }

});

router.post('save',function* (next) {
    try {
        var fileName = this.request.body.fileName;
        var content = this.request.body.content;
        fs.writeFileSync(mdPath + "/" + fileName, content);
    }catch (e)
    {
        console.log(e.message);
        this.body="save error";
    }

    this.body={succsee:true};
});


module.exports = router;