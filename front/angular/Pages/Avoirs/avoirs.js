var AvoirsController = function(tabContainer, edisonAPI, $rootScope, LxProgressService, LxNotificationService, FlushList) {
    "use strict";
    var _this = this
    var tab = tabContainer.getCurrentTab();
    tab.setTitle('LPA')
    _this.loadData = function(prevChecked) {
        LxProgressService.circular.show('#5fa2db', '#globalProgress');
        edisonAPI.compta.avoirs().then(function(result) {
            console.log(result)
            $rootScope.avoirs = result.data
            LxProgressService.circular.hide()
        })
    }
    if (!$rootScope.avoirs)
        _this.loadData()

    _this.reloadAvoir = function() {
        _this.loadData()
    }
    _this.flush = function() {
        var list = _.filter($rootScope.avoirs, {
            checked: true
        })
        edisonAPI.compta.flushAvoirs(list).then(function(resp) {
            LxNotificationService.success(resp.data);
            _this.reloadLPA()
        }).catch(function(err) {
            LxNotificationService.error(err.data);
        })
    }

}


angular.module('edison').controller('avoirsController', AvoirsController);
