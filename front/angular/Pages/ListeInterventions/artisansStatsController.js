angular.module('edison').controller('statsController', function($scope) {
    "use strict";
    $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
    $scope.data = [300, 500, 100];
});
