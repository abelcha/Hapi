angular.module('edison').factory('Map', function() {
    "use strict";

    var Map = function() {
        this.display = false;
    }

    Map.prototype.setCenter = function(address) {
        this.center = address;
    }

    Map.prototype.setZoom = function(value) {
        this.zoom = value
    }
    Map.prototype.show = function() {
        this.display = true;
    }
    return Map;
});
