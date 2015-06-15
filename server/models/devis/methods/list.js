'use strict'

module.exports = function(schema) {

    schema.statics.list = function(req, res) {
        var async = require("async")
        return new Promise(function(resolve, reject) {
            redis.get('devisList', function(err, reply) {
                if (!err && reply && !req.query.cache) {
                    return res.send(reply);
                }
                var FiltersFactory = requireLocal('config/FiltersFactory')
                var config = requireLocal('config/dataList');
                db.model('devis')
                    .find()
                    .then(function(docs) {
                        async.map(docs, function(e, cb) {
                            var fltr = FiltersFactory('devis').filter(e);
                            cb(null, {
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
                            });
                        }, function(err, result)  {
                            resolve(result);
                            redis.set("devisList", JSON.stringify(result))
                            redis.expire("devisList", 30)
                            //redis.del('devisList')
                        });
                    })
            });
        });

    };

}
