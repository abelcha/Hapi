angular.module('edison').controller('InterventionController', function(tabContainer, $location, $mdSidenav, $interval, ngDialog, LxNotificationService, edisonAPI, config, $routeParams, $scope, windowDimensions, interventions, artisans) {
  $scope.windowDimensions = windowDimensions;
  $scope.config = config;
  $scope.tab = tabContainer.getCurrentTab();
  $scope.artisans = artisans.data.sort(function(a, b) {
    return a.nomSociete > b.id;
  });
  var id = parseInt($routeParams.id);

  if (!$scope.tab.data) {
    if ($routeParams.id.length > 12) {
      $scope.tab.isNew = true;
      $scope.tab.setTitle('#' + moment().format("HH:mm").toString());
      $scope.tab.setData({
        client: {},
        reglementSurPlace: true,
        date: {
          ajout: Date.now(),
          intervention: Date.now()
        }
      });
    } else {
      $scope.tab.setTitle('#' + $routeParams.id);
      var inter = interventions.data.find(function(e) {
        return e.id === id
      });
      if (!inter) {
        alert("Impossible de trouver les informations !");
        $location.url("/dashboard");
        $scope.tabs.remove($scope.tab);
        return 0;
      }
      inter.sst = inter.artisan ? inter.artisan.id : 0;
      if (inter.sst > 0) {
        inter.artisan = artisans.data.find(function(e) {
          return e.id === inter.sst;
        });
      }
      $scope.tab.setData(inter);
    }
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




angular.module('edison').controller('InterventionMapController', function($scope, $window, $mdDialog, Address, mapAutocomplete, edisonAPI) {
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
      $scope.tab.data.artisan.add = Address($scope.tab.data.artisan.add, true);
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
    $scope.tab.data.artisan = $scope.artisans.find(function(e) {
      return e.id === id_sst;
    });
    console.log(id_sst)
    if (id_sst && id_sst !== 0) {
      edisonAPI.getArtisanStats(id_sst).success(function(stats) {
        $scope.tab.data.artisan.stats = stats
      })
    }
  })

  function DialogController($scope, $mdDialog) {
    $scope.absenceTime = 'TODAY';
    $scope.absence = [{
      title: 'Toute la journée',
      value: 'TODAY'
    }, {
      title: '1 Heure',
      value: '1H'
    }, {
      title: '2 Heure',
      value: '2H'
    }, {
      title: '3 Heure',
      value: '3H'
    }, {
      title: '4 Heure',
      value: '4H'
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
         edisonAPI.absenceArtisan($scope.tab.data.artisan.id, time);
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
      q += ("&destination=" + $scope.tab.data.artisan.add.lt + "," + $scope.tab.data.artisan.add.lg);
    return "/api/map/staticDirections" + q;
  }
});
