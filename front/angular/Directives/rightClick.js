angular.module('edison').directive('ngRightClick', function($parse) {
    "use strict";
    return function(scope, element, attrs) {
        element.bind('contextmenu', function(event) {
            if (event.altKey ||  event.ctrlKey || event.shiftKey) {
                return false
            }
            var fn = $parse(attrs.ngRightClick);
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {
                    $event: event
                });
            });
        });
    };
});
