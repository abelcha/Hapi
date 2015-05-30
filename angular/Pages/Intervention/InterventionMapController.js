var Map = function() {
    this.show = false;
}

Map.prototype.setCenter = function(address) {
    this.center = address;
}

Map.prototype.setZoom = function(value) {
    this.zoom = value
}
Map.prototype.show = function() {
    this.show = true;
}


var InterMapCtrl = function($scope, $window, Address, dialog, mapAutocomplete) {
    var _this = this;
    var parent = $scope.$parent.vm;
    _this.data = $scope.$parent.vm.data

    _this.map = new Map;
    _this.map.setZoom(_this.data.client.address ? 12 : 6)

    if (parent.isNew)
        _this.map.show();
    _this.autocomplete = mapAutocomplete;
    
    if (_this.data.client.address) {
        _this.data.client.address = Address(_this.data.client.address, true); //true -> copyContructor
        _this.map.setCenter(_this.data.client.address);
    } else {
        _this.map.setCenter({
            lat: 46.3333,
            lng: 2.6
        });
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
