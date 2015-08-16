module.exports = function(schema) {
    var config = requireLocal('config/dataList')
    var d = requireLocal('config/dates.js')
    var _ = require("lodash")
    var ms = require('milliseconds');
    var async = require('async');
    var getReglementClient = function(e) {
        if (e.compta.reglement.recu) {
            return 1;
        } else if (e.status === "VRF") {
            if (e.reglementSurPlace) {
                return 3
            } else {
                return 5
            }
        } else {
            return 0
        }
    }

    var getPaiementArtisan = function(e) {
        if (e.compta.paiement.effectue) {
            return 1;
        } else if (e.compta.reglement.recu) {
            return 2
        } else {
            return 0
        }
    }

    schema.statics.getCache = function(req, res) {
        return new Promise(function(resolve, reject) {
            console.time('find')
            db.model('intervention').find({}, {
                cache: true,
            }).then(function(resp) {
                console.timeEnd('find')
                console.time('pluck')
                var x = _.pluck(resp, 'cache');
                console.timeEnd('pluck')
                console.time('redis')
                redis.set("interventionList", JSON.stringify(x), function() {
                    console.timeEnd('redis')
                    resolve(x);
                });

            })
        })

    }
    schema.statics.cachify = function(e) {

        try {
            if (e.status === "ENC" && Date.now() > (new Date(e.date.intervention)).getTime() + ms.hours(1)) {
                e.status = 'AVR';
            }
            var rtn = {
                t: e.login.ajout,
                id: e.id,
                ai: e.artisan.id,
                s: config.etats[e.status].order,
                c: config.categories[e.categorie].order,
                n: e.client.civilite + ' ' + e.client.nom + ' ' + e.client.prenom,
                a: e.artisan.nomSociete,
                pa: e.prixFinal || e.prixAnnonce,
                da: d(e.date.ajout),
                di: d(e.date.intervention),
                rc: getReglementClient(e) ||  undefined,
                ps: getPaiementArtisan(e) ||  undefined,
                ad: e.client.address.cp + ', ' + e.client.address.v,
                dm: e.login.demarchage || undefined
            };
        } catch (e) {
            console.log('--->', e)
        }
        return rtn;
    }

    schema.statics.cacheActualise = function(doc) {

        var q = {
            id: doc.id
        };

        async.series({
            reloadFilter: function(cb) {
                db.model('intervention').fltrify(q, cb)
            },
            cacheList: function(cb) {
                redis.get("interventionList", cb);
            },
            intervention: function(cb) {
                db.model('intervention').findOne(q, cb)
            }
        }, function(err, resp) {
            if (resp.cacheList && resp.intervention) {
                var data = JSON.parse(resp.cacheList);
                var index = _.findIndex(data, function(e) {
                    return e.id === doc.id;
                });
                result = resp.intervention.cache;
                if (index !== -1) {
                    data[index] = result;
                } else {
                    data.unshift(result);
                }
                db.model('intervention').stats().then(function(resp) {
                    io.sockets.emit('filterStatsReload', resp);
                })

                redis.set("interventionList", JSON.stringify(data), function() {
                    result._date = Date.now()
                    if (!isWorker) {
                        io.sockets.emit('interventionListChange', result);
                        //sometimes it's too fast
                        setTimeout(function() {
                            io.sockets.emit('interventionListChange', result);
                        }, 2500)
                    }
                });
            }

        })





        /*
                redis.get("interventionList", function(err, reply) {
                    if (!err && reply) {
                        var data = JSON.parse(reply);
                        var index = _.findIndex(data, function(e) {
                            return e.id === doc.id;
                        });
                        result = doc.cache;
                        if (index !== -1) {
                            data[index] = result;
                        } else {
                            data.unshift(result);
                        }
                        redis.set("interventionList", JSON.stringify(data), function() {
                            result._date = Date.now()
                            if (!isWorker) {
                                io.sockets.emit('interventionListChange', result);
                                //sometimes it's too fast
                                setTimeout(function() {
                                    io.sockets.emit('interventionListChange', result);
                                }, 2500)
                            }
                        });
                    }
                });*/
    }
}
