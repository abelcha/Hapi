var _session = edison.session;
var edisonAPI = edison.api;
var Intervention = require("../models/intervention");

module.exports = function() {


  app.get('/api/map/:method', function(req, res) {
    if (!edison.map[req.params.method]) {
      return res.status(400).send("Unknown Method");
    }
    edison.map[req.params.method](req.query, res)
  });

  /*  app.all('/ping', function(req, res) {
      res.send("ok");
    })*/

  app.all('/api/:fn', function(req, res) {
    if (typeof edison.ajax[req.params.fn] === 'function') {
      return (edison.ajax[req.params.fn](req, res))
    } else {
      res.sendStatus(404);
    }
  })


  app.all('/api/:model/:method', function(req, res) {
    var model = edison.db.model[req.params.model];
    var method = req.params.method;

    if (!model) {
      return res.status(400).send("Unknown model");
    }
    if (!model[method]) {
      return res.status(400).send("Unknown method")
    }
    model[method](req, res).then(function(result, alreadyReply) {
      if (!alreadyReply)
        res.json(result);
    }).catch(function(err) {
      res.status(400).send(err);
    })
  });



  app.get('/api/search/:model/:options', function(req, res) {
    var t = Date.now()
    try {
      JSON.parse(req.params.options)
    } catch (e) {
      return res.status(400).send("Invalid JSON");
    }
    edisonAPI.getData(req.params.model, JSON.parse(req.params.options))
      .then(function(result) {
        res.json(result);
      })
      .catch(function(err) {
        // Bad Request
        console.log(err.toString())
        res.status(400).send(err.toString());
      })
  })


  app.get('/api/fetchArtisans', function(req, res) {
    edison.dumpArtisan.dumpData(function(artisanList) {
      edison.db.model.artisan.remove({}, function(err) {
        edison.db.model.artisan.create(artisanList, function(err) {
          res.json(artisanList)
        });
      });
    });
  });

  app.get('/api/clearCache', function(req, res) {

    edison.redisCli.del("Artisans");
    edison.redisCli.del("Interventions");
    res.json("OK");

  });
  app.all("*", function(req, res) {
    if (req.url.indexOf('.') >= 0)
      res.sendStatus(404);
    else
      res.sendFile(rootPath + "/views/index.html")
  });

  app.all('/api/*', function(req, res) {
    res.sendStatus(404);
  });
};
