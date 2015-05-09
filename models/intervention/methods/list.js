'use strict'

module.exports = function(schema) {

  var categoriesKV = [{
    short_name: 'EL',
    long_name: 'Electricité'
  }, {
    short_name: 'PL',
    long_name: 'Plomberie'
  }, {
    short_name: 'CH',
    long_name: 'Chauffage'
  }, {
    short_name: 'CL',
    long_name: 'Climatisation'
  }, {
    short_name: 'SR',
    long_name: 'Serrurerie'
  }, {
    short_name: 'VT',
    long_name: 'Vitrerie'
  }, {
    short_name: 'CR',
    long_name: 'Carrelage'
  }, {
    short_name: 'MN',
    long_name: 'Menuiserie'
  }, {
    short_name: 'MC',
    long_name: 'Maconnerie'
  }, {
    short_name: 'PT',
    long_name: 'Peinture'
  }];

  var compressDate = function(date) {
    return Math.round(new Date(date).getTime() / 1000);
  };

  var etatsKV = {
    ENC: {
      n: 'En Cours',
      c: 'orange'
    },
    INT: {
      n: 'Confirmé',
      c: 'green accent-4'
    },
    APR: {
      n: 'A Progr.',
      c: 'blue'
    },
    ANN: {
      n: 'Annuler',
      c: 'red'
    },
    DEV: {
      n: 'Devis',
      c: 'light-blue'
    },
  };

  var selectedFields = [
    '-_id',
    'id',
    'telepro',
    'status',
    'client.civilite',
    'client.nom',
    'client.address',
    'categorie',
    'prixAnnonce',
    'artisan',
    'date.intervention',
    'date.ajout'
  ]
  var s = "";
  selectedFields.forEach(function(e)  {
    s += (' ' + e);
  })
  schema.statics.list = function(req, res) {
    var _this = this;
    console.time('interList')
    return new Promise(function(resolve, reject) {
      edison.redisCli.get('interventionList', function(err, reply) {
        if (err)
          return reject(err);
        if (reply && !req.query.cache) {
          console.timeEnd('interList')
          console.log('cache')
          return resolve(JSON.parse(reply));
        }
        _this.model('intervention').find().limit(100000).sort('-id').select(s).then(function(docs) {
          npm.async.map(docs, function(e, cb) {
            cb(null, {
              t: e.telepro,
              i: e.id,
              ai: e.artisan.id,
              s: etatsKV[e.status],
              c: categoriesKV[e.categorie],
              n: e.client.civilite + ' ' + e.client.nom,
              a: e.artisan.nomSociete ||  "",
              pa: e.prixAnnonce,
              da: e.date.ajout,
              di: e.date.intervention,
              ad: e.client.address.cp + ', ' + e.client.address.v
            });
          }, function(err, result)  {
            resolve(result);
            console.timeEnd('interList')
            console.log('nocache')
            edison.redisCli.set("interventionList", JSON.stringify(result))
            edison.redisCli.expire("interventionList", 6000)
          });
        })
      });
    });
  }
}
