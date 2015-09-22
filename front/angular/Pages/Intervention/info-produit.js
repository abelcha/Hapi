 angular.module('edison').directive('produits',
     function(config, productsList, dialog, openPost, LxNotificationService, Intervention, Devis, Combo, edisonAPI) {
         "use strict";
         return {
             restrict: 'E',
             templateUrl: '/Templates/info-produit.html',
             scope: {
                 data: "=",
                 tva: '=',
                 display: '@',
                 model: "@",
                 embedded: "="
             },
             link: function(scope, element, attrs) {
                 var model = scope.data;
                 scope.config = config
                 model.produits = model.produits || [];
                 scope.config = config;
                 scope.produits = new productsList(model.produits);
                 edisonAPI.combo.list().then(function(resp) {
                     scope.combo = resp.data
                 })

                 scope.Intervention = Intervention;
                 scope.Devis = Devis;

                 if (!scope.data.reglementSurPlace) {
                     scope.display = true;
                 }

                 scope.$watch('data.facture.payeur', function(curr, prev) {
                     if (curr !== prev && (curr === 'GRN' ||  curr === 'SOC')) {
                         scope.data.tva = 20;
                         LxNotificationService.info("La TVA à été mise a 20%");
                     }
                 })

                 scope.$watch('data.produits', function(curr, prev) {
                     if (!_.isEqual(curr, prev)) {
                         //scope.data.prixFinal = scope.produits.total()
                         scope.data.prixAnnonce = scope.produits.total()
                     }
                 }, true)

                 scope.$watch('data.combo', function(curr, prev) {
                     if (curr && !_.isEqual(curr, prev)) {
                         var prod = _.find(scope.combo, function(e) {
                             return e.ref === curr;
                         })
                         _.each(prod.produits, function(e) {
                             if (!e.ref) {
                                 e.ref = e.desc.toUpperCase().slice(0, 3) + '0' + _.random(9, 99)
                             }
                         })
                         model.comboText = prod.text;
                         model.produits = prod.produits || [];
                         scope.produits = new productsList(model.produits);
                     }
                 }, true)

                 scope.changeElemTitle = function(elem) {
                     if (!elem.showDesc) {
                         elem.desc = elem.title
                     }
                 }

                 scope.createProd = function() {
                     /*                     scope.produits.add({
                                              ref: 'EDIXX',
                                              desc: "",
                                              pu: 10,
                                              quantite: 1,
                                              focus: true,
                                          })*/
                     model.produits.push({
                             showDesc: false,
                             desc: '',
                             title: '',
                             pu: 0,
                             quantite: 0,
                         })
                         /*  dialog.addProd(function(resp) {
                               console.log(resp);
                               model.produits.push(resp)
                           });*/
                 }
                 scope.printDevis = function() {
                     openPost('/api/intervention/printDevis', {
                         data: JSON.stringify(scope.data),
                         html: true
                     })
                 }

                 scope.printFactureAcquitte = function() {
                     openPost('/api/intervention/printFactureAcquitte', {
                         data: JSON.stringify(scope.data),
                         html: true
                     })
                 }
             },
         }

     }
 );
