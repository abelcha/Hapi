angular.module('edison', ['ngMaterial', 'lumx', 'ngAnimate', 'ngDialog', 'btford.socket-io', 'pickadate', 'ngRoute', 'ngResource', 'ngTable', 'ngMap'])
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

var getInterList = function(edisonAPI) {
  return edisonAPI.listInterventions(true);
}

var getIntervention = function($route, $q, edisonAPI) {
  var id = $route.current.params.id;

  if (id.length > 10) {
    return $q(function(resolve, reject) {
      resolve({
        client: {},
        reglementSurPlace: true,
        date: {
          ajout: Date.now(),
          intervention: Date.now()
        }
      })
    });
  } else {
    return edisonAPI.getIntervention(id, {
      cache: true,
      extend: true
    });
  }
}

angular.module('edison').config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      redirectTo: '/dashboard',
    })
    .when('/artisan/:id', {
      templateUrl: "Pages/Artisan/artisan.html",
      controller: "ArtisanController",
    })
    .when('/interventions', {
      templateUrl: "Pages/ListeInterventions/listeInterventions.html",
      controller: "InterventionsController",
      resolve: {
        interventions: getInterList
      }
    })
    .when('/intervention', {
      redirectTo: function() {
        return '/intervention/' + Date.now();
      }
    })
    .when('/intervention/:id', {
      templateUrl: "Pages/Intervention/intervention.html",
      controller: "InterventionController",
      resolve: {
        intervention: getIntervention
      }
    })
    .when('/dashboard', {
      controller: 'DashboardController',
      templateUrl: "Pages/Dashboard/dashboard.html",
    })
    .otherwise({
      templateUrl: 'templates/Error404.html',
    });
  // use the HTML5 History API
  $locationProvider.html5Mode(true);
});
