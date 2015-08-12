var users = requireLocal('config/_users');
var ms = require('milliseconds');
var async = require('async')
var _ = require("lodash")
var FiltersFactory = requireLocal('config/FiltersFactory');

module.exports = function(schema) {
    var statusDistinctFactory = function(model, customMatch, customGroup) {
        var match = customMatch || {};
        return function(cb) {
            db.model(model ||  'intervention')
                .aggregate()
                .match(match)
                .group({
                    _id: {
                        telepro: customGroup || '$login.ajout'
                    },
                    mnt: {
                        $sum: "$prixAnnonce"
                    },
                    total: {
                        $sum: 1
                    }
                })
                .project({
                    _id: 1,
                    name: '$_id.st',
                    login: '$_id.telepro',
                    total: 1,
                    montant: db.utils.round("$mnt")
                }).exec(cb);
        }
    }


    schema.statics.statsTelepro = function(req, res) {
        return new Promise(function(resolve, reject) {
            db.model('intervention')
                .aggregate()
                .match({
                    id: {
                        $gt: 26000
                    }
                })
                .group({
                    _id: {
                        telepro: '$login.ajout',
                        status: '$status'
                    },
                    mnt: {
                        $sum: "$prixAnnonce"
                    },
                    total: {
                        $sum: 1
                    }
                }).project({
                    _id: 1,
                    status: '$status',

                    name: '$_id.st',
                    login: '$_id.telepro',
                    total: 1,
                    montant: db.utils.round("$mnt")
                }).exec(function(err, resp) {
                    console.log(err, _.groupBy(resp, '_id.telepro'))
                    resolve('ok')
                })
        });
    }
}
