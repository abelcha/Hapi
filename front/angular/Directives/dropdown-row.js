angular.module('edison').directive('dropdownRow', ['edisonAPI', 'config', '$q', '$timeout', function(edisonAPI, config, $q, $timeout) {
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
                    height: 205,
                }, 200);
            }, 50)

            if (scope.model === "intervention") {
                var pAll = [
                    edisonAPI.intervention.get(scope.row.id),
                ];
                if (scope.row.ai) {
                    console.log('yayai')
                    pAll.push(edisonAPI.artisan.get(scope.row.ai))
                    pAll.push(edisonAPI.artisan.getStats(scope.row.ai))
                }

                var pThen = function(result) {
                    scope.data = result[0].data;
                    scope.client = scope.data.client;
                    scope.address = scope.client.address;
                    console.log('yayai')
                    if (scope.row.ai) {
                        scope.artisan = result[1].data;
                        scope.artisan.stats = result[2].data;
                    }
                    if (scope.data.status === 'ANN')
                        scope.data.ca = config.getCauseAnnulation(scope.data.causeAnnulation)
                }

            } else if (scope.model === "devis") {
                var pAll = [
                    edisonAPI.devis.get(scope.row.id),
                ]
                var pThen = function(result) {
                    scope.data = result[0].data;
                    scope.client = scope.data.client;
                    scope.address = scope.client.address;
                    scope.data.flagship = _.max(scope.data.produits, 'pu');
                    if (scope.data.status === 'ANN')
                        scope.data.ca = config.getCauseAnnulation(scope.data.causeAnnulation)
                }
            } else if (scope.model === 'artisan') {
                pAll = [
                    edisonAPI.artisan.get(scope.row.id),
                    edisonAPI.artisan.getStats(scope.row.id)
                ]
                pThen = function(result) {
                    scope.data = result[0].data;
                    scope.artisan = scope.data;
                    scope.artisan.stats = result[1].data;
                    scope.address = scope.artisan.address
                }
            }

            $q.all(pAll).then(pThen)

            scope.getStaticMap = function(address) {
                var q = "?width=500&height=200&precision=0&zoom=11&origin=" + address.lt + ", " + address.lg;
                return "/api/mapGetStatic" + q;
            }

        }
    };
}]);
