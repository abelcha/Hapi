
app.controller('SideBarController', function($scope, $rootScope, $location) {


  $scope.toggleSidebar = function(i) {
    $('body').toggleClass('closed-sidebar').toggleClass('open-sidebar');
    $('.fa-bars.fa-2x').toggleClass('fa-rotate-270');
  }
  

  $rootScope.getFilter = function() {
    for (var k in $rootScope.config.interFilters) {
      for (var x in $rootScope.config.interFilters[k].list) {
        e = $rootScope.config.interFilters[k].list[x];
        if (e.id === $rootScope.config.selectedFilter) {
          return (e);
        }
      }
    }
    return (null);
  }

  $scope.changeFilter = function(fltr) {
      $rootScope.config.selectedFilter = fltr;
      var newFilter = $rootScope.getFilter();
      var selectedTelepro =  $rootScope.tableParams.$params.filter.telepro;
      $rootScope.tableParams.$params.filter = newFilter.filter;
      $rootScope.tableParams.$params.filter.hide = false;
      if (typeof selectedTelepro !== "undefined")
        $rootScope.tableParams.$params.filter.telepro = selectedTelepro;
      if (newFilter.grouping)
       $rootScope.setGrouping(newFilter.grouping, false)
      $rootScope.updateUrl();
  }

});