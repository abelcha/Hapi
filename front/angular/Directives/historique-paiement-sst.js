angular.module('edison').directive('historiquePaiementSst', function(edisonAPI, FlushList) {
    "use strict";

    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/Templates/historique-paiement-sst.html',
        scope: {
            data: "=",
            exit: '&'
        },
        link: function(scope, element, attrs) {
            var reload = function() {
                if (!scope.data || !scope.data.id) {
                    return 0;
                }
                var getPaiement = function(x) {
                    console.log('-->', x)
                }
                scope.getTotal = function(arr) {
                    var rtn = 0;
                    _.each(arr, function(e) {
                        rtn += e.original.compta.paiement.historique.final
                    })
                    return _.round(rtn, 2);
                }
                edisonAPI.artisan.getCompteTiers(scope.data.id).then(function(resp) {
                    scope.historiquePaiement = _.map(resp.data, function(e) {
                        e.flushList = new FlushList(e.list, _.pluck(e.list, '_id'))
                        _.map(e.flushList.getList() , function(x) {
//                            x.paiement = x.compta.paiement.historique
                            x.original = _.find(e.list, 'id', x.id)
                        })
                        return e;
                    })
                })
            }

            scope.$watch('data.id', reload)
            scope.check = function(sign) {
                /*  if (sign.ok)
                      return 0;*/
                edisonAPI.signalement.check(sign._id, sign.text).then(function(resp) {
                    sign = _.merge(sign, resp.data);
                })
                scope.exit && scope.exit();
                console.log('=>', sign)
            }
            scope.comment = function() {
                edisonAPI.artisan.comment(scope.data.id, scope.comm).then(reload)
                scope.comm = ""
            }
        }
    };
});
