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
        }).then(_.noop, function() {
        LxProgressService.circular.hide()

        })
    }

    socket.on('intervention_db_telMatches', function(data) {
        console.log('uyau')
        $rootScope.globalProgressCounter = data + '%';
    })

    socket.on('telephoneMatch', function(data) {
        $rootScope.globalProgressCounter = ""
        LxProgressService.circular.hide()
        $scope.resp = data
    })

}
angular.module('edison').controller('telephoneMatch', telephoneMatch);
