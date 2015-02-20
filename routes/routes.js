var express = require('express');
var router = express.Router();

/* GET home page. */

function auth(req, res, next) {

    // do any checks you want to in here
//console.log(req.isAuthenticated());
//console.log(req.user);
    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    //if (req.user.authenticated)
        return next();

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/');
}



router.get('/data/interventions/find/:query', function(req, res) {
  var query = JSON.parse(req.params.query);
    req.app.get("schemaDB").interventionModel.find(query.q).sort(query.sort).limit(query.limit).exec(function (err, interList){ 
   
    res.json(interList);
  }); 
});

router.get('/data/interventions/findOne/:query', function(req, res) {
  var query = JSON.parse(req.params.query);
    req.app.get("schemaDB").interventionModel.findOne(query, function (err, data){ 
      res.json(data);
  }); 
});


router.get('/clearCache', function(req, res) {
        req.app.get("schemaDB").interventionModel.find()
        .sort('-id')
        .select('-_id id telepro dateAjout add.v add.cp sst cat nom civ pmntCli pmntSst etat dateInter prixAnn reglSP')
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
        .sort('-id')
        .select('-_id id telepro dateAjout add.v add.cp sst cat nom civ pmntCli pmntSst etat dateInter prixAnn reglSP')
        .exec(function (err, interList){ 
        req.app.get("cache").put("all", interList);
        res.json(interList);
      }); 
    }
});

router.get('/test', function(req, res) {
  res.render('interventions/test', {});
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
router.get('/inters', auth, function(req, res) {
  var config = require("../modules/config.js")
 	res.render('Interventions', {config:config});
});

router.get('/inters/:query', function(req, res) {
  var config = require("../modules/config.js");
  config.parseFilter(req.params.query.split(':'));
  res.render('Interventions', {config:config});
});

router.get('/etats', auth,  function(req, res) {
  res.render('Interventions/etats', {});
});




router.get('/gmap', function(req, res) {
  res.render('gmap', {});
});

router.get('/artisan', function(req, res) {
  var inter = require('../modules/artisan.js');
  inter.dumpData(function(artisanList){
    req.app.get("schemaDB").artisanModel.remove({}, function (err) {
      req.app.get("schemaDB").artisanModel.create(artisanList, function(err) {
      //    console.log(artisanList);
          res.render('index', { title: 'Express', artisanList: {} });
      }); 
    });
  });
});



router.get('/update', function(req, res) {
  var inter = require('../modules/intervention.js');
  inter.dumpData(function(interList){
  	req.app.get("schemaDB").interventionModel.remove({}, function (err) {
      req.app.get("schemaDB").interventionModel.create(interList, function(err) {
  			  //console.log(interList);
          res.render('index', { title: 'Express', interList: {} });
      }); 
		});
  });
});


router.get('/mail', auth, function(req, res) {  
  var mail = require("../modules/edison-mail.js")
  req.app.get("schemaDB").artisanModel
        .find()
        .select("nomSociete -_id id nomRep dateAjout add email tel1 tel2 archive")
        .exec(function (err, ssts){ 
            ssts.forEach(function(e, i) {
               rtn = mail.sendMail({
                  name:"M. " + e.nomRep, 
                  title:"Déménagement de nos locaux et de nos services", 
                  textFile:"ChangementAdresse",
                  template:"basic",
                  adress:e.email

              });
            });
      res.end( rtn)
  });
});

router.get('/address', function(req, res) {  
  req.app.get("schemaDB").artisanModel
        .find({archive:false, dateAjout:{$lte: new Date("2014-09-01")}})
        .select("nomSociete -_id id nomRep dateAjout add email tel1 tel2 archive")
        .exec(function (err, ssts){ 
       res.render("TMP/address", {ssts:ssts})
      });
});

router.get('/', function(req, res) {

  res.render('Login/login', { title: 'Express', interList: {} });

});


module.exports = router;
