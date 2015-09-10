var _ = require('lodash');




var glb = [];


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

var x = _.throttleArgs(function(a) {
    console.log('==>', a);
}, 2000)


var lol = function() {
    setTimeout(function() {
        x(_.random(0, 1000), _.random(0, 1000), _.random(0, 1000))
        lol()
    }, _.random(0, 1500))
}
lol()
