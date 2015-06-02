angular.module('edison').controller('statsController', function($scope) {

    console.log("hey")
  $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
  $scope.data = [300, 500, 100];
});
