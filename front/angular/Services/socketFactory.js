angular.module('edison').factory('socket', function(socketFactory) {
	"use strict";
	return socketFactory({
		ioSocket: io.connect('http://edison.services:1995')
	});
});
