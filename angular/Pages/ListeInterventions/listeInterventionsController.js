angular.module('edison').controller('InterventionsController', function(tabContainer, $window, contextMenu, edisonAPI, dataProvider, $routeParams, $location, $scope, $q, $rootScope, $filter, config, ngTableParams, interventions, user, interventionsStats) {
    $scope.user = user.data;
    $scope.interventionsStats = interventionsStats.data;
    $scope.tab = tabContainer.getCurrentTab();

    $scope.recap = $routeParams.artisanID;
    if ($scope.recap) {
        $scope.tab.setTitle("Recap@" + $routeParams.artisanID)
    } else {

        var title = $routeParams.fltr ? config.filters[$routeParams.fltr].long : 'Interventions';
        $scope.tab.setTitle(title, $location.hash());
    }
    $scope.api = edisonAPI;
    $scope.config = config;
    $scope.dataProvider = dataProvider;

    if (!$scope.dataProvider.getInterventionList()) {
        $scope.dataProvider.setInterventionList(interventions.data);
    }

    $scope.dataProvider.refreshInterventionListFilter($routeParams, $location.hash());

    var tableParameters = {
        page: 1, // show first page
        total: $scope.dataProvider.interventionListFiltered.length,
        filter: {},
        count: 100 // count per page
    };
    var tableSettings = {
        //groupBy:$rootScope.config.selectedGrouping,
        total: $scope.dataProvider.interventionListFiltered,
        getData: function($defer, params) {
            var data = $scope.dataProvider.interventionListFiltered;
            data = $filter('tableFilter')(data, params.filter());
            params.total(data.length);
            data = $filter('orderBy')(data, params.orderBy());
            $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        filterDelay: 150
    }
    $scope.tableParams = new ngTableParams(tableParameters, tableSettings);

    $rootScope.$on('InterventionListChange', function() {
        $scope.dataProvider.refreshInterventionListFilter($location.hash());
        $scope.tableParams.reload();
    })

    $scope.contextMenu = contextMenu('interventionList')


    $scope.getStaticMap = function(inter) {
        var q = "?width=500&height=250&precision=0&zoom=10&origin=" + inter.client.address.lt + ", " + inter.client.address.lg;
        return "/api/map/staticDirections" + q;
    }
    $scope.rowRightClick = function($event, inter) {
        $scope.contextMenu.setPosition($event.pageX, $event.pageY)
        $scope.contextMenu.setData(inter);
        $scope.contextMenu.open();
        edisonAPI.intervention.get(inter.id, {
                extend: true
            })
            .then(function(resp) {
                $scope.contextMenu.setData(resp.data);
            })
    }

    $scope.rowClick = function($event, inter, doubleClick) {
        if ($scope.contextMenu.active)
            return $scope.contextMenu.close();
        /*        if (doubleClick) {
                  return   

                } */
        if ($event.metaKey || $event.ctrlKey) {
            tabContainer.addTab('/intervention/' + inter.id, {
                title: ('#' + inter.id),
                setFocus: false,
                allowDuplicates: false
            });
        } else {
            if ($rootScope.expendedRow === inter.id) {
                $rootScope.expendedRow = -1;
            } else {
                $q.all([
                    edisonAPI.intervention.get(inter.id),
                    edisonAPI.artisan.getStats(inter.ai)
                ]).then(function(result)  {

                    $rootScope.expendedRow = inter.id;
                    $rootScope.expendedRowData = result[0].data;
                    $rootScope.expendedRowData.artisanStats = result[1].data
                })
            }
        }
    }

});
