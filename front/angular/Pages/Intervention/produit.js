 angular.module('edison').directive('produits',
     function(config, productsList, dialog) {
         "use strict";
         return {
             restrict: 'E',
             templateUrl: '/Templates/produits.html',
             scope: {
                 data: "=",
                 tva: '=',
                 display: '@',
                 model: "@"
             },
             link: function(scope, element, attrs) {
                 var model = scope.data;
                 scope.config = config
                 model.produits = model.produits || [];
                 scope.config = config;
                 scope.produits = new productsList(model.produits);

                 if (!scope.data.reglementSurPlace) {
                     scope.display = true;
                 }

                 scope.createProd = function() {
                     dialog.addProd(function(title, ref) {
                         model.produits.push({
                             quantite: 1,
                             ref: ref,
                             title: title,
                             desc: title,
                             pu: 0
                         })
                     });
                 }

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
 );
