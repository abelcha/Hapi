module.exports = function(schema) {
    schema.statics.extendedStats = {
        unique: true,
        findBefore: false,
        method: "GET",
        fn: function(artisan, res, req) {
            var moment = require('moment');
            var _ = require('lodash');
            return new Promise(function(resolve, reject) {
                var last12Months = new Date('Tue Jul 01 2014 15:38:35 GMT+0200 (CEST)')
                db.model('intervention').aggregate([{
                        $match: {
                            'date.ajout': {
                                $gte: last12Months,
                            },
                            'artisan.id': artisan.id
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

                        var rtn = [];
                        console.log(resp);
                        return resolve("ok")
                        _.times(12, function(n) {
                            var month = (monthStart + n) % 12;
                            month++
                            var year = monthStart + n > 12 ? yearStart + 1 : yearStart;
                            console.log(n, month, year)
                            var res = _.filter(resp, {
                                _id: {
                                    year: year,
                                    month: month
                                }
                            })
                            if (!res.length) {
                            	console.log("nolength")
                                res = {
                                    date: [_.padLeft(month, 2, '0'), year].join('/'),

                                        status: 'ANN'
                                }
                                rtn.push(res);
                            } else {

                                _.each(res, function(e) {
                                	console.log(e);
                                    rtn.push({
                                        date: [_.padLeft(month, 2, '0'), year].join('/'),
                                        total: e.total,
                                        status: e._id.status
                                    })
                                })
                            }
                        })
                        console.log(rtn)
                            /*console.log(resp);
                                                	var rtn = _.groupBy(resp, function(n) {
                                                		return _.padLeft(n._id.month, 2, '0') + '/' + n._id.year
                                                	})
                                                    	console.log(rtn);*/
                            /*                     _.each(resp, function(e) {
                                                     if (e._id.year >= 2012) {
                                                         rtn.push({
                                                         	month:e._id.month,
                                                         	year:e._id.year,
                                                             date: e._id.month + "/" + e._id.year,
                                                             total: e.total
                                                         })
                                                     }
                                                 })
                                                 console.log(rtn);*/
                            /*rtn = _.sortBy(rtn, function(a, b) {
                      		return (a.year * 100) + a.month
                      	})*/
                        resolve(resp)
                    });
            })
        }
    }
}
