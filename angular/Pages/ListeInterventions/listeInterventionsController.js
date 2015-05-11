angular.module('edison').controller('InterventionsController', function(tabContainer, $window, edisonAPI, dataProvider, $routeParams, $location, $scope, $q, $rootScope, $filter, config, ngTableParams, interventions) {
  $scope.tab = tabContainer.getCurrentTab();
  $scope.tab.setTitle($routeParams.fltr ? config.filters[$routeParams.fltr].long : 'Interventions');
  $scope.api = edisonAPI;
  $scope.config = config;
  $scope.dataProvider = dataProvider;

  if (!$scope.dataProvider.getInterventionList()) {
    $scope.dataProvider.setInterventionList(interventions.data);
  }

  $scope.dataProvider.refreshInterventionListFilter($routeParams.fltr);

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
    $scope.dataProvider.refreshInterventionListFilter($routeParams.fltr);
    $scope.tableParams.reload();
  })

  $scope.getStaticMap = function(inter) {
    q = "?width=500&height=250&precision=0&zoom=10&origin=" + inter.client.address.lt + ", " + inter.client.address.lg;
    return "/api/map/staticDirections" + q;
  }

  $scope.expendedRow = -1;
  $scope.rowClick = function($event, inter, doubleClick) {
    if (doubleClick) {
      $location.url('/intervention/' + inter.id)

    } else if ($event.metaKey || $event.ctrlKey) {
      tabContainer.addTab('/intervention/' + inter.id, {
        title: ('#' + inter.id),
        setFocus: false,
        allowDuplicates: false
      });
    } else {
      if ($scope.expendedRow === inter.id) {
        $scope.expendedRow = -1;
      } else {
        $q.all([
          edisonAPI.getIntervention(inter.id),
          edisonAPI.getArtisanStats(inter.ai)
        ]).then(function(result)  {

          $scope.expendedRow = inter.id;
          $scope.expendedRowData = result[0].data;
          $scope.expendedRowData.artisanStats = result[1].data
        })
      }
    }
  }

});
