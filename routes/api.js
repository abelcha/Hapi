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

app.get('/api/artisans/stats', _user.isLoggedIn, function(req, res) {
    _db.artisanModel
    .find()
    .exec(function (err, data){ 
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

app.get('/api/interventions/118', function(req, res) {
  var request = require("request")
  request.get({url: "http://electricien13003.com/alvin/118data.php", json: true}, function (error, response, body) {
    res.json(body)
  });
});

app.get('/crowling/quartier', _user.isLoggedIn, function(req, res) {

var utf8 = require('utf8');
var request = require("request")
//http://www.kelquartier.com/gmap_ajax/search-point' --data $'lat=48.8751978&lng=2.3505632000000105&search=61+Rue+d\'Hauteville%2C+Paris%2C+France'
var url = "http://www.kelquartier.com/gmap_ajax/search-point";
console.log(req.query);
request.post({url: url, json: true, form: req.query}, function (error, response, body) {
  request({url: "http://www.kelquartier.com" +  body.link}, function (error2, response2, body2) {
    var cheerio = require('cheerio'),
    $ = cheerio.load(body2);
    var rtn = {};
    rtn.tauxChomage = $('#carteNum_15>.td_A').next().html();
    rtn.ageMoyen = $('#carteNum_16>.td_B').next().html();
    rtn.revenuMoyen = $('.legendes_points_cles>strong')[0].children[0].data.split(' ')[0];
    rtn.typeQuatier = utf8.encode($('.ligne_tab_points_cles.border_bas').last().children().next().html().trim());
    console.log(rtn);
    res.send(rtn);
  });
})

 
});





};