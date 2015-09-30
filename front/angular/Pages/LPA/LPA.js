var LpaController = function(openPost, socket, ContextMenu, $location, $window, tabContainer, edisonAPI, $rootScope, LxProgressService, LxNotificationService, FlushList) {
    "use strict";
    var _this = this
    var tab = tabContainer.getCurrentTab();
    tab.setTitle('LPA')
    _this.search = $location.search();
    _this.contextMenu = new ContextMenu('intervention')

    _this.loadData = function(prevChecked) {
        LxProgressService.circular.show('#5fa2db', '#globalProgress');
        edisonAPI.compta.lpa($location.search()).then(function(result) {
            _.each(result.data, function(sst) {
                sst.list = new FlushList(sst.list, prevChecked);
                if (_this.search.d) {
                    _this.checkArtisan(sst);
                }
                _this.reloadList(sst)
            })
            $rootScope.lpa = result.data
            LxProgressService.circular.hide()
        })
    }


    _this.rowRightClick = function($event, inter) {
        edisonAPI.intervention.get(inter.id, {
                populate: 'sst'
            })
            .then(function(resp) {
                _this.contextMenu.setData(resp.data);
                _this.contextMenu.setPosition($event.pageX, $event.pageY + 200)
                _this.contextMenu.open();
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
                if ($rootScope.lpa[i].list.getList()[0].mode === 'CHQ') {
                    $rootScope.lpa[i].numeroCheque = ++base
                }
            };
        }
    }
    _this.flush = function() {
        var rtn = [];

        var lpa = [];
        _.each(_.cloneDeep($rootScope.lpa), function(e) {
            e.list.__list = _.filter(e.list.__list, 'checked', true);
            if (e.list.__list.length) {
                lpa.push(e);
            }
        })
        console.log(lpa);
        LxProgressService.circular.show('#5fa2db', '#globalProgress');
        edisonAPI.compta.flush(lpa).then(function(resp) {
            edisonAPI.compta.flushMail(lpa).then(function(resp) {
                console.log('yayaya')
            });
        })
    }

    socket.on('intervention_db_flushMail', function(data) {
        if (data === 100) {
            $rootScope.globalProgressCounter = "";
            LxProgressService.circular.hide();
            _this.reloadLPA()
        } else {
            $rootScope.globalProgressCounter = data + '%';
        }

    })

    _this.reloadList = function(artisan) {
        artisan.total = artisan.list.getTotal()
        artisan.total = artisan.list.getTotal(true)
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

    _this.print = function(type) {
        openPost('/api/intervention/print', {
            type: type,
            data: $rootScope.lpa
        });
    }
}


angular.module('edison').controller('LpaController', LpaController);
