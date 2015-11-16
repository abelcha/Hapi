 angular.module('edison').directive('infoPaiement', function(config) {
     "use strict";
     return {
         replace: false,
         restrict: 'E',
         templateUrl: '/Templates/info-paiement.html',
         scope: {
             data: '=',
             artisans: '='
         },
         link: function(scope, elem) {
            scope.config = config;
         }
     }
 });
