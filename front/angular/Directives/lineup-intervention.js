 angular.module('edison').directive('lineupIntervention', function(tabContainer, FiltersFactory, ContextMenu, LxProgressService, edisonAPI, DataProvider, $routeParams, $location, $rootScope, $filter, config, ngTableParams) {
     "use strict";
     return {
         replace: false,
         restrict: 'E',
         templateUrl: '/Templates/lineup-intervention.html',
         scope: {
             filter: '=',
         },
         controller: function($scope) {
             LxProgressService.circular.show('#5fa2db', '#globalProgress');
             var currentFilter;
             var currentHash = $location.hash();
             var dataProvider = new DataProvider('intervention', $routeParams.hashModel);
             var filtersFactory = new FiltersFactory('intervention')
             if ($routeParams.fltr) {
                 currentFilter = filtersFactory.getFilterByUrl($routeParams.fltr)
             }
             $scope.tab = tabContainer.getCurrentTab();
             $scope.tab.hash = currentHash;
             $scope.config = config;
             var title = currentFilter ? currentFilter.long_name : "Interventions";
             if ($routeParams.id) {
                 var id = parseInt($routeParams.id)
                 $scope.customFilter = function(inter) {
                     return inter.ai === id;
                 }
             } else {
                 $scope.tab.setTitle(title, currentHash);
             }
             dataProvider.init(function(err, resp) {

                 dataProvider.applyFilter(currentFilter, $scope.tab.hash, $scope.customFilter);
                 var tableParameters = {
                     page: 1,
                     total: dataProvider.filteredData.length,
                     filter: {},
                     sorting: {
                         id: 'desc'
                     },
                     count: 100
                 };
                 var tableSettings = {
                     total: dataProvider.filteredData,
                     getData: function($defer, params) {
                         var data = dataProvider.filteredData;
                         data = $filter('tableFilter')(data, params.filter());
                         $scope.currentFilter = _.clone(params.filter());
                         params.total(data.length);
                         data = $filter('orderBy')(data, params.orderBy());
                         $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                     },
                     filterDelay: 100
                 }
                 $scope.tableParams = new ngTableParams(tableParameters, tableSettings);
                 LxProgressService.circular.hide()
             })

             var lastChange = 0;
             $rootScope.$on('INTERVENTION_CACHE_LIST_CHANGE', function(event, newData) {
                 if (tabContainer.getCurrentTab() && $scope.tab.fullUrl === tabContainer.getCurrentTab().fullUrl && newData._date > lastChange) {
                     dataProvider.applyFilter(currentFilter, $scope.tab.hash, $scope.customFilter);
                     $scope.tableParams.reload();
                     // $scope.tableParams.orderBy($scope.tableParams.$params.sorting)
                     // $scope.tableParams.filter($scope.tableParams.$params.filter)
                 }
                 lastChange = newData._date;
             })




             $scope.contextMenu = new ContextMenu('intervention')


             $scope.rowRightClick = function($event, inter) {
                 edisonAPI.intervention.get(inter.id, {
                         populate: 'sst'
                     })
                     .then(function(resp) {
                         $scope.contextMenu.setData(resp.data);
                         $scope.contextMenu.setPosition($event.pageX - ($routeParams.id ? 50 : 0), $event.pageY + ($routeParams.id ? 0 : 200))
                         $scope.contextMenu.open();
                     })
             }

             $scope.rowClick = function($event, inter) {
                 if ($scope.contextMenu.active)
                     return $scope.contextMenu.close();
                 if ($event.metaKey || $event.ctrlKey) {
                     tabContainer.addTab('/intervention/' + inter.id, {
                         title: ('#' + inter.id),
                         setFocus: false,
                         allowDuplicates: false
                     });
                 } else {
                     if ($scope.expendedRow === inter.id) {
                         $scope.expendedRow = undefined;
                     } else {
                         $scope.expendedRow = inter.id
                     }
                 }
             }
         }
     }
 });
