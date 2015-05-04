var express = require('express');
global.app = express();
var http = require('http').Server(app);
var port = (process.env.PORT || 8080);
global.path = require('path');

var dep = require('./loadDependencies');
global.rootPath = process.cwd();
global.npm = dep.loadJson("package.json");
global.edison = dep.loadDir("edisonFramework");
global.ed = global.edison;
edison.extendProprieties();

npm.mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/EDISON');


if (process.env.REDISCLOUD_URL) {
  var url = require('url');
  var redisURL = url.parse(process.env.REDISCLOUD_URL);
  edison.redisCli = npm.redis.createClient(redisURL.port, redisURL.hostname, {
    no_ready_check: true
  });
  edison.redisCli.auth(redisURL.auth.split(":")[1]);
} else {
  edison.redisCli = npm.redis.createClient();
}
edison.redisCli.on("error", function(err) {
  console.log("Redis Error " + err);
});

app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'angular')));
app.set('view engine', 'ejs'); // set up ejs for templating
app.use(npm.cookieParser()); // read cookies (needed for auth)
app.use(npm.cors());
app.use(npm.bodyParser.json());
app.use(npm.bodyParser.urlencoded({
  extended: true
}));
app.use(npm.compression());
app.use(npm.connectRedisSessions({
  client: edison.redisCli,
  app: "edison",
  ttl:edison.config.ttl,
  cookie: { maxAge: edison.config.ttl * 1000 }
}))


app.post('/login', function(req, res) {
  edison.db.model.user.validateCredentials(req, res)
    .then(function(user) {
      req.session.upgrade(user.login, function() {
        req.session.test = 52;
        req.session.user = user;
        return res.redirect(req.body.url || '/');
      });
    }).catch(function(err) {
      return res.redirect(req.body.url || '/');
    })
});

app.use(function(req, res, next) {
  if (!req.session || req.session.id == void(0) && 0) {
    return res.sendFile(__dirname + '/views/login.html');
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

global.env_prod = process.env.NODE_ENV;


//if (!env_prod) {
app.use(function(err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.json(err);
});
//}


http.listen(port, function() {
  console.log('listening on *:' + port);
});
