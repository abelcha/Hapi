module.exports.routes = function(app, _db, _user, memCache) {



app.get('/api/interventions/find/:query', _user.isLoggedIn, function(req, res) {
  var query = JSON.parse(req.params.query);
    _db.interventionModel.find(query.q).sort(query.sort).limit(query.limit).exec(function (err, interList){ 
   
    res.json(interList);
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
        .exec(function (err, interList){ 
        memCache.put("all", interList);
        res.json(interList);
      }); 
    }
});



};