angular.module('edison', ['ngMaterial', 'lumx', 'ngAnimate', 'btford.socket-io', 'pickadate', 'ngRoute', 'ngResource', 'ngTable', 'ngMap'])
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('indigo')
      .accentPalette('red');
  });


angular.module('edison').controller('MainController', function(tabContainer, $scope, $rootScope, $location, edisonAPI) {


  $rootScope.loadingData = true;
  $rootScope.$on('$routeChangeSuccess', function(e, curr, prev) {
    $rootScope.loadingData = false;
  });

  $scope.sideBarlinks = [{
    url: '/interventions',
    title: 'Liste Interventions',
    icon: 'tasks'
  }, {
    url: '/dashboard',
    title: 'Dashboard',
    icon: 'dashboard'
  }, {
    url: '/intervention',
    title: 'Nouvelle Intervention',
    icon: 'plus'
  }];

  $scope.tabs = tabContainer;
  $scope.$watch('tabs.selectedTab', function(prev, curr) {
    if (prev === -1 && curr !== -1) {
      $scope.tabs.selectedTab = curr;
    }
  })
  $rootScope.options = {
    showMap: true
  };

  var initTabs = function(baseUrl) {
    this.tabsInitialized = true;
    $scope.tabs.loadSessionTabs(baseUrl)
      .then(function(urlIsInTabs) {
        $location.url(baseUrl)
      }).catch(function() {
        $scope.tabs.addTab(baseUrl);
      });
    return 0;
  }

  $scope.$on("$locationChangeStart", function(event, next, current) {
    if ($location.path() === "/") {
      return 0;
    }
    if (!this.tabsInitialized) {
      return initTabs($location.path())
    }
    if ($location.path() !== "/intervention") {
      $scope.tabs.addTab($location.path());
    }
    edisonAPI.request({
      fn: 'setSessionData',
      data: {
        tabContainer: $scope.tabs
      }
    })

  });

  $scope.tabIconClick = function($event, tab) {
    $event.preventDefault();
    $event.stopPropagation();
    if ($scope.tabs.remove(tab)) {
      $location.url($scope.tabs.getCurrentTab().url);
    }
  }
});


starterKit = {
  interventions: function(edisonAPI) {
    return edisonAPI.getInterventions(true);
  },
  artisans: function(edisonAPI) {
    return edisonAPI.getArtisans(true);
  }
};


angular.module('edison').config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      redirectTo: '/dashboard',
      resolve: starterKit
    })
    .when('/interventions', {
      templateUrl: "Pages/ListeInterventions/listeInterventions.html",
      controller: "InterventionsController",
      resolve: starterKit
    })
    .when('/intervention', {
      redirectTo: function() {
        return '/intervention/' + Date.now();
      }
    })
    .when('/intervention/:id', {
      templateUrl: "Pages/Intervention/intervention.html",
      controller: "InterventionController",
      resolve: starterKit
    })
    .when('/dashboard', {
      controller: 'DashboardController',
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
