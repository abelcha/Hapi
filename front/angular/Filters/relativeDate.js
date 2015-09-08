angular.module('edison').filter('relativeDate', function() {
    "use strict";
    return function(date, no) {
    	var d = moment((date + 1370000000) * 1000); 
    	var l = moment().subtract(4, 'days');
       	if (d < l) {
       		return d.format('DD/MM/YY')
       	} else {
       		return d.fromNow(no).toString()
       	}
       // return moment((date + 1370000000) * 1000).fromNow(no).toString()
    };
});
