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
                .project({
                    day: {
                        $dayOfMonth: "$date.ajout",
                    },
                    recu: '$compta.reglement.recu',
                    prixFinal: "$prixFinal",
                    prixAnnonce: "$prixAnnonce",
                }).exec(function(err, resp) {
                    if (err) {
                        reject(err);
                    }
                    resp = _.map(resp, function(e) {
                        return {
                            prix: e.prixFinal ||  e.prixAnnonce ||  0,
                            day: e.day,
                            recu: e.recu ? 'Encaissé' : 'En Attente'
                        }
                    })
                    _.times(31, function(i) {
                        resp.push({
                            day: i + 1,
                            prix: 0,
                            recu: 'En Attente'
                        })
                    })
                    resolve(resp);
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
                        }, '$prixFinal', 0]
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
                            y:parseInt(req.query.y),
                            montant: _.round(e.recu, 2),
                            mth: k + 1,
                            potentiel: false
                        })
                        rtn.push({
                            y:parseInt(req.query.y),
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
