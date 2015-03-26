var _user = require('./users.js');
var _data = require('./api.js');
var _tmp = require('./tmp.js');

module.exports = function() {
//app, npm.passport, npm.memoryCache

app.get('/clearCache', _user.isLoggedIn, function(req, res) {
        edison.db.interventionModel.find()
        .sort('-id')
        .select('-_id id telepro dateAjout add.v add.cp sst cat nom civ pmntCli pmntSst etat dateInter prixAnn reglSP')
        .exec(function (err, interList){ 
        npm.memoryCache.put("all", interList);
        res.json(interList);
      }); 
});


app.get('/viewJSON/:type/:query', _user.isLoggedIn, function(req, res) {
  res.render('viewJSON', { q: req.params.type + "/" + req.params.query});
});


app.get('/interventions', _user.isLoggedIn,  function(req, res) {
 	res.render('Interventions', {config:edison.intersConfig});
});

app.get('/interventions/:query',_user.isLoggedIn,  function(req, res) {
  
  edison.intersConfig.parseFilter(req.params.query.split(':'));
  res.render('Interventions', {config:edison.intersConfig});
});

app.get('/118', function(req, res) {
    res.render('118/dashboard',{});
});

app.get('/118/interventions', function(req, res) {
    res.render('118/interventions', {});
});

app.get('/118/listeAppels', function(req, res) {
  npm.request.get({url:'http://electricien13003.com/alvin/118_appels.json'}, function(e, d, body) {
    res.render('118/listeAppels', {data:body});
  })
});



app.get('/intervention/:query', _user.isLoggedIn,  function(req, res) {

  edison.db.interventionModel.findOne({id:req.params.query}, function (err, data){ 
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
    edison.db.artisanModel.remove({}, function (err) {
      edison.db.artisanModel.create(artisanList, function(err) {
      //    console.log(artisanList);
          res.render('index', { title: 'Express', artisanList: {} });
      }); 
    });
  });
});



app.get('/update', _user.isLoggedIn, function(req, res) {
  var inter = require('../modules/intervention.js');
  inter.dumpData(function(interList){
  	edison.db.interventionModel.remove({}, function (err) {
      edison.db.interventionModel.create(interList, function(err) {
  			  //console.log(interList);
          res.render('index', { title: 'Express', interList: {} });
      }); 
		});
  });
});


app.get('/mail', _user.isLoggedIn, function(req, res) {  
  var mail = require("../modules/edison-mail.js")
  edison.db.artisanModel
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
    var rtn =  edison.mail.renderMail({
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
/*  edison.db.artisanModel
        .find({archive:false, dateAjout:{$lte: new Date("2014-09-01")}})
        .select("nomSociete -_id id nomRep dateAjout add email tel1 tel2 archive")
        .exec(function (err, ssts){ 
       res.render("TMP/address", {ssts:ssts})
      });*/
});

_user.routes();
_data.routes(_user)
_tmp.routes(_user)


};


