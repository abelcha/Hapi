 angular.module('edison').directive('infoSav', function(config) {
     "use strict";
     return {
         replace: false,
         restrict: 'E',
         templateUrl: '/Templates/info-sav.html',
         scope: {
             data: '=',
             artisans: '='
         },
         link: function(scope, elem) {
            scope.config = config;
         }
     }
 });
