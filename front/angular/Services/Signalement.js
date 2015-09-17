angular.module('edison').factory('Signalement', function() {
    "use strict";

    var Signalement = function(inter) {
        this.intervention = inter;
    }

    Signalement.prototype.list = {
        intervention: [{
            name: 'Indisponibilité',
            id: 'INDISPO',
            fn: function() {
                console.log('yay')
            }
        }],
        partenariat: [{
            name: 'Facturier / Deviseur',
            id: 'FACT_DEV',
            fn: function() {
                console.log('FACTDEV')
            }
        }, {
            name: 'Erreur SST',
            id: 'ERREUR',
            fn: function() {
                console.log('ERR')
            }
            // N'A PAS COMPTÉ LA TVA
            // 
        }, {
            name: 'Plainte SST',
            id: 'PLAINTE',
            fn: function() {
                console.log('PLAINTE')
            }
        }],
        compta: []
    }
    return Signalement;
});
