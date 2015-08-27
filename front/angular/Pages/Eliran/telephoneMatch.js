var telephoneMatch = function(tabContainer, edisonAPI, $rootScope, $scope, $location, LxProgressService, socket) {
    "use strict";
    var _this = this;
    _this.tab = tabContainer.getCurrentTab();
    _this.tab.setTitle('TelMatch');
    $scope.__txt_tel = $rootScope.__txt_tel
    $rootScope.getTelMatch = function() {
        LxProgressService.circular.show('#5fa2db', '#globalProgress');
        $rootScope.__txt_tel = $scope.__txt_tel
        edisonAPI.intervention.getTelMatch({
            q: $rootScope.__txt_tel
        });
    }
    socket.on('telephoneMatch', function(data) {
        LxProgressService.circular.hide()
        console.log(data);
        $scope.resp = data
    })

}
angular.module('edison').controller('telephoneMatch', telephoneMatch);
