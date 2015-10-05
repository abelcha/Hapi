 var Controller = function($timeout, tabContainer, FiltersFactory, user, ContextMenu, LxProgressService, edisonAPI, DataProvider, $routeParams, $location, $rootScope, $filter, config, ngTableParams) {
     var _this = this;
     LxProgressService.circular.show('#5fa2db', '#globalProgress');
     var currentFilter;
     var currentHash = $location.hash();
     var dataProvider = new DataProvider(_this.model, $routeParams.hashModel);
     var filtersFactory = new FiltersFactory(_this.model)
     if ($routeParams.fltr) {
         currentFilter = filtersFactory.getFilterByUrl($routeParams.fltr)
     }


     _this.routeParamsFilter = $routeParams.fltr;
     if (_this.embedded) {
         _this.$watch('filter', function() {
             if (_.size(_this.filter)) {
                 _this.customFilter = function(inter) {
                     for (var i in _this.filter) {
                         if (_this.filter[i] !== inter[i])
                             return false
                     }
                     return true
                 }
                 if (_this.tableParams) {
                     dataProvider.applyFilter(currentFilter, _this.tab.hash, _this.customFilter);
                     _this.tableParams.reload();
                 }
             }
         })

     }

     _this.displaySubRow = function(inter) {
         return _this.expendedRow && _this.expendedRow === inter.id;
     }

     _this.smallWin = window.innerWidth < 1400
     $(window).resize(function() {
         _this.smallWin = window.innerWidth < 1400
     })

     _this.tab = tabContainer.getCurrentTab();
     _this.tab.hash = currentHash;
     _this.config = config;
     var title = currentFilter ? currentFilter.long_name : _this.model;
     if ($routeParams.sstid) {
         var id = parseInt($routeParams.sstid)
         _this.customFilter = function(inter) {
             return inter.ai === id;
         }
     } else {
         _this.tab.setTitle(title, currentHash);
     }
     if ($routeParams.sstids_in) {
         _this.customFilter = function(inter) {
             return _.contains($routeParams.sstids_in, inter.id);
         }
     }

     var actualiseUrl = _.throttle(function(fltrs, page) {
         $location.search('page', page !== 1 ? page : undefined);
         _.each(fltrs, function(e, k) {
             // console.log(e, k)
             if (!e) e = undefined;
             if (e !== "hashModel") {
                 $location.search(k, e);

             } else {
                 //console.log(e)
             }
         })
     }, 250)
     if (_this.routeParamsFilter === 'relanceClient') {
         sorting = {
             l: 'asc'
         }
     } else {
         sorting = {
             id: 'desc'
         }
     }
     dataProvider.init(function(err, resp) {


         dataProvider.applyFilter(currentFilter, _this.tab.hash, _this.customFilter);
         var tableParameters = {
             page: $location.search()['page'] ||  1,
             total: dataProvider.filteredData.length,
             filter: _.omit($location.search(), 'hashModel', 'page', 'sstid'),
             sorting: sorting,
             count: _this.limit || 100
         };
         var tableSettings = {
             total: dataProvider.filteredData,
             getData: function($defer, params) {
                 actualiseUrl(params.filter(), params.page())
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
         if (tabContainer.getCurrentTab() && _this.tab.fullUrl === tabContainer.getCurrentTab().fullUrl) {
             dataProvider.applyFilter(currentFilter, _this.tab.hash, _this.customFilter);
             _this.tableParams.reload();
             //_this.tableParams.orderBy(_this.tableParams.$params.sorting)
             //_this.tableParams.filter(_this.tableParams.$params.filter)
         }
     })


     _this.contextMenu = new ContextMenu(_this.model)


     if (user.service === 'COMPTABILITE') {
         var subs = _.findIndex(_this.contextMenu.list, "title", "Appels");
         if (subs) {
             var tmp = _this.contextMenu.list[subs]
             _this.contextMenu.list.splice(subs, 1);
             _this.contextMenu.list.push(tmp);
         }
     }
     _this.rowRightClick = function($event, inter) {
         edisonAPI[_this.model].get(inter.id, {
                 populate: 'sst'
             })
             .then(function(resp) {
                 _this.contextMenu.setData(resp.data);
                 _this.contextMenu.setPosition($event.pageX - (($routeParams.sstid ||  _this.embedded) ? 50 : 0), $event.pageY + ($routeParams.sstid ||  _this.embedded ? 0 : 200))
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
             // $('.drpdwn').remove()
             if (_this.expendedRow === inter.id) {
                 _this.expendedRow = undefined;
             } else {
                 _this.expendedRow = inter.id
             }
         }
     }
 }



 angular.module('edison').directive('lineupIntervention', function($timeout, tabContainer, FiltersFactory, user, ContextMenu, LxProgressService, edisonAPI, DataProvider, $routeParams, $location, $rootScope, $filter, config, ngTableParams) {
     "use strict";
     var arg = arguments;
     return {
         replace: false,
         restrict: 'E',
         templateUrl: '/Templates/lineup-intervention.html',
         scope: {
             limit: '=',
             embedded: '=',
             filter: '=',
         },
         controller: function($scope) {

             $scope.model = 'intervention'
             Controller.apply($scope, arg)
         }
     }
 });

 angular.module('edison').directive('lineupDevis', function($timeout, tabContainer, FiltersFactory, user, ContextMenu, LxProgressService, edisonAPI, DataProvider, $routeParams, $location, $rootScope, $filter, config, ngTableParams) {
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

 angular.module('edison').directive('lineupArtisan', function($timeout, tabContainer, FiltersFactory, user, ContextMenu, LxProgressService, edisonAPI, DataProvider, $routeParams, $location, $rootScope, $filter, config, ngTableParams) {
     "use strict";
     var arg = arguments;
     return {
         replace: false,
         restrict: 'E',
         templateUrl: '/Templates/lineup-artisan.html',
         scope: {

         },
         controller: function($scope) {
             $scope.model = 'artisan'

             Controller.apply($scope, arg)
         }
     }
 });
