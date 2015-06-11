'use strict'

module.exports = function(schema) {

    schema.statics.list = function(req, res) {
        var async = require("async")
        return new Promise(function(resolve, reject) {
            redis.get('devisList', function(err, reply) {
                if (!err && reply && !req.query.cache) {
                    return resolve(JSON.parse(reply));
                }
                db.model('devis')
                    .find()
                    .select('id client status client.address categorie')
                    .then(function(docs) {
                        async.map(docs, function(e, cb) {
                            cb(null, {
                                c: e.categorie,
                                id: e._id,
                                cl: e.client.civilite + " " + e.client.nom,
                                s: e.status,
                                cp: e.client.address.cp,
                                v: e.client.address.v
                            });
                        }, function(err, result)  {
                            resolve(result);
                           // redis.set("devisList", JSON.stringify(result))
                            //redis.expire("devisList", 6000)
                        });
                    })
            });
        });

    };

}
