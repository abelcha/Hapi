angular.module('edison').directive('listeIntervention', function(tabContainer, FiltersFactory, ContextMenu, LxProgressService, edisonAPI, DataProvider, $routeParams, $location, $rootScope, $filter, config, ngTableParams) {
    "use strict";
    return {
        restrict: 'E',
        templateUrl: '/Templates/listeIntervention.html',
        scope: {
            id: "=",
            //display: "="
        },
        link: function(scope, element, attrs) {
            var currentFilter;
            var currentHash = undefined;
            var dataProvider = new DataProvider('intervention');
            var filtersFactory = new FiltersFactory('intervention')

            var title = currentFilter ? currentFilter.long_name : "Interventions";
            scope.recap = $routeParams.sstID ? parseInt($routeParams.sstID) : false;


            dataProvider.init(function(err, resp) {
                scope.config = config;

                scope.customFilter = function(inter) {
                    return inter.ai === scope.id;
                }

                dataProvider.applyFilter(currentFilter, undefined, scope.customFilter);
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
                        if (!_.isEqual(params.filter(), scope.currentFilter))
                            data = $filter('tableFilter')(data, params.filter());
                        scope.currentFilter = _.clone(params.filter());
                        params.total(data.length);
                        data = $filter('orderBy')(data, params.orderBy());
                        $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    },
                    filterDelay: 100
                }
                scope.tableParams = new ngTableParams(tableParameters, tableSettings);
            })
            var lastChange = 0;
            $rootScope.$on('INTERVENTION_CACHE_LIST_CHANGE', function(event, newData) {
                if (scope.tab.fullUrl === tabContainer.getCurrentTab().fullUrl && newData._date > lastChange) {
                    dataProvider.applyFilter(currentFilter, scope.tab.hash, scope.customFilter);
                    scope.tableParams.reload();
                }
                lastChange = newData._date;
            })

            scope.contextMenu = new ContextMenu('intervention')


            scope.rowRightClick = function($event, inter) {
                edisonAPI.intervention.get(inter.id, {
                        extend: true
                    })
                    .then(function(resp) {
                        scope.contextMenu.setData(resp.data);
                        scope.contextMenu.setPosition($event.pageX - 40, $event.pageY)
                        scope.contextMenu.open();
                    })
            }
            scope.rowClick = function($event, inter) {
                if (scope.contextMenu.active)
                    return scope.contextMenu.close();
                if ($event.metaKey || $event.ctrlKey) {
                    tabContainer.addTab('/intervention/' + inter.id, {
                        title: ('#' + inter.id),
                        setFocus: false,
                        allowDuplicates: false
                    });
                } else {
                    if (scope.expendedRow === inter.id) {
                        scope.expendedRow = undefined;
                    } else {
                        scope.expendedRow = inter.id
                    }
                }
            }
            scope.$watch('id', function(current, prev) {
                if (current && current !== prev) {
                    scope.customFilter = function(inter) {
                        return inter.ai === current;
                    }
                    dataProvider.applyFilter(currentFilter, undefined, scope.customFilter);
                    if (scope.tableParams)
                        scope.tableParams.reload();

                }
            })

        }
    }

});
