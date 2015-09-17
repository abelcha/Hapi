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
                var i = 0;
                async.each(resp, function(e, cb) {
                    if (i++ % 100 === 0) {
                        console.log(Math.round(i * 100 / resp.length) + '%')
                    }
                    var conditions = {
                            _id: e.id
                        },
                        update = {
                            $set: {
                          //      sms:"lol"
                                cache: core.minify(e)
                            }
                        },
                        options = {
                            multi: true
                        };

                    core.model().update(conditions, update, options, cb);
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
