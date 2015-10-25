module.exports = function(schema) {
    schema.statics.extendedStats = {
        unique: true,
        findBefore: false,
        method: "GET",
        fn: function(artisan, res, req) {
            var moment = require('moment');
            var _ = require('lodash');
            return new Promise(function(resolve, reject) {
                var last12Months = moment().subtract(11, 'month').date(1).toDate();
                db.model('intervention').aggregate([{
                        $match: {
                            'date.ajout': {
                                $gte: last12Months,
                            },
                            status: {
                                $in: ["ANN", "ENC", "VRF"],
                            },
                            'artisan.id': parseInt(artisan)
                        }
                    }, {
                        $group: {
                            _id: {
                                status: '$status',
                                month: {
                                    $month: '$date.intervention'
                                },
                                year: {
                                    $year: '$date.intervention'
                                },

                            },

                            total: {
                                $sum: 1
                            },

                        }
                    }])
                    .exec(function(err, resp) {
                        var monthStart = last12Months.getMonth();
                        var yearStart = last12Months.getFullYear();
                        console.log(resp)
                        var rtn = [];
                        _.times(12, function(n) {
                            var month = (monthStart + n) % 12;
                            month++
                            var year = monthStart + n > 12 ? yearStart + 1 : yearStart;
                            var res = _.filter(resp, {
                                _id: {
                                    year: year,
                                    month: month
                                }
                            })
                            if (!res.length) {
                                res = {
                                    dt: month + (year * 100),
                                    date: [_.padLeft(month, 2, '0'), year % 2000].join('/'),
                                    total: 0,
                                    status: ["ANN", "ENC", "VRF"][n % 3]
                                }
                                rtn.push(res);
                            } else {

                                _.each(res, function(e) {
                                    rtn.push({
                                        dt: month + (year * 100),
                                        date: [_.padLeft(month, 2, '0'), year % 2000].join('/'),
                                        total: e.total,
                                        status: e._id.status
                                    })
                                })
                            }
                        })
                        console.log(rtn)
                        resolve(rtn)
                    });
            })
        }
    }
}
