module.exports.routes = function(app, _db, _user, memCache) {



app.get('/api/interventions/find/:query', _user.isLoggedIn, function(req, res) {
  var query = JSON.parse(req.params.query);
    _db.interventionModel.find(query.q).sort(query.sort).limit(query.limit).exec(function (err, data){ 
   
    res.json(data);
  }); 
});



app.get('/api/interventions/findOne/:query',_user.isLoggedIn,function(req, res) {
  var query = JSON.parse(req.params.query);
   _db.interventionModel.findOne(query, function (err, data){ 
      res.json(data);
  }); 
});


app.get('/api/interventions/all', _user.isLoggedIn, function(req, res) {

    var data = memCache.get("all");
    if (data) {
      res.send(data)
    } else {
        _db.interventionModel.find()
        .sort('-id')
        .select('-_id id telepro dateAjout add.v add.cp sst cat nom civ pmntCli pmntSst etat dateInter prixAnn reglSP')
        .exec(function (err, data){ 
        memCache.put("all", data);
        res.json(data);
      }); 
    }
});


app.get('/api/artisans/find/:query', _user.isLoggedIn, function(req, res) {
  console.log(req.params);
  var query = JSON.parse(req.params.query);
  console.log(query);
    _db.artisanModel.find(query.q || "").sort(query.sort || "").limit(query.limit || "").exec(function (err, data){ 
   
    res.json(data);
  }); 
});



app.get('/api/artisans/find', _user.isLoggedIn, function(req, res) {
    _db.artisanModel
    .find()
    .select('-_id id civ nomSociete prenomRepresentant nomRepresentant add categories')
    .exec(function (err, data){ 
      res.json(data);
  }); 
});

};