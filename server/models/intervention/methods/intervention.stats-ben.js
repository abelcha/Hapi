module.exports = function(schema) {
    var moment = require('moment')
    var _ = require('lodash')
    schema.statics.statsBen = function(req, res) {

        return new Promise(function(resolve, reject) {
            var q = {};
            var options = {};

            if (req.query.group === 'day') {
                var date = new Date(req.query.year, req.query.month);
                options.dateRange = {
                    $gte: new Date(date.getFullYear(), date.getMonth() - 1, 1, -1),
                    $lt: new Date(date.getFullYear(), date.getMonth(), 0)
                }
                options.groupId = {
                    $dayOfMonth: "$date.ajout"
                }
                options.maxRange = 31

            } else if (req.query.group == 'month') {
                options.dateRange = {
                    $gte: new Date(req.query.year, 0, 1),
                    $lt: new Date(req.query.year + 1, 0, 1)
                }
                 options.groupId = {
                    $month: "$date.ajout"
                }
                options.maxRange = 13

            }

            db.model('intervention').aggregate()
                .match({
                    'date.ajout': options.dateRange,
                    'status': {
                        $in: ['ENC', 'VRF']
                    }
                })
                .group({
                    _id: options.groupId,
                    recu: db.utils.sumCond('$compta.reglement.recu', true, '$prixFinal'),
                    potentiel: db.utils.sumCond('$compta.reglement.recu', false, '$prixFinal'),
                })
                .exec(function(err, resp) {

                    var rtn = {
                        title: "Chiffre D'affaire / Mois",
                        series: [{
                            name: 'potentiel',
                            data: db.utils.pluck(resp, 'potentiel', options.maxRange),
                            color: "#2196F3"
                        }, {
                            name: 'recu',
                            data: db.utils.pluck(resp, 'recu', options.maxRange),
                            color: "#4CAF50"
                        }],
                        categories: _.map(_.range(1, options.maxRange), String)
                    }
                    console.log(rtn)
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
            db.model('intervention').aggregate()
                .match({
                    'date.ajout': dateRange,
                    'status': {
                        $in: ['ENC', 'VRF']
                    }
                })
                .group({
                    _id: {
                        $month: "$date.ajout"
                    },
                    recu: db.utils.sumCond('$compta.reglement.recu', true, '$prixFinal'),
                    potentiel: db.utils.sumCond('$compta.reglement.recu', false, '$prixFinal'),
                })
                .exec(function(err, resp) {
                    var rtn = {
                        title: "Chiffre D'affaire / Année",
                        series: [{
                            name: 'potentiel',
                            data: db.utils.pluck(resp, 'potentiel', 13),
                            color: "#2196F3"
                        }, {
                            name: 'recu',
                            data: db.utils.pluck(resp, 'recu', 13),
                            color: "#4CAF50"
                        }],
                        categories: _.map(_.range(1, 13), String)
                    }
                    resolve(rtn)
                })
        })
    }




}
