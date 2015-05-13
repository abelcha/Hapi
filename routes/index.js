var edisonAPI = edison.api;

module.exports = function() {


  app.get('/api/map/:method', function(req, res) {
    if (!edison.map[req.params.method]) {
      return res.status(400).send("Unknown Method");
    }
    edison.map[req.params.method](req.query, res)
  });

  app.all('/api/:fn', function(req, res) {
    if (typeof edison.ajax[req.params.fn] === 'function') {
      return (edison.ajax[req.params.fn](req, res))
    } else {
      res.sendStatus(404);
    }
  })

  app.all('/api/:model/:id/:method', function(req, res, next) {
    var model = db.model(req.params.model);
    var method = req.params.method;

    if (!model ||  typeof model[method] !== "function" || model[method].length !== 3) {
      return next();
    }
    model[method](req.params.id, req, res).then(function(result, alreadyReply) {
      if (!alreadyReply)
        res.json(result);
    }).catch(function(err) {
      res.status(400).send(envProduction ? "Bad Request" : err);
    })
  });

  app.all('/api/:model/:id', function(req, res, next) {
    var model = db.model(req.params.model);
    var method = req.params.method;
    id = parseInt(req.params.id);
    if (isNaN(id) || !model)
      return next();
    model.view(id, req, res).then(function(result, alreadyReply) {
      if (!alreadyReply)
        res.json(result);
    }).catch(function(err) {
      res.status(400).send(envProduction ? "Bad Request" : err);
    })
  });

  app.all('/api/:model/:method', function(req, res, next) {
    var model = db.model(req.params.model);
    var method = req.params.method;
    if (!model ||  typeof model[method] !== "function" || model[method].length !== 2) {
      return next();
    }
    model[method](req, res).then(function(result, alreadyReply) {
      if (!alreadyReply)
        res.json(result);
    }).catch(function(err) {
      res.status(400).send(envProduction ? "Bad Request" : err);
    })
  });


  app.all('/api/*', function(req, res) {
    res.status(400).send(envProduction ? "400 - Bad Request" : "Unhandled route error");
  });

  app.all("*", function(req, res) {
    if (req.url.indexOf('.') >= 0)
      res.status(404).send('Unknown method');
    else
      res.sendFile(rootPath + "/views/index.html")
  });

};
