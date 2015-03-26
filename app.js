var express = require('express');
global.app = express();
var http = require('http').Server(app);
var port = (process.env.PORT || 8080);
var path = require('path');

var dep = require('./loadDependencies');
global.npm = dep.loadJson("package.json");
global.edison = dep.loadDir("edisonFramework");


var routes = require('./routes/routes')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // set up ejs for templating

// pass passport for configuration
var passportConfig = edison.passport(npm.passport); 


app.use(npm.cookieParser()); // read cookies (needed for auth)
//test
app.use(npm.bodyParser.json());
app.use(npm.bodyParser.urlencoded({ extended: true }));
app.use(npm.compression());  
app.use(npm.expressSession(passportConfig));
app.use(npm.passport.initialize());
app.use(npm.passport.session()); // persistent login sessions
app.use(npm.connectFlash()); // use connect-flash for flash messages stored in session

// routes ======================================================================


require('./routes/routes.js')(); 

/*  !AUTHENTIFICATION */

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'controllers')));
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.set("env", process.env.NODE_ENV || 'development')

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

