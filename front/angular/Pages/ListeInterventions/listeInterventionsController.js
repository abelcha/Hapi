var InterventionsController = function($q, tabContainer, FiltersFactory, ContextMenu, LxProgressService, edisonAPI, DataProvider, $routeParams, $location, $rootScope, $filter, config, ngTableParams) {
    "use strict";
    var _this = this;
    var currentFilter;
    var currentHash = $location.hash();
    var dataProvider = new DataProvider('intervention', $routeParams.hashModel);
    var filtersFactory = new FiltersFactory('intervention')
    if ($routeParams.fltr) {
        currentFilter = filtersFactory.getFilterByUrl($routeParams.fltr)
    }

    var title = currentFilter ? currentFilter.long_name : "Interventions";
    _this.recap = $routeParams.sstID ? parseInt($routeParams.sstID) : false;


    LxProgressService.circular.show('#5fa2db', '#globalProgress');
    dataProvider.init(function(err, resp) {
        _this.tab = tabContainer.getCurrentTab();
        _this.tab.setTitle(title, currentHash);
        _this.tab.hash = currentHash;
        _this.config = config;

        if (_this.recap) {
            _this.customFilter = function(inter) {
                return inter.ai === _this.recap;
            }
            _this.tab.setTitle('Recap ' + _this.recap)
        }

        dataProvider.applyFilter(currentFilter, _this.tab.hash, _this.customFilter);
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
                if (!_.isEqual(params.filter(), _this.currentFilter))
                    data = $filter('tableFilter')(data, params.filter());
                _this.currentFilter = _.clone(params.filter());
                params.total(data.length);
                data = $filter('orderBy')(data, params.orderBy());
                $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            },
            filterDelay: 100
        }
        _this.tableParams = new ngTableParams(tableParameters, tableSettings);
        LxProgressService.circular.hide();
    })
    var lastChange = 0;
    $rootScope.$on('interventionListChange', function(event, newData) {
        if (_this.tab.fullUrl === tabContainer.getCurrentTab().fullUrl && newData._date > lastChange) {
            dataProvider.applyFilter(currentFilter, _this.tab.hash, _this.customFilter);
            _this.tableParams.reload();
        }
        lastChange = newData._date;
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
