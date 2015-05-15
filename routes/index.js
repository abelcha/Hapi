var edisonAPI = edison.api;

module.exports = function() {


  var onSuccess = function(res) {
    return function(result) {
      if (res.headersSent === false)
        return res.json(result);
    }
  }

  var onFailure = function(res) {
    return function(err) {
      if (res.headersSent === false)
        res.status(400).send(envProd ? "Bad Request" : err);
    }
  }


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
    model[method](req.params.id, req, res).then(onSuccess(res), onFailure(res));
  });

  app.all('/api/:model/:method', function(req, res, next) {
    var model = db.model(req.params.model);
    var method = req.params.method;
    if (!model ||  typeof model[method] !== "function" || model[method].length !== 2) {
      return next();
    }
    model[method](req, res).then(onSuccess(res), onFailure(res))
  });

  app.all('/api/:model/:id', function(req, res, next) {
    var model = db.model(req.params.model);
    var method = req.params.method;
    var id = req.params.id;
    if (!model || !id)
      return next();
    id = id.match(/^[0-9]+$/i) ? parseInt(id) : id;
    model.view(id, req, res).then(onSuccess(res), onFailure(res));
  });



  app.all('/api/*', function(req, res) {
    res.status(400).send(envProd ? "400 - Bad Request" : "Unhandled route error");
  });

  app.all("*", function(req, res) {
    if (req.url.indexOf('.') >= 0)
      res.status(404).send('Unknown method');
    else
      res.sendFile(rootPath + "/views/index.html")
  });

};
