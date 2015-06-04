function lol(callback) {

	window.setTimeout(function() {
		callback();
	}, 2000)
}

angular.module('edison').factory('WaitInit', ['$timeout', 'api', function ($timeout, api) {
lol(function() {
return $timeout(function(){}, 100);
	
})
/*	api.getInterventions().then(function(data) {
		console.log(data);
        $rootScope.interventions = data;
        return $timeout(function(){}, 100);
    });*/
}]);