 angular.module('edison').filter('frnbr', function() {
 	"use strict";
 	return function(num) {
 		var n = _.round((num || 0), 2).toString(),
 			p = n.indexOf('.');
 		return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, function($0, i) {
 			return (p < 0 || i < p ? ($0 + ' ') : $0).replace('.', ',');
 		});
 	};
 });
