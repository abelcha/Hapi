angular.module('edison').directive('infoCompta', ['config', 'Paiement',
    function(config, Paiement) {
        "use strict";
        return {
            restrict: 'E',
            templateUrl: '/Templates/info-compta.html',
            scope: {
                data: "=",
            },
            link: function(scope, element, attrs) {
                scope.config = config
                var reglement = scope.data.compta.reglement
                var paiement = scope.data.compta.paiement
                if (!scope.data.tva) {
                    scope.data.tva = 20
                }
                if (!paiement.mode) {
                    paiement.mode = _.get(scope.data.artisan, 'document.rib.file') ? "VIR" : "CHQ"
                }

                scope.compta = new Paiement(scope.data)
                reglement.montantTTC = scope.compta.getMontantTTC()

                scope.$watchGroup(['data.compta.reglement.montantTTC',
                    'data.compta.reglement.avoir',
                ], function() {
                    console.log('montantTTC')
                    var montant = reglement.montantTTC || 0
                    var coeff = 100 * (100 / (100 + scope.data.tva));
                    if (!scope.data.compta.paiement.base) {
                        console.log('nobase')
                        reglement.montant = Paiement().applyCoeff(reglement.montantTTC, coeff)
                        paiement.base = _.round(reglement.montant - (reglement.avoir ||  0), 2)
                    } else {
                        console.log('yesbase')
                        reglement.montant = Paiement().applyCoeff(reglement.montantTTC, coeff)
                        paiement.base = _.round(reglement.montant - (reglement.avoir ||  0), 2)

                    }
                })

                scope.$watchGroup(['data.compta.reglement.montant',
                    'data.compta.paiement.base',
                    'data.tva',
                    'data.compta.paiement.pourcentage.deplacement',
                    'data.compta.paiement.pourcentage.fourniture',
                    'data.compta.paiement.pourcentage.maindOeuvre'
                ], function(newValues, oldValues, scope) {
                    if (!_.isEqual(newValues, oldValues)) {
                    console.log('here')
                        scope.compta = new Paiement(scope.data)
                        paiement.montant = scope.compta.montantTotal
                    }
                }, true);
            },
        }

    }
]);
