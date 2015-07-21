angular.module('edison').directive('infoCompta', ['config', 'Compta',
    function(config, Compta) {
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
                scope.compta = new Compta(scope.data)
                scope.$watch('data', function(current) {
                    scope.compta = new Compta(current);
                }, true)

                reglement.montantTTC = scope.compta.getMontantTTC()
                console.log(reglement.montant, reglement.montantTTC)
                scope.$watchGroup(['data.compta.reglement.montantTTC',
                    'data.compta.reglement.avoir',
                    'data.tva'
                ], function(newValues, oldValues, scope) {
                    if (!_.isEqual(newValues, oldValues))  {
                        var montant = reglement.montantTTC || 0
                        var coeff = 100 * (100 / (100 + scope.data.tva));
                        reglement.montant = Compta().applyCoeff(reglement.montantTTC, coeff)
                        paiement.base = reglement.montant - reglement.avoir
                    }
                });
            },
        }

    }
]);
