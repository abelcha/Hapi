angular.module('edison').filter('reverse', function() {
  return function(items) {
  	if (!items)
  		return [];
    return items.slice().reverse();
  };
});