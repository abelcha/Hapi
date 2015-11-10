module.exports = function(schema) {
    var async = require('async');
    var _ = require('lodash');
    var moment = require('moment')

    schema.statics.statsNew = {
        unique: true,
        findBefore: false,
        method: "GET",
        fn: function(id, req, res) {
            return new Promise(function(resolve, reject) {

                var getMonthRange = function(m, y) {
                    var date = new Date(y, m);
                    return {
                        $gte: new Date(date.getFullYear(), date.getMonth(), 1, -1),
                        $lt: new Date(date.getFullYear(), date.getMonth() + 1, 0)
                    }
                }
                var dateRange = getMonthRange(req.query.m - 1, req.query.y)


                var baseDate = moment().add('-11', 'months').startOf('month').toDate()

                db.model('intervention')
                    .aggregate()
                    .match({
                        'date.ajout': {
                            $gt: baseDate
                        }
                    })
                    .group({
                        _id: {
                            m: {
                                $month: '$date.ajout'
                            },
                            y: {
                                $year: '$date.ajout'
                            }
                        },

                        'annule': {
                            $sum: {
                                $cond: [{
                                    $eq: ['$status', 'ANN']
                                }, 1, 0]
                            }
                        },
                        'paye': {
                            $sum: {
                                $cond: [{
                                    $eq: ['$compta.paiement.effectue', true]
                                }, 1, 0]
                            }
                        }
                    })
                    .exec(function(err, resp) {
                        var momentIterator = require('moment-iterator');
                        var rtn = []
                        var range = momentIterator(baseDate).each('month', function(dt) {
                            rtn.push({
                                month: dt.month() + 1,
                                year: dt.year(),
                                annule: 0,
                                paye: 0
                            })
                        })
                        rtn.map(function(e) {
                            var fnd = _.find(resp, '_id.m', e.month, '_id.y', e.year);
                            if (fnd) {
                                return _.merge(e, _.omit(fnd, '_id'));
                            }
                            return fnd;
                        })
                        resolve(rtn);
                    })

            })
        }
    };
}
