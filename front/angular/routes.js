angular.module('edison', ['browserify', 'ngMaterial', 'lumx', 'ngAnimate', 'xeditable', 'ngDialog', 'btford.socket-io', 'ngFileUpload', 'pickadate', 'ngRoute', 'ngResource', 'ngTable', 'ngMap'])
    .config(function($mdThemingProvider) {
        "use strict";
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('blue-grey');
    });


angular.module('edison').controller('MainController', function(tabContainer, $scope, socket, config, dataProvider, $rootScope, $location, edisonAPI, taskList) {
    "use strict";
    $scope.config = config;
    $rootScope.loadingData = true;
    $rootScope.$on('$routeChangeSuccess', function() {
        $rootScope.loadingData = false;
    });

    $scope.sideBarlinks = [{
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
    });
    $rootScope.options = {
        showMap: true
    };

    var reloadStats = function() {

        edisonAPI.intervention.getStats()
            .success(function(result) {
                $scope.userStats = _.find(result, function(e) {
                    return e.login === $scope.user.login;
                });
                $scope.interventionsStats = result;
            });
    };

    edisonAPI.getUser().success(function(result) {
        $rootScope.user = result;
        reloadStats();
    });


    $rootScope.$on('InterventionListChange', reloadStats);

    var initTabs = function(baseUrl) {
        $scope.tabsInitialized = true;
        $scope.tabs.loadSessionTabs(baseUrl)
            .then(function() {
                $location.url(baseUrl);
            }).catch(function() {
                $scope.tabs.addTab(baseUrl);
            });
        return 0;
    };

    $scope.$on("$locationChangeStart", function(event) {
        if (!event) {
            edisonAPI.request({
                fn: 'setSessionData',
                data: {
                    tabContainer: $scope.tabs
                }
            });

        }
        if ($location.path() === "/") {
            return 0;
        }
        if (!$scope.tabsInitialized) {
            return initTabs($location.path());
        }
        if ($location.path() !== "/intervention") {
            $scope.tabs.addTab($location.path());
        }

    });

    $scope.taskList = taskList;

    $scope.linkClick = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
    };

    $scope.tabIconClick = function($event, tab) {
        $event.preventDefault();
        $event.stopPropagation();
        if ($scope.tabs.remove(tab)) {
            $location.url($scope.tabs.getCurrentTab().url);
        }
    };
});

var getInterList = function(edisonAPI) {
    "use strict";
    return edisonAPI.intervention.list({
        cache: true
    });
};
var getArtisanList = function(edisonAPI) {
    "use strict";
    return edisonAPI.artisan.list({
        cache: true
    });
};

var getArtisan = function($route, $q, edisonAPI) {
    "use strict";
    var id = $route.current.params.id;

    if (id.length > 10) {
        return $q(function(resolve) {
            resolve({
                data: {
                    telephone: {},
                    pourcentage: {},
                    add: {},
                    representant: {},
                }
            });
        });
    } else {
        return edisonAPI.artisan.get(id, {
            cache: true,
            extend: true
        });
    }
};

var getInterventionStats = function(edisonAPI) {
    "use strict";
    return edisonAPI.intervention.getStats();
};

var getIntervention = function($route, $q, edisonAPI) {
    "use strict";
    var id = $route.current.params.id;

    if (id.length > 10) {
        return $q(function(resolve) {
            resolve({
                data: {
                    prixAnnonce: 0,
                    prixFinal: 0,
                    coutFourniture: 0,
                    comments: [],
                    produits: [],
                    tva: 20,
                    client: {},
                    reglementSurPlace: true,
                    date: {
                        ajout: Date.now(),
                        intervention: Date.now()
                    }
                }
            });
        });
    } else {
        return edisonAPI.intervention.get(id, {
            cache: true,
            extend: true
        });
    }
};



angular.module('edison').config(function($routeProvider, $locationProvider) {
    "use strict";
    $routeProvider
        .when('/', {
            resolve: {
                interventions: getInterList,
                artisans: getArtisanList
            },
            redirectTo: '/interventions',
        })
        .when('/artisan/:id', {
            templateUrl: "Pages/Artisan/artisan.html",
            controller: "ArtisanController",
            resolve: {
                artisan: getArtisan,
                interventions: getInterList,
                artisans: getArtisanList
            }
        })
        .when('/interventions', {
            templateUrl: "Pages/ListeInterventions/listeInterventions.html",
            controller: "InterventionsController",
            resolve: {
                interventions: getInterList,
                interventionsStats: getInterventionStats,
                artisans: getArtisanList
            }
        })
        .when('/interventions/:fltr', {
            templateUrl: "Pages/ListeInterventions/listeInterventions.html",
            controller: "InterventionsController",
            resolve: {
                interventionsStats: getInterventionStats,
                interventions: getInterList,
                artisans: getArtisanList
            }
        })
        .when('/intervention', {
            redirectTo: function() {
                return '/intervention/' + Date.now();
            }
        })
        .when('/artisan', {
            redirectTo: function() {
                return '/artisan/' + Date.now();
            }
        })
        .when('/artisan/:artisanID/recap', {
            templateUrl: "Pages/ListeInterventions/listeInterventions.html",
            controller: "InterventionsController",
            resolve: {
                interventionsStats: getInterventionStats,
                interventions: getInterList,
                artisans: getArtisanList
            }
        })
        .when('/intervention/:id', {
            templateUrl: "Pages/Intervention/intervention.html",
            controller: "InterventionController",
            controllerAs: "vm",
            resolve: {
                interventions: getInterList,
                intervention: getIntervention,
                artisans: getArtisanList

            }
        })
        .when('/dashboard', {
            controller: 'DashboardController',
            templateUrl: "Pages/Dashboard/dashboard.html",
            resolve: {
                interventions: getInterList,
                artisans: getArtisanList

            }
        })
        .otherwise({
            templateUrl: 'templates/Error404.html',
        });
    // use the HTML5 History API
    $locationProvider.html5Mode(true);
});

angular.module('edison').run(function(editableOptions) {
    "use strict";
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
