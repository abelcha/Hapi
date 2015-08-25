var _ = require('lodash')
var async = require('async')
module.exports = function(core) {
    return function(req, res) {

        if (!isWorker) {
            return edison.worker.createJob({
                name: 'db',
                model: core.name,
                method: 'iterator',
                req: _.pick(req, 'body', 'session')
            })
        }
        return new Promise(function(resolve, reject) {
            core.model().find({}, {}).then(function(resp) {
                async.each(resp, function(e, cb) {
                    e.save(function(err) {
                        console.log(e.id);
                        cb(null)
                    })
                }, function(err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve('ok')
                })
            }, reject).catch(__catch);
        })
    }
}
