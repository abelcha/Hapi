angular.module('edison').directive('dropdownRow', ['edisonAPI', '$q', '$timeout', function(edisonAPI, $q, $timeout) {
    "use strict";

    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/Directives/dropdown-row.html',
        scope: {
            intervention: '=',
        },
        link: function(scope, element, attrs) {
            scope.expendedStyle = {
                height: 0,
                overflow: 'hidden'
            };
            scope.expendedReady = false;
            scope.expendedRowData = {};
            $timeout(function() {
                $("#expended").velocity({
                    height: 194,
                }, 200);
            }, 50)
            $q.all([
                edisonAPI.intervention.get(scope.intervention.id),
                edisonAPI.artisan.getStats(scope.intervention.ai)
            ]).then(function(result) {
                scope.expendedRowData = result[0].data;
                scope.expendedRowData.artisanStats = result[1].data
            })

            scope.getStaticMap = function(inter) {
                var q = "?width=500&height=200&precision=0&zoom=11&origin=" + inter.client.address.lt + ", " + inter.client.address.lg;
                return "/api/mapGetStatic" + q;
            }

        }
    };
}]);
