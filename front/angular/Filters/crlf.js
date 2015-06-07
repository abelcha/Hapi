angular.module('edison').filter('crlf', function() {
	"use strict";
    return function(text) {
        return text.split(/\n/g).join('<br>');
    };
});
