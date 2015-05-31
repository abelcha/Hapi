angular.module('edison').filter('TotalMontant', function() {
    return function(obj) {
        if (obj && obj.montant && obj.total)
        	return obj.total + " (" + obj.montant.toFixed(0) + "€ )";
        return "0 (0€)";
    };
});
