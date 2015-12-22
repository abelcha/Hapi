angular.module('edison').factory('socket', function(socketFactory) {
    "use strict";
    return socketFactory({
    	port:1995
    });
});

