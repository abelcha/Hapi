angular.module('edison').controller('DashboardController', function(tabContainer, $scope) {
    "use strict";
    $scope.tab = tabContainer.getCurrentTab();
    $scope.tab.setTitle('dashBoard')
});
