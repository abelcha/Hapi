angular.module('edison', ['ngRoute', 'ngResource', 'ngTable']);

angular.module('edison').controller('MainController', function($scope, $rootScope){

});

angular.module('edison').run(['$rootScope', function($root) {
  $root.loadingData = true;
  $root.$on('$routeChangeSuccess', function(e, curr, prev) { 
    $root.loadingData = false;
  });
}]);

starterKit = {

  interventions: function(edisonAPI) {
    return edisonAPI.getInterventions(true);
  },
  artisans: function(edisonAPI) {
    return edisonAPI.getArtisans(true);
  }
};


angular.module('edison').config(function($routeProvider, $locationProvider){
  $routeProvider
    .when('/', {
      redirectTo: '/dashboard',
      resolve: starterKit
    })
    .when('/interventions', {
      templateUrl: "Pages/ListeInterventions/ListeInterventions.html",
      controller: "InterventionsController",
      resolve: starterKit
    })
    .when('/intervention', {
      templateUrl: "Pages/Intervention/intervention.html",
      controller: "InterventionController",
      resolve: starterKit
    })
    .when('/dashboard', {
      controller:'DashboardController',
      templateUrl: "Pages/Dashboard/dashboard.html",
      resolve: starterKit
    })
    .otherwise({
        templateUrl: 'templates/Error404.html',
        resolve: starterKit
    });
    // use the HTML5 History API
    $locationProvider.html5Mode(true);
});