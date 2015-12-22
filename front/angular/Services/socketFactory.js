angular.module('edison').factory('socket', function(socketFactory) {
	"use strict";
	return socketFactory({
		ioSocket: io.connect('127.0.0.1:1995')
	});
});
