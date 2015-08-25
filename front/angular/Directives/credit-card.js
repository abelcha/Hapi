angular.module('edison').directive('creditcard', function() {
    "use strict";
    return {
        require: 'ngModel',
        scope: {
            inline: "=",
        },
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(input) {
                return input.replace('x', 'AAA')
            });
        }
    };
});
