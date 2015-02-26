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
var session      = require('express-session');
var flash    = require('connect-flash');
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
var _db = require("./modules/schemaDB.js");
var memCache = require('memory-cache');




var passport = require('passport');
var passportConfig = require('./config/passport')(passport, _db); // pass passport for configuration


// set up our express application
//app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(compress());  
//app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(session(passportConfig));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================


require('./routes/routes.js')(app, _db, passport, memCache); // load our routes and pass in our app and fully configured passport


/*  !AUTHENTIFICATION */

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'controllers')));
app.use(express.static(path.join(__dirname, 'modules')));
app.use('/', routes);

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

