module.exports = function(core) {
    return function(res, req) {
        return new Promise(function(resolve, reject) {
            console.time('reloadFilters');
            core.model().reloadFilters(function(err) {
                if (err)
                    reject(err);
                console.timeEnd('reloadFilters');
                console.time('cacheListReload')
                core.model().cacheListReload().then(function() {
                    console.timeEnd('cacheListReload')
                    console.time('teleproStats');
                    edison.statsTelepro.reload().then(function() {
                        console.timeEnd('teleproStats');
                        resolve('ok')
                    }, reject)
                }, reject)
            })
        })
    }
}
