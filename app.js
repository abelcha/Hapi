'use strict'

var express = require('express');
global.app = express();
var http = require('http').Server(app);
var port = (process.env.PORT || 8080);
global.path = require('path');
require('pretty-error').start();
require("date-utils");



var dep = require('./loadDependencies');
global.rootPath = process.cwd();
global.npm = dep.loadJson("package.json");
global.edison = dep.loadDir("edisonFramework");
global.ed = global.edison;
global._ = require('lodash');
global.envProd = process.env.NODE_ENV === "production";
global.envDev = process.env.NODE_ENV === "developement";
global.requestp = require("request-promise")
global.redis = edison.redis();
global.db = edison.db();
global.sms = new edison.mobyt(edison.config.mobytID, edison.config.mobytPASS);
global.mail = new edison.mail;
global.document = new edison.dropbox();
global.isWorker = false;
if (envProd ||  envDev)
  global.jobs = edison.worker.initJobQueue();

global.io = require('socket.io')(http);
var redisIO = require('socket.io-redis');


new edison.timer();

io.on('connection', function(socket) {

});

app.use(npm.multer({
  inMemory: true,
  onFileUploadStart: function(file, req, res) {
    return true;
  }
}));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'angular')));
app.set('view engine', 'ejs'); // set up ejs for templating
app.use(npm.cookieParser()); // read cookies (needed for auth)
app.use(npm.bodyParser.json());
app.use(npm.bodyParser.urlencoded({
  extended: true
}));
app.use(npm.compression());
app.use(npm.connectRedisSessions({
  client: redis,
  app: "edison",
  ttl: edison.config.ttl,
  cookie: {
    maxAge: edison.config.ttl * 1000
  }
}))


app.get('/logout', function(req, res) {
  if (req.session && req.session.id)  {
    req.session.destroy();
  }
  res.redirect('/')

});

app.post('/login', function(req, res) {
  db.model('user').validateCredentials(req, res)
    .then(function(user) {
      req.session.upgrade(user.login, function() {
        req.session.test = 52;
        req.session.login = user.login
        return res.redirect(req.body.url || '/');
      });
    }, function(err) {
      return res.redirect(req.body.url || '/');
    })
});


app.use(function(req, res, next) {
  if (req.session && !req.session.id && (!req.query.x || envProd) ) {
    if (req.url.indexOf('/api/') === 0) /*TEMPORARY*/ {
      return res.sendStatus(401);
    } else {
      return res.sendFile(__dirname + '/views/login.html');
    }
  } else {
    next();
  }
});

require('./routes')();


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


//if (!env_prod) {
app.use(function(err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.json(String(err));
});
//}

process.on('uncaughtException', function(error) {
  console.log(error.stack);
});

db.model('intervention').list();

http.listen(port, function() {
  console.log('listening on *:' + port);
});
