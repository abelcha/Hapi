module.exports = function(schema) {
    var async = require('async');
    var _ = require('lodash');
    var moment = require('moment')
    schema.statics.stats = {
        unique: true,
        findBefore: true,
        method: "GET",
        fn: function(artisan, req, res) {
            return new Promise(function(resolve, reject) {
                var sumCount = function(query) {
                    query['artisan.id'] = artisan.id;
                    var q = db.model('intervention').aggregate([{
                        $match: query
                    }, {
                        $group: {
                            _id: {
                                // week: '$date.intervention'
                            },
                            mnt: {
                                $sum: "$prixAnnonce"
                            },
                            fnl: {
                                $sum: "$prixAnnonce"
                            },
                            px: {
                                $sum: "$compta.paiement.montant"
                            },
                            total: {
                                $sum: 1
                            }
                        }
                    }, {
                        $project: {
                            _id: 0,
                            total: 1,
                            paye: db.utils.round("$px"),
                            'final': db.utils.round("$fnl"),
                            montant: db.utils.round("$mnt")
                        }
                    }])
                    return q.exec.bind(q);
                }

                var lastMonth = new Date(Date.now() - (28 * 24 * 60 * 60 * 1000));
                async.parallel({
                        total: sumCount({}),
                        annule: sumCount({
                            status: 'ANN'
                        }),
                        paye: sumCount({
                            status: 'VRF',
                            'compta.paiement.effectue': true
                        }),
                        envoye: sumCount({
                            status: 'ENC'
                        }),
                        impayeUrgent: sumCount({
                            status: 'VRF',
                            reglementSurPlace: true,
                            'date.intervention': {
                                $lte: lastMonth
                            },
                            'compta.reglement.recu': false,
                        }),
                        aVerifier: sumCount({
                            status: 'ENC',
                            'date.intervention': {
                                $lte: new Date()
                            },
                        }),
                        impaye: sumCount({
                            status: 'VRF',
                            reglementSurPlace: true,
                            'compta.reglement.recu': false,
                        }),
                        paye: sumCount({
                            'compta.reglement.recu': true,
                        }),
                        _lastInter: function(cb) {
                            db.model('intervention').findOne({
                                'artisan.id': artisan.id
                            }).sort('-id').select('date.ajout').then(function(resp) {
                                if (!resp)
                                    return cb(null, 0)
                                cb(null, {
                                    id: resp._id,
                                    date: resp.date.ajout,
                                    relative: moment(resp.date.ajout).fromNow()
                                })
                            })
                        }
                    },
                    function(err, results) {
                        if (err)
                            return reject(err);
                        var rtn = (_.mapValues(results, function(e, k) {
                            if (k.indexOf('_') == 0) {
                                return e
                            }
                            return e.length ? e[0] : {
                                total: 0,
                                montant: 0,
                                paye: 0,
                                final: 0
                            };
                        }));
                        //        console.log(rtn)
                        resolve(rtn)
                    });

            })
        }
    };
}
