module.exports = require("./artisan/index")();
return 0;
var schema = new npm.mongoose.Schema({
  id: {
    type: Number,
    index: true
  },
  nomSociete: String,
  formeJuridique: String,
  representant: {
    civilite: String,
    nom: String,
    prenom: String,
  },
  add: {
    n: String,
    r: String,
    v: String,
    cp: String,
    lt: Number,
    lg: Number,
  },
  pourcentage: {
    deplacement: Number,
    maindOeuvre: Number,
    fourniture: Number
  },
  zoneChalandise: Number,
  loc: {
    type: [Number, Number],
    index: '2d'
  },
  categories: [],
  email: String,
  telephone: {
    tel1: String,
    tel2: String
  },
  archive: Boolean
});



var translateModel = function(d) {

  var rtn = {
    id: d.id,
    nomSociete: d.nom_societe,
    categories: [],
    formeJuridique: d.forme_juridique,
    email: d.email,
    telephone: {
      tel1: d.tel1,
      tel2: d.tel2,
    },
    representant: {
      nom: d.nom_representant,
      prenom: d.prenom_representant,
      civilite: d.civilite
    },
    pourcentage: {
      deplacement: d.pourcentage_deplacement,
      maindOeuvre: d.pourcentage_main_d_oeuvre,
      fourniture: d.pourcentage_fourniture
    },
    zoneChalandise: d.zone_chalandise.slice(0, -2),
    add: {
      n: d.numero,
      r: d.adresse,
      v: d.ville,
      cp: d.code_postal,
      lt: d.lat,
      lg: d.lng,
    },
    loc: [parseFloat(d.lat), parseFloat(d.lng)],
    archive: (d.archive == 1 ? true : false),
  };

  var cat = [{
    name: 'EL',
    value: d.electricite
  }, {
    name: 'PL',
    value: d.plomberie
  }, {
    name: 'CH',
    value: d.chauffage
  }, {
    name: 'CL',
    value: d.climatisation
  }, {
    name: 'SR',
    value: d.serrurerie
  }, {
    name: 'VT',
    value: d.vitrerie
  }, {
    name: 'MN',
    value: d.menuiserie
  }, {
    name: 'PT',
    value: d.peinture
  }, {
    name: 'CR',
    value: d.carrelage
  }, {
    name: 'MC',
    value: d.maconnerie
  }];
  for (var i = 0; i < cat.length; i++) {
    if (cat[i].value === '1')
      rtn.categories.push(cat[i].name);
  }

  return rtn;
}

var addInDB = function(data, i, cb) {
  if (i >= data.length - 1)
    return cb(null)
  if (i % 100 === 0)
    console.log(((i / data.length) * 100).toFixed(2), '%')
  var artisan = new model(translateModel(data[i]));
  artisan.save(function(err) {
    if (err) {
      return cb({
        id: artisan.id,
        err: err
      });
    } else {
      addInDB(data, i + 1, cb);
    }
  });

}

schema.statics.dump = function(req, res) {
  var self = this;
  var exit = false;
  var t = Date.now();

  return new Promise(function(resolve, reject) {
    var inters = [];
    self.remove({}, function() {
      npm.request("http://electricien13003.com/alvin/test42.php", function(err, rest, body) {
        var data = JSON.parse(body);
        addInDB(data, 0, function(err) {
          if (err)
            return reject(err);
          return resolve({
            status: 'OK',
            time: (Date.now() - t) / 1000
          });
        });
      });
    });
  });
}

var getStats = function(id) {
  return new Promise(function(resolve, reject) {
    console.time("ts")
    var sumCount = function(query) {
      query['artisan.id'] = id;
      var q = edison.db.model.intervention.aggregate([{
        $match: query
      }, {
        $group: {
          _id: {
            // week: '$date.intervention'
          },
          mnt: {
            $sum: "$prixAnnonce"
          },
          total: {
            $sum: 1
          }
        }
      }, {
        $project: {
          _id: 0,
          total: 1,
          montant: {
            $divide: [{
                $subtract: [{
                  $multiply: ['$mnt', 100]
                }, {
                  $mod: [{
                    $multiply: ['$mnt', 100]
                  }, 1]
                }]
              },
              100
            ]
          }
        }
      }])
      return q.exec.bind(q);
    }

    var lastMonth = new Date(Date.now() - (28 * 24 * 60 * 60 * 1000));
    npm.async.parallel({
        total: sumCount({}),
          annule: sumCount({
            status: 'ANN'
          }),
          intervenu: sumCount({
            status: 'INT'
          }),
          enc: sumCount({
            status: 'ENC'
          }),
          impayeUrgent: sumCount({
            status: 'INT',
            'date.intervention': {
              $lte: lastMonth
            },
            'date.paiementCLI': {
              $exists: false
            }
          }),
          aVerifier: sumCount({
            status: 'ENC',
            'date.intervention': {
              $lte: new Date()
            },
          }),
          impaye: sumCount({
            status: 'INT',
            'date.paiementCLI': {
              $exists: false
            }
          }),
          paye: sumCount({
            'date.paiementCLI': {
              $exists: true
            }
          })
      },
      function(err, results) {
        console.log(results)
        resolve(results);
        if (err)
          console.log(err);
        console.timeEnd("ts")
      });

  })
}


var getNoobs = function() {
  return new Promise(function(resolve, reject) {
    edison.db.model.intervention.aggregate([{
      $match: {
        'artisan.id': {
          $exists: true
        },
        status: 'INT'
      }
    }, {
      $group: {
        nbr: {
          $sum: 1
        },
        _id: '$artisan.id'
      }
    }]).exec(function(err, doc) {
      //console.log(err, doc)
      var rtn = [];
      doc.forEach(function(e) {
        if (e.nbr > 5)
          rtn.push(e._id);
      })
      resolve(rtn);
    })
  })
}

schema.statics.stats = function(req, res) {
  return getStats(parseInt(req.query.id))
};


var mapRank = function(docs, i, noobs, req, cb) {
  if (i === 0) {
    this.rtn = [];
    this.x = -1;
  }
  if (i === docs.length - 1) {
    return cb(this.rtn)
  }
  if (!req.query.categorie || docs[i].obj.categories.indexOf(req.query.categorie) >= 0) {
    if (++this.x > req.query.limit) {
      return cb(this.rtn)
    }
    this.rtn.push({
      distance: docs[i].dis.toFixed(1),
      categories: docs[i].obj.categories,
      noob: (noobs.indexOf(docs[i].obj.id) == -1),
      // address: docs[i].obj.add,
      id: docs[i].obj.id,
      nomSociete: docs[i].obj.nomSociete
    });
  }
  //edison.db.model.intervention.count({'artisan.id':docs[i].obj.id}).exec().then(function(res) {
  //this.rtn[x].noob = res < 5;
  return mapRank(docs, i + 1, noobs, req, cb)
    //})
}

schema.statics.rank = function(req, res) {
  console.time("rank")
  var self = this;
  return new Promise(function(resolve, reject) {
    var point = {
      type: "Point",
      coordinates: [parseFloat(req.query.lat), parseFloat(req.query.lng)]
    };
    var options = {
      distanceMultiplier: 0.01,
      maxDistance: (parseFloat(req.query.maxDistance) || 50)
    }
    self.geoNear(point, options, function(err, docs) {
      if (err)
        return resolve(err);
      getNoobs().then(function(noobs) {
        mapRank(docs, 0, noobs, req, function(rtn) {
          // console.log("==>", rtn)
          console.timeEnd("rank")
          resolve(rtn);
        })
      });
    });
  })
}


var model = npm.mongoose.model('artisan', schema);

module.exports = model;
