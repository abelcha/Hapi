angular.module('edison').controller('ArtisanController', function(tabContainer, $location, $mdSidenav, $interval, ngDialog, LxNotificationService, edisonAPI, config, $routeParams, $scope, windowDimensions, interventions, artisans) {
  $scope.tab = tabContainer.getCurrentTab();
  var id = parseInt($routeParams.id);
  if (!$scope.tab.data) {
    if ($routeParams.id.length > 12) {
      $scope.tab.isNew = true;
      $scope.tab.setTitle('@' + moment().format("HH:mm").toString());
      $scope.tab.setData({
    	telephone: {},
    	pourcentage:{},
    	add:{},
    	representant:{},

      });
    } else {
      var sst = artisans.data.find(function(e) {
        return e.id === id
      });
      $scope.tab.setTitle('@' + sst.nomSociete.substr(0, 10));
      if (!sst) {
        alert("Impossible de trouver les informations !");
        $location.url("/dashboard");
        $scope.tabs.remove($scope.tab);
        return 0;
      }
      $scope.tab.setData(sst);
    }
  }

});
