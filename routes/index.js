var _session = edison.session;
var edisonAPI = edison.api;

module.exports = function() {

app.get('/interventions', function(req, res) {
  console.time('Get interventions');
  edisonAPI.getIntersPublicData({cache:true}).then(function(result) {
  console.timeEnd('Get interventions');
    res.json(result);
  })
});

app.get('/artisans', function(req, res) {
  console.time('Get Artisans');
  edisonAPI.getArtisansPublicData({cache:true}).then(function(result) {
  console.timeEnd('Get Artisans');
    res.json(result);
  })
});

app.get('/fetchInterventions', function(req, res) {
  edison.dumpInter.dumpData(function(interList) {
    edison.db.interventionModel.remove({}, function (err) {
      edison.db.interventionModel.create(interList, function(err) {
          res.redirect("/interventions")
      });
    });
  });
});

app.get('/fetchArtisans', function(req, res) {
  edison.dumpArtisan.dumpData(function(artisanList){
    edison.db.artisanModel.remove({}, function (err) {
      edison.db.artisanModel.create(artisanList, function(err) {
        res.redirect("/artisans")
      }); 
    });
  });
});

app.get('/test', function(req, res) {

  res.json("ok");

});

app.get('/redis', function(req, res) {

edison.redisCli.set("test", 'lol123')
edison.redisCli.expire("test", 60)
edison.redisCli.get("test", function(err, reply) {
  res.json({err:err, reply:reply});
});

});

app.all('/*', function(req, res) {
	
  	res.sendStatus(404);
	});
};