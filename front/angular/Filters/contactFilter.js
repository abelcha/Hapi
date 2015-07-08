angular.module("edison").filter('contactFilter', ['config', function(config) {
    "use strict";

    var clean = function(str) {
        return _.deburr(str).toLowerCase();
    }

    var compare = function(a, b, strictMode) {
        if (typeof a === "string") {
            return clean(a).includes(b);
        } else if (!strictMode) {
            return clean(String(a)).startsWith(b);
        } else {
            return a === parseInt(b);
        }
    }
    return function(dataContainer, input) {
        var rtn = [];
        input = clean(input);
        _.each(dataContainer, function(data) {
            if (!data.stringify)
                data.stringify = clean(JSON.stringify(data))
            if (!input || data.stringify.indexOf(input) >= 0) {
                rtn.push(data);
            } else {
            }
        })
        return rtn;
    }
}]);
