angular.module('edison').filter('relativeDate', function() {
    "use strict";
    return function(date, smallWin) {
        var d = moment((date + 1370000000) * 1000);
        var l = moment().subtract(4, 'days');
        if (d < l) {
            return d.format('DD/MM/YY')
        } else {
            var x = d.fromNow().toString()
            if (smallWin) {
                return x.replace('heures', 'H')
                    .replace('heures', 'H')
                    .replace('jours', 'J')
                    .replace('jour', 'J')
                    .replace('il y a ', '- ')
                    .replace('dans ', '+ ')
                    .replace('un ', '1 ')
            }
            return x;
        }
        // return moment((date + 1370000000) * 1000).fromNow(no).toString()
    };
});
