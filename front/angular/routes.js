angular.module('edison', ['browserify', 'ngMaterial', 'lumx', 'ngAnimate', 'xeditable', 'ngDialog', 'btford.socket-io', 'ngFileUpload', 'pickadate', 'ngRoute', 'ngResource', 'ngTable', 'ngMap'])
    .config(function($mdThemingProvider) {
        "use strict";
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('blue-grey');
    });


angular.module('edison').controller('MainController', function(tabContainer, $scope, socket, config, $rootScope, $location, edisonAPI, taskList) {
    "use strict";
    edisonAPI.getUser().success(function(result) {
        $rootScope.user = result;
        reloadStats();
    });
    $scope.config = config;
    $rootScope.loadingData = true;
    $rootScope.$on('$routeChangeSuccess', function() {
        $rootScope.loadingData = false;
    });

    $scope.dateFormat = moment().format('llll').slice(0, -5);
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
                $rootScope.interventionsStats = result;
            });
    };



    $rootScope.$on('interventionListChange', reloadStats);

    var initTabs = function(baseUrl, baseHash) {
        $scope.tabsInitialized = true;
        $scope.tabs.loadSessionTabs(baseUrl)
            .then(function() {
                $location.url(baseUrl);
            }).catch(function() {
                $scope.tabs.addTab(baseUrl, {
                    hash: baseHash
                });
            });
        return 0;
    };

    $scope.$on("$locationChangeStart", function(event) {
        console.log('here')
        if ($location.path() === "/") {
            return 0;
        }
        if (!$scope.tabsInitialized) {
            return initTabs($location.path(), $location.hash());
        }
        if ($location.path() !== "/intervention" && $location.path() !== "/devis") {
            $scope.tabs.addTab($location.path(), {
                hash: $location.hash()
            });
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

var getDevisList = function(edisonAPI) {
    "use strict";
    return edisonAPI.devis.list({
        cache: true
    });
};

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
    if ($route.current.params.d) {
        return edisonAPI.devis.get($route.current.params.d, {
            transform: true
        });
    } else if (id.length > 10) {
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

var getDevis = function($route, $q, edisonAPI) {
    "use strict";
    var id = $route.current.params.id;
    console.log($route.current)
    if (id.length > 10) {
        return $q(function(resolve) {
            resolve({
                data: {
                    isDevis: true,
                    produits: [],
                    tva: 20,
                    client: {},
                    date: {
                        ajout: Date.now(),
                    },
                    historique: []
                }
            });
        });
    } else {
        return edisonAPI.devis.get(id);
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
            redirectTo: '/intervention/list',
        })
        .when('/intervention/list', {
            templateUrl: "Pages/ListeInterventions/listeInterventions.html",
            controller: "InterventionsController",
            controllerAs: 'vm',
            resolve: {
                interventions: getInterList,
                interventionsStats: getInterventionStats,
                artisans: getArtisanList
            }
        })
        .when('/intervention/list/:fltr', {
            templateUrl: "Pages/ListeInterventions/listeInterventions.html",
            controller: "InterventionsController",
            controllerAs: 'vm',
            resolve: {
                interventionsStats: getInterventionStats,
                interventions: getInterList,
                artisans: getArtisanList
            }
        })
        .when('/intervention', {
            redirectTo: function(routeParams, path, params) {
                var url = params.devis ? "?d=" + params.devis : "";
                return '/intervention/' + Date.now() + url;
            }
        })
        .when('/intervention/:id', {
            templateUrl: "Pages/Intervention/intervention.html",
            controller: "InterventionController",
            controllerAs: "vm",
            resolve: {
                interventions: getInterList,
                interventionPrm: getIntervention,
                artisans: getArtisanList

            }
        })
        .when('/devis/list', {
            templateUrl: "Pages/ListeDevis/listeDevis.html",
            controller: "ListeDevisController",
            controllerAs: 'vm',
            resolve: {
                devis: getDevisList,
            }
        })
        .when('/devis/list/:fltr', {
            templateUrl: "Pages/ListeDevis/listeDevis.html",
            controller: "ListeDevisController",
            controllerAs:"vm",
            resolve: {
                devis: getDevisList,
            }
        })
        .when('/devis', {
            redirectTo: function() {
                return '/devis/' + Date.now();
            }
        })
        .when('/devis/:id', {
            templateUrl: "Pages/Intervention/devis.html",
            controller: "DevisController",
            controllerAs: "vm",
            resolve: {
                interventions: getInterList,
                devisPrm: getDevis,
                artisans: getArtisanList
            }
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
}).run(function($templateCache, $route, $http) {
    var url;
    for (var i in $route.routes) {
        if (url = $route.routes[i].templateUrl) {
            $http.get(url, {
                cache: $templateCache
            });
        }
    }
    $http.get("/Directives/dropdown-row.html", {
        cache: $templateCache
    });
    $http.get("/Templates/info-client.html", {
        cache: $templateCache
    });
    $http.get("/Templates/info-categorie.html", {
        cache: $templateCache
    });
    $http.get("/Templates/autocomplete-map.html", {
        cache: $templateCache
    });
})
