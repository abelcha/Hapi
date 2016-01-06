module.exports = {
    find: function(model, query, options, cb) {
        var _ = require('lodash')
        var async = require('async')
        var chunk = options.chunk || 100
        var i = 0;
        var select = _.size(select) ? select :  undefined;
        db.model(model).findOne({}, {}).sort("-_id")
            .exec(function(_err, latest) {
                var len = latest._id + 10;
                var slice = parseInt((len / chunk) + 1)
                var getQuery = _.map(new Array(chunk), function(e, k) {
                    var q = _.merge({
                        id: {
                            $gt: k * slice,
                            $lt: (k + 1) * slice
                        }
                    }, query)
                    console.time(q.id.$gt)
                    return function(callback) {
                        db.model(model).find(q, function(err, resp) {
                            console.timeEnd(q.id.$gt)
                            console.log(++i, '/', chunk)
                            callback(err, resp)
                        })

                    }
                })
                async.parallel(getQuery, function(err, resp) {
                    cb(err, _.flatten(resp));
                })
            })
    }
}
if (!global.db) {
    require('./server/shared.js')()
}
module.exports.find('intervention', {
        // reglementSurPlace: false,
        //newOs: true
    }, {
        chunk: 100,
        select: {}
    },
    function(err, resp) {
        console.log()
        console.log('ok', err, resp && resp.length)
        process.exit()
    })
