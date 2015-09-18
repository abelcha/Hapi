var editUsers = function(tabContainer, edisonAPI, $rootScope, $scope, $location, LxNotificationService, socket) {
    "use strict";
    var _this = this;
    _this.tab = tabContainer.getCurrentTab();
    _this.tab.setTitle('Utilisateurs');



    edisonAPI.users.list().then(function(resp) {
        $scope.usrs = resp.data
    })

    _this.save = function() {
        edisonAPI.users.save($scope.usrs).then(function() {
            LxNotificationService.success("Les utilisateurs on été mis a jour");
        }, function(err) {
            LxNotificationService.error("Une erreur est survenu (" + JSON.stringify(err.data) + ')');
        })
    }


}
angular.module('edison').controller('editUsers', editUsers);
