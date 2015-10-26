 angular.module('edison').directive('absenceSst', function(edisonAPI, LxNotificationService, user) {
    "use strict";
    return {
        replace: false,
        restrict: 'E',
        templateUrl: '/Templates/absence-sst.html',
        scope: {
            data: '=',
            exit: '&',
        },
        link: function(scope, elem) {
            scope.absence = {
                start: moment().add(-1, 'hours').toDate(),
                end: moment().hour(23).minute(43).toDate()
            }
            scope.save = function() {
                edisonAPI.artisan.absence(scope.data.id, scope.absence).then(function() {
                    console.log('yaya')
                })
                LxNotificationService.success("L'absence à été enregistrer");
                console.log('==>', scope.exit);
                (scope.exit || _.noop)();
            }
        }
    }
 });
