var ArtisanController = function($timeout, tabContainer, LxProgressService, FiltersFactory, ContextMenu, edisonAPI, DataProvider, $routeParams, $location, $q, $rootScope, $filter, config, ngTableParams) {
    "use strict";
    var _this = this;
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
        var tableParameters = {
            page: 1, // show first page
            total: dataProvider.filteredData.length,
            filter: {},
            sorting: {
                id: 'desc'
            },
            count: 100 // count per page
        };
        var tableSettings = {
            //groupBy:$rootScope.config.selectedGrouping,
            total: dataProvider.filteredData,
            getData: function($defer, params) {
                var data = dataProvider.filteredData;
                data = $filter('tableFilter')(data, params.filter());
                params.total(data.length);
                data = $filter('orderBy')(data, params.orderBy());
                $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            },
            filterDelay: 100
        }
        _this.tableParams = new ngTableParams(tableParameters, tableSettings);
        LxProgressService.circular.hide();
    });

    $rootScope.$on('artisanListChange', function() {
        console.log("yayay change")
        dataProvider.applyFilter(currentFilter, _this.tab.hash);
        _this.tableParams.reload();
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
                $rootScope.expendedRow = undefined;
            } else {
                $rootScope.expendedRow = inter.id
            }
        }
    }

}
angular.module('edison').controller('ListeArtisanController', ArtisanController);
