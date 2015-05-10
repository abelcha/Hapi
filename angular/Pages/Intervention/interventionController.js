angular.module('edison').controller('InterventionController',
  function($scope, $location, $routeParams, ngDialog, LxNotificationService, tabContainer, edisonAPI, config, intervention, artisans) {
    $scope.artisans = artisans.data;
    $scope.config = config;
    $scope.tab = tabContainer.getCurrentTab();
    var id = parseInt($routeParams.id);

    if (!$scope.tab.data) {
      if ($routeParams.id.length > 12) {
        $scope.tab.isNew = true;
        $scope.tab.setTitle('#' + moment().format("HH:mm").toString());
      } else {
        $scope.tab.setTitle('#' + $routeParams.id);
        if (!intervention) {
          alert("Impossible de trouver les informations !");
          $location.url("/dashboard");
          $scope.tabs.remove($scope.tab);
          return 0;
        }
      }
      $scope.tab.setData(intervention.data);
      $scope.tab.data.sst = intervention.data.artisan ? intervention.data.artisan.id : 0;
    }
    $scope.showMap = false;

    $scope.saveInter = function(send, cancel) {
      edisonAPI.saveIntervention({
        send: send,
        cancel: cancel,
        data: $scope.tab.data
      }).then(function(data) {
        LxNotificationService.success("L'intervention " + data.data + " à été enregistré");
        $location.url("/interventions");
        $scope.tabs.remove($scope.tab);
      }).catch(function(response) {
        LxNotificationService.error(response.data);
      });
    }

    $scope.clickOnArtisanMarker = function(event, sst) {
      $scope.tab.data.sst = sst.id;
    }

    $scope.searchArtisans = function() {
      edisonAPI.getNearestArtisans($scope.tab.data.client.address, $scope.tab.data.categorie)
        .success(function(result) {
          $scope.nearestArtisans = result;
        });
    }
    if ($scope.tab.data.client.address)
      $scope.searchArtisans();

  });



