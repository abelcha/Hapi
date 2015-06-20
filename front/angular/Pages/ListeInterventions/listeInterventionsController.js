var InterventionsController = function($timeout, tabContainer, FiltersFactory, ContextMenu, edisonAPI, DataProvider, $routeParams, $location, $q, $rootScope, $filter, config, ngTableParams, interventions, interventionsStats) {
    "use strict";
    var _this = this;
    _this.tab = tabContainer.getCurrentTab();
    _this.recap = $routeParams.artisanID;
    var filtersFactory = new FiltersFactory('intervention')
    var currentFilter;
    if ($routeParams.fltr) {
        // console.log('-->', filtersFactory.getFilterByName)
        currentFilter = filtersFactory.getFilterByUrl($routeParams.fltr)
    }
    var currentHash = $location.hash();
    var title = currentFilter ? currentFilter.long_name : "Interventions";
    _this.tab.setTitle(title, currentHash);
    _this.tab.hash = currentHash;
    _this.config = config;

    var dataProvider = new DataProvider('intervention');
    if (!dataProvider.isInit()) {
        console.log("not init")
        dataProvider.setData(interventions.data);
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
            data = $filter('tableFilter')(data, params.filter(), "lolo");
            params.total(data.length);
            data = $filter('orderBy')(data, params.orderBy());
            $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        filterDelay: 100
    }
    _this.tableParams = new ngTableParams(tableParameters, tableSettings);

    $rootScope.$on('interventionListChange', function() {
        console.log("reload")
        dataProvider.applyFilter(currentFilter, _this.tab.hash);
        _this.tableParams.reload();
    })

    _this.contextMenu = new ContextMenu('intervention')



    _this.rowRightClick = function($event, inter) {
        edisonAPI.intervention.get(inter.id, {
                extend: true
            })
            .then(function(resp) {
                _this.contextMenu.setData(resp.data);
                _this.contextMenu.setPosition($event.pageX, $event.pageY)
                _this.contextMenu.open();
            })
    }

    _this.rowClick = function($event, inter) {
        if (_this.contextMenu.active)
            return _this.contextMenu.close();
        if ($event.metaKey || $event.ctrlKey) {
            tabContainer.addTab('/intervention/' + inter.id, {
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
angular.module('edison').controller('InterventionsController', InterventionsController);
