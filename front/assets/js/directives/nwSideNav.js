angular.module("edison").directive('nwSideNav', function(){
  return {
    replace: true,
    restrict: "E",
    templateUrl: "templates/directives/nwSideNav.html",
    controller: function($scope, $location){
      $scope.isPage = function(name){
        return new RegExp("/" + name + "($|/)").test($location.path());
      };
    }
  };
});