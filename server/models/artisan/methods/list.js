'use strict'

module.exports = function(schema) {
    var redisRStream = require('redis-rstream')
    var FiltersFactory = requireLocal('config/FiltersFactory')
    var config = requireLocal('config/dataList');
    var ReadWriteLock = require('rwlock');
    var lock = new ReadWriteLock();
    var d = requireLocal('config/dates.js')

    var _ = require('lodash')

    var translate = function(e) {
        var fltr = FiltersFactory('artisan').filter(e);
        return {
            f: fltr,

            da: d(e.date.ajout),
            t: e.login.ajout,
            c: e.categories,
            id: e._id,
            n: e.nomSociete,
            r: e.representant.nom+ " " + e.representant.prenom,
            s: e.status,
            cp: e.address.cp,
            v: e.address.v,
            x:e.telephone.tel1,
            cnd: e.origin === 'CAND' ? 1 : undefined,
        };
    }
    schema.statics.translate = translate;

    schema.statics.cacheActualise = function(doc) {
        lock.writeLock(function(release) {
            redis.get("artisanList", function(err, reply) {
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
                    redis.set("artisanList", JSON.stringify(data), function() {
                        io.sockets.emit('artisanListChange', result);
                        release();
                    });
                } else {
                    db.model('artisan').list()
                }
            });
        });
    }


    schema.statics.list = function(req, res) {
        return new Promise(function(resolve, reject) {
            redis.get('artisanList', function(err, reply) {
                if (!err && reply && !_.get(req, 'query.cache')) { // we just want to refresh the cache 
                    return res.send(reply)
                } else {
                    db.model('artisan')
                        .find()
                        .then(function(docs) {
                            docs = _.map(docs, translate)
                            resolve(docs);
                            redis.set("artisanList", JSON.stringify(docs))
                        })
                }
            });
        });

    };

}
