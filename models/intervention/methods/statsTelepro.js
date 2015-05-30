module.exports = function(schema) {

    schema.statics.statsTelepro = function(req, res) {
        return new Promise(function(resolve, reject) {
            resolve("ok");
            var lastMonday = new Date().strtotime("last monday");
            db.model('intervention').aggregate([{
                $match: {
                    'date.ajout': {
                        $gt: lastMonday
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
                docs.forEach(function(doc) {
                  console.log("-->", doc)
                })
            })
        });
    }
}
