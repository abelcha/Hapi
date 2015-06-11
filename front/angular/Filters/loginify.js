angular.module('edison').filter('loginify', function() {
    "use strict";
    return function(obj) {
        if (!obj)
            return "";
        return obj.slice(0, 1).toUpperCase() + obj.slice(1, -2)
    };
});
