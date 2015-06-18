 angular.module('edison').directive('artisanCategorie', ['config', function(config) {
     "use strict";
     return {
         replace: true,
         restrict: 'E',
         templateUrl: '/Templates/artisan-categorie.html',
         transclude: true,
         scope: {
             model: "=",
         },
         link: function(scope, element, attrs) {
             scope.config = config
             scope.findColor = function(categorie) {
                 var f = _.find(scope.model.categories, function(e)  {
                     return e === categorie.short_name
                 })
                 return f ? categorie.color : "white";

             }
             scope.toggleCategorie = function(categorie) {
                var f = scope.model.categories.indexOf(categorie);
                if (f >= 0) {
                    scope.model.categories.splice(f, 1);
                } else {
                    scope.model.categories.push(categorie)
                }
             }
         },
     }

 }]);
