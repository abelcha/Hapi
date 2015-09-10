angular.module('edison', ['browserify', 'ui.slimscroll', 'ngMaterial', 'lumx', 'ngAnimate', 'xeditable', 'btford.socket-io', 'ngFileUpload', 'pickadate', 'ngRoute', 'ngResource', 'ngTable', 'ngMap'])
    .config(function($mdThemingProvider) {
        "use strict";
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('blue-grey');
    });


angular.module('edison').controller('MainController', function($timeout, $q, DataProvider, tabContainer, $scope, socket, config, $rootScope, $location, edisonAPI, taskList, $window) {
    "use strict";

    $rootScope.app_users = app_users;
    $scope.sidebarHeight = $("#main-menu-bg").height();
    $scope.config = config;
    $rootScope.loadingData = true;
    $rootScope.$on('$routeChangeSuccess', function() {
        $window.scrollTo(0, 0);
        $rootScope.loadingData = false;
    });
    var checkResize = function() {

        $rootScope.smallWin = window.innerWidth < 1200
        $timeout(function() {
            if ($rootScope.smallWin) {
                $rootScope.sideBarIsOpen = true;
            }
        })
    }

    $(window).resize(checkResize);

    checkResize();


    $scope.toggleSidebar = function(open) {
        if (open && !$rootScope.smallWin)
            return 0;
        $scope.sideBarIsOpen = open;
    }

    $scope.changeUser = function(usr) {
        $rootScope.user = usr
    }

    $scope.shadowClick = function(url) {
        $location.url(url)
    }
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
    $('input[type="search"]').ready(function() {

        $('input[type="search"]').on('keyup', function(e, w) {
            if (e.which == 13) {
                if ($('ul.md-autocomplete-suggestions>li').length) {
                    $location.url('/search/' + $(this).val())
                    $(this).val("")
                    $(this).blur()
                }
            }
        });
    })
    $scope.searchBox = {
        search: function(x) {
            var deferred = $q.defer();
            edisonAPI.searchText(x, {
                limit: 10,
                flat: true
            }).success(function(resp) {
                deferred.resolve(resp)
            })
            return deferred.promise;
        },
        change: function(x) {
            if (x) {
                $location.url(x.link)
            }
            $scope.searchText = "";
        }
    }

    var reloadStats = function() {
        edisonAPI.stats.telepro()
            .success(function(result) {
                $scope.userStats = _.find(result, function(e) {
                    return e.login === $scope.user.login;
                });
                $rootScope.interventionsStats = result;
            });
    };

    $rootScope.user = window.app_session
    reloadStats();

    socket.on('filterStatsReload', function(data) {
        $scope.userStats = _.find(data, function(e) {
            return e.login === $scope.user.login;
        });
        $rootScope.interventionsStats = data;
    })

    $rootScope.openTab = function(tab) {
        //   console.log('-->', tab);
    }

    $rootScope.closeContextMenu = function() {
        $rootScope.$broadcast('closeContextMenu');
    }

    var devisDataProvider = new DataProvider('devis')
    var artisanDataProvider = new DataProvider('artisan')
    var interventionDataProvider = new DataProvider('intervention')





    var initTabs = function(baseUrl, baseHash, urlFilter) {
        $scope.tabsInitialized = true;
        $scope.tabs.addTab(baseUrl, {
            hash: baseHash,
            urlFilter: urlFilter
        });
        return 0;
    };

    $scope.$on("$locationChangeStart", function(event) {
        if ($rootScope.preventRouteChange) {
            $rootScope.preventRouteChange = false;
            return false;
        }
        if ($location.path() === "/") {
            return 0;
        }
        if (!$scope.tabsInitialized) {
            return initTabs($location.path(), $location.hash(), $location.$$search);
        }
        if ($location.path() !== "/intervention" && $location.path() !== "/devis" && $location.path() !== "/artisan") {
            $scope.tabs.addTab($location.path(), {
                hash: $location.hash(),
                urlFilter: $location.$$search
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
        $scope.tabs.close(tab)
    };
});

var getDevisList = function(edisonAPI) {
    "use strict";
    return edisonAPI.devis.list({
        cache: true
    });
};

var getArtisanList = function(edisonAPI) {
    "use strict";
    return edisonAPI.artisan.list({
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
                    origin: 'DEM',
                    telephone: {},
                    pourcentage: {
                        deplacement: 50,
                        maindOeuvre: 30,
                        fourniture: 30
                    },
                    zoneChalandise: 30,
                    add: {},
                    categories: [],
                    representant: {
                        civilite: 'M.'
                    },
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

var getIntervention = function($route, $q, edisonAPI) {
    "use strict";
    var id = $route.current.params.id;
    if ($route.current.params.d) {
        return edisonAPI.devis.get($route.current.params.d, {
            select: 'date login produits tva client prixAnnonce categorie -_id'
        });
    } else if (id.length > 10) {
        return edisonAPI.intervention.getTmp(id);
    } else {
        return edisonAPI.intervention.get(id, {
            populate: 'sst'
        });
    }
};

var getDevis = function($route, $q, edisonAPI) {
    "use strict";
    var id = $route.current.params.id;
    if ($route.current.params.i) {
        return edisonAPI.intervention.get($route.current.params.i, {
            select: 'client categorie tva -_id'
        });
    } else if (id.length > 10) {
        return edisonAPI.devis.getTmp(id);
    } else {
        return edisonAPI.devis.get(id);
    }
};

angular.module('edison').config(function($routeProvider, $locationProvider) {
    "use strict";
    $routeProvider
        .when('/', {
            redirectTo: '/intervention/list',
        })
        .when('/intervention/list', {
            templateUrl: "Pages/ListeInterventions/listeInterventions.html",
            controller: "InterventionsController",
            controllerAs: 'vm',
        })
        .when('/intervention/list/:fltr', {
            templateUrl: "Pages/ListeInterventions/listeInterventions.html",
            controller: "InterventionsController",
            controllerAs: 'vm',
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
                interventionPrm: getIntervention,
            }
        })
        .when('/devis/list', {
            templateUrl: "Pages/ListeDevis/listeDevis.html",
            controller: "ListeDevisController",
            controllerAs: 'vm',
        })
        .when('/devis/list/:fltr', {
            templateUrl: "Pages/ListeDevis/listeDevis.html",
            controller: "ListeDevisController",
            controllerAs: "vm",
        })
        .when('/devis', {
            redirectTo: function(routeParams, path, params) {
                var url = params.i ? "?i=" + params.i : "";
                return '/devis/' + Date.now() + url;
            }
        })
        .when('/devis/:id', {
            templateUrl: "Pages/Intervention/devis.html",
            controller: "DevisController",
            controllerAs: "vm",
            resolve: {
                devisPrm: getDevis,
            }
        })
        .when('/artisan/contact', {
            templateUrl: "Pages/ListeArtisan/contactArtisan.html",
            controller: "ContactArtisanController",
            controllerAs: 'vm',
            reloadOnSearch: false
        })
        .when('/artisan/:id/recap', {
            templateUrl: "Pages/ListeArtisan/contactArtisan.html",
            controller: "ContactArtisanController",
            controllerAs: 'vm',
        })
        .when('/artisan/list', {
            templateUrl: "Pages/ListeArtisan/listeArtisan.html",
            controller: "ListeArtisanController",
            controllerAs: 'vm',
        })
        .when('/artisan/list/:fltr', {
            templateUrl: "Pages/ListeArtisan/listeArtisan.html",
            controller: "ListeArtisanController",
            controllerAs: "vm",
        })
        .when('/artisan', {
            redirectTo: function() {
                return '/artisan/' + Date.now();
            }
        })
        .when('/artisan/:id', {
            templateUrl: "Pages/Artisan/artisan.html",
            controller: "ArtisanController",
            controllerAs: "vm",
            resolve: {
                artisanPrm: getArtisan,
            }
        })
        .when('/dashboard', {
            controller: 'DashboardController',
            templateUrl: "Pages/Dashboard/dashboard.html",
        })
        .when('/search/:query', {
            templateUrl: "Pages/Search/search.html",
            controller: "SearchController",
            controllerAs: "vm",
        })
        .when('/compta/lpa', {
            templateUrl: "Pages/LPA/LPA.html",
            controller: "LpaController",
            controllerAs: "vm",
        })
        .when('/compta/avoirs', {
            templateUrl: "Pages/Avoirs/avoirs.html",
            controller: "avoirsController",
            controllerAs: "vm",
        })
        .when('/compta/archivesPaiement', {
            templateUrl: "Pages/Archives/archives.html",
            controller: "archivesPaiementController",
            controllerAs: "vm",
        })
        .when('/compta/archivesReglement', {
            templateUrl: "Pages/Archives/archives.html",
            controller: "archivesReglementController",
            controllerAs: "vm",
        })
        .when('/eliran/telephoneMatch', {
            templateUrl: "Pages/Eliran/telephoneMatch.html",
            controller: "telephoneMatch",
            controllerAs: "vm",
        })
        .when('/stats/:type', {
            templateUrl: "Pages/Stats/stats.html",
            controller: "StatsController",
            controllerAs: 'vm',
        })
        .otherwise({
            redirectTo: '/dashboard'
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

    $http.get("/Templates/artisan-categorie.html", {
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
angular.module('edison').config(function($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|callto|mailto|file|tel):/);
});
