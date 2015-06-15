angular.module('edison').filter('relativeDate', function() {
    "use strict";
    return function(date, no) {
        return moment(date).fromNow(no).toString()
    };
});
