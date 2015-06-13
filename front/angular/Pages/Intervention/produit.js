 angular.module('edison').directive('produits', ['config', 'productsList',
     function(config, productsList) {
         "use strict";
         return {
             restrict: 'E',
             templateUrl: '/Pages/intervention/produits.html',
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
                    console.log(model.typeOf())
                     if (model.typeOf() === "Intervention") {
                         model.envoiDevis(function(err, res) {
                             console.log(err, resp)
                             if (!err)
                                 model.date.envoiFacture = new Date();
                         })
                     } else if (model.typeOf() === "Devis") {
                         model.envoi(function(err, resp) {
                             console.log(err, resp)
                         })

                     } else {
                        console.error("unknown model")
                     }
                 }
             },
         }

     }
 ]);
