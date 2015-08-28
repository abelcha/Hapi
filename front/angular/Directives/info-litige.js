 angular.module('edison').directive('infoLitige', function() {
     "use strict";
     return {
         replace: false,
         restrict: 'E',
         templateUrl: '/Templates/info-litige.html',
         scope: {
             data: '=',
         },
         link: function(scope, elem) {
             scope.$watch('data.litige.description', function(curr, prev) {
                 if (scope.data.litige && !scope.data.litige.closed)
                     scope.data.litige.open = true
             })
         }
     }
 });
