module.exports = function(app, express) {

    var path = require('path')
    var _ = require('lodash')
    var fs = require('fs')
    var keys = requireLocal('config/_keys')

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



    var Logger = require('le_node');
    var log = new Logger({
        token: 'ad0947b5-9007-4d57-b13c-5d65146aaafc'
    });
    app.use(function(req, res, next) {
        var obj = {
            url:req.originalUrl,
            date:new Date,

        }
        console.log(req.url);
        next()
        //log.notice()
    })


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
}
