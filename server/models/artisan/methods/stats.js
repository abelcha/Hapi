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
                            total: {
                                $sum: 1
                            }
                        }
                    }, {
                        $project: {
                            _id: 0,
                            total: 1,
                            montant: {
                                $divide: [{
                                        $subtract: [{
                                            $multiply: ['$mnt', 100]
                                        }, {
                                            $mod: [{
                                                $multiply: ['$mnt', 100]
                                            }, 1]
                                        }]
                                    },
                                    100
                                ]
                            }
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
                                montant: 0
                            };
                        }));
                        rtn.facturier = artisan.historique.facturier.length ? artisan.historique.facturier[0].text : undefined;
                        rtn.kbis = artisan.document.kbis.file;
                        rtn.contrat = artisan.document.contrat.file
                        resolve(rtn)
                    });

            })
        }
    };
}
