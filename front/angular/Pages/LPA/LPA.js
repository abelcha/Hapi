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
    _this.checkArtisan = function(sst) {
        sst.checked = !sst.checked
        _.each(sst.list, function(e) {
            e.checked = sst.checked;
        })
    }
    _this.updateNumeroCheque = function(index) {
        var base = $rootScope.lpa[index].numeroCheque;
        if (base) {
            for (var i = index; i < $rootScope.lpa.length; i++) {
                $rootScope.lpa[i].numeroCheque = ++base
            };
        }
    }
}


angular.module('edison').controller('LpaController', LpaController);
