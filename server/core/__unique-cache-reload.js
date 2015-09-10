    module.exports = function(core) {
        var async = require('async');
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



        return _.throttleArgs(function(docs) {

            if (!isWorker) {
                return edison.worker.createJob({
                    name: 'db',
                    model: core.name,
                    method: 'throttleCacheReload',
                    req: docs
                }).then(function(resp) {
                    io.sockets.emit(core.listChange, {
                        data: resp[0],
                        ts: _.now()
                    });
                    io.sockets.emit('filterStatsReload', resp[1]);
                    Promise.resolve('ok')
                }, Promise.reject.bind(Promise))
            }

        }, 3000, {
            leading: true
        })
    }
