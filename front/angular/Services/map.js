angular.module('edison').factory('Map', function() {
    "use strict";

    var Map = function() {
        this.display = false;
    }

    Map.prototype.setCenter = function(address) {
        var myLatLng = new google.maps.LatLng(address.lt, address.lg);
        this.center = address;
        if (window.map)
            window.map.setCenter(myLatLng)
    }

    Map.prototype.setZoom = function(value) {
         if (window.map)
            window.map.setZoom(value)
        this.zoom = value
    }
    Map.prototype.show = function() {
        this.display = true;
    }
    return Map;
});
