angular.module('edison').factory('taskList', ['dialog', 'edisonAPI', function(dialog, edisonAPI) {

    var Task = function(user) {
        edisonAPI.get({
            to: user,
            done: false
        })
    }
    Task.prototype = {
        check: function(_id) {
            edisonAPI.check({
                _id: _id
            })
        },
        add: function(params) {
            edisonAPI.add(params)

        }
    }
    return Task;


}]);
