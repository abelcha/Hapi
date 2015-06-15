angular.module('edison').directive('dropdownRow', ['edisonAPI', '$q', '$timeout', function(edisonAPI, $q, $timeout) {
    "use strict";

    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/Directives/dropdown-row.html',
        scope: {
            model: "@",
            row: '=',
        },
        link: function(scope, element, attrs) {
            scope.model = scope.model || "intervention"
            scope.expendedStyle = {
                height: 0,
                overflow: 'hidden'
            };
            scope.expendedReady = false;
            scope.data = {};
            $timeout(function() {
                $("#expended").velocity({
                    height: 194,
                }, 200);
            }, 50)

            if (scope.model === "intervention") {
                var pAll = [
                    edisonAPI.intervention.get(scope.row.id),
                    edisonAPI.artisan.getStats(scope.row.ai)
                ];
                var pThen = function(result) {
                    scope.data = result[0].data;
                    scope.data.artisanStats = result[1].data
                }
            } else if (scope.model === "devis") {
                var pAll = [
                    edisonAPI.devis.get(scope.row.id),
                ]
                var pThen = function(result) {
                    scope.data = result[0].data;
                    scope.data.flagship = _.max(scope.data.produits, 'pu');
                }
            }

            $q.all(pAll).then(pThen)

            scope.getStaticMap = function(inter) {
                var q = "?width=500&height=200&precision=0&zoom=11&origin=" + inter.client.address.lt + ", " + inter.client.address.lg;
                return "/api/mapGetStatic" + q;
            }

        }
    };
}]);
