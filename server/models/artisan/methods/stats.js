module.exports = function(schema) {
    var async = require('async');
    var _ = require('lodash');

    schema.statics.stats = {
        unique: true,
        findBefore: false,
        method: "GET",
        fn: function(id, req, res) {
            return new Promise(function(resolve, reject) {
                var sumCount = function(query) {
                    query['artisan.id'] = parseInt(id);
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
                            'date.paiementSST': {
                                $exists: true
                            }
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
                            'date.paiementCLI': {
                                $exists: false
                            }
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
                            'date.paiementCLI': {
                                $exists: false
                            }
                        }),
                        paye: sumCount({
                            'date.paiementCLI': {
                                $exists: true
                            }
                        })
                    },
                    function(err, results) {
                        if (err)
                            return reject(err);
                        resolve(_.mapValues(results, function(e) {
                            return e.length ? e[0] : {
                                total: 0,
                                montant: 0
                            };
                        }));
                    });

            })
        }
    };
}
