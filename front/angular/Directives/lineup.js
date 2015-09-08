 var Controller = function(tabContainer, FiltersFactory, ContextMenu, LxProgressService, edisonAPI, DataProvider, $routeParams, $location, $rootScope, $filter, config, ngTableParams) {
     var _this = this;
     LxProgressService.circular.show('#5fa2db', '#globalProgress');
     var currentFilter;
     var currentHash = $location.hash();
     var dataProvider = new DataProvider(_this.model, $routeParams.hashModel);
     var filtersFactory = new FiltersFactory(_this.model)
     if ($routeParams.fltr) {
         currentFilter = filtersFactory.getFilterByUrl($routeParams.fltr)
     }

     _this.smallWin = window.innerWidth < 1200
     $(window).resize(function() {
         _this.smallWin = window.innerWidth < 1200
         console.log('-->', _this.smallWin)
     })

     _this.tab = tabContainer.getCurrentTab();
     _this.tab.hash = currentHash;
     _this.config = config;
     var title = currentFilter ? currentFilter.long_name : _this.model;
     if ($routeParams.id) {
         var id = parseInt($routeParams.id)
         _this.customFilter = function(inter) {
             return inter.ai === id;
         }
     } else {
         _this.tab.setTitle(title, currentHash);
     }
     if ($routeParams.ids_in) {
         _this.customFilter = function(inter) {
             return _.contains($routeParams.ids_in, inter.id);
         }
     }
     dataProvider.init(function(err, resp) {

         dataProvider.applyFilter(currentFilter, _this.tab.hash, _this.customFilter);
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
                 _this.currentFilter = _.clone(params.filter());
                 params.total(data.length);
                 data = $filter('orderBy')(data, params.orderBy());
                 $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
             },
             filterDelay: 100
         }
         _this.tableParams = new ngTableParams(tableParameters, tableSettings);
         LxProgressService.circular.hide()
     })

     var lastChange = 0;
     $rootScope.$on(_this.model.toUpperCase() + '_CACHE_LIST_CHANGE', function(event, newData) {
         if (tabContainer.getCurrentTab() && _this.tab.fullUrl === tabContainer.getCurrentTab().fullUrl && newData._date > lastChange) {
             dataProvider.applyFilter(currentFilter, _this.tab.hash, _this.customFilter);
             _this.tableParams.reload();
             //_this.tableParams.orderBy(_this.tableParams.$params.sorting)
             //_this.tableParams.filter(_this.tableParams.$params.filter)
         }
         lastChange = newData._date;
     })


     _this.contextMenu = new ContextMenu(_this.model)


     _this.rowRightClick = function($event, inter) {
         edisonAPI[_this.model].get(inter.id, {
                 populate: 'sst'
             })
             .then(function(resp) {
                 _this.contextMenu.setData(resp.data);
                 _this.contextMenu.setPosition($event.pageX - ($routeParams.id ? 50 : 0), $event.pageY + ($routeParams.id ? 0 : 200))
                 _this.contextMenu.open();
             })
     }

     _this.rowClick = function($event, inter) {
         if (_this.contextMenu.active)
             return _this.contextMenu.close();
         if ($event.metaKey || $event.ctrlKey) {
             tabContainer.addTab('/' + _this.model + '/' + inter.id, {
                 title: ('#' + inter.id),
                 setFocus: false,
                 allowDuplicates: false
             });
         } else {
             if (_this.expendedRow === inter.id) {
                 _this.expendedRow = undefined;
             } else {
                 _this.expendedRow = inter.id
             }
         }
     }
 }



 angular.module('edison').directive('lineupIntervention', function(tabContainer, FiltersFactory, ContextMenu, LxProgressService, edisonAPI, DataProvider, $routeParams, $location, $rootScope, $filter, config, ngTableParams) {
     "use strict";
     var arg = arguments;
     return {
         replace: false,
         restrict: 'E',
         templateUrl: '/Templates/lineup-intervention.html',
         scope: {
             filter: '=',
         },
         controller: function($scope) {
             $scope.model = 'intervention'
             Controller.apply($scope, arg)
         }
     }
 });

 angular.module('edison').directive('lineupDevis', function(tabContainer, FiltersFactory, ContextMenu, LxProgressService, edisonAPI, DataProvider, $routeParams, $location, $rootScope, $filter, config, ngTableParams) {
     "use strict";
     var arg = arguments;
     return {
         replace: false,
         restrict: 'E',
         templateUrl: '/Templates/lineup-devis.html',
         scope: {
             filter: '=',
         },
         controller: function($scope) {
             $scope.model = 'devis'
             Controller.apply($scope, arg)
         }
     }
 });
