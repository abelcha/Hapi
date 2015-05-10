'use strict';

module.exports = function(schema) {

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
  ].join(' ');

  var translate = function(e, cb) {
    cb(null, {
      t: e.telepro,
      id: e.id,
      ai: e.artisan.id,
      s: edison.config.etatsKV[e.status],
      c: edison.config.categoriesKV[e.categorie],
      n: e.client.civilite + ' ' + e.client.nom,
      a: e.artisan.nomSociete ||  "",
      pa: e.prixAnnonce,
      da: e.date.ajout,
      di: e.date.intervention,
      ad: e.client.address.cp + ', ' + e.client.address.v
    });
  }

  schema.statics.cacheActualise = function(id) {

    edison.redisCli.get("interventionList", function(err, reply) {
      if (!err && reply) {
        var data = JSON.parse(reply);
        var index = _.findIndex(data, function(e, i) {
          return e.id === id;
        })

        npm.mongoose.model('intervention').findOne({
          id: id
        }).then(function(doc) {
          translate(doc, function(err, result) {
            data[index] = result;
            edison.redisCli.set("interventionList", JSON.stringify(data));
            io.sockets.emit('interventionListChange', data[index]);

          });
        })
      }
    });

  }

  schema.statics.cacheReload = function() {
    return new Promise(function(resolve, reject) {
      npm.mongoose.model('intervention').find().sort('-id').select(selectedFields).then(function(docs) {
        npm.async.map(docs, translate, function(err, result)  {
          resolve(result);
          edison.redisCli.set("interventionList", JSON.stringify(result))
          edison.redisCli.expire("interventionList", 6000)
        });
      });
    });
  }
}
