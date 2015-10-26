angular.module('edison').directive('historiqueSst', function(edisonAPI) {
    "use strict";

    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/Templates/historique-sst.html',
        scope: {
            data: "=",
        },
        link: function(scope, element, attrs) {
            edisonAPI.artisan.fullHistory(scope.data.id).then(function(resp) {
                    console.log('====>', resp.data);
                    scope.hist = resp.data;
                })
                //console.log('==>', scope.data);
        }
    };
});
