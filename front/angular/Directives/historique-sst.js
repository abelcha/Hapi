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
            scope.$watch('data.id', function() {
                edisonAPI.artisan.fullHistory(scope.data.id).then(function(resp) {
                    console.log('====>', resp.data);
                    scope.hist = resp.data;
                })
            })
            scope.check = function(sign) {
                /*  if (sign.ok)
                      return 0;*/
                edisonAPI.signalement.check(sign._id, sign.text).then(function(resp) {
                    sign = _.merge(sign, resp.data);
                })
                console.log('=>', sign)
            }
        }
    };
});
