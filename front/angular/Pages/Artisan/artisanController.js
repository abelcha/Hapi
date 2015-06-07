angular.module('edison').controller('ArtisanController', function(tabContainer, $location, $mdSidenav, $interval, ngDialog, LxNotificationService, edisonAPI, config, $routeParams, $scope, artisan) {
  "use strict";
  $scope.config = config;
  $scope.tab = tabContainer.getCurrentTab();

  if (!$scope.tab.data) {
    if ($routeParams.id.length > 12) {
      $scope.tab.isNew = true;
      $scope.tab.setTitle('@' + moment().format("HH:mm").toString());
    } else {
      $scope.tab.setTitle('@' + $routeParams.id);
      if (!artisan) {
        alert("Impossible de trouver les informations !");
        $location.url("/dashboard");
        $scope.tabs.remove($scope.tab);
        return 0;
      }
    }
    $scope.tab.setData(artisan.data);
  }
});
