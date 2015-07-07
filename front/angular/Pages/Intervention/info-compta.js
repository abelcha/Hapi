angular.module('edison').directive('infoCompta', ['config',
    function(config, fourniture) {
        "use strict";
        return {
            restrict: 'E',
            templateUrl: '/Templates/info-compta.html',
            scope: {
                data: "=",
            },
            link: function(scope, element, attrs) {
                scope.config = config
            },
        }

    }
]);
