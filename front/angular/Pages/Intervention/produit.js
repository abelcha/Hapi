 angular.module('edison').directive('produits', ['config', 'productsList',
     function(config, productsList) {
         "use strict";
         return {
             restrict: 'E',
             templateUrl: '/Templates/produits.html',
             scope: {
                 data: "=",
                 tva: '=',
                 display: '@'
             },
             link: function(scope, element, attrs) {
                 var model = scope.data;
                 scope.config = config
                 model.produits = model.produits || [];
                 scope.config = config;
                 scope.produits = new productsList(model.produits);

                 scope.envoiFacture = function() {
                     model.envoiFacture(function(err, res) {
                         if (!err)
                             model.date.envoiFacture = new Date();
                     })
                 }


                 scope.envoiDevis = function() {
                     model.envoiDevis(function(err, res) {
                         if (!err)
                             model.date.envoiFacture = new Date();
                     })
                 }
             },
         }

     }
 ]);
