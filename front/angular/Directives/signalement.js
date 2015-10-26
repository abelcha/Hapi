 angular.module('edison').directive('signalement', function(edisonAPI, LxNotificationService) {
    "use strict";
    return {
        replace: false,
        restrict: 'E',
        templateUrl: '/Templates/signalement.html',
        scope: {
            data: '=',
            exit: '&',
        },
        link: function(scope, elem) {
            scope.setSelectedSubType = function(subType) {
                scope.selectedSubType = subType
            }
            edisonAPI.signal.list().then(function(resp) {
                scope.signalementsGrp = _.groupBy(resp.data, 'subType');
                scope.signalements = resp.data;
            })
            scope.hide = function(signal) {

                edisonAPI.signalement.add(_.merge(signal, {
                    id_inter: scope.data.id || scope.data.tmpID,
                    id_sst: scope.data.sst && scope.data.sst.id
                })).then(function() {
                    LxNotificationService.success("Le service " + signal.service.toLowerCase() + " en a été notifié");
                })
                scope.exit()
            }
        }
    }
 });
