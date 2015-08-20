module.exports = function(app) {
    var success = function(result) {
        if (this.headersSent === false)
            return this.status(200).send(result);
    }

    var die = function(err) {
        if (this.headersSent === false) {
            console.log(err.stack || JSON.stringify(err, undefined, 1))
            this.status(400).send(JSON.stringify(err, undefined, 1));
        }
    }


    app.get('/api/:fn', function(req, res) {
        if (typeof edison.methods[req.params.fn] === 'function') {
            return (edison.methods[req.params.fn](req, res))
        } else {
            res.sendStatus(404);
        }
    })

    app.get('/api/search/:text', edison.search)

    var uniqueModel = function(model, method, req, res) {
        return new Promise(function(resolve, reject) {
            var idIsNumber = model.schema.paths._id.instance === 'Number'
            var id = idIsNumber ? (parseInt(req.params.id) || 0) : req.params.id;
            var promise = Promise.resolve(id)

            if (model[method].findBefore === true) {
                promise = model.findOne({
                    _id: id
                });
            }
            if (model[method].populateArtisan === true) {
                promise = promise.populate('sst');
            }

            promise.then(function(data) {
                if (!data)
                    reject("Document Not Found");
                var promise = model[method].fn(data, req, res);
                if (promise && promise.then && typeof promise.then === 'function')
                    promise.then(resolve, reject)
            }, reject)

        })
    }


    app.all('/api/:model/:id/:method', function(req, res, next) {
        var model = db.model(req.params.model);
        var method = req.params.method;
        if (!model)
            return next();
        if (typeof model[method] === "undefined")
            return next();
        if (model[method].unique === true && model[method].method === req.method) {
            uniqueModel(model, method, req, res).then(success.bind(res), die.bind(res));
        } else {
            next();
        }
    });

    app.post('/api/:model', function(req, res, next) {
        var model = db.model(req.params.model);
        var method = 'save';
        if (!model ||  typeof model[method] !== "function" || model[method].length !== 2) {
            return next();
        }
        model[method](req, res).then(success.bind(res), die.bind(res))
    });

    app.all('/api/:model/:method', function(req, res, next) {
        var model = db.model(req.params.model);
        var method = req.params.method;
        if (!model ||  typeof model[method] !== "function" || model[method].length !== 2) {
            return next();
        }
        var prm = model[method](req, res);
        if (prm && typeof prm.then === 'function') {
            return prm.then(success.bind(res), die.bind(res))
        }
    });

    app.all('/api/:model/:id', function(req, res, next) {
        var model = db.model(req.params.model);
        var method = req.params.method;
        var id = req.params.id;
        if (!model || !id)
            return next();
        id = id.match(/^[0-9]+$/i) ? parseInt(id) : id;
        model.view(id, req, res).then(success.bind(res), die.bind(res));
    });

    app.get('/api/map/:method', function(req, res) {
        if (!edison.map[req.params.method]) {
            return res.status(400).send("Unknown Method");
        }
        edison.map[req.params.method](req.query, res)
    });


    app.all("*", function(req, res) {
        res.status(404).send('X Not Found');
    });

};
