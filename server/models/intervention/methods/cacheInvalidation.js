'use strict';

//var ReadWriteLock = require('rwlock');
//var lock = new ReadWriteLock();
var _ = require("lodash")
var ms = require('milliseconds');

var filtersFactory = requireLocal('config/FiltersFactory')("intervention")

module.exports = function(schema) {


    var selectedFields = [
        '-_id',
        'id',
        'login',
        'sav',
        'status',
        'client.civilite',
        'client.nom',
        'client.address',
        'categorie',
        'prixAnnonce',
        'prixFinal',
        'artisan',
        'reglementSurPlace',
        'date',
        'compta.reglement.recu',
        'compta.paiement.effectue',
        "aDemarcher",
    ].join(' ');


    var getReglementClient = function(e, fltr) {
        if (fltr.i_rgl) {
            return 1;
        } else if (fltr.i_vrf) {
            if (e.reglementSurPlace) {
                return fltr.i_sarl ? 2 : 3
            } else {
                return fltr.i_carl ? 4 : 5
            }
        } else {
            return 0
        }
    }

    var getPaiementArtisan = function(e, fltr) {
        if (fltr.i_pay) {
            return 1;
        } else if (fltr.i_rgl) {
            return 2
        } else {
            return 0
        }
    }

    var translate = schema.statics.cachify = function(e) {
        var config = requireLocal('config/dataList')
        var d = requireLocal('config/dates.js')
        console.log(e.id)
        if (e.status === "ENC" && Date.now() > (new Date(e.date.intervention)).getTime() + ms.hours(1)) {
            e.status = 'AVR';
        }
        var fltr = {}
        if (e.id > 15000) {
            fltr = filtersFactory.filter(e);
        }
        try {
            var rtn = {
                f: !_.isEmpty(fltr) ? _.clone(fltr) : undefined,
                t: e.login.ajout,
                id: e.id,
                ai: e.artisan.id,
                s: config.etats[e.status].order,
                c: config.categories[e.categorie].order,
                n: e.client.civilite + ' ' + e.client.nom,
                a: e.artisan.nomSociete,
                pa: e.prixFinal || e.prixAnnonce,
                da: d(e.date.ajout),
                di: d(e.date.intervention),
                rc: getReglementClient(e, fltr) ||  undefined,
                ps: getPaiementArtisan(e, fltr) ||  undefined,
                ad: e.client.address.cp + ', ' + e.client.address.v,
                dm: e.login.demarchage || undefined
            };
        } catch (e) {
            console.log('--->', e)
        }
        fltr = null;
        return rtn;
    }
    schema.statics.translate = translate;
    schema.statics.cacheActualise = function(doc) {
        console.log('cacheActualise')
        //lock.writeLock(function(release) {
            redis.get("interventionList", function(err, reply) {
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
                    redis.set("interventionList", JSON.stringify(data), function() {
                        result._date = Date.now()
                        if (!isWorker) {
                            io.sockets.emit('interventionListChange', result);
                            //sometimes it's too fast
                            setTimeout(function() {
                                io.sockets.emit('interventionListChange', result);
                            }, 2500)
                        }
                       // release();
                    });
                }
            });
      //  });
    }


    schema.statics.filterReload = function(req, res) {
        return new Promise(function(resolve) {
            db.model('intervention').find().sort('-id').select(selectedFields).then(function(docs) {
                redis.get("interventionList", function(err, reply) {
                    if (!err && reply) {
                        var data = JSON.parse(reply);
                        _.each(data, function(e) {
                            var inter = _.find(docs, 'id', e.id)
                            console.log(e.id)
                            if (inter) {
                                var fltr = filtersFactory.filter(inter);
                                e.fltr = !_.isEmpty(fltr) ? _.clone(fltr) : undefined;
                            }
                        })
                        redis.set("interventionList", JSON.stringify(data), resolve);
                    }
                });
            });
        })
    }

    schema.statics.cacheReload = function(req, res) {
        return new Promise(function(resolve, reject) {
            console.log('cachereload')
            try {

                db.model('intervention').find({
                    id: {
                        $gt: req.query.limit || 10000
                    }
                }).sort('-id').select(selectedFields).then(function(docs) {
                    console.log('yay memory')
                    var result = [];
                    for (var i = 0; i < docs.length - 1; i++) {
                        result[i] = translate(docs[i])
                            //console.log('-->', i);
                    };
                    redis.set("interventionList", JSON.stringify(result), function() {
                        resolve(result);
                    })
                }, reject);
            } catch (e) {
                console.log(e)
            }
        });
    }
}
