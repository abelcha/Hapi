'use strict'

module.exports = function(schema) {
    var redisRStream = require('redis-rstream')
    var FiltersFactory = requireLocal('config/FiltersFactory')
    var config = requireLocal('config/dataList');
    var ReadWriteLock = require('rwlock');
    var d = requireLocal('config/dates.js')

    var lock = new ReadWriteLock();
    var _ = require('lodash')

    var translate = function(e) {
        var fltr = FiltersFactory('devis').filter(e);
        return {
            f: fltr,
            da: d(e.date.ajout),
            t: e.login.ajout,
            c: e.categorie,
            cx: config.categories[e.categorie].long_name,
            id: e._id,
            n: e.client.civilite + " " + e.client.nom + ' ' + e.client.prenom,
            s: e.status,
            sx: config.etatsDevis[e.status].long_name,
            cp: e.client.address.cp,
            ad: e.client.address.v,
            ev: e.envois,
            pa: e.prixAnnonce,
        };
    }
    schema.statics.translate = translate;

    schema.statics.cacheActualise = function(doc) {
        lock.writeLock(function(release) {
            console.log("cacheActualise")
            redis.get("devisList".envify(), function(err, reply) {
                if (!err && reply) {
                    var data = JSON.parse(reply);
                    var index = _.findIndex(data, function(e, i) {
                        return e.id === doc.id;
                    })
                    var result = translate(doc)
                    if (index !== -1) {
                        data[index] = result;
                    } else {
                        data.unshift(result);
                    }
                    redis.set("devisList".envify(), JSON.stringify(data), function() {
                        io.sockets.emit('devisListChange', result);
                        setTimeout(function() {
                            io.sockets.emit('devisListChange', result);
                        }, 3000)
                        release();
                    });
                } else {
                    db.model('devis').list()
                }
            });
        });
    }


    schema.statics.list = function(req, res) {
        return new Promise(function(resolve, reject) {
            redis.get('devisList'.envify(), function(err, reply) {
                if (!err && reply && !_.get(req, 'query.cache')) { // we just want to refresh the cache 
                    return res.send(reply)
                } else {
                    db.model('devis')
                        .find()
                        .then(function(docs) {
                            docs = _.map(docs, translate)
                            resolve(docs);
                            redis.set("devisList".envify(), JSON.stringify(docs))
                        })
                }
            });
        });

    };

}
