 angular.module('edison').directive('signalement', function() {
     "use strict";
     return {
         replace: false,
         restrict: 'E',
         templateUrl: '/Templates/signalement.html',
         scope: {
             sst: '=',
             exit: '&',
         },
         link: function(scope, elem) {
             console.log('==>', scope.exit);
             scope.hide = function() {
                scope.exit()
             }
         }
     }
 });
