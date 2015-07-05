angular.module('edison').directive('infoFourniture', ['config', 'fourniture',
    function(config, fourniture) {
        "use strict";
        return {
            restrict: 'E',
            templateUrl: '/Templates/info-fourniture.html',
            scope: {
                data: "=",
                display: "="
            },
            link: function(scope, element, attrs) {
                scope.config = config
                scope.dsp = scope.display || false
                scope.data.fourniture = scope.data.fourniture || [];
                scope.fourniture = fourniture.init(scope.data.fourniture);
            },
        }

    }
]);
