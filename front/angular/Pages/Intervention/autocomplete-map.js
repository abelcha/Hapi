 angular.module('edison').directive('edisonMap', ['$window', 'Map', 'mapAutocomplete', 'Address',
     function($window, Map, mapAutocomplete, Address) {
         "use strict";
         return {
             replace: true,
             restrict: 'E',
             templateUrl: '/Templates/autocomplete-map.html',
             scope: {
                 data: "=",
                 height: "@",
                 xmarkers: "=",
                 addressChange: '&',
                 isNew: "="
             },
             link: function(scope, element, attrs) {
                 scope._height = scope.height || 315;
                 scope.map = new Map();
                 scope.map.setZoom(_.get(scope, 'data.client.address') ? 12 : 6)
                 if (scope.isNew) {
                     scope.map.show()
                 }
                 scope.autocomplete = mapAutocomplete;

                 scope.mapShow = function() {
                     scope.mapDisplay = true
                 }

                 if (_.get(scope, 'data.client.address')) {
                     scope.data.client.address = Address(scope.data.client.address, true); //true -> copyContructor
                     scope.map.setCenter(scope.data.client.address);
                 } else {
                     scope.map.setCenter(Address({
                         lat: 46.3333,
                         lng: 2.6
                     }));
                 }

                 scope.changeAddress = function(place) {
                     mapAutocomplete.getPlaceAddress(place).then(function(addr) {
                         scope.map.setZoom(12);
                         scope.map.setCenter(addr)
                         scope.data.client.address = addr;
                         scope.addressChange({
                             test: 123
                         });
                     });
                 }

                 scope.getStaticMap = function() {
                     var q = "?width=" + Math.round($window.outerWidth * 0.8);
                     if (scope.data.client && scope.data.client.address && scope.data.client.address.latLng)
                         q += ("&origin=" + scope.data.client.address.latLng);
                     if (scope.data.artisan && scope.data.artisan.id)
                         q += ("&destination=" + scope.data.artisan.address.lt + "," + scope.data.artisan.address.lg);
                     return "/api/mapGetStatic" + q;
                 }
                 scope.showClientMarker = function() {
                     return scope.data.client.address && scope.data.client.address.latLng;
                 }
                 scope.clickOnArtisanMarker = function(event, sst) {
                     scope.data.sst = sst.id;
                 }
             }
         }
     }
 ]);
