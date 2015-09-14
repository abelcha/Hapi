var editUsers = function(tabContainer, edisonAPI, $rootScope, $scope, $location, LxNotificationService, socket) {
    "use strict";
    var _this = this;
    _this.tab = tabContainer.getCurrentTab();
    _this.tab.setTitle('Produits');



    edisonAPI.users.list().then(function(resp) {
        $scope.usrs = resp.data
    })

    var save = _.throttle(function() {
        edisonAPI.users.save($scope.usrs).then(function() {
        })
    }, 500)

    $scope.$watch('usrs', function(curr, prev) {
        if (curr && prev && !_.isEqual(prev, curr)) {
            save()
        }
    }, true)


}
angular.module('edison').controller('editUsers', editUsers);
