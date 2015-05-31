/*
var InterMapCtrl = function($scope, $q, $window, Address, dialog, edisonAPI, mapAutocomplete) {
    var _this = this;
    var parent = $scope.$parent.vm;
    _this.data = parent.data
    _this.nearestArtisans = parent.nearestArtisans;
    _this.map = new Map;
    _this.map.setZoom(_this.data.client.address ? 12 : 6)

    if (parent.isNew) {
        _this.map.show();
    }
    _this.autocomplete = mapAutocomplete;

    if (_this.data.client.address) {
        _this.data.client.address = Address(_this.data.client.address, true); //true -> copyContructor
        _this.map.setCenter(_this.data.client.address);
    } else {
        _this.map.setCenter(Address({
            lat: 46.3333,
            lng: 2.6
        }));
    }

    _this.showInterMarker = function() {
        return _this.data.client.address && _this.data.client.address.latLng;
    }

    _this.changeAddress = function(place, searchText) {
        mapAutocomplete.getPlaceAddress(place).then(function(addr)  {
                _this.map.zoom = 12;
                _this.map.center = addr;
                _this.data.client.address = addr;
                parent.searchArtisans();
            },
            function(err) {
                console.log(err);
            })
    }


    $scope.$watch(function() {
        return _this.data.sst;
    }, function(id_sst) {
        if (id_sst) {
            $q.all([
                edisonAPI.artisan.get(id_sst, {
                    cache: true
                }),
                edisonAPI.artisan.getStats(id_sst, {
                    cache: true
                }),
                edisonAPI.call.get(_this.data.id || _this.data.tmpID, id_sst),
                edisonAPI.sms.get(_this.data.id || _this.data.tmpID, id_sst)
            ]).then(function(result)  {
                _this.data.artisan = result[0].data;
                _this.data.artisan.stats = result[1].data;
                _this.data.artisan.calls = result[2].data;
                _this.data.artisan.sms = result[3].data;
                if (result[0].data.address) {
                    edisonAPI.getDistance({
                            origin: result[0].data.address.lt + ", " + result[0].data.address.lg,
                            destination: _this.data.client.address.lt + ", " + _this.data.client.address.lg
                        })
                        .then(function(result) {
                            _this.data.artisan.stats.direction = result.data;
                        })
                }
            });
        }
    })


    $scope.sstAbsence = function(id) {
        if (id)
            dialog.absence.open(id, function() {
                parent.searchArtisans();
            })
    }


    $scope.getStaticMap = function() {
        var q = "?width=" + $window.outerWidth * 0.8;
        if (_this.data.client && _this.data.client.address && _this.data.client.address.latLng)
            q += ("&origin=" + _this.data.client.address.latLng);
        if (_this.data.artisan && _this.data.artisan.id)
            q += ("&destination=" + _this.data.artisan.address.lt + "," + _this.data.artisan.address.lg);
        return "/api/map/staticDirections" + q;
    }
}

angular.module('edison').controller('InterventionMapController', InterMapCtrl);
*/