'use strict'
var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = (process.env.PORT || 8080);
var path = require('path');
var _ = require('lodash')
var fs = require('fs')
require('pretty-error').start();

express.response.pdf = function(obj, headers, status) {
    this.header('Content-Type', 'application/pdf');
    return this.send(obj, headers, status);
};

global.requireLocal = function(pth) {
    return require(process.cwd() + '/' + pth)
}

/*var Logger = require('le_node');
global.logger = new Logger({
  token:'LOGENTRIES_TOKEN'
});
*/
global.__catch = function(e) {
    var prettyError = require('pretty-error');
    console.log((new prettyError().render(e)));
    throw e;
}



var key = requireLocal('config/_keys');
var dep = require(process.cwd() + '/server/loadDependencies');
global.edison = dep.loadDir(process.cwd() + "/server/edison_components");
global.envProd = process.env.APP_ENV === "PRODUCTION";
global.envDev = process.env.APP_ENV === "DEVELOPMENT";
global.envStaging = process.env.APP_ENV === "STAGING";
console.log(envDev, envStaging, envProd)
global.redis = edison.redis();
global.db = edison.db();
global.sms = new edison.mobyt(key.mobyt.login, key.mobyt.pass);
global.mail = new edison.mail;
global.document = new edison.dropbox();
global.isWorker = false;
global.io = require('socket.io')(http);
edison.extendPrototypes();
global.jobs = edison.worker.initJobQueue();


new edison.timer();

app.get('/api/client/:id/telephone', edison.axialis.get)

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
    app: "EDISON".envify(),
    ttl: 999999999
}))




app.get('/logout', function(req, res) {
    if (req.session && req.session.id)  {
        new edison.event("LOGOUT", req.session.login);
        req.session.destroy();
    }
    res.redirect('/')

});



app.post('/login', function(req, res) {
    db.model('user').validateCredentials(req, res)
        .then(function(user) {
            req.session.upgrade(user.login, function() {
                req.session.login = user.login
                req.session.nom = user.nom;
                req.session.prenom = user.prenom;
                req.session.portable = user.portable;
                req.session.service = user.service;
                req.session.email = user.email;
                req.session.root = user.root;
                req.session.pseudo = user.pseudo;
                return res.redirect(req.body.url || '/');
            });
        }, function(err) {
            return res.redirect((req.body.url || '/') + '#failure');
        })
});


app.get("/ping", function(req, res)  {
    res.json(Date.now());
})

var getEmbeddedScript = function(req) {
    return '<script>' +
        ';window.app_session = ' + JSON.stringify(req.session) +
        ';window.app_env = ' + JSON.stringify(process.env.APP_ENV) +
        '</script>';
}

app.use(function(req, res, next) {
    if (req.url.includes('.'))
        return next();
    if (req.session && !req.session.id && (!req.query.x)) {
        if (req.url.startsWith('/api/')) {
            return res.status(401).send("Unauthorized");
        } else {
            return res.status(401).sendFile(process.cwd() + '/front/views/login.html');
        }
    } else {

        if (!req.url.startsWith('/api/')) {
            fs.readFile(process.cwd() + "/front/views/index.html", 'utf8', function(err, data) {
                if (err) {
                    return res.status(500).send('error #00412')
                }
                return res.send(data + getEmbeddedScript(req));
            });
        } else {
            return next();

        }
    }
});



require('./routes')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


//if (!env_prod) {
app.use(function(err, req, res, next) {
    __catch(err)
    res.status(err.status || 500);
    res.json(err, err.stack);
});
//}

process.on('uncaughtException', function(error) {
    console.log("Stack => ", error, error.stack);
    // throw error;
});


http.listen(port, function() {
    console.log('listening on *:' + port);
});

module.exports = app;
