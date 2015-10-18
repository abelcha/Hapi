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
                    'login.ajout': req.session.login ||  req.query.user
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
                        $month: "$date.ajout"
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
                    resp = _.map(resp, _.partial(_.mapValues, _, _.partial(_.round, _, 2)))
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
    var div = function(a, b) {
        var x = {};
        x.$divide = [a, b];
        return x;
    }
    var sub = function(a, b) {
        var x = {};
        x.$subtract = [a, b];
        return x;
    }

    var set = function(obj, prop, vr, vl) {
        var v = _.find(obj, 'login', prop);
        if (v) {
            v[vr] = _.round(v[vr] + vl);
            v.total = v.ajout + v.envoi + v.verif + v.sum - v.annul
        }
    }
    schema.statics.weekStats = function(req, res) {
        //ligue 1
        return new Promise(function(resolve, reject) {
            var dateCeilling = moment(req.query.date || new Date).startOf('week').toDate();

            db.model('intervention')
                .aggregate()
                .match({
                    'date.ajout': {
                        $gt: dateCeilling
                    },
                })
                .project({
                    'login.ajout': 1,
                    'login.envoi': 1,
                    'login.verification': 1,
                    TOTAL: 1,
                    ENC: cond('$status', 'ENC', 1),
                    VRF: cond('$status', 'VRF', 1),
                    APR: cond('$status', 'APR', 1),
                    ANN: cond('$status', 'ANN', 1),
                    SUM: cond('$status', 'VRF', div(sub("$prixFinal", "$coutFourniture"), 200))
                })
                .group({
                    _id: {
                        a: '$login.ajout',
                        e: '$login.envoi',
                        v: '$login.verification'
                    },
                    TOTAL_SUM: sum('$SUM'),
                    TOTAL_ENC: sum('$ENC'),
                    TOTAL_APR: sum('$APR'),
                    TOTAL_VRF: sum('$VRF'),
                    TOTAL_ANN: sum('$ANN'),
                })
                .exec(function(err, resp) {
                    var rtn = edison.users.service('INTERVENTION')
                    rtn = _.map(rtn, function(e) {
                        return {
                            login: e,
                            ajout: 0,
                            envoi: 0,
                            verif: 0,
                            annul: 0,
                            total:0,
                            sum: 0
                        }
                    })
                    _.each(resp, function(elem) {
                        if (elem.TOTAL_VRF > 0) {
                            set(rtn, elem._id.a, 'ajout', elem.TOTAL_VRF)
                            set(rtn, elem._id.e, 'envoi', elem.TOTAL_VRF)
                            set(rtn, elem._id.v, 'verif', elem.TOTAL_VRF)
                        }
                        if (elem.TOTAL_SUM > 0) {
                            set(rtn, elem._id.a, 'sum', elem.TOTAL_SUM)
                            set(rtn, elem._id.e, 'sum', elem.TOTAL_SUM)
                            set(rtn, elem._id.v, 'sum', elem.TOTAL_SUM)
                        }
                        if (elem.TOTAL_ENC > 0) {
                            set(rtn, elem._id.a, 'ajout', elem.TOTAL_ENC)
                            set(rtn, elem._id.e, 'envoi', elem.TOTAL_ENC)
                        }
                        if (elem.TOTAL_APR > 0) {
                            set(rtn, elem._id.a, 'ajout', elem.TOTAL_APR)
                        }
                        if (elem.TOTAL_ANN > 0) {
                            set(rtn, elem._id.a, 'annul', elem.TOTAL_ANN)
                        }
                    })
                    resolve(rtn);
                })
        });
    }

    schema.statics.champLastMonth = function(req, res) {
    }

    schema.statics.dashboardStats = function(req, res) {
        Promise.all([
            this.monthComission(req, res),
            this.weekStats(req, res),
        ]).then(function(resp) {
            var rtn = {
                monthComission: resp[0],
                weekStats: resp[1],
            }
            res.json(rtn)
        })
    }

}
