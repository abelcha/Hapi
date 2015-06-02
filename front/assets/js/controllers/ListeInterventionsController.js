angular.module('edison').controller('InterventionsController', function($scope, $rootScope, ngTableParams, interventions){


	var initTable = function() {
		var tableParameters = {
	 		page: 1,            // show first page
	 		total:interventions.data.length,
	        filter: {},
	        count: 100          // count per page
		};
		var tableSettings = {
				//groupBy:$rootScope.config.selectedGrouping,
				total:interventions.data,
	            getData: function($defer, params) {
	            	var data = interventions.data;
	            	params.total(interventions.data.length);
	           		$defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
/*		            var filteredData = interventions;
		            var orderedData = $filter('filter')(filteredData, params.filter());
		            params.total(orderedData.length);              
		            orderedData = $filter('orderBy')( orderedData, params.orderBy())
		            $defer.resolve( orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));*/
            	},
            	filterDelay:100
		}

       $rootScope.tableParams = new ngTableParams(tableParameters, tableSettings);
	};
	initTable();
});