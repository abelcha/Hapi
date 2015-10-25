var ContactArtisanController = function($scope, $timeout, TabContainer, LxProgressService, FiltersFactory, ContextMenu, edisonAPI, DataProvider, $routeParams, $location, $q, $rootScope, $filter, config, ngTableParams) {
    "use strict";
    var _this = this;

    _this.loadPanel = function(id) {
        edisonAPI.artisan.get(id)
            .then(function(resp) {
                _this.sst = resp.data;
                console.log(TabContainer)
                _this.tab.setTitle('@' + _this.sst.nomSociete.slice(0, 10));

            })
        edisonAPI.artisan.getStats(id).then(function(resp) {
            new Chartist.Pie('.ct-chart', {
                series: [{
                    value: resp.data.envoye.total,
                    name: 'En cours',
                    className: 'ct-orange',
                    meta: 'Meta One'
                }, {
                    value: resp.data.annule.total,
                    name: 'annulé',
                    className: 'ct-red',
                    meta: 'Meta One'
                }, {
                    value: resp.data.paye.total,
                    name: 'payé',
                    className: 'ct-green',
                    meta: 'Meta One'
                }]
            }, {
                total: resp.data.annule.total + resp.data.paye.total + resp.data.envoye.total,
                donut: true,
                startAngle: 270,
                donutWidth: 62,
                /* donut: true,
                 total: 100 +resp.data.annule.total + resp.data.paye.total + resp.data.envoye.total,
                 showLabel: false*/
            });
            _this.stats = resp.data
        })

    }

    _this.reloadStats = function() {
        edisonAPI.artisan.statsMonths($routeParams.sstid).then(function(resp) {
            var series = ['Annulé', 'Payé'];
            var labels = []
            var data = [
                [],
                []
            ];
            _.each(resp.data, function(e) {
                labels.push(_.capitalize(moment([e.year, e.month - 1]).format('MMMM YYYY')))
                data[0].push(e.annule);
                data[1].push(e.paye);
            })
            _this.sstChart = {
                series: series,
                data: data,
                labels: labels,
                options: {
                    scaleBeginAtZero: true,
                },
                colours: [
                    '#F7464A', // red
                    '#46BFBD', // green
                   
                ]
            }
        });
    }


    _this.tbz = ['informations', 'interventions', 'historique', 'stats', 'paiements'];
    var ind = _this.tbz.indexOf($location.hash());
    $scope.selectedIndex = ind >= 0 ? ind : 0
    _this.tab = TabContainer.getCurrentTab();

    _this.recap = $location.url().includes('recap') ? $routeParams.sstid : undefined

    if (_this.recap) {
        _this.loadPanel(_this.recap)
    } else {
        LxProgressService.circular.show('#5fa2db', '#globalProgress');
        var dataProvider = new DataProvider('artisan');
        dataProvider.init(function(err, resp) {
            _this.config = config;
            _this.moment = moment;
            if (!dataProvider.isInit()) {
                dataProvider.setData(resp);
            }
            _this.tableFilter = "";
            _this.tableLimit = 20;
            $rootScope.expendedRow = $routeParams.sstid || 45
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
        if (_this.tbz[current[0]] === 'stats') {
            _this.reloadStats();
        }
    })


}
angular.module('edison').controller('ContactArtisanController', ContactArtisanController);
