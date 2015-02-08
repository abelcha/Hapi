var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/data/interventions/find/:query', function(req, res) {
  var query = JSON.parse(req.params.query);
    req.app.get("schemaDB").interventionModel.find(query.q).sort(query.sort).limit(query.limit).exec(function (err, interList){ 
   
    res.json(interList);
  }); 
});

router.get('/clearCache', function(req, res) {
        req.app.get("schemaDB").interventionModel.find()
        .sort('-numOs')
        .select('-_id id telepro dateAjout add.v add.cp sst cat nom civ pmntCli pmntSst etat dateInter')
        .exec(function (err, interList){ 
        req.app.get("cache").put("all", interList);
        res.json(interList);
      }); 
});

router.get('/data/interventions/all', function(req, res) {

    var data = req.app.get("cache").get("all");
    if (data) {
      res.send(data)
    } else {
        req.app.get("schemaDB").interventionModel.find()
        .sort('-numOs')
        .select('id telepro dateAjout add.ville add.cp sst cat nom prenom civ pmntCli pmntSst etat dateInter')
        .exec(function (err, interList){ 
        req.app.get("cache").put("all", interList);
        res.json(interList);
      }); 
    }
});

router.get('/viewJSON/:type/:query', function(req, res) {
  res.render('viewJSON', { q: req.params.type + "/" + req.params.query});
});

router.get('/data/interventions/countTelepro', function(req, res) {
  
  var telepro = ['boukris_b', 'tayeb', 'harald', "eliran", "jeremie"];

  req.app.get("schemaDB").interventionModel.aggregate([
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

router.get('/data/interventions/count/:query', function(req, res) {
  var query = JSON.parse(req.params.query);
    req.app.get("schemaDB").interventionModel.count(query.q).exec(function (err, interList){ 
    res.json(interList);
  }); 
});
router.get('/interventions', function(req, res) {
 	res.render('index', { title: 'Interventions' });
});
router.get('/interventions/:query', function(req, res) {
  res.render('index', { title: 'Interventions' });
});

router.get('/update', function(req, res) {
  var inter = require('../modules/intervention.js');
  inter.dumpData(function(interList){
  	req.app.get("schemaDB").interventionModel.create(interList, function(err) {
			  console.log(interList);
        res.render('index', { title: 'Express', interList: {} });
		});
  });
});

module.exports = router;
