'use strict'

var cluster = require('cluster')
/*
if (cluster.isMaster) {
    console.log('MASSSTER')

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;
    console.log("CPU", cpuCount)
    // Create a worker for each CPU
    for (var i = 0; i < process.env.CLUSTER_PROCESS_NBR; i++) {
        console.log('FORK')
        cluster.fork();
    }
    return 0;
// Code to run if we're in a worker process
}
console.log('==>SLAVE', process.pid)

*/
var express = require('express');

express.response.pdf = function(obj, headers, status) {
    this.header('Content-Type', 'application/pdf');
    return this.send(obj, headers, status);
};

express.response.table = function(obj, headers, status) {
    var row = _.map(obj, function(e) {
        return '<td>' + e.join('</td><td>') + '</td>';
    })
    var css = '<style> table, td, th {padding: 1px 10px;border: 1px solid black;}</style>'
    this.send(css + '<table><tr>' + row.join('</tr><tr>') + '</tr></table');
}

express.response.xls = function(obj, headers, status) {
    var _this = this;
    var xlsx = require('node-xlsx');

    this.setHeader('Content-disposition', 'attachment; filename=' + obj.name + ".xlsx");

    return this.send(xlsx.build([{
            name: obj.name,
            data: obj.data
        }]))
        // returns a buffer

    //  this.contentType('text/csv');

};

express.response.sage = function(obj, headers, status) {
    var _this = this;
    this.contentType('text/csv');
    this.setHeader('Content-disposition', 'attachment; filename=' + "Ecritures.txt");
    var rtn = "";
    _.each(obj, function(e) {
        _this.write(e.join(';') + "\r\n");
    })
    return this.end();
};



express.response.jsonStr = function(obj, headers, status) {
    this.header('Content-Type', 'application/json');
    return this.send(obj, headers, status);
};


var app = express();
var http = require('http').Server(app);
var port = (process.env.PORT || 8080);
var path = require('path');
var _ = require('lodash')
var fs = require('fs')
var io_redis = require('socket.io-redis');
global.io = require('socket.io')(http);
io.adapter(io_redis({
    host: 'localhost',
    port: 6379
}));

require('./shared.js')(express);
global.jobs = edison.worker.initJobQueue();
var keys = requireLocal('config/_keys')
global.isWorker = false;

new edison.timer();

app.all('/api/call/:call_id', edison.axialis.info)

app.get('/api/client/:id/svi/contact', edison.axialis.contact)
app.get('/api/client/:id/svi/callback', edison.axialis.callback)

if (process.env.PLATFORM === 'HEROKU') {
    app.use(function(req, res, next) {
        res.redirect('http://edison.services' + req.url)
    })
}

app.get('/favicon.ico', function(req, res) {
    res.sendFile(process.cwd() + '/front/assets/img/favicon.ico')
})

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
app.use(require('body-parser').json({
    limit: '50mb'
}));
app.use(require('body-parser').urlencoded({
    extended: true,
    limit: '50mb'

}));
app.use(require('compression')());


/*app.use(function(req, res, next) {
var requestIp = require('request-ip');
var clientIp = requestIp.getClientIp(req); 
console.log(clientIp)
next()

});
*/
app.use(require('connect-redis-sessions')({
    client: redis,
    app: "EDISON".envify(),
    ttl: 999999999
}))


app.use(function(req, res, next) {
    if (req.session && req.session.root === false && req.headers['x-forwarded-for'] !== '141.105.72.198') {
        return res.status(400).send('BAD IP ADDRESS')
    }
    next(null)
})




app.get('/logout', function(req, res) {
    if (req.session && req.session.id)  {
        edison.event('LOGOUT').login(req.session.login).save()
        req.session.destroy();
    }
    res.redirect('/')
});



app.post('/login', function(req, res) {
    try {
       // if (req.session.root)
        db.model('user').validateCredentials(req, res)
            .then(function(user) {
                req.session.upgrade(user.login, function() {
                    req.session.login = user.login
                    req.session.ligne = user.ligne
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
                __catch(err)
                return res.redirect((req.body.url || '/') + '#failure');
            })
    } catch (e) {
        console.log('-->', e)
    }
});


app.get("/api/ping", function(req, res)  {
    console.log("==>", req.headers['x-forwarded-for'])
    res.json(Date.now());
})

var getEmbeddedScript = function(req) {
    return '<script>' +
        ';window.app_session = ' + JSON.stringify(req.session) +
        ';window.app_env = ' + JSON.stringify(process.env.APP_ENV) +
        ';window.app_users = ' + JSON.stringify(edison.users.list()) +
        '</script>';
}

app.use(function(req, res, next) {
    if (_.includes(req.url, '.'))
        return next();
    if (req.session && !req.session.id && (req.query.x !== keys.commandLineQuery)) {
        if (_.startsWith(req.url, '/api/')) {
            return res.status(401).send("Unauthorized");
        } else {
            return res.sendFile(process.cwd() + '/front/views/login.html');
        }
    } else {

        if (!_.startsWith(req.url, '/api/')) {
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



app.get('/api/job/test', function(req, res) {
    edison.worker.createJob({
        ttl: req.query.ttl,
        time: req.query.time,
        priority: req.query.priority,
        model: "test",
        method: req.query.name ||  "test",
        name: 'test',
        fail: req.query.fail,
    }).then(function() {
        res.send('OK')
    }, function() {
        res.send('ERR')
    })
})


app.get('/api/job/replay', function(req, res) {
    db.model('event').findOne({
        'data._id': req.query.id
    }).then(function(resp) {
        if (!resp) return res.send('nip');
        edison.worker.createJob(resp.data).then(function() {
            res.send('OK')
        }, function() {
            res.send('ERR')
        })
    })

})

app.get('/api/job/clean', function(req, res) {
    redis.delWildcard("kue".envify() + '*', function(err, resp) {
        console.log(err, resp)
        res.send('ok')
    })
})


app.get('/api/block', function(req, res) {
    for (var i = 0; i < 1000000000; i++) {
        if (i % 1000000 == 0) {
            console.log('-->', i)
        }
    };
    res.send('ok')
})


app.get('/api/artisan2014', function(req, res) {
    var async = require('async');
    var _ = require('lodash');

    var d = new Date(2015, 0, 0, 0)
    console.log(d)
    db.model('artisan').find({
        'date.ajout': {
            $lt: d
        }
    }, {
        id: 1,
        nomSociete: 1
    }).then(function(resp) {
        async.each(resp, function(e, small_cb) {
            db.model('intervention').findOne({
                sst: e.id,
                'date.ajout': {
                    $gt: d
                }
            }, {
                'id': 1,
                nomSociete: 1
            }).sort({
                id: -1
            }).then(function(inter) {
                if (inter) {
                    //console.log('==>', inter.id, inter.date.ajout)
                } else {
                    console.log('[' + e.id + ' ' + e.nomSociete + "]")
                }
                small_cb(null)
            })
        })
    })
})

app.post('/api/bug/declare', function(req, res) {
    var textTemplate = requireLocal('config/textTemplate');
    var options = {};
    options.what = req.body.what || ""
    options.on = req.body.on || ""
    options.location = req.body.location || ""
    options.comment = req.body.comment || ""
    options.event = req.body.event || ""
    options.on = req.body.on || ""
    options.login = req.session.login
    var text = _.template(textTemplate.mail.bug.declare())(options);
    mail.send({
        noBCC: true,
        From: "intervention@edison-services.fr",
        ReplyTo: req.session.email,
        To: 'abel.chalier@gmail.com',
        Subject: "[BUG REQUEST] - " + req.session.login,
        HtmlBody: text,
    });
    res.send('ok')

})



require('./routes.js')(app);












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
    res.status(500).json([err, err.stack]);
});
//}

process.on('uncaughtException', __catch);


http.listen(port, function() {
    console.log('listening on *:' + port);
    return !envDev && edison.event('REBOOT').save()
});

module.exports = app;
