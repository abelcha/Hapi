'use strict'

var schema = new npm.mongoose.Schema({
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

  var cat = {
    EL: d.electricite,
    PL: d.plomberie,
    CH: d.chauffage,
    CL: d.climatisation,
    SR: d.serrurerie,
    VT: d.vitrerie,
    MN: d.menuiserie,
    PT: d.peinture,
    CR: d.carrelage,
    MC: d.maconnerie,
  };
  for (k in cat) {
    if (cat[k] == '1') {
      rtn.categories.push(k)
    }
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

/*
  total/sum
    en cours
    annuler
    intervenu
    paiementcli

    

*/

schema.statics.stats = function(req, res) {
  var id = parseInt(req.query.id);
  console.time("ts")
  return new Promise(function(resolve, reject) {

    var cnt = function(query) {
      query['info.artisan.id'] = id;
      var q = edison.db.model.intervention.where(query)
      return q.count.bind(q);
    }
    var sum = function(query) {
      query['info.artisan.id'] = id;
      var q = edison.db.model.intervention.aggregate([{
        $match: query
      }, {
        $group: {
          _id: null,
          totalAmount: {
            $sum: "$info.prixAnnonce"
          },
          count: {
            $sum: 1
          }
        }
      }/*, {
        $project: {
          _id: 0
        }
      }*/])
      return q.exec.bind(q);
    }

    npm.async.parallel({
        total: cnt({}),
        annule: cnt({
          status: 'ANN'
        }),
        intervenu: cnt({
          status: 'INT'
        }),
        enc: cnt({
          status: 'ENC'
        }),
        sm: sum({})
      },
      function(err, results) {
        resolve(results);
        console.timeEnd("ts")
      });

  })
};

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


schema.statics.rank = function(req, res) {
  var self = this;
  return new Promise(function(resolve, reject) {
    var point = {
      type: "Point",
      coordinates: [parseFloat(req.query.lat), parseFloat(req.query.lng)]
    };
    var options = {
      distanceMultiplier: 100,
      maxDistance: (parseFloat(req.query.maxDistance) || 30) * 0.01
    }
    self.geoNear(point, options, function(err, docs) {
      if (err)
        return resolve(err);
      var rtn = [];
      for (var i = 0, x = 0; i < docs.length; i++) {
        if (!req.query.categorie || docs[i].obj.categories.indexOf(req.query.categorie) >= 0) {
          if (++x > req.query.limit)
            break;
          rtn.push({
            distance: docs[i].dis.toFixed(1),
            categories: docs[i].obj.categories,
            address: docs[i].obj.add,
            id: docs[i].obj.id,
            nomSociete: docs[i].obj.nomSociete
          })
        }
      };
      resolve(rtn);
    });
  })
}


var model = npm.mongoose.model('artisan', schema);

module.exports = model;
