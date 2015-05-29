angular.module('edison').controller('InterventionMapController', function($scope, $q, $interval, $window, Address, dialog, mapAutocomplete, edisonAPI) {
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
            //$scope.tab.data.artisan.address = Address($scope.tab.data.artisan.address, true);
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


    $scope.changeAddress = function(place, searchText) {
        mapAutocomplete.getPlaceAddress(place).then(function(addr)  {
                $scope.zoom = 12;
                $scope.mapCenter = addr;
                $scope.tab.data.client.address = addr;
                $scope.searchArtisans();
            },
            function(err) {
                console.log(err);
            })
    }

    $scope.$watch('tab.data.sst', function(id_sst) {
        console.log("==>", id_sst)
        if (id_sst) {
            $q.all([
                edisonAPI.artisan.get(id_sst, {
                    cache: true
                }),
                edisonAPI.getArtisanStats(id_sst, {
                    cache: true
                }),
                edisonAPI.getCalls($scope.tab.data.id || $scope.tab.data.tmpID, id_sst),
                edisonAPI.getSms($scope.tab.data.id || $scope.tab.data.tmpID, id_sst)
            ]).then(function(result)  {
                $scope.tab.data.artisan = result[0].data;
                $scope.tab.data.artisan.stats = result[1].data;
                $scope.tab.data.artisan.calls = result[2].data;
                if (result[0].data.address) {
                    edisonAPI.getDistance({
                            origin: result[0].data.address.lt + ", " + result[0].data.address.lg,
                            destination: $scope.tab.data.client.address.lt + ", " + $scope.tab.data.client.address.lg
                        })
                        .then(function(result) {
                            $scope.tab.data.artisan.stats.direction = result.data;
                        })
                }
            });
        }
    })

    $scope.dialog = dialog;

    $scope.sstAbsence = function(id) {
        if (id)
            dialog.absence.open(id, function() {
                $scope.searchArtisans();
            })
    }

    $scope.showMap = function() {
        $scope.loadMap = true;
    }

    $scope.loadMap = $scope.tab.isNew;

    $scope.getStaticMap = function() {
        var q = "?width=" + $window.outerWidth * 0.8;
        if ($scope.tab.data.client && $scope.tab.data.client.address && $scope.tab.data.client.address.latLng)
            q += ("&origin=" + $scope.tab.data.client.address.latLng);
        if ($scope.tab.data.artisan && $scope.tab.data.artisan.id)
            q += ("&destination=" + $scope.tab.data.artisan.address.lt + "," + $scope.tab.data.artisan.address.lg);
        return "/api/map/staticDirections" + q;
    }
});
