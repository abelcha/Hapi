module.exports = function(schema) {
    var moment = require('moment')
    var _ = require('lodash')
    schema.statics.statsBen = function(req, res) {

        if (!req.query.m) {
            return this.statsBenYearly(req, res);
        }

        return new Promise(function(resolve, reject) {
            var getMonthRange = function(m, y) {
                var date = new Date(y, m);
                return {
                    $gte: new Date(date.getFullYear(), date.getMonth(), 1, -1),
                    $lt: new Date(date.getFullYear(), date.getMonth() + 1, 0)
                }
            }
            var dateRange = getMonthRange(req.query.m - 1, req.query.y)
            db.model('intervention').aggregate()
                .match({
                    'date.ajout': dateRange,
                    'status': {
                        $in: ['ENC', 'VRF']
                    }
                })
                .group({
                    _id: {
                        $dayOfMonth: "$date.ajout"
                    },
                    recu: db.utils.sumCond('$compta.reglement.recu', true, '$prixFinal'),
                    potentiel: db.utils.sumCond('$compta.reglement.recu', false, '$prixFinal'),
                })
                .exec(function(err, resp) {

                    var rtn = {
                        title: "Chiffre D'affaire",
                        series: [{
                            name: 'potentiel',
                            data: db.utils.pluck(resp, 'potentiel'),
                            color: "#2196F3"
                        }, {
                            name: 'recu',
                            data: db.utils.pluck(resp, 'recu'),
                            color: "#4CAF50"
                        }],
                        categories: _.map(_.range(1, 32), String)
                    }
                    resolve(rtn);
                })
        })
    }

    schema.statics.statsBenYearly = function(req, res) {
        return new Promise(function(resolve, reject) {
            var getYearRange = function(y) {
                return {
                    $gte: new Date(y, 0, 1),
                    $lt: new Date(y + 1, 0, 1)
                }
            }
            var dateRange = getYearRange(parseInt(req.query.y))

            var lol = {
                $cond: [{
                    $gt: ['$prixFinal', 0]
                }, '$prixFinal', '$prixAnnonce']
            }
            db.model('intervention').aggregate()
                .match({
                    'date.ajout': dateRange,
                    'status': {
                        $in: ['ENC', 'VRF']
                    }
                })
                .project({
                    month: {
                        $month: "$date.ajout",
                    },
                    recu: { // Set to 1 if value < 10
                        $cond: [{
                            $eq: ['$compta.reglement.recu', true]
                        }, '$prixFinal', 0]
                    },
                    potentiel: { // Set to 1 if value < 10
                        $cond: [{
                            $ne: ['$compta.reglement.recu', true]
                        }, lol, 0]
                    },
                    prixFinal: "$prixFinal",
                    prixAnnonce: "$prixAnnonce",
                })
                .group({
                    _id: {
                        mth: '$month',

                    },
                    potentiel: {
                        $sum: '$potentiel'
                    },
                    recu: {
                        $sum: '$recu'
                    }
                })
                .exec(function(err, resp) {
                    var base = _.map(new Array(12), function(e, k) {
                        return _.find(resp, '_id.mth', k + 1) || {
                            potentiel: 0,
                            recu: 0
                        }
                    })
                    var rtn = [];
                    _.each(base, function(e, k) {
                        rtn.push({
                            y: parseInt(req.query.y),
                            montant: _.round(e.recu, 2),
                            mth: k + 1,
                            potentiel: false
                        })
                        rtn.push({
                            y: parseInt(req.query.y),
                            montant: _.round(e.potentiel, 2),
                            mth: k + 1,
                            potentiel: true
                        })
                    })
                    resolve(rtn);
                })
        })
    }
}
