 angular.module('edison').directive('infoAppelSst', function(mapAutocomplete, edisonAPI, config) {
    "use strict";
    return {
        restrict: 'E',
        templateUrl: '/Templates/info-appel-sst.html',
        scope: {
            data: "=",
        },
        link: function(scope, element, attrs) {
            scope.embedded = !!attrs.embedded
            console.log(attrs.embedded);
        },
    }

 });
