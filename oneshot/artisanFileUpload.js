'use strict'

var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = (process.env.PORT || 8080);
var path = require('path');
require('pretty-error').start();


global.requireLocal = function(pth) {
    return require(process.cwd() + '/' + pth)
}

var key = requireLocal('config/_keys');
var dep = require(process.cwd() + '/server/loadDependencies');
global.edison = dep.loadDir(process.cwd() + "/server/edison_components");
global.envProd = process.env.NODE_ENV === "production";
global.envDev = process.env.NODE_ENV === "developement";
global.redis = edison.redis();
global.db = edison.db();
global.sms = new edison.mobyt(key.mobyt.login, key.mobyt.pass);
global.mail = new edison.mail;
global.document = new edison.dropbox();
global.isWorker = false;
global.io = require('socket.io')(http);
edison.extendPrototypes();
if (envProd ||  envDev)
    global.jobs = edison.worker.initJobQueue();


new edison.timer();

io.on('connection', function(socket) {

});

app.use(require("multer")({
    inMemory: true,
    onFileUploadStart: function(file, req, res) {
        return true;
    }
}));
app.use(express.static(path.join(process.cwd(), 'front', 'bower_components')));
app.use(express.static(path.join(process.cwd(), 'front', 'assets')));
app.use(express.static(path.join(process.cwd(), 'front', 'angular')));
app.set('view engine', 'ejs');
app.use(require('cookie-parser')());
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({
    extended: true
}));
app.use(require('compression')());
app.use(require('connect-redis-sessions')({
    client: redis,
    app: "EDISON-SESSION",
    ttl: 60 * 60 * 12,
    cookie: {
        maxAge: 1000 * 60 * 60 * 12
    }
}))

var _ = require('lodash')

var glob = require("glob")

var files = glob.sync("./artisanFiles/*")
var path = require('path')
var fs = require('fs.extra');
var mkdirp = require('mkdirp')

_.each(files, function(e, k) {
    var x = glob.sync([e, '*'].join('/'));
    _.each(x, function(z) {
        /*        var f = {
                    data: fs.readFileSync(z),
                    extension: path.extname(),
                    fileName: z
                }*/
        var split = z.split('_');
        var id = parseInt(split[split.length - 1].split('.')[0]);
        if (!_.isNaN(id)) {
            mkdirp.sync('./V2/' + id);
            //console.log(id, e.split('/')[e.split('/').length - 1], z);
            var filePath = './V2/' + id + '/' + e.split('/')[e.split('/').length - 1] + path.extname(z)
            console.log(z, filePath);
            fs.copy(z, filePath, function(err) {
                console.log('->', err)
            })
        }
    })
})
//process.exit();
/*db.model('document').find().exec(function(err, resp) {
    console.log(err, resp);
process.exit();
})
*/
