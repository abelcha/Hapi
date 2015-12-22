angular.module('edison').factory('socket', function(socketFactory) {
	"use strict";
	return socketFactory({
		ioSocket: io.connect('http://localhost:1995')
	});
});
