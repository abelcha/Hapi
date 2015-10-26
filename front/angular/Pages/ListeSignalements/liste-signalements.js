var listeSignalements = function(TabContainer, edisonAPI, $rootScope, $scope, $location, LxNotificationService, socket) {
    "use strict";
    var _this = this;
    _this.tab = TabContainer.getCurrentTab();
    _this.tab.setTitle('Liste Signalements');

    edisonAPI.signal.list({
        service: 'INTERVENTION'
    }).then(function(resp) {
        console.log(resp.data);
        $scope.pl = resp.data;
    })

}
angular.module('edison').controller('listeSignalements', listeSignalements);
