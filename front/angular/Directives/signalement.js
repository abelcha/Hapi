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
                scope.selectedSubType = scope.selectedSubType === subType ? null : subType
            }
            edisonAPI.signal.list().then(function(resp) {
                scope.signalementsGrp = _.groupBy(resp.data, 'subType');
            })
            scope.hide = function(signal) {

                edisonAPI.signalement.add(_.merge(signal, {
                    inter_id: scope.data.id || scope.data.tmpID,
                    sst_id: scope.data.sst && scope.data.sst.id,
                    sst_nom: scope.data.sst && scope.data.sst.nomSociete
                })).then(function() {
                    LxNotificationService.success("Le service " + signal.service.toLowerCase() + " en a été notifié");
                })
                console.log('EXIT')
                return scope.exit && scope.exit()
            }
        }
    }
 });
