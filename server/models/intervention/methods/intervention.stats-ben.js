module.exports = function(schema) {
    var moment = require('moment')
    var _ = require('lodash')
    schema.statics.statsBen = function(req, res) {

        return new Promise(function(resolve, reject) {
            var q = {};
            var options = {};


            //date

            if (req.query.group === 'day') {
                options.divider = 'jours'
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
                options.divider = 'mois'
                options.dateRange = {
                    $gte: new Date(req.query.year, 0, 1),
                    $lt: new Date(req.query.year + 1, 0, 1)
                }
                options.groupId = {
                    $month: "$date.ajout"
                }
                options.maxRange = 13

            } else if (req.query.group == 'week') {
                options.divider = 'semaine'
                options.dateRange = {
                    $gte: new Date(req.query.year, 0, 1),
                    $lt: new Date(req.query.year + 1, 0, 1)
                }
                options.groupId = {
                    $week: "$date.ajout"
                }
                options.maxRange = 53
            }




            options.match = {
                'status': {
                    $in: ['ENC', 'VRF']
                }
            }


            //divider

            var divider = {
                chiffre: {
                    post: function(resp) {
                        return {
                            title: req.query.model + ' / ' + options.divider,
                            series: [{
                                name: 'potentiel',
                                data: db.utils.pluck(resp, 'potentiel', options.maxRange),
                                color: "#26C6DA"
                            }, {
                                name: 'recu',
                                data: db.utils.pluck(resp, 'recu', options.maxRange),
                                color: "#4CAF50"
                            }],
                            categories: _.map(_.range(1, options.maxRange), String)
                        }
                    },
                    project: function() {
                        return {
                            _id: options.groupId,
                            recu: db.utils.sumCond('$compta.reglement.recu', true, db.utils.prix()),
                            potentiel: db.utils.sumCond('$compta.reglement.recu', false, db.utils.prix()),
                        }
                    }
                },
                categorie: {
                    post: function(resp) {
                        var categories = requireLocal('config/dataList').categories;
                        var series = _.map(categories, function(e) {
                            e.name = e.short_name;
                            e.data = db.utils.pluck(resp, e.name, options.maxRange)
                            e.color = e.color_hex;
                            return _.pick(e, 'name', 'color', 'data');
                        })

                        return {
                            title: req.query.model + ' / ' + options.divider,
                            series: series,
                            categories: _.map(_.range(1, options.maxRange), String)
                        }
                    },
                    project: function() {
                        var categories = requireLocal('config/dataList').categories;
                        var rtn = {
                            _id: options.groupId,
                        }
                        _.each(categories, function(e) {
                            rtn[e.short_name] = db.utils.sumCond('$categorie', e.short_name, db.utils.prix())
                        })
                        return rtn;
                    }
                },
                telepro: {
                    post: function(resp) {
                        //                  console.log(resp)
                        var telepro = edison.users.service('INTERVENTION');
                        var series = _.map(telepro, function(e) {
                            return {
                                name: e,
                                data: db.utils.pluck(resp, e, options.maxRange)
                            }
                        })
                        return {
                            title: req.query.model + ' / ' + options.divider,
                            series: series,
                            categories: _.map(_.range(1, options.maxRange), String)
                        }
                    },
                    project: function() {
                        var telepro = edison.users.service('INTERVENTION');
                        var rtn = {
                            _id: options.groupId,
                        }
                        _.each(telepro, function(e) {
                                rtn[e] = db.utils.sumCond('$login.ajout', e, db.utils.prix())
                            })
                        return rtn;
                    }
                },


            }



            options.match['date.ajout'] = options.dateRange
            db.model('intervention').aggregate()
                .match(options.match)
                .group(divider[req.query.divider].project())
                .exec(function(err, resp) {
                    var rtn = divider[req.query.divider].post(resp);
                    resolve(rtn);
                })
        })
    }






}
