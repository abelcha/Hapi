    module.exports = function(core) {
      var _ = require('lodash');
      var __throttle_cache_name = '__throttle_cache_reloa' + core.name



      var applyCacheReload = function(ids) {
        console.log(ids);

        return edison.worker.createJob({
          name: 'db',
          model: core.name,
          priority: 'medium',
          method: 'throttleCacheReload',
          attempts: 10,
          req: ids
        }).then(function(resp) {
          io.sockets.emit(core.listChange, {
            data: resp,
            ts: _.now()
          });
          edison.statsTelepro.reload();
        })
      }

      if (!global.isWorker && global.workerID === 1) {
        setInterval(function() {
          redis.get(__throttle_cache_name, function(err, resp) {
            if (!err && resp) {
              var list = JSON.parse(resp);
              console.log(core.NAME + 'PUSH =======>>', list)
              redis.del(__throttle_cache_name, function() {
                console.log(Object.keys(list))
                return applyCacheReload(Object.keys(list).map(_.parseInt))
              })
            }
          })
        }, 1500)
      }

      return function(doc) {
        redis.get(__throttle_cache_name, function(err, resp) {
          var list = JSON.parse(resp ||  "{}");
          list[doc.id] = list[doc.id] ? list[doc.id] + 1 : 1;
          redis.setex(__throttle_cache_name, 10, JSON.stringify(list), function(err, resp) {
            console.log(err, resp)
          });
        });
      }

      /*  return _.throttleArgs(function(docs) {

            if (!isWorker) {
                console.time('throttleCacheReload')
                return edison.worker.createJob({
                    name: 'db',
                    model: core.name,
                    priority: 'medium',
                    method: 'throttleCacheReload',
                    attempts: 10,
                    req: _(docs).flatten().map('id').uniq().value()
                }).then(function(resp) {
                    io.sockets.emit(core.listChange, {
                        data: resp,
                        ts: _.now()
                    });
                    edison.statsTelepro.reload();
                })
            }

        }, 5000, {
            leading: true
        })*/
    }
