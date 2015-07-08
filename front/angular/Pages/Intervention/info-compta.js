angular.module('edison').directive('infoCompta', ['config','Compta',
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
                scope.compta = new Compta(scope.data)
                scope.$watch('data', function() {
                    scope.compta = new Compta(scope.data);
                }, true)
            },
        }

    }
]);
