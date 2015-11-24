module.exports = function(core) {
    return function(res, req) {
        var _ = require('lodash')
        console.time('reloadFilters');
        if (!isWorker) {
            return edison.worker.createJob({
                name: 'db',
                model: core.name,
                method: 'fullReload',
                req: _.pick(req, 'query', 'session')
            })
        }
        return new Promise(function(resolve, reject) {
            core.model().reloadFilters(function(err) {
                if (err)
                    reject(err);
                core.model().cacheListReload().then(function() {
                    edison.statsTelepro.reload().then(function() {
                        resolve('ok')
                    }, reject)
                }, reject)
            })
        })
    }
}
