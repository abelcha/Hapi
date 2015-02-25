module.exports.routes = function(app, _db, _user, memCache) {



app.get('/data/interventions/find/:query', _user.isLoggedIn, function(req, res) {
  var query = JSON.parse(req.params.query);
    _db.interventionModel.find(query.q).sort(query.sort).limit(query.limit).exec(function (err, interList){ 
   
    res.json(interList);
  }); 
});



app.get('/data/interventions/findOne/:query',_user.isLoggedIn,function(req, res) {
  var query = JSON.parse(req.params.query);
   _db.interventionModel.findOne(query, function (err, data){ 
      res.json(data);
  }); 
});


app.get('/data/interventions/all', _user.isLoggedIn, function(req, res) {

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

app.get('/data/interventions/countTelepro', _user.isLoggedIn, function(req, res) {
  
  var telepro = ['boukris_b', 'tayeb', 'harald', "eliran", "jeremie"];

  _db.interventionModel.aggregate([
      {$match: {ajoutePar : {$in: telepro}}},   
      { $group: {
          '_id' : { ajoutePar: '$ajoutePar' },
          intervenu: { $sum: { $cond: [ { $eq: [ '$etatInter', 'INTERVENU' ] }, 1, 0 ] }},
          enCours:  { $sum: { $cond: [ { $eq: [ '$etatInter', 'EN COURS'   ] }, 1, 0 ] }},
          aProg   : { $sum: { $cond: [ { $eq: [ '$etatInter', 'A PROGRAMMER' ] }, 1, 0 ]}},
      } },
      { $project: { _id: 0, telepro: '$_id.ajoutePar', intervenu: 1, enCours: 1, aProg: 1 }}
  ], 
    function (err, data) { if (err) res.json(err); else res.json(data); }
  );

});

app.get('/data/interventions/count/:query', _user.isLoggedIn, function(req, res) {
  var query = JSON.parse(req.params.query);
    _db.interventionModel.count(query.q).exec(function (err, interList){ 
    res.json(interList);
  }); 
});

};