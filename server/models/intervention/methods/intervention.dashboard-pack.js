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
                                    $eq: ['$compta.paiement.effectue', true]
                                }]
                            },
                            150,
                            0
                        ],
                    },
                    montant_vt_pot: {
                        $cond: [{
                                $eq: ['$categorie', 'VT']
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
                                    $eq: ['$compta.paiement.effectue', true]
                                }]
                            },
                            "$prixFinal",
                            0
                        ],
                    },
                    montant_pot: {
                        $cond: [{
                                $ne: ['$categorie', 'VT']
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
                })
                .exec(function(err, resp) {
                    resp = _.map(resp, _.partial(_.mapValues, _, _.partial(_.round, _, 2)))
                    resolve(resp)
                })
        })
    }


    var cond = function(a, b, c, d) {
        return {
            $cond: [{
                $eq: [a, b]
            }, c || 1, d || 0]
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
            v.total = v.ajout + v.envoi + v.verif + v.sum - v.annul - v.averif
        }
    }
    schema.statics.weekStats = function(req, res) {
        //ligue 1
        var dt = new Date(req.query.date);
        return new Promise(function(resolve, reject) {
            db.model('intervention')
                .aggregate()
                .match({
                    'login.ajout': {
                        $in: edison.users.service('INTERVENTION')
                    },
                    $or: [{
                        $and: [{
                            'date.verification': {
                                $gt: dt
                            },
                            'status': 'VRF'
                        }]
                    }, {
                        $and: [{
                            'date.annulation': {
                                $gt: dt
                            },
                            'status': 'ANN'
                        }]
                    }, {
                        'date.ajout': {
                            $gt: dt
                        },
                    }, {
                        'cache.f.i_avr': 1
                    }],
                })
                .project({
                    'login.ajout': 1,
                    'login.envoi': 1,
                    'login.verification': 1,
                    TOTAL: 1,

                    ANN: {
                        $cond: [{
                            $and: [{
                                $eq: ['$status', 'ANN']
                            }, {
                                $gt: ['$date.annulation', dt]
                            }]
                        }, 1, 0]
                    },
                    VRF: {
                        $cond: [{
                            $and: [{
                                $eq: ['$status', 'VRF']
                            }, {
                                $gt: ['$date.verification', dt]
                            }]
                        }, 1, 0]
                    },
                    ANNULE_VRF: {
                        $cond: [{
                            $and: [{
                                $eq: ['$status', 'ANN']
                            }, {
                                $gt: ['$date.annulation', dt]
                            }, {
                                $gt: ['$date.envoi', dt - ms.days(360)]
                            }]
                        }, 1, 0]
                    },
                    ENC: {
                        $cond: [{
                            $and: [{
                                $or: [{
                                    $eq: ['$status', 'ENC']
                                }, {
                                    $eq: ['$status', 'VRF']
                                }]
                            }, {
                                $gt: ['$date.ajout', dt]
                            }]
                        }, 1, 0]
                    },
                    APR: {
                        $cond: [{
                            $and: [{
                                $eq: ['$status', 'APR']
                            }, {
                                $gt: ['$date.ajout', dt]
                            }]
                        }, 1, 0]
                    },
                    AVR: {
                        $cond: [{
                            $eq: ['$cache.f.i_avr', 1]
                                /* $and: [{
                                     $eq: ['$cache.f.i_avr', 1]
                                 }, {
                                     $gt: ['$date.ajout', dt]
                                 }]*/
                        }, 1, 0]
                    },
                    SUM: {
                        $cond: [{
                            $and: [{
                                $or: [{
                                    $eq: ['$status', 'ENC']
                                }, {
                                    $eq: ['$status', 'VRF']
                                }]
                            }, {
                                $gt: ['$date.ajout', dt]
                            }]
                        }, div(sub("$prixFinal", "$coutFourniture"), 100), 0]
                    },
                })
                .group({
                    _id: {
                        a: '$login.ajout',
                        e: '$login.envoi',
                        n: '$login.annulation',
                        v: '$login.verification'
                    },
                    TOTAL_AVR: sum('$AVR'),
                    TOTAL_ANNULE_VRF: sum('$ANNULE_VRF'),
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
                            annul_vrf: 0,
                            averif: 0,
                            verif: 0,
                            annul: 0,
                            total: 0,
                            sum: 0
                        }
                    })

                    _.each(resp, function(elem) {
                        if (elem.TOTAL_VRF > 0) {
                            //    set(rtn, elem._id.a, 'ajout', elem.TOTAL_VRF)
                            //    set(rtn, elem._id.a, 'envoi', elem.TOTAL_VRF)
                            set(rtn, elem._id.v, 'verif', elem.TOTAL_VRF)
                        }
                        if (elem.TOTAL_ANNULE_VRF > 0) {
                            set(rtn, elem._id.n, 'verif', elem.TOTAL_VRF)
                        }
                        if (elem.TOTAL_SUM > 0) {
                            set(rtn, elem._id.a, 'sum', elem.TOTAL_SUM)
                                //    set(rtn, elem._id.a, 'sum', elem.TOTAL_SUM)
                                //    set(rtn, elem._id.a, 'sum', elem.TOTAL_SUM)
                        }
                        if (elem.TOTAL_ENC > 0) {
                            // set(rtn, elem._id.a, 'ajout', elem.TOTAL_ENC)
                            set(rtn, elem._id.a, 'ajout', elem.TOTAL_ENC)
                            set(rtn, elem._id.a, 'envoi', elem.TOTAL_ENC)
                        }
                        if (elem.TOTAL_APR > 0) {
                            set(rtn, elem._id.a, 'ajout', elem.TOTAL_APR)
                        }
                        if (elem.TOTAL_ANN > 0) {
                            set(rtn, elem._id.a, 'annul', elem.TOTAL_ANN)
                        }
                        if (elem.TOTAL_AVR > 0) {
                            set(rtn, elem._id.a, 'averif', elem.TOTAL_AVR)
                        }

                    })
                    resolve(rtn);
                })
        });
    }


    var reload = function(req, rescallback) {

    }

    schema.statics.dashboardStats = function(req, res) {
        var _this = this;
        var token = ('dashboardStats' + req.query.date).envify()
        redis.get(token, function(err, reply) {
            if (!err && reply && !req.query.cache) {
                return res.jsonStr(reply)
            } else {
                Promise.all([
                    _this.monthComission(req, res),
                    _this.weekStats(req, res),
                ]).then(function(resp) {
                    var rtn = {
                        monthComission: resp[0],
                        weekStats: resp[1],
                    }
                    redis.setex(token, 15, JSON.stringify(rtn), function() {
                        res.json(rtn)
                    });
                })
            }
        })
    }

}
