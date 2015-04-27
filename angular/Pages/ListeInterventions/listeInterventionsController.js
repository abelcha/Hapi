angular.module('edison').controller('InterventionsController', function(tabContainer, $window, $location, $scope, $filter, config, ngTableParams, interventions) {


  $scope.config = config;
  if (!$scope.tableParams) {
    var tableParameters = {
      page: 1, // show first page
      total: interventions.data.length,
      filter: {},
      count: 100 // count per page
    };
    var tableSettings = {
      //groupBy:$rootScope.config.selectedGrouping,
      total: interventions.data,
      getData: function($defer, params) {
        var data = interventions.data;
        data = $filter('tableFilter')(data, params.filter());
        params.total(data.length);
        data = $filter('orderBy')(data, params.orderBy());
        $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      },
      filterDelay: 150
    }
    console.log("yay");
    $scope.tableParams = new ngTableParams(tableParameters, tableSettings);
  };

  $scope.tab = tabContainer.getCurrentTab();
  $scope.tab.setTitle('Interventions');

  $scope.getStaticMap = function(inter) {
    q = "?width=500&height=250&precision=0&zoom=8&origin=" + inter.client.address.lt + ", " + inter.client.address.lg;
    return "/api/map/staticDirections" + q;
  }


  $scope.expendedRow = -1;
  $scope.rowClick = function($event, info, doubleClick) {
    if (doubleClick) {
      $location.url('/intervention/' + info.id)

    } else if ($event.metaKey || $event.ctrlKey) {
      tabContainer.addTab('/intervention/' + info.id, {
        title: ('#' + info.id),
        setFocus: false,
        allowDuplicates: false
      });
    } else {
      if ($scope.expendedRow === info.id) {
        $scope.expendedRow = -1;
      } else {

        $scope.expendedRow = info.id;
      }
    }
  }

});
