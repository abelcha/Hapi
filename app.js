'use strict'

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
global._ = require('lodash');
global.envProduction = typeof process.env.REDISCLOUD_URL !== "undefined";

npm.mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/EDISON');
global.io = require('socket.io')(http);
var redisIO = require('socket.io-redis');


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

global.jobs = npm.kue.createQueue({
  prefix: 'q',
  redis: process.env.REDISCLOUD_URL ? {
    port: redisURL.port,
    host: redisURL.hostname,
    auth: redisURL.auth.split(":")[1],
  } : undefined,
  disableSearch: true
})

app.get('/jobs', function(req, res) {
  var job = jobs.create('crawl', {
    url: 'http://example.com',
    token: 'foo'
  });
  job.on('complete', function(re) {
    console.log("===>", re)
    // avoid sending data after the response has been closed
    if (res.finished) {
      console.log("Job complete");
    } else {
      return res.send("Job complete");
    }
  }).on('failed', function() {
    if (res.finished) {
      console.log("Job failed");
    } else {
      return res.send("Job failed");
    }
  }).on('progress', function(progress) {
    console.log('job #' + job.id + ' ' + progress + '% complete');
  });
  job.save();
  // timeout after 5s
/*  setTimeout(function() {
    return res.send("OK (timed out)");
  }, 5000);*/
});

app.get('/test2', function(req, res) {
    for (var i = 0; i < 150000; i++) {
    if (i % 10000 === 0)
     console.log(i / 5000);
    for (var j = 0; j < i; j++) {};
  };
res.send("ok")
})


edison.redisCli.on("error", function(err) {
  console.log("Redis Error " + err);
});

io.on('connection', function(socket) {

});

app.use(npm.kue.app);
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
  client: edison.redisCli,
  app: "edison",
  ttl: edison.config.ttl,
  cookie: {
    maxAge: edison.config.ttl * 1000
  }
}))


app.post('/login', function(req, res) {
  edison.db.model.user.validateCredentials(req, res)
    .then(function(user) {
      req.session.upgrade(user.login, function() {
        req.session.test = 52;
        req.session.user = user;
        return res.redirect(req.body.url || '/');
      });
    }, function(err) {
      return res.redirect(req.body.url || '/');
    })
});

app.use(function(req, res, next) {
  if (req.session && req.session.id == void(0) && (42 == 0 /*|| envProduction*/)) {
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
  res.status(err.status || 500);
  res.json(err);
});
//}


http.listen(port, function() {
  console.log('listening on *:' + port);
});
