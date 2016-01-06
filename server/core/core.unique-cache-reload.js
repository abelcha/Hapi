    module.exports = function(core) {
      var _ = require('lodash');
      var __throttle_cache_name = '__throttle_cache_reload' + core.name

      return function(doc) {
        core.model().throttleCacheReload([doc._id]).then(function(resp) {
          console.log('HERE')
          io.sockets.emit(core.listChange, {
            data: resp,
            ts: _.now()
          });
          edison.statsTelepro.reload();
        })
      }

      // var applyCacheReload = function(ids) {
      //   console.log('')
      //   return edison.worker.createJob({
      //     name: 'db',
      //     model: core.name,
      //     priority: 'medium',
      //     method: 'throttleCacheReload',
      //     req: ids
      //   }).then(function(resp) {
      //     io.sockets.emit(core.listChange, {
      //       data: resp,
      //       ts: _.now()
      //     });
      //     edison.statsTelepro.reload();
      //   })
      // }

      // if (!global.isWorker && global.workerID === 1) {
      //   setInterval(function() {
      //     redis.get(__throttle_cache_name, function(err, resp) {
      //       if (!err && resp) {
      //         var list = JSON.parse(resp);
      //         redis.del(__throttle_cache_name, function() {
      //           return applyCacheReload(Object.keys(list).map(_.parseInt))
      //         })
      //       }
      //     })
      //   }, 100)
      // }

      // return function(doc) {
      //   redis.get(__throttle_cache_name, function(err, resp) {
      //     var list = JSON.parse(resp ||  "{}");
      //     list[doc.id] = list[doc.id] ? list[doc.id] + 1 : 1;
      //     redis.setex(__throttle_cache_name, 10, JSON.stringify(list), function(err, resp) {
      //       console.log(err, resp)
      //     });
      //   });
      // }
    }
