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

            var reload = function() {
                edisonAPI.artisan.fullHistory(scope.data.id).then(function(resp) {
                    scope.hist = resp.data;
                })
            }

            scope.$watch('data.id', reload)
            scope.check = function(sign) {
                /*  if (sign.ok)
                      return 0;*/
                edisonAPI.signalement.check(sign._id, sign.text).then(function(resp) {
                    sign = _.merge(sign, resp.data);
                })
                console.log('=>', sign)
            }
            scope.comment = function() {
                edisonAPI.artisan.comment(scope.data.id, scope.comm).then(reload)
                scope.comm = ""
            }
        }
    };
});
