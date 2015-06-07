angular.module("edison").filter('tableFilter', function() {
    "use strict";

    var clean = function(str) {
        return _.deburr(str).toLowerCase();
    }

    var compare = function(a, b) {
        if (typeof a === "string") {
            return clean(a).includes(b);
        } else {
            return clean(String(a)).startsWith(b);
        }
    }

    return function(dataContainer, inputs) {
        var rtn = [];
        console.time('fltr')
        inputs = _.mapValues(inputs, clean);
        _.each(dataContainer, function(data) {
            if (data.id) {
                var psh = true;
                _.each(inputs, function(input, k) {
                    if (input && input.length > 0 && !compare(data[k], input)) {
                        psh = false;
                        return false
                    }
                });
                if (psh === true) {
                    rtn.push(data);
                }
            }
        })
        console.timeEnd('fltr')

        return rtn;
    }
});
