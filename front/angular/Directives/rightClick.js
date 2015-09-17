angular.module('edison').directive('ngRightClick', function($parse) {
    "use strict";
    return function(scope, element, attrs) {
        element.bind('contextmenu', function(event) {
            if (!(event.altKey ||  event.ctrlKey || event.shiftKey ||  ["INPUT", "TEXTAREA"].indexOf(event.target.nodeName) >= 0)) {
                scope.$apply(function() {
                    event.preventDefault();
                    $parse(attrs.ngRightClick)(scope, {
                        $event: event
                    });
                });
            }
        });
    };
});
