var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = (process.env.PORT || 8080);
var compress = require('compression');

// Configuration of the server 
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Database
var mongo = require('mongodb');

// Authentification
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var routes = require('./routes/routes')
var users = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set("schemaDB", require("./modules/schemaDB.js"))
app.set("cache", require('memory-cache'));

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
app.use(compress());  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/*  AUTHENTIFICATION */

//app.use(passport.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function(user, done) {
  console.log("serialize()")
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log("deser")
  done(null, user);
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   if (username == "abel" && password == "123") {
     return done(null, {toto:"abel", lol:42});
   }
    return done(null, false);
  }
));


app.post('/login', function(req, res, next) {
    console.log("user : ", req.body.username);
    console.log("password : ", req.body.password);
    passport.authenticate('local', { successRedirect: '/inters',
                                     failureRedirect: '/' })(req, res, next);
});

/*  !AUTHENTIFICATION */

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'controllers')));
app.use(express.static(path.join(__dirname, 'modules')));
app.use('/', routes);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}



http.listen(port, function(){
  console.log('listening on *:' + port);
});

var schema = app.get("schemaDB");
