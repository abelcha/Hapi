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
          edison.redisCli.del("Interventions");
          res.redirect("/interventions")
      });
    });
  });
});

app.get('/fetchArtisans', function(req, res) {
  edison.dumpArtisan.dumpData(function(artisanList){
    edison.db.artisanModel.remove({}, function (err) {
      edison.db.artisanModel.create(artisanList, function(err) {
        edison.redisCli.del("Artisans");
        res.redirect("/artisans")
      }); 
    });
  });
});

app.get('/clearCache', function(req, res) {

  edison.redisCli.del("Artisans");
  edison.redisCli.del("Interventions");

});

app.all('/*', function(req, res) {
  	res.sendStatus(404);
	});
};