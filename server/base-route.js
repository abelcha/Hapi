module.exports = function(app, express) {

    var path = require('path')
    var _ = require('lodash')
    var fs = require('fs')
    var keys = requireLocal('config/_keys')

    if (process.env.PLATFORM === 'HEROKU') {
        app.use(function(req, res, next) {
            res.redirect('http://46.101.137.217' + req.url)
        })
    }


    app.get('/socket.io', function(req, res) {
        return res.status(404).send()
    })

    app.get('/loaderio-52e4c613b16fcf8369dbca3b9e206881', function(req, res) {
        return res.send("loaderio-52e4c613b16fcf8369dbca3b9e206881")
    })

    app.all('/api/call/:call_id', edison.axialis.info)

    app.get('/api/client/:id/svi/contact', edison.axialis.contact)
    app.get('/api/client/:id/svi/callback', edison.axialis.callback)


    app.get('/favicon.ico', function(req, res) {

        res.sendFile(process.cwd() + '/front/assets/img/favicon' + (envDev ? '-dev' : '') + '.ico')
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
        app: "EDISON",
        ttl: 999999999
    }))



    app.use(function(req, res, next) {
        var lg = {
            url: req.url,
            login: (req.session && req.session.login) || 'unknown',
            ip: (req.headers && req.headers)['x-forwarded-for'] || req.ip,
            wid: global.workerID
        }
        if (envProd) {
            log.info(lg)
            console.log(JSON.stringify(lg))
        } else {}
        next()
    })


    app.get('/logout', function(req, res) {
        if (req.session && req.session.id)  {
            edison.event('LOGOUT').login(req.session.login).save()
            req.session.destroy();
        }
        res.redirect('/')
    });



    app.post('/login', function(req, res) {
        console.log('HERE')
        db.model('user').validateCredentials(req, res)
            .then(function(user) {
                console.log('ok')

                req.session.upgrade(user.login, function() {
                    req.session.login = user.login
                    req.session.ligne = user.ligne
                    req.session.nom = user.nom;
                    req.session.maxInterAverif = user.maxInterAverif;
                    req.session.prenom = user.prenom;
                    req.session.portable = user.portable;
                    req.session.service = user.service;
                    req.session.email = user.email;
                    req.session.root = user.root;
                    req.session.pseudo = user.pseudo;
                    console.log(req.body.redirect, req.body.redirect === '✓')
                    if (req.body.redirect === '✓') {
                        return res.redirect(req.body.url || '/');
                    }
                    return res.send('OK')
                });
            }, function(err) {
                if (req.body.redirect === '✓') {
                    return res.redirect((req.body.url || '/'));
                }
                return res.status(400).send('KO')

            })
    });

    var goodIP = function(ip) {
        return ip === '141.105.72.198' ||  ip === '82.123.70.5';
    }

    app.use(function(req, res, next) {
        if (req.session && req.session.root === false && !goodIP(req.headers['x-forwarded-for'])) {
            req.session.destroy();
            return res.status(400).send('BAD IP ADDRESS')
        }
        next(null)
    })

    app.get("/api/new_call", function(req, res)  {
        console.log("==>", req.headers['x-forwarded-for'], req.query)
        res.json(Date.now());
    })

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


    app.get('/api/env', function(req, res) {
        console.log(_.pick(process.env, 'APP_ENV'))
        res.json(_.pick(process.env, 'APP_ENV'));
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
