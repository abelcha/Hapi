var AvoirsController = function(TabContainer, openPost, edisonAPI, $rootScope, LxProgressService, LxNotificationService, FlushList) {
    "use strict";
    var _this = this
    var tab = TabContainer.getCurrentTab();
    tab.setTitle('Avoirs')
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

    _this.print = function(type) {
        console.log($rootScope.avoirs);
        openPost('/api/intervention/printAvoir', {
            data: $rootScope.avoirs
        });
    }

    _this.flush = function() {
        var list = _.filter($rootScope.avoirs, {
            checked: true
        })
        edisonAPI.compta.flushAvoirs(list).then(function(resp) {
            LxNotificationService.success(resp.data);
            _this.reloadAvoir()
        }).catch(function(err) {
            LxNotificationService.error(err.data);
        })
    }

}


angular.module('edison').controller('avoirsController', AvoirsController);
