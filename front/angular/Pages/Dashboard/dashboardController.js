angular.module('edison').controller('DashboardController', function(tabContainer, $location, $scope, $rootScope, interventions, artisans){

	$scope.tab = tabContainer.getCurrentTab();
	$scope.tab.setTitle('dashBoard')
});