 angular.module('edison').directive('edisonMap', ['$window', 'Map', 'mapAutocomplete', 'Address',
     function($window, Map, mapAutocomplete, Address) {
         "use strict";
         return {
             replace: true,
             restrict: 'E',
             templateUrl: '/Templates/autocomplete-map.html',
             scope: {
                 data: "=",
                 client: "=",
                 height: "@",
                 xmarkers: "=",
                 addressChange: '&',
                 isNew: "=",
                 firstAddress: "="
             },
             link: function(scope, element, attrs) {
                 scope._height = scope.height || 315;
                 scope.map = new Map();
                 scope.map.setZoom(_.get(scope, 'client.address') ? 12 : 6)
                 if (scope.isNew) {
                     scope.map.show()
                 }
                 scope.autocomplete = mapAutocomplete;

                 scope.mapShow = function() {
                     scope.mapDisplay = true
                 }

                 if (_.get(scope, 'client.address')) {
                     scope.client.address = Address(scope.client.address, true); //true -> copyContructor
                     scope.map.setCenter(scope.client.address);
                 } else {
                     scope.map.setCenter(Address({
                         lat: 46.3333,
                         lng: 2.6
                     }));
                 }

                 scope.changeAddress = function(place) {
                     scope.firstAddress = true;
                     mapAutocomplete.getPlaceAddress(place).then(function(addr) {
                         scope.map.setZoom(12);
                         scope.map.setCenter(addr)
                         scope.client.address = addr;
                         scope.addressChange({
                             test: 123
                         });
                     });
                 }

                 scope.getStaticMap = function() {
                     if (!_.get(scope, 'data.client.address.lt') && !_.get(scope, 'data.address.lt'))
                         return 0
                     var q = "?width=" + Math.round($window.outerWidth * (scope.height === "small" ? 0.8 : 1.2));
                     if (scope.client && scope.client.address && scope.client.address.latLng)
                         q += ("&origin=" + scope.client.address.latLng);
                     if (scope.data.artisan && scope.data.artisan.address)
                         q += ("&destination=" + scope.data.artisan.address.lt + "," + scope.data.artisan.address.lg);
                     return "/api/mapGetStatic" + q;
                 }
                 scope.showClientMarker = function() {
                     return scope.client.address && scope.client.address.latLng;
                 }
                 scope.clickOnArtisanMarker = function(event, sst) {
                     scope.data.sst = sst.id;
                 }
             }
         }
     }
 ]);
