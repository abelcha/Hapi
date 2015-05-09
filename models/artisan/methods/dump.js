module.exports = function(schema) {

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
    var artisan = edison.db.model.artisan(translateModel(data[i]));
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
    var _this = this;
    var exit = false;
    var t = Date.now();

    return new Promise(function(resolve, reject) {
      var inters = [];
      _this.remove({}, function() {
        npm.request(ed.config.alvinURL + "/dumpArtisan.php?key=" + ed.config.alvinKEY, function(err, rest, body) {
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
}
