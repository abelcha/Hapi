 angular.module('edison').directive('creditCard', ['config', function(config) {
     "use strict";
     return {
         replace: true,
         restrict: 'E',
         templateUrl: '/Templates/credit-card.html',
         scope: {
             model: "=",
         },
         link: function(scope, element, attrs) {
             scope.config = config
         },
     }

 }]);
