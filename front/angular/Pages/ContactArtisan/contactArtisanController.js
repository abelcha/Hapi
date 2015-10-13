var ContactArtisanController = function($scope, $timeout, TabContainer, LxProgressService, FiltersFactory, ContextMenu, edisonAPI, DataProvider, $routeParams, $location, $q, $rootScope, $filter, config, ngTableParams) {
    "use strict";
    var _this = this;
    _this.loadPanel = function(id) {
        edisonAPI.artisan.get(id)
            .then(function(resp) {
                _this.sst = resp.data;
                _this.tab.setTitle('@' + _this.sst.nomSociete.slice(0, 10));

            })
    }
    _this.tbz = ['informations', 'interventions', 'historique', 'stats', 'paiements'];
    var ind = _this.tbz.indexOf($location.hash());
    $scope.selectedIndex = ind >= 0 ? ind : 0
    _this.tab = TabContainer.getCurrentTab();

    _this.recap = $location.url().includes('recap') ? $routeParams.sstid : undefined

    if (_this.recap) {
        _this.loadPanel(_this.recap)
    } else {
        console.log('-->', 'yay')
        LxProgressService.circular.show('#5fa2db', '#globalProgress');
        var dataProvider = new DataProvider('artisan');
        dataProvider.init(function(err, resp) {
            console.log('init')
            _this.config = config;
            _this.moment = moment;
            if (!dataProvider.isInit()) {
                dataProvider.setData(resp);
            }

            _this.tableFilter = "";
            _this.tableLimit = 20;
            $rootScope.expendedRow = $routeParams.sstid || 45
            console.log(_this.recap, $location.url())
                // if (_this.recap) {
                //     $scope.selectedIndex = 1;
                // }
            _this.tableData = dataProvider.getData()
            _this.loadPanel(_this.tableData[0].id)
            LxProgressService.circular.hide();
        });
    }

    _this.getStaticMap = function(address) {
        if (_this.sst && this.sst.address)
            return "/api/mapGetStatic?width=500&height=400&precision=0&zoom=6&origin=" + _this.sst.address.lt + ", " + _this.sst.address.lg;
    }

    _this.reloadData = function() {
        _this.tableData = $filter('contactFilter')(dataProvider.getData(), _this.tableFilter);
    }

    _this.loadMore = function() {
        _this.tableLimit += 10;
    }

    /*
        $rootScope.$watch('tableilter', _this.reloadData);
    */
    $rootScope.$on('ARTISAN_CACHE_LIST_CHANGE', function() {
        if (_this.tab.fullUrl === TabContainer.getCurrentTab().fullUrl) {
            dataProvider.applyFilter(currentFilter, _this.tab.hash);
        }
    })

    _this.contextMenu = new ContextMenu('artisan')

    _this.rowRightClick = function($event, inter) {
        console.log('contactclick')
        _this.contextMenu.setPosition($event.pageX, $event.pageY + 200)
        edisonAPI.artisan.get(inter.id)
            .then(function(resp) {
                _this.contextMenu.setData(resp.data);
                _this.contextMenu.open();
            })
    }

    $scope.addComment = function() {
        edisonAPI.artisan.comment(_this.sst.id, $scope.commentText).then(function() {
            _this.loadPanel(_this.sst.id);
            $scope.commentText = "";
        })
    }

    _this.rowClick = function($event, inter) {
        if (_this.contextMenu.active)
            return _this.contextMenu.close();
        if ($event.metaKey || $event.ctrlKey) {
            TabContainer.addTab('/artisan/' + inter.id, {
                title: ('#' + inter.id),
                setFocus: false,
                allowDuplicates: false
            });
        } else {
            if ($rootScope.expendedRow === inter.id) {
                return 0;
            } else {
                $rootScope.expendedRow = inter.id
                _this.loadPanel(inter.id)
                $location.search('sstid', inter.id);
            }
        }
    }


    $scope.$watchCollection('[selectedIndex, expendedRow]', function(current, prev) {
            if (current && current[0] !== void(0)) {
                $location.hash(_this.tbz[current[0]]);
            }
            if (prev[1] && $scope.selectedIndex == 4) {
                $scope.compteTiers = undefined
                edisonAPI.artisan.getCompteTiers($rootScope.expendedRow).success(function(resp) {
                    $scope.compteTiers = resp;
                })
            }
        })
        /*
            $scope.$on('$locationChangeSuccess', function(event) {
                if ($route.current.$$route.controller === 'CurrencyConvertCtrl') {
                    // Will not load only if my view use the same controller
                    $route.current = lastRoute;
                }
            });
        */
    $scope.$watch('selectedIndex', function(current, prev) {
        if (current !== void(0) && prev !== current)  {
            $('md-tabs-content-wrapper').hide()
            $timeout(function() {
                $('md-tabs-content-wrapper').show()
            }, 500)
        }
    })

}
angular.module('edison').controller('ContactArtisanController', ContactArtisanController);
