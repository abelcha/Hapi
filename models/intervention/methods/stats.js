module.exports = function(schema) {

    schema.statics.stats = function(req, res) {
        return new Promise(function(resolve, reject) {
            var today = new Date().strtotime('last day')
            today.setHours(0);
            db.model('intervention').aggregate([{
                $match: {
                    'date.ajout': {
                        $gt: today
                    }
                }
            }, {
                $group: {
                    _id: {
                        tele: '$login.ajout',
                        st: '$status'
                            // week: '$date.intervention'
                    },
                    mnt: {
                        $sum: "$prixAnnonce"
                    },
                    total: {
                        $sum: 1
                    }
                }
            }, {
                $project: {
                    _id: 1,
                    total: 1,
                    montant: {
                        $divide: [{
                                $subtract: [{
                                    $multiply: ['$mnt', 100]
                                }, {
                                    $mod: [{
                                        $multiply: ['$mnt', 100]
                                    }, 1]
                                }]
                            },
                            100
                        ]
                    }
                }
            }]).exec(function(err, docs) {
                var rtn = {};
                var rtnArr = [];
                docs.forEach(function(doc) {
                    if (!rtn[doc._id.tele]) {

                        rtn[doc._id.tele] = {
                            login: doc._id.tele
                        };
                        rtn[doc._id.tele]['ALL'] = {
                            total: 0,
                            montant: 0
                        }
                    }
                    rtn[doc._id.tele][doc._id.st] = {
                        total: doc.total,
                        montant: doc.montant
                    }
                    rtn[doc._id.tele]['ALL'].montant += doc.montant;
                    rtn[doc._id.tele]['ALL'].total += doc.total;
                    rtn[doc._id.tele]['ALL'].montant = Math.round(rtn[doc._id.tele]['ALL'].montant * 100) / 100;

                })
                var rtnArr = _.sortByOrder(rtn, 'ALL.total').reverse()
                resolve(rtnArr);
            })
        });
    }
}
