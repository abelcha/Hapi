    module.exports = function(core) {
        var _ = require('lodash');

                _.mixin({
                    debounceArgs: function(fn, timeout, options) {
                        var __dbArgs = []
                        var __dbFn = _.debounce(function() {
                            fn.call(undefined, __dbArgs);
                            __dbArgs = []
                        }, timeout, options);
                        return function() {
                            __dbArgs.push(_.values(arguments));
                            __dbFn();
                        }
                    },
                    throttleArgs: function(fn, timeout, options) {
                        var _thArgs = []
                        var _thFn = _.throttle(function() {
                            fn.call(undefined, _thArgs);
                            _thArgs = []
                        }, timeout, options);
                        return function() {
                            _thArgs.push(_.values(arguments));
                            _thFn();
                        }
                    },
                })
        
/*        if (global.workerID === 1 && core.name === 'intervention') {

            setInterval(function() {
                redis.get('cacheReload' + core.name, function(err, resp) {
                    console.log('=======', err, resp)
                })
            }, 5000)

        }
        return function(doc) {
            redis.get('cacheReload' + core.name, function(err, resp) {
              //  console.log('-->', err, resp)
                var list = JSON.parse(resp ||  "{}");
               console.log('===>', list)
                list[doc.id] = 1
                redis.set('cacheReload' + core.name, JSON.stringify(list), function(err, resp) {
                    console.log(err, resp)
                });
            });
        }*/

           return _.throttleArgs(function(docs) {

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
           })
    }
