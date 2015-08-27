var telephoneMatch = function(tabContainer, edisonAPI, $rootScope, $scope, $location, LxProgressService) {
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
        }).then(function(resp) {
            $scope.resp = resp.data;
            LxProgressService.circular.hide();
           // $location.url('/intervention/list?ids_in=' + JSON.stringify(resp.data))
        })
    }

}
angular.module('edison').controller('telephoneMatch', telephoneMatch);
