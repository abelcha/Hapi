angular.module('edison').filter('total', function() {
    return function(obj) {
        if (obj && obj.total) {
        	return obj.total;
        }
        return "0";
    };
});

angular.module('edison').filter('montant', function() {
    return function(obj) {
        if (obj && obj.montant) {
        	return (obj.montant > 999 ? (obj.montant / 1000).toFixed(0) + 'k' : obj.montant.toFixed(0)) + '€'
        }
        return "0€";
    };
});
