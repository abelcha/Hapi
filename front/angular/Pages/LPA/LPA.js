var LpaController = function(tabContainer, edisonAPI, $rootScope, LxProgressService) {
    "use strict";
    var _this = this
    var tab = tabContainer.getCurrentTab();
    tab.setTitle('LPA')
    var loadData = function() {
        $rootScope.lpa = undefined
        LxProgressService.circular.show('#5fa2db', '#globalProgress');
        edisonAPI.compta.lpa().then(function(result) {
            $rootScope.lpa = result.data
            LxProgressService.circular.hide()
        })
    }
    if (!$rootScope.lpa)
        loadData()
    var reloadNumeroCheque = function(debutCheque) {
        _.each(_this.result, function(e) {
            if (e.toFlush) {
                e.numeroCheque = debutCheque++
            }
        })
    }
    _this.checkArtisan = function(sst) {
        sst.checked = !sst.checked
        _.each(sst.list, function(e) {
            e.checked = sst.checked;
        })
    }
}


angular.module('edison').controller('LpaController', LpaController);
