var editSignalements = function(TabContainer, edisonAPI, $rootScope, $scope, $location, LxNotificationService, socket) {
    "use strict";
    var _this = this;
    _this.tab = TabContainer.getCurrentTab();
    _this.tab.setTitle('Signalements');


    edisonAPI.signal.list().then(function(resp) {
        $scope.pl = resp.data;
    })

    _this.remove = function(_id) {
        var i = _.findIndex($scope.pl, '_id', _id)
        $scope.pl.splice(i, 1);
    }
    _this.save = function() {
        edisonAPI.signal.save($scope.pl).then(function(resp) {
            $scope.pl = resp.data;
            LxNotificationService.success("Les produits on été mis a jour");
        }, function(err) {
            LxNotificationService.error("Une erreur est survenu (" + JSON.stringify(err.data) + ')');
        })
    }


}
angular.module('edison').controller('editSignalements', editSignalements);
