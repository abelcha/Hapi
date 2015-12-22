angular.module('edison').factory('socket', function(socketFactory, $location) {
	"use strict";
	console.log($location.protocol + $location.hostname + ':1995')
	return socketFactory({
		ioSocket: io.connect($location.protocol + $location.hostname + ':1995')
	});
});
