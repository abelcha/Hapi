var LpaController = function(tabContainer, edisonAPI, $rootScope, LxProgressService, LxNotificationService, FlushList) {
    "use strict";
    var _this = this
    var tab = tabContainer.getCurrentTab();
    tab.setTitle('LPA')
    _this.loadData = function(prevChecked) {
        console.log('reload')
        LxProgressService.circular.show('#5fa2db', '#globalProgress');
        edisonAPI.compta.lpa().then(function(result) {
            _.each(result.data, function(sst) {
                sst.nomSociete = sst.list[0].artisan.nomSociete
                sst.id = sst.list[0].artisan.id
                sst.list = new FlushList(sst.list, prevChecked);
                _this.reloadList(sst)
            })
            console.log($rootScope.lpa, result.data)
            $rootScope.lpa = result.data
            LxProgressService.circular.hide()
        })
    }
    if (!$rootScope.lpa)
        _this.loadData()
    _this.checkArtisan = function(sst) {
        sst.checked = !sst.checked
        _.each(sst.list.getList(), function(e) {
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
    _this.flush = function() {
        var rtn = [];
        _.each($rootScope.lpa, function(sst) {
            _.each(sst.list.getList(), function(e) {
                if (e.checked) {
                    e.numeroCheque = sst.numeroCheque
                    rtn.push(e);
                }
            })
        })
        edisonAPI.compta.flush(rtn).then(function(resp) {
            LxNotificationService.success(resp.data);
            _this.reloadLPA()
        }).catch(function(err) {
            LxNotificationService.error(err.data);
        })
    }
    _this.reloadList = function(artisan) {
        artisan.total = artisan.list.getTotal()
    }
    _this.reloadLPA = function() {
        var rtn = [];
        _.each($rootScope.lpa, function(sst) {
            _.each(sst.list.getList(), function(e) {
                if (e.checked) {
                    rtn.push(e.id);
                }
            })
        })
        _this.loadData(rtn)
    }
}


angular.module('edison').controller('LpaController', LpaController);
