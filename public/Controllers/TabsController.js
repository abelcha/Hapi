app.controller('TabsController', function($scope, $rootScope, $location) {

    $rootScope.updateUrl = function() {
      var url = "";
      if ($rootScope.config.selectedFilter)
        url += $rootScope.getFilter().cleanTitle;
      if ($rootScope.config.selectedTelepro !== -1)
        url += ':' + $rootScope.getTelepro().login;
      if ($rootScope.config.selectedDate)
        url += ':' + $rootScope.getDate().url;
      $location.path("/interventions/" + url) ;
      $rootScope.config.pageTitle = url != "" ? url : "Interventions";
      
    };


    $rootScope.getTelepro = function() {
      return ($rootScope.config.telepro[$rootScope.config.selectedTelepro])
    }
    $scope.setTelepro = function(telepro) {

      $rootScope.config.selectedTelepro = telepro;
      if (telepro === -1) {
         delete $rootScope.tableParams.$params.filter.telepro;
      } else {
          $rootScope.tableParams.$params.filter.telepro = $rootScope.getTelepro().login;
      }
      $rootScope.tableParams.reload();
      $rootScope.updateUrl();
    }


 $rootScope.setGrouping = function(grouping, reload) {
      $rootScope.config.selectedGrouping = grouping;
      $rootScope.tableParams.settings().groupBy = grouping;
      $rootScope.tableParams.$params.sorting = {}
      $rootScope.tableParams.$params.sorting[grouping] = "asc"
      if (reload)
        $rootScope.tableParams.reload();
    }



    $rootScope.setDate = function(date) {
      $rootScope.config.selectedDate = date;
      $rootScope.updateUrl()
      var limit = Date.now() - $rootScope.config.interDate[date].ts;
      $rootScope.newData.forEach(function(e, i) {
        var ts = new Date(e.dateAjout).getTime();
        e.hide = ($rootScope.config.selectedDate != 0 && (ts - limit <= 0));
      });
        $rootScope.tableParams.reload();
    }

    $rootScope.getDate = function() {
      return $rootScope.config.interDate[$rootScope.config.selectedDate];
    }
});