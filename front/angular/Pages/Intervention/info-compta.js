angular.module('edison').directive('infoCompta', ['config', 'Paiement',
    function(config, Paiement) {
        "use strict";
        return {
            restrict: 'E',
            templateUrl: '/Templates/info-compta.html',
            scope: {
                data: "=",
                displayReglement: '@',
                dialog: '@',
                displayPaiement: '@',
            },
            link: function(scope, element, attrs) {
                scope.config = config
                var reglement = scope.data.compta.reglement
                var paiement = scope.data.compta.paiement
                if (!scope.data.tva) {
                    scope.data.tva = (scope.data.client.civilite == 'Soc.' ? 20 : 10)
                }
                if (!paiement.mode) {
                    paiement.mode = _.get(scope.data.sst, 'document.rib.file') ? "VIR" : "CHQ"
                }

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

                scope.$watchGroup(['data.compta.reglement.montant',
                    'data.compta.paiement.base',
                    'data.compta.paiement.tva',
                    'data.compta.paiement.pourcentage.deplacement',
                    'data.compta.paiement.pourcentage.fourniture',
                    'data.compta.paiement.pourcentage.maindOeuvre',
                    'data.fourniture',
                ], function(newValues, oldValues, scope) {
                    console.log('CHANGE')
                    if (!_.isEqual(newValues, oldValues)) {
                        scope.compta = new Paiement(scope.data)
                        paiement.montant = scope.compta.montantTotal
                    }
                }, true);
                if (!scope.data.compta.paiement.base && scope.data.compta.reglement.montant) {
                    scope.data.compta.paiement.base = scope.data.compta.reglement.montant;
                    scope.compta = new Paiement(scope.data)
                    paiement.montant = scope.compta.montantTotal
                }
            },

        }

    }
]);
