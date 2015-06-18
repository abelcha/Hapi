angular.module('edison').directive('capitalize', function() {
    "use strict";
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(input) {
                return typeof input === "string" ? input.toUpperCase() : "";
            });
            element.css("text-transform", "uppercase");
        }
    };
});
