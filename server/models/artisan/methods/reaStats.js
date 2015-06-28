module.exports = function(schema) {
    schema.statics.reaStats = function(res, req) {
        var _ = require('lodash');
        var FiltersFactory = requireLocal('config/FiltersFactory');
        var fltr = FiltersFactory('intervention').getFilterByName('i_sarl')

        return new Promise(function(resolve, reject) {
            db.model('intervention').aggregate([{
                    $match: fltr.match()
                }, {
                    $group: {
                        _id: {
                            id: '$artisan.id'
                        },
                        mnt: {
                            $sum: "$prixAnnonce"
                        },
                        total: {
                            $sum: 1
                        },

                    }
                }])
                .exec(function(err, resp) {
                    var rtn = {};
                    _.each(resp, function(e) {
                        rtn[e._id.id] = {
                            id: e._id.id,
                            total: e.total,
                            montant: Math.round(e.mnt)
                        }
                    })
                    resolve(rtn);
                });
        })
    }
}
