 angular.module('edison').directive('infoFacture', ['config', 'mapAutocomplete',
     function(config, mapAutocomplete) {
         "use strict";
         return {
             restrict: 'E',
             templateUrl: '/Templates/info-facture.html',
             scope: {
                 data: "=",
             },
             link: function(scope, element, attrs) {
                 var model = scope.data;
                 scope.config = config
                 scope.autocomplete = mapAutocomplete;
                 scope.changeAddressFacture = function(place) {
                     mapAutocomplete.getPlaceAddress(place).then(function(addr) {
                         scope.data.facture = scope.data.facture ||  {}
                         scope.data.facture.address = addr;
                     });
                 }
                 scope.changeGrandCompte = function() {
                     // var x = _.clone(config.compteFacturation[scope.data.facture.compte])
                     scope.data.facture = _.find(config.compteFacturation, {
                         short_name: scope.data.facture.compte
                     });
                     scope.data.facture.payeur = "GRN";
                 }
             },
         }

     }
 ]);
