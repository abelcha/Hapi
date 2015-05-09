angular.module('edison').controller('InterventionController',
  function($scope, $location, $routeParams, ngDialog, LxNotificationService, tabContainer, edisonAPI, config, intervention) {

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
    if ($scope.tab.data.artisan)
      $scope.searchArtisans();

  });




angular.module('edison').controller('InterventionMapController', function($scope, $q, $window, $mdDialog, Address, mapAutocomplete, edisonAPI) {
  $scope.autocomplete = mapAutocomplete;
  if (!$scope.tab.data.client.address) {
    $scope.mapCenter = Address({
      lat: 46.3333,
      lng: 2.6
    });
    $scope.zoom = 6;
  } else {
    if ($scope.tab.data.artisan) {
      $scope.zoom = 12;
      $scope.tab.data.artisan.address = Address($scope.tab.data.artisan.address, true);
    }
    if ($scope.tab.data.client.address) {
      $scope.tab.data.client.address = Address($scope.tab.data.client.address, true); //true -> copyContructor
      $scope.mapCenter = $scope.tab.data.client.address;
    }
  }


  $scope.showInterMarker = function() {
    if (!$scope.mapCenter ||  !$scope.mapCenter.latLng || !$scope.tab.data.client || !$scope.tab.data.client.address ||  !$scope.tab.data.client.address.latLng) {
      return (false)
    }
    return ($scope.tab.data.client.address.latLng == $scope.mapCenter.latLng);
  }

  $scope.changeAddress = function(place) {
    mapAutocomplete.getPlaceAddress(place).then(function(addr)  {
        $scope.zoom = 12;
        $scope.mapCenter = addr;
        if (addr.streetAddress) {
          $scope.tab.data.client.address = addr;
          $scope.searchText = "";
        }
        $scope.searchArtisans();
      },
      function(err) {
        console.log(err);
      })
  }

  $scope.$watch('tab.data.sst', function(id_sst) {
    $q.all([
      edisonAPI.getArtisan(id_sst, {cache:true}),
      edisonAPI.getArtisanStats(id_sst, {cache:true})
    ]).then(function(result)  {
      $scope.tab.data.artisan = result[0].data;
      $scope.tab.data.artisan.stats = result[1].data;
    });
  })

  function DialogController($scope, $mdDialog) {
    $scope.absenceTime = 'TODAY';
    $scope.absence = [{
      title: 'Toute la journée',
      value: 'TODAY'
    }, {
      title: '1 Heure',
      value: '1'
    }, {
      title: '2 Heure',
      value: '2'
    }, {
      title: '3 Heure',
      value: '3'
    }, {
      title: '4 Heure',
      value: '4'
    }]
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {

      $mdDialog.hide(answer);
    };
  };

  $scope.openDialog = function(ev) {
    $mdDialog.show({
        controller: DialogController,
        templateUrl: '/Pages/Intervention/dialog-box.html',
        targetEvent: ev,
      })
      .then(function(time) {
        var hours = 0;
        if (time === "TODAY") {
          hours = 23 - (new Date).getHours() + 1;
        } else {
          hours = parseInt(time);
        }
        start = new Date;
        end = new Date;
        end.setHours(end.getHours() + hours)
        edisonAPI.absenceArtisan($scope.tab.data.artisan.id, {
          start: start,
          end: end
        });
      });
  };

  $scope.showMap = function() {
    $scope.loadMap = true;
  }

  $scope.loadMap = $scope.tab.isNew;

  $scope.getStaticMap = function() {
    var q = "?width=" + $window.outerWidth * 0.8;
    if ($scope.tab.data.client && $scope.tab.data.client.address && $scope.tab.data.client.address.latLng)
      q += ("&origin=" + $scope.tab.data.client.address.latLng);
    if ($scope.tab.data.artisan)
      q += ("&destination=" + $scope.tab.data.artisan.address.lt + "," + $scope.tab.data.artisan.address.lg);
    return "/api/map/staticDirections" + q;
  }
});
