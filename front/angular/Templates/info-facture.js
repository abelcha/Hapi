 angular.module('edison').directive('infoFacture', function(mapAutocomplete, edisonAPI,config) {
     "use strict";
     return {
         restrict: 'E',
         templateUrl: '/Templates/info-facture.html',
         scope: {
             data: "=",
         },
         link: function(scope, element, attrs) {
             var model = scope.data;
             scope.config = config;
             scope.autocomplete = mapAutocomplete;
             scope.changeAddressFacture = function(place) {
                 mapAutocomplete.getPlaceAddress(place).then(function(addr) {
                     scope.data.facture = scope.data.facture ||  {}
                     scope.data.facture.address = addr;
                 });
             }
             edisonAPI.compte.list().then(function(resp) {
                 scope.grndComptes = resp.data
             })

             scope.changeGrandCompte = function() {
                 // var x = _.clone(config.compteFacturation[scope.data.facture.compte])
                 var x  = scope.data.facture.compte
                 scope.data.facture = _.find(scope.grndComptes, 'ref', scope.data.facture.compte);
                 scope.data.facture.payeur = "GRN";
                 scope.data.facture.compte = x;
             }
         },
     }

 });
