 angular.module('edison').directive('trello', function(user, edisonAPI) {
    "use strict";
    return {
        replace: false,
        restrict: 'E',
        templateUrl: '/Templates/trello.html',
        scope: {
            data: '=',
        },
        link: function(scope, elem) {

            var xmap = function(e) {
                e.checked = e.state === 'complete';
                return e;
            }
            scope.reload = function() {
                edisonAPI.tasklist.get(moment().format('DD-MM-YYYY'), user.login).then(function(resp) {
                    scope.tasklist = resp.data
                    resp.data.checkItems = resp.data.checkItems.map(xmap)
                })
            }
            scope.reload()
            scope.check = function(task) {
                task.listID = scope.tasklist.id;
                task.cardID = scope.tasklist.cardID;
                edisonAPI.tasklist.update(_.clone(task)).then(function(resp) {
                    task = xmap(resp.data)
                })
                task.checked = !task.checked;
            }
        }
    }
 });
