module.exports.routes = function(_user) {



app.get('/api/interventions/find/:query', _user.isLoggedIn, function(req, res) {
  var query = JSON.parse(req.params.query);
    edison.db.interventionModel.find(query.q).sort(query.sort).exec(function (err, data){ 
   
    res.json(data);
  }); 
});



app.get('/api/interventions/findOne/:query',_user.isLoggedIn,function(req, res) {
  var query = JSON.parse(req.params.query);
   edison.db.interventionModel.findOne(query, function (err, data){ 
      res.json(data);
  }); 
});


app.get('/api/interventions/all', _user.isLoggedIn, function(req, res) {

    var data = npm.memoryCache.get("all");
    if (data) {
      res.send(data)
    } else {
        edison.db.interventionModel.find()
        .sort('-id')
        .select('-_id id telepro dateAjout add.v add.cp sst cat nom civ pmntCli pmntSst etat dateInter prixAnn reglSP')
        .exec(function (err, data){ 
        npm.memoryCache.put("all", data);
        res.json(data);
      }); 
    }
});


app.get('/api/artisans/find/:query', _user.isLoggedIn, function(req, res) {
  console.log(req.params);
  var query = JSON.parse(req.params.query);
  console.log(query);
    edison.db.artisanModel.find(query.q || "").sort(query.sort || "").limit(query.limit || "").exec(function (err, data){ 
   
    res.json(data);
  }); 
});

app.get('/api/artisans/stats', _user.isLoggedIn, function(req, res) {
    edison.db.artisanModel
    .find()
    .exec(function (err, data){ 
      res.json(data);
  }); 
});

app.get('/api/artisans/find', _user.isLoggedIn, function(req, res) {
    edison.db.artisanModel
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
  edison.crawler.getInfosQuartier(req.query, function(data) {
      res.json(data);
  });
});


app.get('/incomingCalls/:number',_user.isLoggedIn, function(req, res) {

  var number = '0033' + parseInt(req.params.number);
  var qtime = Date.now();
  edison.crawler.getOvhSessionId(function(err, sessionId) {
    if (err)
      return res.json(err);
    else {
      edison.crawler.getOvhIncomingCalls(number, sessionId, function(data) {
        data.seconds = (Date.now() - qtime) / 1000;
        return res.json(data);
      });
    }
  })
});
  
app.get('/api/actualise118',_user.isLoggedIn, function(req, res) {

 var crawler = require("../edisonFramework/crawler");
var request = require("request");
var number = '0033184204446';
var pass = "3t9V8gbnUx11n1Fu6Ja0w8K861f77h6Dn22E8Ur563N7qXb8rl";


  var qtime = Date.now();
  console.log('ok');
  crawler.getOvhSessionId(function(err, sessionId) {
    if (err) return (res.json("err"));
    else {
      console.log('ok2');
      crawler.getOvhIncomingCalls(number, sessionId, function(data) {
        data.seconds = (Date.now() - qtime) / 1000;
        console.log('ok3');
        request.post({url:'http://electricien13003.com/alvin/118actualise.php', form: {data:data, password:pass}}, function(err,httpResponse,body){
          console.log('ok4');
          res.json(body);
        })
      });
    }
  })

});


};