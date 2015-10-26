var listeSignalements = function(TabContainer, edisonAPI, $rootScope, $scope, $location, LxNotificationService, socket) {
    "use strict";
    var _this = this;
    _this.tab = TabContainer.getCurrentTab();
    _this.tab.setTitle('Liste Signalements');
    var q = $location.search();
    edisonAPI.signalement.list($location.search()).then(function(resp) {
        $scope.pl = resp.data;
        console.log('-->', resp.data)
    })

}
angular.module('edison').controller('listeSignalements', listeSignalements);
