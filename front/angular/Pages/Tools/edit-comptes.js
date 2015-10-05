var editComptes = function(tabContainer, edisonAPI, $rootScope, $scope, $location, LxNotificationService, socket) {
    "use strict";
    var _this = this;
    _this.tab = tabContainer.getCurrentTab();
    _this.tab.setTitle('grand Comptes');

    edisonAPI.compte.list().then(function(resp) {
        $scope.pl = resp.data
        console.log($scope.pl)
    })


    _this.save = function() {
        edisonAPI.compte.save($scope.pl).then(function(resp) {
            LxNotificationService.success("Les comptes on été mis a jour");
        }, function(err) {
            LxNotificationService.error("Une erreur est survenu (" + JSON.stringify(err.data) + ')');
        })
    }
    _this.remove = function(obj) {
        $scope.pl.splice(_.findIndex($scope.pl, '_id', obj._id), 1);
    }
}

angular.module('edison').controller('editComptes', editComptes);
