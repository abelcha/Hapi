'use strict'

module.exports = function(schema) {
    var redisRStream = require('redis-rstream')
    var FiltersFactory = requireLocal('config/FiltersFactory')
    var config = requireLocal('config/dataList');

    var translate = function(e) {
        var fltr = FiltersFactory('devis').filter(e);
        return {
            fltr: fltr,
            da: e.date.ajout,
            t: e.login.ajout,
            c: e.categorie,
            cx: config.categories[e.categorie].long_name,
            id: e._id,
            n: e.client.civilite + " " + e.client.nom,
            s: e.status,
            sx: config.etatsDevis[e.status].long_name,
            cp: e.client.address.cp,
            ad: e.client.address.v,
            ev: e.envois,
            pa: e.prixFinal,
        };
    }

    schema.statics.translate = translate;

    schema.statics.list = function(req, res) {
        var _ = require('lodash')
        return new Promise(function(resolve, reject) {
            redis.exists('devisList', function(err, reply) {
                if (!err && reply) { // we just want to refresh the cache 
                    redisRStream(redis, 'devisList')
                        .pipe(res)
                } else {
                    db.model('devis')
                        .find()
                        .then(function(docs) {
                            docs = _.map(docs, translate)
                            resolve(docs);
                            redis.set("devisList", JSON.stringify(docs))
                        })
                }
            });
        });

    };

}
