var ContactArtisanController = function($timeout, tabContainer, LxProgressService, FiltersFactory, ContextMenu, edisonAPI, DataProvider, $routeParams, $location, $q, $rootScope, $filter, config, ngTableParams) {
    "use strict";
    var _this = this;
    _this.loadPanel = function(id) {
        edisonAPI.artisan.get(id)
            .then(function(resp) {
                _this.sst = resp.data;
            })
    }

    var dataProvider = new DataProvider('artisan');
    var filtersFactory = new FiltersFactory('artisan')
    var currentFilter;
    if ($routeParams.fltr) {
        currentFilter = filtersFactory.getFilterByUrl($routeParams.fltr)
    }
    var currentHash = $location.hash();
    var title = currentFilter ? currentFilter.long_name : "Artisan";

    LxProgressService.circular.show('#5fa2db', '#globalProgress');
    dataProvider.init(function(err, resp) {

        _this.tab = tabContainer.getCurrentTab();
        _this.tab.setTitle(title, currentHash);
        _this.tab.hash = currentHash;
        _this.config = config;
        _this.moment = moment;
        if (!dataProvider.isInit()) {
            dataProvider.setData(resp);
        }

        dataProvider.applyFilter(currentFilter, _this.tab.hash);
        _this.tableFilter = "";
        _this.tableLimit = 20;
        $rootScope.expendedRow = 7
        _this.loadPanel($rootScope.expendedRow)
        _this.tableData = dataProvider.filteredData;
        LxProgressService.circular.hide();
    });
    _this.getStaticMap = function(address) {
        if (_this.sst && this.sst.address)
          return "/api/mapGetStatic?width=500&height=600&precision=0&zoom=6&origin=" + _this.sst.address.lt + ", " +_this.sst.address.lg;
    }

    _this.reloadData = function() {
        _this.tableData = $filter('contactFilter')(dataProvider.filteredData, _this.tableFilter);
    }

    _this.loadMore = function() {
        _this.tableLimit += 10;
    }

    /*
        $rootScope.$watch('tableilter', _this.reloadData);
    */
    $rootScope.$on('artisanListChange', function() {
        if (_this.tab.fullUrl === tabContainer.getCurrentTab().fullUrl) {
            dataProvider.applyFilter(currentFilter, _this.tab.hash);
        }
    })

    _this.contextMenu = new ContextMenu('artisan')

    _this.rowRightClick = function($event, inter) {
        _this.contextMenu.setPosition($event.pageX, $event.pageY)
        edisonAPI.artisan.get(inter.id)
            .then(function(resp) {
                _this.contextMenu.setData(resp.data);
                _this.contextMenu.open();
            })
    }

    _this.rowClick = function($event, inter) {
        if (_this.contextMenu.active)
            return _this.contextMenu.close();
        if ($event.metaKey || $event.ctrlKey) {
            tabContainer.addTab('/artisan/' + inter.id, {
                title: ('#' + inter.id),
                setFocus: false,
                allowDuplicates: false
            });
        } else {
            if ($rootScope.expendedRow === inter.id) {
                return 0;
            } else {
                $rootScope.expendedRow = inter.id
                return _this.loadPanel(inter.id)
            }
        }
    }

}
angular.module('edison').controller('ContactArtisanController', ContactArtisanController);
