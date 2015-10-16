module.exports = function(schema) {
    var moment = require('moment')
    var async = require('async')
    var _ = require('lodash')
    schema.statics.monthComission = function(req, res) {
        return new Promise(function(resolve, reject) {
            var dateCeilling = moment().subtract(2, 'month').startOf('month').toDate();
            db.model('intervention')
                .aggregate()
                .match({
                    'date.ajout': {
                        $gt: dateCeilling
                    },
                    status: {
                        $in: ["ENC", "VRF"]
                    },
                    'login.ajout': req.query.user
                })
                .project({
                    _id: 0,
                    id: 1,
                    prixFinal: 1,
                    'date.ajout': 1,
                    categorie: 1,
                    status: 1,
                    enCours: {
                        $cond: [{
                            $eq: ['$status', 'ENC']
                        }, 1, 0]
                    },
                    montant_vt_reel: {
                        $cond: [{
                                $and: [{
                                    $eq: ['$categorie', 'VT']
                                }, {
                                    $eq: ['$compta.reglement.recu', true]
                                }]
                            },
                            150,
                            0
                        ],
                    },
                    montant_vt_pot: {
                        $cond: [{
                                $and: [{
                                    $eq: ['$categorie', 'VT']
                                }, {
                                    $ne: ['$compta.reglement.recu', true]
                                }]
                            },
                            150,
                            0
                        ],
                    },
                    montant_reel: {
                        $cond: [{
                                $and: [{
                                    $ne: ['$categorie', 'VT']
                                }, {
                                    $eq: ['$compta.reglement.recu', true]
                                }]
                            },
                            "$prixFinal",
                            0
                        ],
                    },
                    montant_pot: {
                        $cond: [{
                                $and: [{
                                    $ne: ['$categorie', 'VT']
                                }, {
                                    $ne: ['$compta.reglement.recu', true]
                                }]
                            },
                            "$prixFinal",
                            0
                        ],
                    },
                })
                .group({
                    _id: {
                        d: {
                            $month: "$date.ajout"
                        }
                    },
                    /*id: {
                            $push: '$id'
                        },*/
                    sum_VT_pot: {
                        $sum: '$montant_vt_pot'
                    },
                    sum_pot: {
                        $sum: '$montant_pot'
                    },
                    sum_VT_reel: {
                        $sum: '$montant_vt_reel'
                    },
                    sum_reel: {
                        $sum: '$montant_reel'
                    },
                    /*
                        totalEnc: {
                            $sum: '$enCours'
                        },
                        total: {
                        $sum: 1
                    }*/
                })
                .exec(function(err, resp) {
                    console.log(err, resp)
                    resolve(resp)
                })
        })
    }


    var cond = function(vr, val, res) {
        return {
            $cond: [{
                $eq: [vr, val]
            }, res, 0]
        }
    }
    var sum = function(vr) {
        return {
            $sum: vr
        }
    }

    schema.statics.weekStats = function(req, res) {
        //ligue 1
        return new Promise(function(resolve, reject) {
            var dateCeilling = moment().startOf('week').toDate();
            console.log(dateCeilling)
            db.model('intervention')
                .aggregate()
                .match({
                    'date.ajout': {
                        $gt: dateCeilling
                    },
                })
                .project({
                    'login.ajout': 1,
                    TOTAL: 1,
                    ENC: cond('$status', 'ENC', 1),
                    VRF: cond('$status', 'VRF', 1),
                    APR: cond('$status', 'APR', 1),
                    ANN: cond('$status', 'ANN', 1),
                    SUM: cond('$status', 'VRF', "$prixFinal")
                })
                .group({
                    _id: '$login.ajout',
                    TOTAL_ENC: sum('$ENC'),
                    TOTAL_APR: sum('$APR'),
                    TOTAL_VRF: sum('$VRF'),
                    TOTAL_ANN: sum('$ANN'),
                })
                .exec(function(err, resp) {
                    resp = _.map(resp, function(e) {
                        e.TOTAL_POINTS = ((e.TOTAL_ENC * 2) + (e.TOTAL_APR * 1) + (e.TOTAL_VRF * 3))
                        return e;
                    })
                    console.log(err, resp)
                    resolve(resp)
                })
        });
    }

}
