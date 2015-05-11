angular.module('edison').controller('InterventionsController', function(tabContainer, $window, edisonAPI, dataProvider, $routeParams, $location, $scope, $q, $rootScope, $filter, config, ngTableParams, interventions) {
  $scope.tab = tabContainer.getCurrentTab();

  $scope.recap = $routeParams.artisanID;
  if ($scope.recap) {
    $scope.tab.setTitle("Recap@" + $routeParams.artisanID)

    $scope.data = [
  {label: "Four", value: 44, color: "#F44336"},
  {label: "Five", value: 55, color: "#ff9800"},
  {label: "Six", value: 66, color: "#00C853"}
    ];
    $scope.options = {thickness: 200};
  } else {
      $scope.tab.setTitle($routeParams.fltr ? config.filters[$routeParams.fltr].long : 'Interventions');
  }
  $scope.api = edisonAPI;
  $scope.config = config;
  $scope.dataProvider = dataProvider;

  if (!$scope.dataProvider.getInterventionList()) {
    $scope.dataProvider.setInterventionList(interventions.data);
  }

  $scope.dataProvider.refreshInterventionListFilter($routeParams);

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
    $scope.dataProvider.refreshInterventionListFilter($routeParams);
    $scope.tableParams.reload();
  })

  $scope.getStaticMap = function(inter) {
    q = "?width=500&height=250&precision=0&zoom=10&origin=" + inter.client.address.lt + ", " + inter.client.address.lg;
    return "/api/map/staticDirections" + q;
  }
  
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
      if ($rootScope.expendedRow === inter.id) {
        $rootScope.expendedRow = -1;
      } else {
        $q.all([
          edisonAPI.getIntervention(inter.id),
          edisonAPI.getArtisanStats(inter.ai)
        ]).then(function(result)  {

          $rootScope.expendedRow = inter.id;
          $rootScope.expendedRowData = result[0].data;
          $rootScope.expendedRowData.artisanStats = result[1].data
        })
      }
    }
  }

});
