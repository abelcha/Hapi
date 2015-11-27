var _ = require('lodash')
var async = require('async')
module.exports = function(core) {
    return function(req, res) {

        if (!isWorker) {
            return edison.worker.createJob({
                name: 'db',
                model: core.name,
                method: 'iterator',
                req: _.pick(req, 'query', 'session')
            })
        }
        return new Promise(function(resolve, reject) {
            try {
                var q = JSON.parse(req.query.q);
            } catch (e) {
                var q = {}
            }
            console.log('-->', q)
            core.model().find(q, {}).populate('sst').then(function(resp) {
                var i = 0;
                async.eachLimit(resp, 10, function(e, cb) {
                        try {
                            if (i++ % 100 === 0) {
                                console.log(Math.round(i * 100 / resp.length) + '%')
                            }
                            var conditions = {
                                    _id: e.id
                                },
                                update = {
                                    $set: {
                                        'artisan.subStatus': (e && e.sst && e.sst.subStatus),
                                        cache: core.minify(e)
                                    }
                                },
                                options = {
                                    multi: true
                                };

                            core.model().update(conditions, update, options, cb);
                            e = null;
                            conditions = null;
                            updates = null
                        } catch (e) {
                            __catch(e)
                        }
                    },
                    function(err) {
                        if (err) {
                            return reject(err);
                        }
                        resolve('ok')
                    })
            }, reject)
        })
    }
}
