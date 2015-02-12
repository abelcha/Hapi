
app.controller('SideBarController', function($scope, $rootScope, $location) {


  $scope.toggleSidebar = function(i) {
    var offset = (typeof i !== 'undefined' ? 77 : 0); 
    if (i == 0 || $('.side-menu').css('margin-left') == "0px") {
       $(".side-menu>div>ul>li:not(.toggleButton)").css("visibility", "hidden")
       $('.side-body').css('margin-left', (  34 - offset) +"px");
       $('.side-menu').css('margin-left', (-186 - offset) + "px");

    }
    else {
       $('.side-body').css('margin-left', (offset ? 0 :220) + "px");
       $('.side-menu').css('margin-left', "0px");
       $(".side-menu>div>ul>li:not(.toggleButton)").css("visibility", "visible")
    }
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
      $rootScope.updateUrl();
  }

});