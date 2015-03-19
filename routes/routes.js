      var _config = require("../config/interventions.js");
var _user = require('./users.js');
var _data = require('./api.js');
var _tmp = require('./tmp.js');
module.exports = function(app, _db, passport, memCache) {


app.get('/clearCache', _user.isLoggedIn, function(req, res) {
        _db.interventionModel.find()
        .sort('-id')
        .select('-_id id telepro dateAjout add.v add.cp sst cat nom civ pmntCli pmntSst etat dateInter prixAnn reglSP')
        .exec(function (err, interList){ 
        memCache.put("all", interList);
        res.json(interList);
      }); 
});


app.get('/viewJSON/:type/:query', _user.isLoggedIn, function(req, res) {
  res.render('viewJSON', { q: req.params.type + "/" + req.params.query});
});


app.get('/interventions', _user.isLoggedIn,  function(req, res) {
 	res.render('Interventions', {config:_config});
});

app.get('/interventions/:query',_user.isLoggedIn,  function(req, res) {
  
  _config.parseFilter(req.params.query.split(':'));
  res.render('Interventions', {config:_config});
});







app.get('/intervention/:query', _user.isLoggedIn,  function(req, res) {

  _db.interventionModel.findOne({id:req.params.query}, function (err, data){ 
    res.render('FicheInter', {data:data});
  }); 

});

app.get('/intervention', _user.isLoggedIn,  function(req, res) {
  res.render('FicheInter', {data:{}});
});









app.get('/etats', _user.isLoggedIn, function(req, res) {
  res.render('Interventions/etats', {});
});


app.get('/artisan', _user.isLoggedIn, function(req, res) {
  var inter = require('../modules/artisan.js');
  inter.dumpData(function(artisanList){
    _db.artisanModel.remove({}, function (err) {
      _db.artisanModel.create(artisanList, function(err) {
      //    console.log(artisanList);
          res.render('index', { title: 'Express', artisanList: {} });
      }); 
    });
  });
});



app.get('/update', _user.isLoggedIn, function(req, res) {
  var inter = require('../modules/intervention.js');
  inter.dumpData(function(interList){
  	_db.interventionModel.remove({}, function (err) {
      _db.interventionModel.create(interList, function(err) {
  			  //console.log(interList);
          res.render('index', { title: 'Express', interList: {} });
      }); 
		});
  });
});


app.get('/mail', _user.isLoggedIn, function(req, res) {  
  var mail = require("../modules/edison-mail.js")
  _db.artisanModel
        .find()
        .select("nomSociete -_id id nomRep dateAjout add email tel1 tel2 archive")
        .exec(function (err, ssts){ 
            ssts.forEach(function(e, i) {
               rtn = mail.sendMail({
                  name:"M. Chalier", 
                  title:"Activation du compte Edison Service", 
                  textFile:"invitation",
                  template:"basic2",
                  adress:"e.email"

              });
            });
      res.end( rtn)
  });
});

app.get('/test',  _user.isLoggedIn, function(req, res){
   var _mail = require("../modules/edison-mail.js")
    var rtn =  _mail.renderMail({
                  name:"M. Chalier", 
                  title:"Activation du compte Edison Service", 
                  textFile:"invitation",
                  button:"Activer votre compte",
                  link:"#signup",
                  template:"messageAndLink",
                  adress:e.email,
                  service:"Service Informatique"
        });
      res.send(rtn);

});


app.get('/address',_user.isLoggedIn, function(req, res) {  
/*  _db.artisanModel
        .find({archive:false, dateAjout:{$lte: new Date("2014-09-01")}})
        .select("nomSociete -_id id nomRep dateAjout add email tel1 tel2 archive")
        .exec(function (err, ssts){ 
       res.render("TMP/address", {ssts:ssts})
      });*/
});

_user.routes(app, _db, passport, memCache);
_data.routes(app, _db, _user, memCache)
_tmp.routes(app, _db, _user, memCache)


};


