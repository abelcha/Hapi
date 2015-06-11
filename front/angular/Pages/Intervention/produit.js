 angular.module('edison').directive('produits', ['config', 'productsList', 'actionIntervention',
     function(config, productsList, actionIntervention) {
         "use strict";
         return {
             restrict: 'E',
             templateUrl: '/Pages/intervention/produits.html',
             scope: {
                 data: "=",
                 tva: '=',
                 display:'@'
             },
             link: function(scope, element, attrs) {
                 scope.config = config
                 scope.data.produits = scope.data.produits || [];
                 scope.config = config;
                 scope.produits = new productsList(scope.data.produits);

                 scope.envoiFacture = function() {
                     actionIntervention.envoiFacture(scope.data, function(err, res) {
                         if (!err)
                             scope.data.date.envoiFacture = new Date();
                     })
                 }


                 scope.envoiDevis = function() {
                     actionIntervention.envoiDevis(scope.data, function(err, res) {
                         if (!err)
                             _this.data.date.envoiFacture = new Date();
                     })
                 }
             },
         }

     }
 ]);
