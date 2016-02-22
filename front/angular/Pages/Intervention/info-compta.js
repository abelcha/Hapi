angular.module('edison').directive('infoCompta',
    function(config, Paiement, Intervention, textTemplate) {
        "use strict";
        return {
            restrict: 'E',
            templateUrl: '/Templates/info-compta.html',
            scope: {
                data: "=",
                displayReglement: '@',
                dialog: '@',
                displayPaiement: '@',
                simulator: '@'
            },
            link: function(scope, element, attrs) {
                scope.config = config
                scope.textTemplate = textTemplate;
                scope.Intervention = Intervention
                if (scope.displayReglement) {
                    scope.showPaiement = true
                }
                if (scope.displayPaiement) {
                    scope.showReglement = true
                }
                var reglement = scope.data.compta.reglement
                var paiement = scope.data.compta.paiement
                if (!scope.data.tva) {
                    scope.data.tva = (scope.data.client.civilite == 'Soc.' ? 20 : 10)
                }
                if (!paiement.mode) {
                    paiement.mode = _.get(scope.data.sst, 'document.rib.ok') ? "VIR" : "CHQ"
                }
                scope.format = function(nbr) {
                    return _.round(nbr, 2).toFixed(2);
                }
                scope.getPaiement = function(e) {
                    var x = _.cloneDeep(scope.data);
                    x.compta.paiement = _.cloneDeep(e);
                    return new Paiement(x);
                }
                scope.Paiement = Paiement;
                scope.compta = new Paiement(scope.data)
                reglement.montantTTC = scope.compta.getMontantTTC()

                scope.$watchGroup(['data.compta.reglement.montantTTC',
                    'data.compta.reglement.avoir',
                    'data.tva'
                ], function(current, prev) {
                    var montant = reglement.montantTTC || 0
                    var coeff = 100 * (100 / (100 + scope.data.tva));
                    reglement.montant = Paiement().applyCoeff(reglement.montantTTC, coeff)
                    if (!paiement.base) {
                        paiement.base = _.round(reglement.montant - (reglement.avoir ||  0), 2)
                    }
                })

                var change = function(newValues, oldValues, scope) {
                //    if (!_.isEqual(newValues, oldValues)) {
                        scope.compta = new Paiement(scope.data)
                        paiement.montant = scope.compta.montantTotalTTC
                  //  }
                }
                scope.$watch('data.fourniture', change, true)

                scope.$watch('data.compta.paiement.pourcentage.deplacement', change, true)

                scope.$watch('data.compta.paiement.pourcentage.maindOeuvre', change, true)

                scope.$watchGroup(['data.compta.reglement.montant',
                    'data.compta.paiement.base',
                    'data.compta.paiement.tva',
                    'data.compta.paiement.pourcentage.deplacement',
                    'data.compta.paiement.pourcentage.maindOeuvre',
                ], change, true);
                if (!scope.data.compta.paiement.base && scope.data.compta.reglement.montant) {
                    scope.data.compta.paiement.base = scope.data.compta.reglement.montant;
                    scope.compta = new Paiement(scope.data)
                    paiement.montant = scope.compta.montantTotalTTC
                }
            },

        }

    }
);
