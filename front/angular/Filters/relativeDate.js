angular.module('edison').filter('relativeDate', function() {
    "use strict";
    return function(date, no) {
        return moment((date * 1000) + 1370000000).fromNow(no).toString()
    };
});
