angular.module('edison').filter('reverse', function() {
    "use strict";
    return function(items) {
        if (!items)
            return [];
        return items.slice().reverse();
    };
});
