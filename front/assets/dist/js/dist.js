angular.module('edison', ['chart.js', 'browserify', 'mm.iban', 'ui.slimscroll', 'ngMaterial', 'lumx', 'ngAnimate', 'xeditable', 'btford.socket-io', 'ngFileUpload', 'pickadate', 'ngRoute', 'ngResource', 'ngTable', 'ngMap'])
    .config(["$mdThemingProvider", function($mdThemingProvider) {
        "use strict";
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('blue-grey');
    }])
    .run(["editableOptions", function(editableOptions) {
        "use strict";
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    }]).run(["$templateCache", "$route", "$http", function($templateCache, $route, $http) {
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
    }]).config(["$compileProvider", function($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|callto|mailto|file|tel):/);
    }]);

angular.module('edison').controller('MainController', ["$timeout", "LxNotificationService", "dialog", "$q", "DataProvider", "TabContainer", "$scope", "socket", "config", "$rootScope", "$location", "edisonAPI", "taskList", "$window", function($timeout, LxNotificationService, dialog, $q, DataProvider, TabContainer, $scope, socket, config, $rootScope, $location, edisonAPI, taskList, $window) {
    "use strict";

    $rootScope.app_users = app_users;
    $rootScope.displayUser = app_session
    $scope.sidebarHeight = $("#main-menu-bg").height();
    $scope.config = config;
    $scope._ = _;
    $rootScope.loadingData = true;
    $rootScope.$on('$routeChangeSuccess', function() {
        $window.scrollTo(0, 0);
        $rootScope.loadingData = false;
    });
    var _this = this;

    $rootScope.toggleSidebar = function(open) {
        if ($rootScope.sideBarMode === true) {
            $rootScope.sideBarIsClosed = open;
        }
    }

    $rootScope.addIntervention = function() {
        if ($scope.user.service !== 'INTERVENTION' || (!$scope.userStats.i_avr.total || !$scope.userStats.i_avr.total || ($scope.user.maxInterAverif > $scope.userStats.i_avr.total))) {
            $location.url('/intervention')
        } else {
            LxNotificationService.error("Impossible: Vous avez dépasser votre quota d'intervention à vérifié (" + $scope.userStats.i_avr.total + ' > ' + $scope.user.maxInterAverif + ')')
        }
    }

    $rootScope.toggleSidebarMode = function(newVal) {
        $rootScope.sideBarMode = _.isUndefined(newVal) ? !$rootScope.sideBarMode : newVal;
        $rootScope.sideBarIsClosed = $rootScope.sideBarMode
    }

    var checkResize = function() {
        $rootScope.smallWin = window.innerWidth < 1350
        return $rootScope.toggleSidebarMode($rootScope.smallWin);
    }
    $(window).resize(checkResize);
    checkResize();


    $scope.dateFormat = moment().format('llll').slice(0, -5);
    /*    $scope.$watch('tabs.selectedTab', function(prev, curr) {
            if (prev === -1 && curr !== -1) {
                $scope.tabs.selectedTab = curr;
            }
        });*/
    $rootScope.options = {
        showMap: true
    };


    var getSignalementStats = function() {
        edisonAPI.signalement.stats().then(function(resp) {
            $scope.signalementStats = resp.data;
        })
    }
    getSignalementStats()

    var reloadStats = function() {
        edisonAPI.stats.telepro()
            .success(function(result) {
                $scope.userStats = _.find(result, function(e) {
                    return e.login === $scope.user.login;
                });
                $rootScope.interventionsStats = result;
            });

        edisonAPI.intervention.dashboardStats({
                date: moment().startOf('day').toDate()
            })
            .then(function(resp) {
                _this.statsTeleproBfm = _.sortBy(resp.data.weekStats, 'total').reverse()
            });

    };

    $rootScope.user = window.app_session
    reloadStats();
    socket.on('filterStatsReload', _.debounce(reloadStats, _.random(0, 1000)));

    $window.notify = function() {
        LxNotificationService.notify("test", 'android', false, "red");
    }

    socket.on('test', function(data) {
        console.log(new Date, "notif test", data)
    })
    socket.on('notification', function(data) {
//        console.log('NOTIF', data)

        if (data.dest === $rootScope.user.login && (data.dest !== data.origin || data.self)) {
            LxNotificationService.notify(data.message, data.icon || 'android', false, data.color);
        }
        if (data.service && data.service === $rootScope.user.service) {
            LxNotificationService.notify(data.message, data.icon || 'android', false, data.color);
        }
    })


    $rootScope.openTab = function(tab) {

    }

    $rootScope.closeContextMenu = function(ev) {
        $rootScope.$broadcast('closeContextMenu');
    }

    var devisDataProvider = new DataProvider('devis')
    var artisanDataProvider = new DataProvider('artisan')
    var interventionDataProvider = new DataProvider('intervention')




    this.tabContainer = TabContainer;
    $scope.$on("$locationChangeStart", function(event) {
        if (_.includes(["/intervention", '/devis', '/artisan', '/'], $location.path())) {
            return 0
        }
        TabContainer.add($location).order();
    })


    $scope.taskList = taskList;

    $scope.linkClick = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
    };


    Mousetrap.bind(['command+i', 'ctrl+i'], function() {
        dialog.declareBug(_this.tabContainer, function(err, resp) {
            edisonAPI.bug.declare(resp).then(function() {
                    LxNotificationService.error("Le Serice informatique en a été prevenu");
                })
                /* edisonAPI.intervention.save(_this).then(function(resp) {
                     LxNotificationService.success("L'intervention " + _this.id + " est modifié");
                 }, function(err) {
                     LxNotificationService.error("Une erreur est survenu (" + err.data + ")");
                 });*/
        })
    });


    $scope.tabIconClick = function($event, tab) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.tabs.close(tab)
    };
}]);

var getIntervention = function($route, $q, edisonAPI) {
  "use strict";
  var id = $route.current.params.id;
  if ($route.current.params.d) {
    var deferred = $q.defer();
    $q.all([
      edisonAPI.devis.get($route.current.params.d, {
        select: 'date login produits tva client prixAnnonce categorie -_id'
      }),
      edisonAPI.intervention.getTmp(0)
    ]).then(function(result) {
      deferred.resolve(_.merge(result[1], result[0]));
    })
    return deferred.promise;

  } else if (id.length > 10) {
    return edisonAPI.intervention.getTmp(id);
  } else {
    return edisonAPI.intervention.get(id, {
      populate: 'sst'
    });
  }
};
getIntervention.$inject = ["$route", "$q", "edisonAPI"];

var statsTelepro = function($route, $q, edisonAPI) {
  return edisonAPI.stats.telepro()
}
statsTelepro.$inject = ["$route", "$q", "edisonAPI"];

var getDevis = function($route, $q, edisonAPI) {
  "use strict";
  var id = $route.current.params.id;
  if ($route.current.params.i) {
    return edisonAPI.intervention.get($route.current.params.i, {
      select: 'client categorie tva -_id conversations'
    });
  } else if (id.length > 10) {
    return edisonAPI.devis.getTmp(id);
  } else {
    return edisonAPI.devis.get(id);
  }
};
getDevis.$inject = ["$route", "$q", "edisonAPI"];
var getArtisan = function($route, $q, edisonAPI) {
  "use strict";
  var id = $route.current.params.id;
  if (id.length > 10) {
    return edisonAPI.artisan.getTmp(id);
  } else {
    return edisonAPI.artisan.get(id);
  }
}
getArtisan.$inject = ["$route", "$q", "edisonAPI"];

angular.module('edison').config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
  "use strict";
  $routeProvider
    .when('/', {
      redirectTo: '/dashboard',
    })
    .when('/intervention/list', {
      templateUrl: "Pages/ListeInterventions/listeInterventions.html",
      controller: "ListeInterventionController",
      controllerAs: 'vm',
      reloadOnSearch: false

    })
    .when('/intervention/list/:fltr', {
      templateUrl: "Pages/ListeInterventions/listeInterventions.html",
      controller: "ListeInterventionController",
      controllerAs: 'vm',
      reloadOnSearch: false

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
      reloadOnSearch: false,
      resolve: {
        interventionPrm: getIntervention,
      }
    })
    .when('/devis/list', {
      templateUrl: "Pages/ListeDevis/listeDevis.html",
      controller: "ListeDevisController",
      controllerAs: 'vm',
      reloadOnSearch: false

    })
    .when('/devis/list/:fltr', {
      templateUrl: "Pages/ListeDevis/listeDevis.html",
      controller: "ListeDevisController",
      controllerAs: "vm",
      reloadOnSearch: false

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
    .when('/artisan/:sstid/recap', {
      templateUrl: "Pages/ListeArtisan/contactArtisan.html",
      controller: "ContactArtisanController",
      controllerAs: 'vm',
      reloadOnSearch: false

    })
    .when('/artisan/list', {
      templateUrl: "Pages/ListeArtisan/listeArtisan.html",
      controller: "ListeArtisanController",
      controllerAs: 'vm',
      reloadOnSearch: false

    })
    .when('/artisan/list/:fltr', {
      templateUrl: "Pages/ListeArtisan/listeArtisan.html",
      controller: "ListeArtisanController",
      controllerAs: "vm",
      reloadOnSearch: false

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
      controllerAs: "vm",
      resolve: {
        statsTelepro: statsTelepro
      }
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
    .when('/tools/telephoneMatch', {
      templateUrl: "Pages/Tools/telephoneMatch.html",
      controller: "telephoneMatch",
      controllerAs: "vm",
    })
    .when('/tools/editProducts', {
      templateUrl: "Pages/Tools/edit-products.html",
      controller: "editProducts",
      controllerAs: "vm",
    })
    .when('/tools/editSignalements', {
      templateUrl: "Pages/Tools/edit-signalements.html",
      controller: "editSignalements",
      controllerAs: "vm",
    })
    .when('/listeSignalements', {
      templateUrl: "Pages/ListeSignalements/liste-signalements.html",
      controller: "listeSignalements",
      controllerAs: "vm",
      // reloadOnSearch: false
    })
    .when('/tools/editComptes', {
      templateUrl: "Pages/Tools/edit-comptes.html",
      controller: "editComptes",
      controllerAs: "vm",
    })
    .when('/tools/editCombos', {
      templateUrl: "Pages/Tools/edit-combos.html",
      controller: "editCombos",
      controllerAs: "vm",
    })
    .when('/tools/editUsers', {
      templateUrl: "Pages/Tools/edit-users.html",
      controller: "editUsers",
      controllerAs: "vm",
    })
    .when('/partenariat/comissions', {
      templateUrl: "Pages/Tools/commissions-partenariat.html",
      controller: "commissionsPartenariat",
      controllerAs: 'vm',
    })
    .when('/tools/commissions', {
      templateUrl: "Pages/Tools/commissions.html",
      controller: "CommissionsController",
      controllerAs: "vm",
      reloadOnSearch: false

    })
    .when('/stats/:type', {
      templateUrl: "Pages/Stats/stats.html",
      controller: "StatsController",
      controllerAs: 'vm',
      reloadOnSearch: false
    })
    .when('/statsnew/:type', {
      templateUrl: "Pages/Stats/stats-new.html",
      controller: "StatsNewController",
      controllerAs: 'vm',
      reloadOnSearch: false
    })
    .when('/gstats/:type', {
      templateUrl: "Pages/Stats/gstats.html",
      controller: "GStatsController",
      controllerAs: 'vm',
      reloadOnSearch: false
    })
    .when('/user/history', {
      templateUrl: "Pages/User/historique.html",
      controller: "userHistory",
      controllerAs: 'vm',
      reloadOnSearch: false
    })
    .otherwise({
      redirectTo: '/dashboard'
    });
  // use the HTML5 History API
  $locationProvider.html5Mode(true);
}]);

 angular.module('edison').directive('absenceSst', ["edisonAPI", "LxNotificationService", "user", function(edisonAPI, LxNotificationService, user) {
    "use strict";
    return {
        replace: false,
        restrict: 'E',
        templateUrl: '/Templates/absence-sst.html',
        scope: {
            data: '=',
            exit: '&',
        },
        link: function(scope, elem) {
            scope.absence = {
                start: moment().add(-1, 'hours').toDate(),
                end: moment().hour(23).minute(43).toDate()
            }
            scope.save = function() {
                edisonAPI.artisan.absence(scope.data.id, scope.absence).then(function() {
                    LxNotificationService.success("L'absence à été enregistrer");
                    (scope.exit || _.noop)();
                })
            }
        }
    }
 }]);

angular.module('edison').directive('allowPattern', [allowPatternDirective]);

function allowPatternDirective() {
    return {
        restrict: "A",
        compile: function(tElement, tAttrs) {
            return function(scope, element, attrs) {
                // I handle key events
                element.bind("keypress", function(event) {
                    var keyCode = event.which || event.keyCode; // I safely get the keyCode pressed from the event.
                    var keyCodeChar = String.fromCharCode(keyCode); // I determine the char from the keyCode.

                    // If the keyCode char does not match the allowed Regex Pattern, then don't allow the input into the field.
                    if (!keyCodeChar.match(new RegExp(attrs.allowPattern, "i"))) {
                        event.preventDefault();
                        return false;
                    }

                });
            };
        }
    };
}

angular.module('edison').directive('capitalize', function() {
    "use strict";
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(input) {
                return typeof input === "string" ? input.toUpperCase() : "";
            });
            element.css("text-transform", "uppercase");
        }
    };
});


angular.module('edison').directive('creditcard', function() {
    "use strict";
    return {
        require: 'ngModel',
        scope: {
            inline: "=",
        },
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(input) {
                return input.replace('x', 'AAA')
            });
        }
    };
});

angular.module('edison').directive('dropdownRow', ["Devis", "productsList", "edisonAPI", "config", "$q", "$timeout", "Intervention", function(Devis, productsList, edisonAPI, config, $q, $timeout, Intervention) {
    "use strict";

    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/Directives/dropdown-row.html',
        scope: {
            model: "@",
            row: '=',
        },
        link: function(scope, element, attrs) {
            scope._ = _;
            scope.Intervention = Intervention
            scope.Devis = Devis
            scope._model = scope.model || "intervention"

            scope.expendedStyle = {
                height: 0,
                overflow: 'hidden'
            };
            scope.expendedReady = false;
            scope.data = {};
            scope.config = config
            if (scope._model === "intervention") {
                edisonAPI.intervention.get(scope.row.id, {
                    populate: ['sst', 'devisOrigine'].join(',')
                }).then(function(result) {
                    scope.data = result.data;
                    if (scope.data.produits) {
                        scope.produits = new productsList(scope.data.produits);
                    }
                    scope.client = scope.data.client;
                    scope.address = scope.client.address;

                })

            } else if (scope._model === "devis") {
                var pAll = [
                    edisonAPI.devis.get(scope.row.id, {
                        populate: 'transfertId'
                    }),
                ]
                var pThen = function(result) {
                    scope.data = result[0].data;
                    scope.produits = new productsList(scope.data.produits);
                    scope.hist = scope.data.historique
                    scope.client = scope.data.client;
                    scope.address = scope.client.address;
                }
            } else if (scope._model === 'artisan') {




                scope.loadPanel = function(id) {
                    edisonAPI.artisan.getStats(id).then(function(resp) {
                        new Chartist.Pie('.ct-chart', {
                            series: [{
                                value: resp.data.envoye.total,
                                name: 'En cours',
                                className: 'ct-orange',
                                meta: 'Meta One'
                            }, {
                                value: resp.data.annule.total,
                                name: 'annulé',
                                className: 'ct-red',
                                meta: 'Meta One'
                            }, {
                                value: resp.data.paye.total,
                                name: 'payé',
                                className: 'ct-green',
                                meta: 'Meta One'
                            }]
                        }, {
                            total: resp.data.annule.total + resp.data.paye.total + resp.data.envoye.total,
                            donut: true,
                            startAngle: 270,
                            donutWidth: 62,
                        });
                        scope.stats = resp.data
                    })

                }

                scope.loadPanel(scope.row.id)


                pAll = [
                    edisonAPI.artisan.get(scope.row.id),
                    edisonAPI.artisan.getStats(scope.row.id)
                ]
                pThen = function(result) {
                    scope.data = result[0].data;
                    scope.artisan = scope.data;
                    scope.artisan.stats = result[1].data;
                    scope.address = scope.artisan.address
                }
            }

            $q.all(pAll).then(pThen)
            scope.getStaticMap = function() {
                var q = "?format=jpg&width=411&height=210px&precision=0&origin=" + scope.address.lt + ", " + scope.address.lg;
                if (_.get(scope, 'data.artisan.address.lt'))
                    q += "&destination=" + scope.data.artisan.address.lt + ", " + scope.data.artisan.address.lg;
                else
                    q += "&zoom=15";
                return "/api/mapGetStatic" + q;
            }

        }
    };
}]);

angular.module('edison').directive('elastic', ["$timeout", function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, element) {
                $scope.initialHeight = $scope.initialHeight || element[0].style.height;
                var resize = function() {
                    element[0].style.height = $scope.initialHeight;
                    element[0].style.height = "" + element[0].scrollHeight + "px";
                };
                element.on("input change", resize);
                $timeout(resize, 0);
            }
        };
    }
]);
angular.module('edison').directive('ngEnter', function () {
    "use strict";
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
angular.module('edison').directive('historiquePaiementSst', ["edisonAPI", "FlushList", function(edisonAPI, FlushList) {
    "use strict";

    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/Templates/historique-paiement-sst.html',
        scope: {
            data: "=",
            exit: '&'
        },
        link: function(scope, element, attrs) {
            var reload = function() {
                if (!scope.data || !scope.data.id) {
                    return 0;
                }
                var getPaiement = function(x) {
                    console.log('-->', x);
                }
                scope.getTotal = function(arr) {
                    var rtn = 0;
                    _.each(arr, function(e) {
                        rtn += e.original.compta.paiement.historique.final
                    })
                    return _.round(rtn, 2);
                }
                edisonAPI.artisan.getCompteTiers(scope.data.id).then(function(resp) {
                    scope.historiquePaiement = _.map(resp.data, function(e) {
                        e.flushList = new FlushList(e.list, _.map(e.list, '_id'))
                        _.map(e.flushList.getList() , function(x) {
                            x.original = _.find(e.list, 'id', x.id)
                        })
                        return e;
                    })
                })
            }

            scope.$watch('data.id', reload)
            scope.check = function(sign) {
                /*  if (sign.ok)
                      return 0;*/
                edisonAPI.signalement.check(sign._id, sign.text).then(function(resp) {
                    sign = _.merge(sign, resp.data);
                })
                scope.exit && scope.exit();
                console.log('=>', sign)
            }
            scope.comment = function() {
                edisonAPI.artisan.comment(scope.data.id, scope.comm).then(reload)
                scope.comm = ""
            }
        }
    };
}]);

angular.module('edison').directive('historiqueSst', ["edisonAPI", function(edisonAPI) {
    "use strict";

    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/Templates/historique-sst.html',
        scope: {
            data: "=",
            exit: '&'
        },
        link: function(scope, element, attrs) {
            var reload = function() {
                if (!scope.data || !scope.data.id) {
                    return 0;
                }
                edisonAPI.artisan.fullHistory(scope.data.id).then(function(resp) {
                    scope.hist = resp.data;
                })
            }

            scope.$watch('data.id', reload)
            scope.check = function(sign) {
                /*  if (sign.ok)
                      return 0;*/
                edisonAPI.signalement.check(sign._id, sign.text).then(function(resp) {
                    sign = _.merge(sign, resp.data);
                })
                scope.exit && scope.exit();
            }
            scope.comment = function() {
                edisonAPI.artisan.comment(scope.data.id, scope.comm).then(reload)
                scope.comm = ""
            }
        }
    };
}]);

 angular.module('edison').directive('infoComment', ["user", function(user) {
     "use strict";
     return {
         replace: false,
         restrict: 'E',
         templateUrl: '/Templates/info-comment.html',
         scope: {
             data: '=',
         },
         link: function(scope, elem, attr) {
             scope.height = attr.height ||  216;
             scope.user = user;
             scope.addComment = function() {
                 scope.data.comments.push({
                     login: user.login,
                     text: scope.commentText,
                     date: new Date()
                 })
                 scope.commentText = "";
             }
         }
     }
 }]);

 angular.module('edison').directive('infoLitige', function() {
     "use strict";
     return {
         replace: false,
         restrict: 'E',
         templateUrl: '/Templates/info-litige.html',
         scope: {
             data: '=',
         },
         link: function(scope, elem) {
             scope.$watch('data.litige.description', function(curr, prev) {
                 if (scope.data.litige && !scope.data.litige.closed && scope.data.litige.description)
                     scope.data.litige.open = true
                 if (scope.data.litige && !scope.data.litige.description) {
                     scope.data.litige.open = false
                 }
             })
         }
     }
 });

 angular.module('edison').directive('infoPaiement', ["config", function(config) {
     "use strict";
     return {
         replace: false,
         restrict: 'E',
         templateUrl: '/Templates/info-paiement.html',
         scope: {
             data: '=',
             artisans: '='
         },
         link: function(scope, elem) {
            scope.config = config;
         }
     }
 }]);

 angular.module('edison').directive('infoSav', ["config", function(config) {
     "use strict";
     return {
         replace: false,
         restrict: 'E',
         templateUrl: '/Templates/info-sav.html',
         scope: {
             data: '=',
             artisans: '='
         },
         link: function(scope, elem) {
            scope.config = config;
         }
     }
 }]);

 var Controller = function($timeout, TabContainer, FiltersFactory, user, ContextMenu, LxProgressService, edisonAPI, DataProvider, $routeParams, $location, $rootScope, $filter, config, ngTableParams, MomentIterator) {
    var _this = this;
    _this._ = _;
    LxProgressService.circular.show('#5fa2db', '#globalProgress');
    var currentFilter;
    var currentHash = $location.hash();
    var dataProvider = new DataProvider(_this.model, $routeParams.hashModel);
    var filtersFactory = new FiltersFactory(_this.model)


    if ($routeParams.fltr) {
        currentFilter = filtersFactory.getFilterByUrl($routeParams.fltr)
    }
    var end = new Date();
    var start = moment().add(-13, 'month').toDate()
    _this.dateSelectList = MomentIterator(start, end).range('month').map(function(e) {
        return {
            ts:e.unix(),
            t: e.format('MMM YYYY'),
            m: e.month() + 1,
            y: e.year(),
        }
    })

    _this.routeParamsFilter = $routeParams.fltr;
    if (_this.embedded) {
        _this.$watch('filter', function() {
            if (_.size(_this.filter)) {
                _this.customFilter = function(inter) {
                    for (var i in _this.filter) {
                        if (_this.filter[i] !== inter[i])
                            return false
                    }
                    return true
                }
                if (_this.tableParams) {
                    dataProvider.applyFilter({}, _this.tab.hash, _this.customFilter);
                    _this.tableParams.reload();
                }
            }
        })

    }

    _this.displaySubRow = function(inter) {
        return _this.expendedRow && _this.expendedRow === inter.id;
    }

    _this.smallWin = window.innerWidth < 1400
    $(window).resize(function() {
        _this.smallWin = window.innerWidth < 1400
    })

    _this.tab = TabContainer.getCurrentTab();
    _this.tab.hash = currentHash;
    _this.config = config;
    var title = currentFilter ? currentFilter.long_name : _this.model;
    if ($routeParams.sstid) {
        var id = parseInt($routeParams.sstid)
        _this.customFilter = function(inter) {
            return inter.ai === id;
        }
    } else {
        _this.tab.setTitle(title, currentHash);
    }
    if ($routeParams.sstids_in) {
        _this.customFilter = function(inter) {
            return _.includes($routeParams.sstids_in, inter.id);
        }
    }
    if ($routeParams.ids_in) {
        var tab = JSON.parse($routeParams.ids_in)
        _this.customFilter = function(inter) {
            return _.includes(tab, inter.id);
        }
    }


    _this.$watch(function() {
        return $location.search()
    }, _.after(2, function(nw, old) {
        _this.tableParams.filter(_.omit(nw, 'hashModel', 'page', 'sstid', 'ids_in'))
    }), true)

    _this.$watch(function() {
        return $location.hash()
    }, function(nw, old) {
        if (_this.tableParams) {
            dataProvider.applyFilter(currentFilter, nw, _this.customFilter);
            _this.tableParams.reload()
        }
    }, true)


    var actualiseUrl = function(fltrs, page) {
        $location.search('page', page !== 1 ? page : undefined);
        _.each(fltrs, function(e, k) {
            if (!e) e = undefined;
            if (e !== "hashModel") {
                $location.search(k, e);

            } else {}
        })
    }

    var sortBy = (currentFilter && currentFilter.sortBy) ||  {
        id: 'desc'
    }
    dataProvider.init(function(err, resp) {


        dataProvider.applyFilter(currentFilter, _this.tab.hash, _this.customFilter);
        var tableParameters = {
            page: $location.search()['page'] ||  1,
            total: dataProvider.filteredData.length,
            filter: _this.embedded ? {} : _.omit($location.search(), 'hashModel', 'page', 'sstid', 'ids_in'),
            sorting: sortBy,
            count: _this.limit || 100
        };
        var tableSettings = {
            total: dataProvider.filteredData,
            getData: function($defer, params) {
                var data = dataProvider.filteredData;
                if (!_this.embedded) {
                    data = $filter('tableFilter')(data, params.filter());
                }
                _this.currentFilter = _.clone(params.filter());
                params.total(data.length);
                data = $filter('orderBy')(data, params.orderBy());
                $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            },
            filterDelay: 100
        }
        _this.tableParams = new ngTableParams(tableParameters, tableSettings);
        LxProgressService.circular.hide()
    })

    var lastChange = 0;
    $rootScope.$on(_this.model.toUpperCase() + '_CACHE_LIST_CHANGE', function(event, newData) {
        if (TabContainer.getCurrentTab() && _this.tab.fullUrl === TabContainer.getCurrentTab().fullUrl) {
            dataProvider.applyFilter(currentFilter, _this.tab.hash, _this.customFilter);
            _this.tableParams.reload();
        }
    })


    _this.contextMenu = new ContextMenu(_this.model)


    if (user.service === 'COMPTABILITE') {
        var subs = _.findIndex(_this.contextMenu.list, "title", "Appels");
        if (subs) {
            var tmp = _this.contextMenu.list[subs]
            _this.contextMenu.list.splice(subs, 1);
            _this.contextMenu.list.push(tmp);
        }
    }
    _this.rowRightClick = function($event, inter) {
        edisonAPI[_this.model].get(inter.id, {
                populate: 'sst'
            })
            .then(function(resp) {
                _this.contextMenu.setData(resp.data);
                _this.contextMenu.setPosition($event.pageX - (($routeParams.sstid ||  _this.embedded) ? 50 : 0), $event.pageY + ($routeParams.sstid ||  _this.embedded ? 0 : 200))
                _this.contextMenu.open();
            })
    }

    _this.rowClick = function($event, inter) {
        if (_this.contextMenu.active)
            return _this.contextMenu.close();
        if ($event.metaKey || $event.ctrlKey) {
            TabContainer.addTab('/' + _this.model + '/' + inter.id, {
                title: ('#' + inter.id),
                setFocus: false,
                allowDuplicates: false
            });
        } else {
            if (_this.expendedRow === inter.id) {
                _this.expendedRow = undefined;
            } else {
                _this.expendedRow = inter.id
            }
        }
    }
 }



 angular.module('edison').directive('lineupIntervention', ["$timeout", "TabContainer", "FiltersFactory", "user", "ContextMenu", "LxProgressService", "edisonAPI", "DataProvider", "$routeParams", "$location", "$rootScope", "$filter", "config", "ngTableParams", "MomentIterator", function($timeout, TabContainer, FiltersFactory, user, ContextMenu, LxProgressService, edisonAPI, DataProvider, $routeParams, $location, $rootScope, $filter, config, ngTableParams, MomentIterator) {
    "use strict";
    var arg = arguments;
    return {
        replace: false,
        restrict: 'E',
        templateUrl: '/Templates/lineup-intervention.html',
        scope: {
            limit: '=',
            embedded: '=',
            filter: '=',
        },
        controller: ["$scope", function($scope) {

            $scope.model = 'intervention'
            Controller.apply($scope, arg)
        }]
    }
 }]);

 angular.module('edison').directive('lineupDevis', ["$timeout", "TabContainer", "FiltersFactory", "user", "ContextMenu", "LxProgressService", "edisonAPI", "DataProvider", "$routeParams", "$location", "$rootScope", "$filter", "config", "ngTableParams", "MomentIterator", function($timeout, TabContainer, FiltersFactory, user, ContextMenu, LxProgressService, edisonAPI, DataProvider, $routeParams, $location, $rootScope, $filter, config, ngTableParams, MomentIterator) {
    "use strict";
    var arg = arguments;
    return {
        replace: false,
        restrict: 'E',
        templateUrl: '/Templates/lineup-devis.html',
        scope: {
            filter: '=',
        },
        controller: ["$scope", function($scope) {
            $scope.model = 'devis'
            Controller.apply($scope, arg)
        }]
    }
 }]);

 angular.module('edison').directive('lineupArtisan', ["$timeout", "TabContainer", "FiltersFactory", "user", "ContextMenu", "LxProgressService", "edisonAPI", "DataProvider", "$routeParams", "$location", "$rootScope", "$filter", "config", "ngTableParams", "MomentIterator", function($timeout, TabContainer, FiltersFactory, user, ContextMenu, LxProgressService, edisonAPI, DataProvider, $routeParams, $location, $rootScope, $filter, config, ngTableParams, MomentIterator) {
    "use strict";
    var arg = arguments;
    return {
        replace: false,
        restrict: 'E',
        templateUrl: '/Templates/lineup-artisan.html',
        scope: {

        },
        controller: ["$scope", function($scope) {
            $scope.model = 'artisan'

            Controller.apply($scope, arg)
        }]
    }
 }]);

angular.module('edison').directive('ngRightClick', ["$parse", function($parse) {
    "use strict";
    return function(scope, element, attrs) {
        element.bind('contextmenu', function(event) {
            if (!(event.altKey ||  event.ctrlKey || event.shiftKey ||  ["INPUT", "TEXTAREA"].indexOf(event.target.nodeName) >= 0)) {
                scope.$apply(function() {
                    event.preventDefault();
                    $parse(attrs.ngRightClick)(scope, {
                        $event: event
                    });
                });
            }
        });
    };
}]);

 angular.module('edison').directive('link', ["FiltersFactory", "$rootScope", function(FiltersFactory, $rootScope) {
     "use strict";
     return {
         restrict: 'AE',
         replace: true,
         template: '<li>' +
             '      <a href="{{fullUrl}}" >' +
             '            <i ng-if="icon" class = "menu-icon fa fa-{{icon}}"> </i>' +
             '            <span ng-class="{bold : bold, textWhite: textWhite}" class="mm-text">{{title || exFltr.long_name}}</span>' +
             '            <span ng-if="total"class="label label-{{_color}}">{{total}}</span>' +
             '        </a>' +
             '      </li>',
         scope: {
             fltr: '@',
             login: '@',
             today: '@',
             icon: '@',
             title: '@',
             url: '@',
             textWhite: '@',
             model: '@',
             bold: '@',
             count: '@',
             noCounter: '@',
             color: '@',
             hashModel: '@'
         },
         link: function(scope, element, attrs) {
             var findTotal = function() {
                if (scope.count) {
                    return scope.count
                }
                 if (scope.noCounter)
                     return undefined;
                 var total = 0;
                 if (scope.login) {
                     var t = _.find($rootScope.interventionsStats, function(e) {
                         return e.login === scope.login;
                     })
                     total += _.get(t, scope.fltr + '.total', 0);
                 } else {
                     _.each($rootScope.interventionsStats, function(t) {
                         total += _.get(t, scope.fltr + '.total', 0);
                     })
                 }
                 return total;
             }
             $rootScope.$watch('interventionsStats', function() {
                 scope.total = findTotal();
             })
             scope.$watch('login', function(current, prev) {
                 scope._color = (scope.color || 'success')
                 scope._model = scope.model || 'intervention';
                 var filtersFactory = new FiltersFactory(scope._model);
                 scope.exFltr = filtersFactory.getFilterByName(scope.fltr);
                 scope.total = findTotal();
                 scope.exFltr = scope.exFltr ||  {
                     url: ''
                 };
                 scope._url = scope.exFltr.url.length ? "/" + scope.exFltr.url : scope.exFltr.url;
                 scope._login = scope.login && !scope.hashModel ? ("#" + scope.login) : '';
                 scope._hashModel = scope.hashModel ? ("?" + scope.hashModel + "=" + scope.login) : '';
                 scope.fullUrl = scope.url ||  ('/' + scope._model + '/list' + scope._url + scope._hashModel + scope._login)
             })

         }
     };
 }]);

 angular.module('edison').directive('simpleLink', ["FiltersFactory", "$rootScope", function(FiltersFactory, $rootScope) {
     "use strict";
     return {
         restrict: 'AE',
         replace: true,
         template: '<li>' +
             '      <a href="{{url}}"  target="{{target}}">' +
             '            <i ng-if="icon" class = "menu-icon fa fa-{{icon}}"> </i>' +
             '            <span class="mm-text">{{title}}</span>' +
             '        </a>' +
             '      </li>',
         scope: {
             icon: '@',
             title: '@',
             url: '@',
         },
         link: function(scope, element, attrs) {
             scope.target = (typeof attrs.extern === 'string' ? '_blank' : '')
         }
     };
 }]);


 angular.module('edison').directive('linkSeparator', function() {
     "use strict";
     return {
         restrict: 'AE',
         replace: true,
         template: '<li>' +
             '      <a>' +
             '            <i ng-if="icon" class = "menu-icon fa fa-{{icon}}"> </i>' +
             '            <strong><span class="mm-text">{{title}}</span></strong>' +
             '        </a>' +
             '      </li>',
         scope: {
             icon: '@',
             title: '@',
         },
         link: function(scope, element, attrs) {

         }
     };
 });


 angular.module('edison').service('sidebarSM', function() {

     var C = function() {
         this.display = false;
     };
     C.prototype.set = function(name, value) {
         this[name] = value;
     }
     return new C();

 });



 angular.module('edison').directive('sideBar', ["sidebarSM", function(sidebarSM) {
     "use strict";
     return {
         replace: false,
         restrict: 'E',
         templateUrl: '/Directives/side-bar.html',
         transclude: true,
         scope: {},
         link: function(scope, element, attrs) {
             scope.sidebarSM = sidebarSM;
         }
     }
 }]);

 angular.module('edison').directive('dropDown', ["config", "sidebarSM", "$timeout", function(config, sidebarSM, $timeout) {
     "use strict";


     return {
         replace: true,
         restrict: 'E',
         templateUrl: '/Directives/dropdown.html',
         transclude: true,
         scope: {
             title: '@',
             icon: '@',
             isOpen: '@',
             openDefault: '&'
         },
         link: function(scope, element, attrs) {
             scope.openDefault = scope.$eval(scope.openDefault)
             scope.isopen = scope.openDefault
             scope.toggleSidebar = function($event, $elem) {
                 var $ul = $(element).find('>ul')
                 if ($('#main-menu').width() > 200) {
                     if (scope.isopen) {
                         $ul.velocity({
                             height: 0
                         }, 200, function() {
                             scope.$apply(function() {
                                 scope.isopen = false;
                             })
                         });
                     } else {
                         $ul.css('height', '100%')
                         scope.isopen = true
                     }
                 } else {

                     $('#mmc-ul > .mmc-wrapper').html($ul.find('> *'));
                     sidebarSM.set("display", true);
                     $timeout(function checkHover() {
                         if (!$('#mmc-ul').is(":hover")) {
                             sidebarSM.set("display", false);
                             $ul.html($('#mmc-ul > .mmc-wrapper').find(">*"))
                             $('#mmc-ul > .mmc-wrapper').html('');
                         } else {
                             $timeout(checkHover, 1000);
                         }
                     }, 1000)
                 }
             }
         }
     };
 }]);

 angular.module('edison').directive('signalement', ["edisonAPI", "LxNotificationService", function(edisonAPI, LxNotificationService) {
    "use strict";
    return {
        replace: false,
        restrict: 'E',
        templateUrl: '/Templates/signalement.html',
        scope: {
            data: '=',
            exit: '&',
        },
        link: function(scope, elem) {
            scope.setSelectedSubType = function(subType) {
                scope.selectedSubType = scope.selectedSubType === subType ? null : subType
            }
            edisonAPI.signal.list().then(function(resp) {
                scope.signalementsGrp = _.groupBy(resp.data, 'subType');
            })
            scope.hide = function(signal) {

                edisonAPI.signalement.add(_.merge(signal, {
                    inter_id: scope.data.id || scope.data.tmpID,
                    sst_id: scope.data.sst && scope.data.sst.id,
                    sst_nom: scope.data.sst && scope.data.sst.nomSociete
                })).then(function() {
                    LxNotificationService.success("Le service " + signal.service.toLowerCase() + " en a été notifié");
                })
                return scope.exit && scope.exit()
            }
        }
    }
 }]);

 angular.module('edison').directive('trello', ["user", "edisonAPI", function(user, edisonAPI) {
    "use strict";
    return {
        replace: false,
        restrict: 'E',
        templateUrl: '/Templates/trello.html',
        scope: {
            data: '=',
        },
        link: function(scope, elem) {

            var xmap = function(e) {
                e.checked = e.state === 'complete';
                return e;
            }
            scope.reload = function() {
                edisonAPI.tasklist.get(moment().format('DD-MM-YYYY'), user.login).then(function(resp) {
                    scope.tasklist = resp.data
                    resp.data.checkItems = resp.data.checkItems.map(xmap)
                })
            }
            scope.reload()
            scope.check = function(task) {
                task.listID = scope.tasklist.id;
                task.cardID = scope.tasklist.cardID;
                edisonAPI.tasklist.update(_.clone(task)).then(function(resp) {
                    task = xmap(resp.data)
                })
                task.checked = !task.checked;
            }
        }
    }
 }]);

angular.module("edison").filter('contactFilter', ["config", function(config) {
    "use strict";

    var clean = function(str) {
        return _.deburr(str).toLowerCase();
    }

    var compare = function(a, b, strictMode) {
        if (typeof a === "string") {
            return clean(a).includes(b);
        } else if (!strictMode) {
            return clean(String(a)).startsWith(b);
        } else {
            return a === parseInt(b);
        }
    }
    return function(dataContainer, input) {
        var rtn = [];
        input = clean(input);
        _.each(dataContainer, function(data) {
            if (!data.stringify)
                data.stringify = clean(JSON.stringify(data))
            if (!input || data.stringify.indexOf(input) >= 0) {
                rtn.push(data);
            } else {
            }
        })
        return rtn;
    }
}]);

angular.module('edison').filter('crlf', function() {
	"use strict";
    return function(text) {
        return text.split(/\n/g).join('<br>');
    };
});

 angular.module('edison').filter('frnbr', function() {
 	"use strict";
 	return function(num) {
 		var n = _.round((num || 0), 2).toString(),
 			p = n.indexOf('.');
 		return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, function($0, i) {
 			return (p < 0 || i < p ? ($0 + ' ') : $0).replace('.', ',');
 		});
 	};
 });

angular.module('edison').filter('loginify', function() {
    "use strict";
    return function(obj) {
        if (!obj)
            return "";
        return obj.slice(0, 1).toUpperCase() + obj.slice(1, -2)
    };
});

angular.module('edison').filter('relativeDate', function() {
    "use strict";
    return function(date, smallWin) {
        var d = moment((date + 137000000) * 10000);
        var l = moment().subtract(4, 'days');
        if (d < l) {
            return smallWin ? d.format('DD/MM') : d.format('DD/MM/YY')
        } else {
            var x = d.fromNow().toString()
            if (smallWin) {
                x = x
                    .replace('quelques secondes', '')
                    .replace(' minutes', 'mn')
                    .replace(' minute', 'mn')
                    .replace(' une', '1')
                    .replace(' heures', 'H')
                    .replace(' heure', 'H')
                    .replace(' jours', 'J')
                    .replace(' jour', 'J')
                    .replace('il y a', '-')
                    .replace(' un', '1')
                    .replace('dans ', '+')
            }
            return x;
        }
        // return moment((date + 1370000000) * 1000).fromNow(no).toString()
    };
});

angular.module('edison').filter('reverse', function() {
    "use strict";
    return function(items) {
        if (!items)
            return [];
        return items.slice().reverse();
    };
});

angular.module("edison").filter('tableFilter', ["config", function(config) {
    "use strict";

    var clean = function(str) {
        return _.deburr(str).toLowerCase();
    }

    var compare = function(a, b, strictMode) {
        if (typeof a === "string") {
            return clean(a).includes(b);
        } else if (!strictMode) {
            return clean(String(a)).startsWith(b);
        } else {
            return a === parseInt(b);
        }
    }
    var compareCustom = function(key, data, input) {
        if (key === '_categorie') {
            var cell = config.categoriesHash()[data.c].long_name;
            return compare(cell, input);
        }
        if (key === '_etat') {
            var cell = config.etatsHash()[data.s].long_name
            return compare(cell, input);
        }
        return true;

    }
    var compareDate = function(key, data, input) {
        var md = (data[key] + 137000000) * 10000;
        //console.log( input.start, input.end);
        if (md > input.start.getTime() && md < input.end.getTime()) {
            return true
        }
        return false;
    }

    var parseDate = function(e) {
        if (!(/^[0-9\/]+$/).test(e) ||  _.endsWith(e, '/')) {
            return undefined;
        }
        var x = e.split('/');
        if (x.length === 1) {
            var month = parseInt(x[0]);
            var year = new Date().getFullYear();
            return {
                start: new Date(year, month - 1),
                end: new Date(year, month)
            }
        } else if (x.length === 2)  {

            if (x[1].length == 4) {
                var month = parseInt(x[0]);
                var year = parseInt(x[1]);
                return {
                    start: new Date(year, month - 1),
                    end: new Date(year, month),
                }
            }

            var day = parseInt(x[0]);
            var month = parseInt(x[1]);
            var year = new Date().getFullYear();
            return {
                start: new Date(year, month - 1, day),
                end: new Date(year, month - 1, day + 1)
            }
        }
        return undefined;
    }


    return function(dataContainer, inputs, strictMode) {
        var rtn = [];
        //console.time('fltr')
        inputs = _.mapValues(inputs, clean);
        _.each(inputs, function(e, k) {
            if (k.charAt(0) === '∆') {
                inputs[k] = parseDate(e);
            }
        })

        _.each(dataContainer, function(data) {
                if (data.id) {
                    var psh = true;
                    _.each(inputs, function(input, k) {
                        if (input && _.size(input) > 0) {
                            if (k.charAt(0) === '_') {
                                if (!compareCustom(k, data, input)) {
                                    psh = false;
                                    return false
                                }
                            } else if (k.charAt(0) === '∆') {
                                if (!compareDate(k.slice(1), data, input)) {
                                    psh = false;
                                    return false
                                }
                            } else {
                                if (!compare(data[k], input, strictMode)) {
                                    psh = false;
                                    return false
                                }
                            }
                        }
                    });
                    if (psh === true) {
                        rtn.push(data);
                    }
                }
            })
            //console.timeEnd('fltr')

        return rtn;
    }
}]);

angular.module('edison').factory('TabContainer', ["$location", "$window", "$q", "edisonAPI", function($location, $window, $q, edisonAPI) {
    "use strict";
    var Tab = function(args, options, prevTab) {

        if (typeof args === 'object') {
            //copy constructor
            _.each(args, function(e, k) {
                this[k] = e;
            })
        } else {
            this.prevTab = prevTab ||  {}
            this.urlFilter = options.urlFilter
            this.hash = options.hash
            this.url = args;
            this.fullUrl = this.url + ['', $.param(this.urlFilter)].join(_.isEmpty(this.urlFilter) ? '' : '?') + (this.hash ? '#' + this.hash : '')
            this.title = '';
            this.position = null;
            this.deleted = false;
            this._timestamp = Date.now();
        }
    }

    Tab.prototype.setData = function(data) {
        //slice create a copy
        this.data = data;
    }

    Tab.prototype.setTitle = function(title, subTitle) {
        this.title = title;
    }

    var TabContainer = function() {
        this._tabs = [];
        this.selectedTab = 0;
    }

    TabContainer.prototype.loadSessionTabs = function(currentUrl) {
        var _this = this;

        return $q(function(resolve, reject) {
            var currentUrlInSessionTabs = false;
            edisonAPI.request({
                fn: "getSessionData",
            }).then(function(result) {
                _this.selectedTab = result.data.selectedTab;
                for (var i = 0; i < result.data._tabs.length; i++) {
                    _this._tabs.push(new Tab(result.data._tabs[i]))
                    if (result.data._tabs[i].url === currentUrl) {
                        _this.selectedTab = i;
                        currentUrlInSessionTabs = true;
                    }
                }
                if (!currentUrlInSessionTabs) {
                    return reject();
                }
                return resolve();
            }).catch(reject);

        })

    }

    TabContainer.prototype.setFocus = function(tab) {
        this.selectedTab = (typeof tab === 'number' ? tab : tab.position);
    };

    TabContainer.prototype.createTab = function(url, options) {
        var tab = new Tab(url, options, this.getCurrentTab());
        tab.position = this._tabs.length;
        this._tabs.push(tab);
        return (tab);
    }

    TabContainer.prototype.isOpen = function(url, options) {
        var index = _.findIndex(this._tabs, function(e) {
            return !e.deleted && e.url === url &&
                (!options.hash && !e.hash || options.hash == e.hash) &&
                _.isEqual(options.urlFilter, e.urlFilter)
        });
        return (index >= 0);
    };

    TabContainer.prototype.getTab = function(url, options) {

        return _.find(this._tabs, function(e) {
            return !e.deleted && e.url === url &&
                (!options.hash && !e.hash || options.hash == e.hash) &&
                _.isEqual(options.urlFilter, e.urlFilter)
        });
    };

    TabContainer.prototype.getTabSimple = function(url, options) {

        return _.find(this._tabs, function(e) {
            return !e.deleted && e.url.split('/')[1] === url.split('/')[1]
        });
    };

    TabContainer.prototype.len = function() {
        var size = 0;

        this._tabs.forEach(function(e) {
            size += !e.deleted;
        })
        return (size);
    }

    TabContainer.prototype.getPrevTab = function(tab) {

        for (var i = tab.position - 1; i >= 0; i--) {
            if (this._tabs[i].deleted === false)
                return (this._tabs[i]);
        }
    };

    TabContainer.prototype.close = function(tab) {
        if (this.len() > 1) {
            console.log("multiple tabs")
            if (this.remove(tab)) {
                $location.url(tab.prevTab.fullUrl ||  '/intervention/list')
            }
        } else {
            console.log("only tab")
            $location.url(tab.prevTab.fullUrl ||  '/intervention/list');
            this.noClose = true;
            //this.remove(tab);
        }
    }

    TabContainer.prototype.remove = function(tab) {
        var newTabs = [];
        var j = 0;

        if (this._tabs.length <= 1) {
            return false;
        }
        var reload = (this.selectedTab === tab.position);
        for (var i = 0; i < this._tabs.length; i++) {
            if (i !== tab.position) {
                newTabs.push(this._tabs[i]);
                newTabs[j].position = j;
                ++j;
            }
        }
        this._tabs = newTabs;

        if (this.selectedTab === tab.position && this.selectedTab !== 0) {
            this.selectedTab--;
        }
        if (this.selectedTab > tab.position) {
            this.selectedTab--;
        }
        return (reload);
    }

    TabContainer.prototype.getCurrentTab = function() {
        return this._tabs[this.selectedTab];
    }
    TabContainer.prototype.addTab = function(url, options) {
        var tab;
        var noOpen = [
            '/list',
            '/search',
            '/recap',
            'lpa',
            '/artisan/contact',
            '/tools/edit',
        ]
        if (this.noClose) {
            tab = this._tabs[0]
        } else if (_.find(noOpen, _.partial(_.includes, url)) && this.getTabSimple(url)) {
            tab = this.getTabSimple(url);
        } else if (this.noClose || this.isOpen(url, options)) {
            tab = this.getTab(url, options)
        } else {
            tab = this.createTab(url, options);
        }
        this.noClose = false;
        if (!(options && options.setFocus === false)) {
            this.setFocus(tab)
        }
        if (options && options.title) {
            tab.setTitle(options.title);
        }
    }

    return (new TabContainer());

}]);

angular.module('edison').factory('Signalement', ["edisonAPI", function(edisonAPI) {
    "use strict";

    var Signalement = function(inter) {
        this.intervention = inter;
    }

    Signalement.prototype.list = []
    return Signalement;
}]);

angular.module('edison').factory('Tab', function() {


    var Tab = function(container, location) {
        this.container = container;
        this.title = "...";
        this.path = location.path();
        this.url = location.path().split('/').slice(1)
        this.model = this.url[0]
        this.route = this.url[1]
        this.hash = location.hash();
        this.title = this.url[this.url.length - 1]
        this.date = new Date;
    }
    Tab.prototype.setTitle = function(title) {
        this.title = title
        return this;
    };

    Tab.prototype.close = function() {
        this.container.close(this);
    }

    Tab.prototype.setData = function(data) {
        this.data = data;
        return this;
    };
    return Tab;

})

angular.module('edison').factory('TabContainer', ["Tab", "$location", function(Tab, $location) {
    "use strict";

    var TabContainer = {
        __tabs: [],
        __ordered: {}
    }


    TabContainer.find = function(location) {
        var cmp = new Tab(this, location)
        return _.find(this.__tabs, function(e) {
            if (e.route === 'list' && cmp.route === 'list') {
                return cmp.model === e.model
            }
            return e.path == location.path() && e.hash == location.hash()
        })
    }

    TabContainer.ordered = function() {
        return this.__ordered;
    }
    TabContainer.close = function(tab) {
        var index = _.findIndex(this.__tabs, function(e) {
            return e.path == tab.path && e.hash == location.hash
        })
        this.__tabs.splice(index, 1);
        $location.url((this.prevTab && this.prevTab.path != this.selectedTab.path && this.prevTab.path) ||  '/intervention/list');
    }



    TabContainer.add = function(location) {
        var tab = this.find(location);
        this.prevTab = this.selectedTab
        if (!tab) {
            this.selectedTab = new Tab(this, location);
            this.__tabs.push(this.selectedTab)
        } else {
            this.selectedTab = tab
        }
        return this;
    }

    TabContainer.getCurrentTab = function() {
        return this.selectedTab;
    }
    TabContainer.order = function() {
        var _this = this;
        var models = ["intervention", "artisan", "devis", 'tools', 'compta'];
        var tmp = {};
        _.each(_this.__tabs, function(e) {
            if (_.includes(models, e.model) && e.url[1] !== 'list' && e.url[1] !== 'contact') {
                var dest = _.endsWith(e.model, 's') ? e.model : e.model + 's';
            } else {
                dest = 'Recents';
            }
            tmp[dest] = tmp[dest] || {
                title: dest,
                tabs: []
            };
            tmp[dest].tabs.push(e)
        })
        this.__ordered = tmp
        return this;
    }
    TabContainer.getOrdered = function() {
        return this.__ordered;
    }


    return TabContainer

}]);

angular.module('edison').factory('Address', function() {
    "use strict";

    var Address = function(place, copyContructor) {
      console.log('=>', place, copyContructor)
        if (place.lat && place.lng) {
            this.lt = place.lat;
            this.lg = place.lng;
        } else if (copyContructor) {
            this.getAddressProprieties(place);
            this.streetAddress = true;
        } else if (this.isStreetAddress(place)) {
            this.getPlaceProprieties(place);
        } else if (this.isLocalityAddress(place)) {
            this.getPlaceLocalityProprieties(place);
        }
        if (place.geometry) {
            this.lt = place.geometry.location.lat();
            this.lg = place.geometry.location.lng();
        }
        this.latLng = this.lt + ', ' + this.lg;
    };

    Address.prototype.getPlaceLocalityProprieties = function(place) {
        var a = place.address_components;
        this.cp = a[1] && a[1].short_name;
        this.v = a[0] && a[0].short_name;
    }

    Address.prototype.getPlaceProprieties = function(place) {
        var a = place.address_components;
        this.n = a[0] && a[0].short_name;
        this.r = a[1] && a[1].short_name;
        this.cp = a[6] && a[6].short_name;
        this.v = a[2] && a[2].short_name;
    }

    Address.prototype.getAddressProprieties = function(address) {
        this.n = address.n;
        this.r = address.r;
        this.cp = address.cp;
        this.v = address.v;
        this.lt = address.lt;
        this.lg = address.lg;
        this.code = address.code;
        this.etage = address.etage;
        this.batiment = address.batiment;
    }

    Address.prototype.isLocalityAddress = function(place) {
        this.localityAddress = (place.types.indexOf("locality") >= 0);
        return this.localityAddress;
    }

    Address.prototype.isStreetAddress = function(place) {
        var noStreet = ["locality", "country", "postal_code", "route", "sublocality"];
        this.streetAddress = (noStreet.indexOf(place.types[0]) < 0);
        return (this.streetAddress);
    }

    Address.prototype.toString = function() {
        return (this.n + " " + this.r + " " + this.cp + ", " + this.v + ", France")
    }

    return (function(place, copyContructor) {
        return new Address(place, copyContructor);
    })
});

angular.module('edison').factory('edisonAPI', ["$http", "$location", "Upload", function($http, $location, Upload) {
  "use strict";
  return {
    bug: {
      declare: function(params) {
        return $http.post('/api/bug/declare', params)
      },
    },
    user: {
      history: function(login) {
        return $http.get('/api/user/' + login + '/history')
      },
    },
    product: {
      list: function() {
        return $http.get('/api/product/list');
      },
      save: function(data) {
        return $http.post('/api/product/__save', data);
      }
    },
    signal: {
      list: function() {
        return $http.get('/api/signal/list');
      },
      save: function(data) {
        return $http.post('/api/signal/__save', data);
      }
    },
    compte: {
      list: function() {
        return $http.get('/api/compte/list');
      },
      save: function(data) {
        return $http.post('/api/compte/__save', data);
      }
    },
    combo: {
      list: function() {
        return $http.get('/api/combo/list');
      },
      save: function(data) {
        return $http.post('/api/combo/__save', data);
      }
    },
    stats: {
      telepro: function() {
        return $http.get('/api/stats/telepro');
      },
      day: function() {
        return $http.get('/api/stats/day');
      }
    },
    users: {
      logout: function() {
        return $http.get('/logout');
      },
      save: function(data) {
        return $http.post('/api/user/__save', data);
      },
      list: function() {
        return $http.get('/api/user/list');
      }
    },
    bfm: {
      get: function() {
        return $http.get('/api/bfm');
      }
    },
    compta: {
      lpa: function(data) {
        return $http.get('/api/intervention/lpa?d=' + (data.d ||  ''));
      },
      flush: function(data) {
        return $http.post('/api/intervention/flush', data);
      },
      flushMail: function(data) {
        return $http.post('/api/intervention/flushMail', data);
      },
      archivesPaiement: function() {
        return $http.get('/api/intervention/archivePaiement');
      },
      archivesReglement: function() {
        return $http.get('/api/intervention/archiveReglement');
      },
      avoirs: function() {
        return $http.get('/api/intervention/avoirs')
      },
      flushAvoirs: function(data) {
        return $http.post('/api/intervention/flushAvoirs', data);
      },

    },
    devis: {
      saveTmp: function(data) {
        return $http.post('/api/devis/temporarySaving', data);
      },
      getTmp: function(id) {
        return $http.get('/api/devis/temporarySaving?id=' + id);
      },
      get: function(id, options) {
        return $http({
          method: 'GET',
          cache: false,
          url: '/api/devis/' + id,
          params: options || {}
        }).success(function(result) {
          return result;
        });
      },
      save: function(params) {
        if (!params.id) {
          return $http.post("/api/devis", params)
        } else {
          return $http.post("/api/devis/" + params.id, params)

        }
      },
      envoi: function(id, options) {
        return $http.post("/api/devis/" + id + "/envoi", options);
      },
      annulation: function(id, causeAnnulation) {
        return $http.post("/api/devis/" + id + "/annulation");
      },
      list: function() {
        return $http.get('api/devis/getCacheList')
      },
    },
    intervention: {
      dashboardStats: function(options) {
        return $http.get('/api/intervention/dashboardStats', {
          params: options
        });
      },
      getTelMatch: function(text) {
        return $http.post('/api/intervention/telMatches', text);
      },
      saveTmp: function(data) {
        return $http.post('/api/intervention/temporarySaving', data);
      },
      getTmp: function(id) {
        return $http.get('/api/intervention/temporarySaving?id=' + id);
      },
      demarcher: function(id) {
        return $http({
          method: 'POST',
          url: '/api/intervention/' + id + '/demarcher'
        })
      },
      reactivation: function(id) {
        return $http.post('api/intervention/' + id + '/reactivation')
      },
      list: function() {
        return $http.get('api/intervention/getCacheList')
      },
      get: function(id, options) {
        return $http({
          method: 'GET',
          cache: false,
          url: '/api/intervention/' + id,
          params: options || {}
        }).success(function(result) {
          return result;
        });
      },
      getCB: function(id) {
        return $http.get("/api/intervention/" + id + "/CB");
      },
      save: function(params) {
        if (!params.id) {
          return $http.post("/api/intervention", params)
        } else {
          return $http.post("/api/intervention/" + params.id, params)

        }
      },
      getFiles: function(id) {
        return $http({
          method: 'GET',
          url: "/api/intervention/" + id + "/getFiles"
        });
      },
      verification: function(id, options) {
        return $http.post("/api/intervention/" + id + "/verification", options);
      },
      annulation: function(id, options) {
        return $http.post("/api/intervention/" + id + "/annulation", options);
      },
      envoi: function(id, options) {
        return $http.post("/api/intervention/" + id + "/envoi", options);
      },
      sendFacture: function(id, options) {
        return $http.post("/api/intervention/" + id + "/sendFacture", options);
      },
      sendFactureAcquitte: function(id, options) {
        return $http.post("/api/intervention/" + id + "/sendFactureAcquitte", options);
      },
      statsBen: function(options) {
        return $http({
          method: 'GET',
          url: "/api/intervention/statsBen",
          params: options
        });
      },
      gstats: function(options) {
        return $http({
          method: 'GET',
          url: "/api/intervention/gstats",
          params: options
        });
      },
      statsBenYear: function(options) {
        return $http({
          method: 'GET',
          url: "/api/intervention/statsBenYearly",
          params: options
        });
      },
      commissions: function(options) {
        return $http({
          method: 'GET',
          url: "/api/intervention/commissions",
          params: options
        });
      },
      scan: function(id) {
        return $http.post("/api/intervention/" + id + "/scan");
      }
    },
    artisan: {
      tableauCom: function(date) {
        return $http.get('/api/artisan/tableauCom', {
          params: {
            date: date
          }
        });
      },
      manage: function(id) {
        return $http.post('/api/artisan/' + id + '/manage')
      },
      comment: function(id, text) {
        return $http.post('/api/artisan/' + id + '/comment', {
          text: text
        })
      },
      absence: function(id, absence) {
        return $http.post('/api/artisan/' + id + '/absence', absence)
      },
      needFacturier: function(id) {
        return $http.post('/api/artisan/' + id + '/needFacturier')
      },
      sendFacturier: function(id, facturier, deviseur) {
        return $http.post('/api/artisan/' + id + '/sendFacturier', {
          facturier: facturier,
          deviseur: deviseur,
        });
      },
      saveTmp: function(data) {
        return $http.post('/api/artisan/temporarySaving', data);
      },
      fullHistory: function(id) {
        return $http.get('/api/artisan/' + id + '/fullHistory');
      },
      getTmp: function(id) {
        return $http.get('/api/artisan/temporarySaving?id=' + id);
      },
      getCompteTiers: function(id_sst) {
        return $http.get(['/api/artisan', id_sst, 'compteTiers'].join('/'));
      },
      envoiContrat: function(id, options) {
        return $http.post("/api/artisan/" + id + '/sendContrat', options)
      },
      upload: function(file, name, id) {
        return Upload.upload({
          url: '/api/artisan/' + id + "/upload",
          fields: {
            name: name,
            id: id
          },
          file: file
        })
      },
      getFiles: function(id) {
        return $http({
          method: 'GET',
          url: "/api/artisan/" + id + "/getFiles"
        });
      },
      extendedStats: function(id) {
        return $http.get('/api/artisan/' + id + "/extendedStats")
      },
      statsMonths: function(id) {
        return $http.get('/api/artisan/' + id + "/statsMonths")
      },
      save: function(params) {
        if (!params.id) {
          return $http.post("/api/artisan", params)
        } else {
          return $http.post("/api/artisan/" + params.id, params)

        }
      },
      list: function(options) {
        return $http.get('api/artisan/getCacheList')
      },
      lastInters: function(id) {
        return $http({
          method: 'GET',
          url: '/api/artisan/' + id + '/lastInters',
        })
      },
      get: function(id, options) {
        return $http({
          method: 'GET',
          cache: false,
          url: '/api/artisan/' + id,
          params: options || {}
        }).success(function(result) {
          return result;
        });
      },
      getNearest: function(address, categorie) {
        return $http({
          method: 'GET',
          url: "/api/artisan/rank",
          cache: false,
          params: {
            categorie: categorie,
            lat: address.lt,
            lng: address.lg,
            limit: 150,
            maxDistance: 100
          }
        });
      },
      getStats: function(id_sst) {
        return $http({
          method: 'GET',
          url: "/api/artisan/" + id_sst + "/stats"
        });
      },
    },
    tasklist: {
      get: function(date, login) {
        return $http.get('/api/tasklist/' + date + '/' + login);
      },
      check: function(listid, taskid) {
        return $http.post('/api/tasklist/' + listid + '/check/' + taskid);
      },
      update: function(task) {
        return $http.post('/api/tasklist/', {
          task: task
        });
      }
    },
    task: {
      add: function(params) {
        return $http.post('/api/task/add', params)
      },
      check: function(id) {
        return $http.post('/api/task/' + id + '/check')
      },
      listRelevant: function(options) {
        return $http.get('/api/task/relevant', {
          params: options
        });
      }
    },
    signalement: {
      check: function(id, text) {
        return $http.post('/api/signalement/' + id + '/check', {
          text: text
        })
      },
      add: function(params) {
        return $http.post('/api/signalement/add', params)
      },
      list: function(params) {
        return $http.get('/api/signalement/list', {
          params: params
        })
      },
      stats: function() {
        return $http.get('/api/signalement/stats')
      }
    },
    file: {
      uploadScans: function(file, options) {
        return Upload.upload({
          url: '/api/document/uploadScans',
          fields: options,
          file: file
        })
      },
      upload: function(file, options) {
        return Upload.upload({
          url: '/api/document/upload',
          fields: options,
          file: file
        })
      },
      scan: function(options) {
        return $http.post('/api/document/scan', options);
      }
    },
    call: {
      get: function(origin, link) {
        return $http({
          method: 'GET',
          url: '/api/calls/get',
          params: {
            q: JSON.stringify({
              link: link
            })
          }
        })
      },
      save: function(params) {
        return $http.post('/api/calls', params);
      },
    },
    sms: {
      get: function(origin, link) {
        return $http({
          method: 'GET',
          url: '/api/sms/get',
          params: {
            q: JSON.stringify({
              link: link,
              origin: origin
            })
          }
        })
      },
      send: function(params) {
        return $http.post("/api/sms/send", params)
      },

    },
    getDistance: function(origin, destination) {
      return $http({
        method: 'GET',
        cache: true,
        url: '/api/mapGetDistance',
        params: {
          origin: origin,
          destination: destination
        }
      })
    },
    request: function(options) {
      return $http({
        method: options.method || 'GET',
        url: '/api/' + options.fn,
        params: options.data
      });
    },
    searchPhone: function(tel) {
      return $http({
        method: 'GET',
        url: "api/arcep/" + tel + "/search"
      });
    },
    getUser: function() {
      return $http({
        method: 'GET',
        cache: true,
        url: "/api/whoAmI"
      });
    },
    searchText: function(text, options) {
      return $http({
        method: 'GET',
        params: options,
        url: ['api', 'search', text].join('/')
      })
    },
    bigSearch: function(text, options) {
      return $http({
        method: 'GET',
        params: options,
        url: ['api', 'bigSearch', text].join('/')
      })
    }
  }
}]);

angular.module('edison')
    .factory('Artisan', ["$window", "$rootScope", "user", "$location", "LxNotificationService", "LxProgressService", "dialog", "edisonAPI", "textTemplate", function($window, $rootScope, user, $location, LxNotificationService, LxProgressService, dialog, edisonAPI, textTemplate) {
        "use strict";
        var Artisan = function(data) {
            if (!(this instanceof Artisan)) {
                return new Artisan(data);
            }
            for (var k in data) {
                this[k] = data[k];
            }
        }

        var appelLocal = function(tel) {
            if (tel) {
                $window.open('callto:' + tel, '_self', false);
            }
        }

        Artisan.prototype.callTel1 = function() {
            appelLocal(this.telephone.tel1)
        }
        Artisan.prototype.callTel2 = function() {
            appelLocal(this.telephone.tel2)
        }

        Artisan.prototype.typeOf = function() {
            return 'Artisan';
        }

        Artisan.prototype.ouvrirFiche = function() {
            $location.url("/artisan/" + this.id);
        }
        Artisan.prototype.ouvrirRecap = function() {
            $location.url("/artisan/" + this.id + '/recap');
        }
        Artisan.prototype.facturierDeviseur = function() {
            var _this = this;
            dialog.facturierDeviseur(this, function(facturier, deviseur) {
                edisonAPI.artisan.sendFacturier(_this.id, facturier, deviseur);
            })
        }

        Artisan.prototype.tutelleIn = function(cb) {
            this.tutelle = true;
            Artisan(this).save();
        }
        Artisan.prototype.tutelleOut = function(cb) {
            this.tutelle = false;
            Artisan(this).save();
        }

        Artisan.prototype.deArchiver = function() {
            this.status = "ACT";
            Artisan(this).save();
        }
        Artisan.prototype.archiver = function() {
            this.status = "ARC";
            Artisan(this).save();
        }

        Artisan.prototype.call = function(cb) {
            var _this = this;
            var now = Date.now();
            $window.open('callto:' + _this.telephone.tel1, '_self', false)
        };

        Artisan.prototype.refuseFacturier = function() {
            this.demandeFacturier.status = 'NO';
            Artisan(this).save();
        }

        Artisan.prototype.needFacturier = function() {
            if (this.demandeFacturier && moment(this.demandeFacturier.date).isAfter(moment().add(-10, 'days'))) {
                if (this.demandeFacturier.status === 'PENDING') {
                    LxNotificationService.error(moment(this.demandeFacturier.date).format("[Une demande à deja été éffectué le ]LLL"));
                }
                if (this.demandeFacturier.status === 'OK') {
                    LxNotificationService.error("Un facturier à deja été envoyé dans les 10 derniers jours");
                }
                if (this.demandeFacturier.status === 'NO') {
                    LxNotificationService.error("L'envoi d'un facturier à deja été refusé dans les 10 derniers jours");
                }
                return 0;
            }
            edisonAPI.artisan.needFacturier(this.id).then(function(resp) {
                LxNotificationService.success("Une notification a été envoyer au service partenariat");
            })
        }

        Artisan.prototype.save = function(cb) {
            var _this = this;

            edisonAPI.artisan.save(_this)
                .then(function(resp) {
                    LxNotificationService.success("Les données ont à été enregistré");
                    if (typeof cb === 'function')
                        cb(null, resp.data)
                }).catch(function(error) {
                    LxNotificationService.error(error.data);
                    if (typeof cb === 'function')
                        cb(error.data)
                });
        };


        Artisan.prototype.manager = function(cb) {
            var _this = this;
            _this.login.management = user.login;
            edisonAPI.artisan.save(_this)
                .then(function(resp) {
                    LxNotificationService.success("Vous manager désormais " + _this.nomSociete);
                    if (typeof cb === 'function')
                        cb(null, resp.data)
                }).catch(function(error) {
                    LxNotificationService.error(error.data);
                    if (typeof cb === 'function')
                        cb(error.data)
                });
        };

        Artisan.prototype.upload = function(file, name, cb) {
            var _this = this;
            if (file) {
                LxProgressService.circular.show('#5fa2db', '#fileUploadProgress');
                edisonAPI.artisan.upload(file, name, _this.id)
                    .success(function(resp) {
                        _this.document = resp.document;
                        LxProgressService.circular.hide();
                        if (typeof cb === 'function')
                            cb(null, resp);
                    }).catch(function(err) {
                        LxProgressService.circular.hide();
                        if (typeof cb === 'function')
                            cb(err);
                    })
            }
        }

        Artisan.prototype.envoiContrat = function(options, cb) {
            var _this = this;
            options = options || {};
            dialog.sendContrat({
                data: _this,
                signe: options.signe,
                text: _.template(textTemplate.mail.artisan.envoiContrat())(_this),
            }, function(options) {
                LxProgressService.circular.show('#5fa2db', '#globalProgress');
                edisonAPI.artisan.envoiContrat(_this.id, {
                    text: options.text,
                    signe: options.signe
                }).success(function(resp) {
                    LxProgressService.circular.hide()
                    if (typeof cb === 'function')
                        cb(null, resp);
                });
            });
        }
        Artisan.prototype.relanceDocuments = function(cb) {
            var _this = this;
            _this.datePlain = moment(_this.date.ajout).format('ll')
            dialog.sendContrat({
                data: _this,
                text: _.template(textTemplate.mail.artisan.relanceDocuments())(_this),
            }, function(options) {
                LxProgressService.circular.show('#5fa2db', '#globalProgress');
                edisonAPI.artisan.envoiContrat(_this.id, {
                    text: options.text,
                    signe: options.signe,
                    rappel: true
                }).success(function(resp) {
                    LxProgressService.circular.hide()
                    if (typeof cb === 'function')
                        cb(null, resp);
                });
            });
        }

        Artisan.prototype.ouvrirFiche = function() {
            $location.url("/artisan/" + this.id);
        }
        return Artisan;
    }]);

angular.module('edison').factory('ContextMenu', ["$rootScope", "$location", "edisonAPI", "user", "$window", "$timeout", "dialog", "Devis", "Intervention", "Artisan", "contextMenuData", function($rootScope, $location, edisonAPI, user, $window, $timeout, dialog, Devis, Intervention, Artisan, contextMenuData) {
    "use strict";

    var ContextMenu = function(model) {
        var _this = this;
        this.model = model
        this.list = contextMenuData[model];
        $rootScope.$on('closeContextMenu', function() {
            return _this.active && _this.close();
        })
        this.style = {
            left: 0,
            top: 0,
            display: "none"
        }
    }

    ContextMenu.prototype.openSub = function(delay) {
        var _this = this
        this.openSubTimeout = $timeout(function() {
            _this.mouseOverCM = true
        }, delay || 0)

    }

    ContextMenu.prototype.closeSub = function() {
        if (this.openSubTimeout) {
            $timeout.cancel(this.openSubTimeout);
        }
        this.mouseOverCM = false
    }

    ContextMenu.prototype.getData = function() {
        return this.data;
    }
    ContextMenu.prototype.setData = function(data) {
        this.data = data;
    }

    ContextMenu.prototype.setPosition = function(x, y) {
        this.style.left = (x - $('#main-menu-inner').width()) - 4;
        this.style.top = y - 48;
    }

    ContextMenu.prototype.active = false;

    ContextMenu.prototype.open = function() {
        var _this = this;
        this.closeSub()
        this.list.forEach(function(e) {
            if (e.subs) {
                _.each(e.subs, function(sub) {
                    sub.hidden = sub.hide && sub.hide(_this.data);
                })
            } else {
                e.hidden = e.hide && e.hide(_this.data, user);
            }
        });
        this.style.display = "block";
        this.active = true;
        return this
    }

    ContextMenu.prototype.onClose = function(callback) {
        this.onCloseCallback = callback;
    }

    ContextMenu.prototype.close = function() {
        this.style.display = "none";
        this.active = false;
        if (this.onCloseCallback) {
           this.onCloseCallback()
           this.onCloseCallback = null;
        }

    }

    ContextMenu.prototype.modelObject = {
        intervention: Intervention,
        devis: Devis,
        artisan: Artisan
    }

    ContextMenu.prototype.tooltip = function(link) {
        return _.get(this.data, link.binding, '');
    }

    ContextMenu.prototype.click = function(link) {
        if (typeof link.action === 'function') {
            return link.action(this.getData())
        } else if (typeof link.action === 'string') {
            return this.modelObject[this.model]()[link.action].bind(this.data)();
        } else {
            console.error("error here")
        }
    }


    return ContextMenu

}]);

angular.module('edison').factory('DataProvider', ["$timeout", "edisonAPI", "socket", "$rootScope", "config", function($timeout, edisonAPI, socket, $rootScope, config) {
    "use strict";
    var DataProvider = function(model, hashModel) {
        var _this = this;
        this.model = model;
        this.hashModel = hashModel || 't';
        this.rand = new Date
        socket.on(_this.socketListChange(), function(change) {
            if (_this.appliedList.indexOf(change.ts) === -1) {
                _this.appliedList.push(change.ts)
                _this.updateData(change.data);
            }
        });
    }

    DataProvider.prototype.socketListChange = function() {
        var _this = this;
        return _this.model.toUpperCase() + '_CACHE_LIST_CHANGE';
    }
    DataProvider.prototype.appliedList = [];

    DataProvider.prototype.data = {}

    DataProvider.prototype.trie = {}

    DataProvider.prototype.setData = function(data) {
        var _this = this;
        this.data[this.model] = data;
        _this.trie[this.model] = {};
        _.each(data, function(e) {
            _this.getTrie()[e.id] = e;
        })
    };

    DataProvider.prototype.init = function(cb) {
        var _this = this;
        if (_this.getData())
            return cb(_this.getData());
        edisonAPI[_this.model].list({
            cache: true
        }).success(function(resp) {
            _this.setData(resp);
            return cb(null, resp);
        })
    }

    DataProvider.prototype.rowFilterFactory = function(filter, hash) {
        var _this = this;
        if (!filter && hash) {
            return function onlyLogin(inter) {
                return inter[_this.hashModel] === hash;
            }
        }
        if (filter && hash) {
            return function loginAndFilter(inter) {
                return inter.f && inter.f[filter.short_name] === 1 && inter[_this.hashModel] === hash;
            }
        }
        if (filter && !hash) {
            return function onlyFilter(inter) {
                return inter.f && inter.f[filter.short_name] === 1;
            }
        }
    }

    DataProvider.prototype.applyFilter = function(filter, hash, customFilter) {
        this.filteredData = this.getData();
        if (this.getData() && (filter || hash || customFilter)) {
            this.filteredData = _.filter(this.getData(), customFilter || this.rowFilterFactory(filter, hash));
        }
    }

    DataProvider.prototype.flash = function(row) {
        row.flash = true;
        $timeout(function() {
            row.flash = false;
        }, 1000)
    }

    DataProvider.prototype.updateData = function(newRows) {
        var _this = this;
        if (this.getData()) {
            _.each(newRows, function(e) {
                var tmp = _this.getTrie()[e.id];
                if (tmp) {
                    _.merge(_this.getTrie()[e.id], e);
                } else {
                    _this.getData().unshift(e);
                    _this.getTrie()[e.id] = e;
                }
            })

            $rootScope.$broadcast(_this.socketListChange());
        }

    }

    DataProvider.prototype.getData = function() {
        return this.data[this.model];
    }
    DataProvider.prototype.getTrie = function() {
        return this.trie[this.model];
    }

    DataProvider.prototype.isInit = function() {
        return this.model && this.data && this.data[this.model];
    }
    return DataProvider;

}]);

angular.module('edison').factory('DateSelect', function() {
    "use strict";
    var DateSelect = function(dateStart, dateEnd) {

        var _this = this;
        var d = new Date();
        _this.start = {
            m: !dateStart ? 9 : dateStart.getMonth() + 1,
            y: !dateStart ? 2013 : dateStart.getFullYear()
        }
        _this.current = {
            m: d.getMonth() + 1,
            y: d.getFullYear()
        }

        var frenchMonths = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        _this._list = [];
        _.times(_this.current.y - _this.start.y + 1, function(yr) {
            _.times(12, function(mth) {
                _this._list.push({
                    m: mth + 1,
                    y: _this.start.y + yr,
                    t: frenchMonths[mth] + ' ' + (_this.start.y + yr),
                    o: (_this.start.y + yr) + (mth + 1) * 0.01
                })
            })
        })
        _this._list.splice(_this.current.m - 12)
    }
    DateSelect.prototype.list = function() {
        return this._list;
    }
    return DateSelect;
});

angular.module('edison')
    .factory('Devis', ["openPost", "$window", "$rootScope", "$location", "LxNotificationService", "LxProgressService", "dialog", "edisonAPI", "textTemplate", function(openPost, $window, $rootScope, $location, LxNotificationService, LxProgressService, dialog, edisonAPI, textTemplate) {
        "use strict";
        var Devis = function(data) {
            if (!(this instanceof Devis)) {
                return new Devis(data);
            }
            for (var k in data) {
                this[k] = data[k];
            }
        }

        var appelLocal = function(tel) {
            console.log('---->', tel);
            if (tel) {
                $window.open('callto:' + tel, '_self', false);
            }
        }

        Devis.prototype.callTel1 = function() {
            appelLocal(this.client.telephone.tel1)
        }
        Devis.prototype.callTel2 = function() {
            appelLocal(this.client.telephone.tel2)
        }
        Devis.prototype.callTel3 = function() {
            appelLocal(this.client.telephone.tel3)
        }

        Devis.prototype.typeOf = function() {
            return 'Devis';
        }
        Devis.prototype.save = function(cb) {
            var _this = this;
            console.log('yay')
            edisonAPI.devis.save(_this)
                .then(function(resp) {
                    console.log('resp')
                    var validationMessage = _.template("Les données du devis {{id}} ont à été enregistré")(resp.data);
                    LxNotificationService.success(validationMessage);
                    if (typeof cb === 'function')
                        cb(null, resp.data)
                }, function(error) {
                    console.log('err')
                    LxNotificationService.error(error.data);
                    if (typeof cb === 'function')
                        cb("une erreur est " + error.data)
                }).catch(function(e) {
                    console.log('ERRRR:>', e)
                })
        };

        Devis.prototype.devisPreview = function() {
            if (!this.client.nom || !this.client.address.r || !this.client.address.v ||  !this.client.address.cp || !this.client.address.n) {
                return LxNotificationService.error('Les Coordonnées du devis sont incompletes');
            }
            if (!this.produits || !this.produits.length) {
                return LxNotificationService.error('Veuillez renseigner au moins 1 produits');
            }
            openPost('/api/intervention/devisPreview', {
                data: JSON.stringify(this),
                html: true
            })
        }

        Devis.prototype.sendDevis = function(cb) {
            var _this = this;
            if (!/\S+@\S+\.\S+/.test(_this.client.email)) {
                LxNotificationService.error("L'addresse email est invalide");
                return cb("err");
            }
            var preview = Devis(this).devisPreview.bind(this)
            dialog.getTextDevis(preview, {
                text: textTemplate.mail.devis.envoi.bind(_this)($rootScope.user),
                width: "900px",
                height: "700px"
            }, function(text) {
                LxProgressService.circular.show('#5fa2db', '#globalProgress');
                edisonAPI.devis.envoi(_this.id, {
                    text: text,
                }).success(function(resp) {
                    LxProgressService.circular.hide()
                    var validationMessage = _.template("le devis {{id}} à été envoyé")(_this);
                    LxNotificationService.success(validationMessage);
                    if (typeof cb === 'function') {
                        console.log('yes cb')
                        cb(null, resp);
                    }
                }, function(err) {
                    LxProgressService.circular.hide()
                    var validationMessage = _.template("L'envoi du devis {{id}} à échoué\n")(_this)
                    if (err && err.data && typeof err.data === 'string')
                        validationMessage += ('\n(' + err.data + ')')
                    LxNotificationService.error(validationMessage);
                    if (typeof cb === 'function')
                        cb(err);
                }).catch(function(err) {
                    LxProgressService.circular.hide()
                    var validationMessage = _.template("L'envoi du devis {{id}} à échoué\n")(_this)
                    if (err && err.data && typeof err.data === 'string')
                        validationMessage += ('\n(' + err.data + ')')
                    LxNotificationService.error(validationMessage);
                    if (typeof cb === 'function')
                        cb(err);
                })

            })
        }
        Devis.prototype.annulation = function(cb) {
            var _this = this;
            edisonAPI.devis.annulation(_this.id)
                .then(function(resp) {
                    var validationMessage = _.template("Le devis {{id}} est annulé")(resp.data)
                    LxNotificationService.success(validationMessage);
                    if (typeof cb === 'function')
                        cb(null, resp.data)
                });
        };

        Devis.prototype.ouvrirFiche = function() {
            $location.url("/devis/" + this.id);
        }
        Devis.prototype.transfert = function() {
            $location.url("/intervention?devis=" + this.id);
        }
        return Devis;
    }]);

angular.module('edison').factory('dialog', ["openPost", "$mdDialog", "edisonAPI", "config", "$window", "LxNotificationService", function(openPost, $mdDialog, edisonAPI, config, $window, LxNotificationService) {
    "use strict";

    return {

        declareBug: function(tabs, cb) {
            $mdDialog.show({
                controller: ["$scope", "$mdDialog", "config", function($scope, $mdDialog, config) {
                    $scope.resp = {
                        location: tabs.getCurrentTab().path,
                    }
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (!cancel) {
                            return cb(null, $scope.resp)
                        }
                    }
                }],
                templateUrl: '/DialogTemplates/declare-bug.html',
            });
        },

        getPassword: function(cb) {
            $mdDialog.show({
                controller: ["$scope", "$mdDialog", "config", function($scope, $mdDialog, config) {

                    $scope.answer = function(cancel) {
                        if ($scope.password === 'lecielestgris') {
                          $mdDialog.hide();
                          return cb(null, "OK")
                        }
                    }
                }],
                templateUrl: '/DialogTemplates/get-password.html',
            });
        },

        verification: function(inter, cb) {
            $mdDialog.show({
                controller: ["$scope", "$mdDialog", "config", function DialogController($scope, $mdDialog, config) {
                    $scope.data = inter
                    $scope.config = config;
                    $scope.answer = function(cancel) {
                        $scope.window = $window;
                        $scope.inter = inter;
                        if (!cancel) {
                            if (!$scope.inter.prixFinal) {
                                LxNotificationService.error("Veuillez renseigner un prix final");
                            } else {
                                $mdDialog.hide();
                                cb(inter);
                            }
                        } else {
                            $mdDialog.hide();
                        }
                    }
                }],
                templateUrl: '/DialogTemplates/verification.html',
            });
        },
        recouvrement: function(inter, cb) {
            $mdDialog.show({
                controller: ["$scope", "$mdDialog", "config", function DialogController($scope, $mdDialog, config) {
                    $scope.data = inter
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (!cancel) {
                            cb(inter);
                        }
                    }
                }],
                templateUrl: '/DialogTemplates/recouvrement.html',
            });
        },
        validationReglement: function(inter, cb) {
            $mdDialog.show({
                controller: ["$scope", "$mdDialog", function DialogController($scope, $mdDialog) {
                    $scope.data = inter

                    Mousetrap.bind(['command+k', 'ctrl+k', 'command+f1', 'ctrl+f1'], function() {
                        $window.open("appurl:", '_self');
                        edisonAPI.intervention.scan(inter.id).then(function() {
                            LxNotificationService.success("Le fichier est enregistré");
                        })
                        return false;
                    });


                    $scope.answer = function(resp) {
                        $scope.data = inter;
                        $mdDialog.hide();
                        if (resp === null) {
                            return cb('nope')
                        }
                        if ($scope.data.compta.reglement.montant !== 0) {
                            $scope.data.compta.reglement.recu = resp;
                        }
                        return cb(null, $scope.data);
                    }
                }],
                templateUrl: '/DialogTemplates/validationReglement.html',
            });
        },
        validationPaiement: function(inter, cb) {
            $mdDialog.show({
                controller: ["$scope", "$mdDialog", function DialogController($scope, $mdDialog) {
                    $scope.data = inter
                    Mousetrap.bind(['command+k', 'ctrl+k', 'command+f1', 'ctrl+f1'], function() {
                        $window.open("appurl:", '_self');
                        console.log('scane')
                        edisonAPI.intervention.scan(inter.id).then(function() {
                            LxNotificationService.success("Le fichier est enregistré");
                        })
                        return false;
                    });
                    $scope.data.compta.paiement.ready = true;
                    $scope.preview = function() {
                        openPost('/api/intervention/autofacture', {
                            data: JSON.stringify($scope.data),
                            html: true
                        });
                    }
                    $scope.answer = function(resp) {
                        $scope.data = inter;
                        $mdDialog.hide();
                        if (resp === null) {
                            return cb('nope')
                        }
                        return cb(null, $scope.data);
                    }
                }],
                templateUrl: '/DialogTemplates/validationPaiement.html',
            });
        },
        facturierDeviseur: function(artisan, cb) {
            $mdDialog.show({
                controller: ["$scope", "$mdDialog", "config", function DialogController($scope, $mdDialog, config) {
                    $scope.sst = artisan
                    $scope.deviseur = true;
                    $scope.facturier = true;
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (!cancel) {
                            cb($scope.facturier, $scope.deviseur);
                        }
                    }
                }],
                templateUrl: '/DialogTemplates/facturierDeviseur.html',
            });
        },
        envoiFacture: function(inter, text, showAcquitte, cb) {
            $mdDialog.show({
                controller: ["$scope", "$mdDialog", function DialogController($scope, $mdDialog) {
                    $scope.text = text
                    $scope.date = new Date();
                    $scope.showAcquitte = showAcquitte;
                    $scope.acquitte = showAcquitte;
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (!cancel) {
                            cb(null, $scope.text, $scope.acquitte, $scope.date);
                        } else {
                            cb('nope')
                        }
                    }
                }],
                templateUrl: '/DialogTemplates/envoiFacture.html',
            });
        },
        recap: function(inters) {
            $mdDialog.show({
                controller: ["$scope", "$mdDialog", "config", function DialogController($scope, $mdDialog, config) {
                    $scope.inters = inters;
                    $scope.config = config
                    $scope.answer = function() {
                        $mdDialog.hide();
                    }
                }],
                templateUrl: '/DialogTemplates/recapList.html',
            });
        },
        callsList: function(sst) {
            $mdDialog.show({
                controller: ["$scope", "$mdDialog", function DialogController($scope, $mdDialog) {
                    $scope.sst = sst;
                    $scope.answer = function() {
                        $mdDialog.hide();
                    }
                }],
                templateUrl: '/DialogTemplates/callsList.html',
            });
        },
        smsList: function(sst) {
            $mdDialog.show({
                controller: ["$scope", "$mdDialog", function DialogController($scope, $mdDialog) {
                    $scope.sst = sst;
                    $scope.answer = function() {
                        $mdDialog.hide();
                    }
                }],
                templateUrl: '/DialogTemplates/smsList.html',
            });
        },
        choiceText: function(options, cb) {
            $mdDialog.show({
                controller: ["$scope", "$mdDialog", function DialogController($scope, $mdDialog) {
                    $scope.options = options;
                    $scope.answer = function(resp, text) {
                        $mdDialog.hide();
                        return cb(resp, text);
                    }
                }],
                templateUrl: '/DialogTemplates/choiceText.html',
            });
        },
        addProd: function(cb) {
            $mdDialog.show({
                controller: ["$scope", "$mdDialog", "$window", function DialogController($scope, $mdDialog, $window) {
                    $scope.pu = 0;
                    $scope.window = $window
                    $scope.quantite = 1;
                    $scope.prod = {
                        quantite: 1,
                        pu: 0,
                        title: "",
                        ref: ""
                    }
                    $scope.$watch('prod', function() {
                        $scope.prod.ref = $scope.prod.ref.toUpperCase();
                        $scope.prod.title = $scope.prod.title.toUpperCase();
                        $scope.prod.desc = $scope.prod.title;
                        $scope.prod.pu = $scope.prod.pu;
                        $scope.prod.quantite = $scope.prod.quantite;
                    }, true)
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (!cancel) {
                            return cb($scope.prod);
                        }
                    }
                }],
                templateUrl: '/DialogTemplates/getProd.html',
            });
        },
        getCauseAnnulation: function(inter, cb) {
            $mdDialog.show({
                controller: ["$scope", "config", function($scope, config) {
                    $scope.causeAnnulation = config.causeAnnulation;
                    inter.datePlain = moment(inter.date.intervention).format('DD/MM/YYYY')
                    $scope.textSms = _.template("L'intervention {{id}} chez {{client.civilite}} {{client.nom}} à {{client.address.v}} le {{datePlain}} a été annulé. \nMerci de ne pas intervenir. \nEdison Services")(inter)
                    $scope.answer = function(resp) {
                        if (resp && !$scope.ca) {
                            return LxNotificationService.error("Veuillez renseigner une raison d'annulation");
                        }
                        $mdDialog.hide();
                        if (resp)
                            return cb(null, $scope.ca, $scope.reinit, $scope.sendSms, $scope.textSms);
                        return cb('nope');
                    }
                }],
                templateUrl: '/DialogTemplates/causeAnnulation.html',
            });
        },
        sendContrat: function(options, cb) {
            $mdDialog.show({
                controller: ["$scope", "$mdDialog", function DialogController($scope, $mdDialog) {
                    $scope.options = options;
                    console.log(options.signe)
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (!cancel)
                            return cb($scope.options);
                    }
                }],
                templateUrl: '/DialogTemplates/sendContrat.html',
            });
        },
        getText: function(options, cb) {
            $mdDialog.show({
                controller: ["$scope", "$mdDialog", function DialogController($scope, $mdDialog) {
                    $scope.options = options;
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (!cancel)
                            return cb($scope.options.text);
                    }
                }],
                templateUrl: '/DialogTemplates/text.html',
            });
        },
        getTextDevis: function(previewFunction, options, cb) {
            $mdDialog.show({
                controller: ["$scope", "$mdDialog", function DialogController($scope, $mdDialog) {
                    $scope.options = options;
                    $scope.previewFunction = previewFunction;
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (!cancel)
                            return cb($scope.options.text);
                    }
                }],
                templateUrl: '/DialogTemplates/textDevis.html',
            });
        },
        getFileAndText: function(data, text, files, cb) {
            $mdDialog.show({
                controller: ["$scope", "$mdDialog", function DialogController($scope, $mdDialog) {
                    $scope.Math = Math
                    $scope.xfiles = _.clone(files ||  []);
                    $scope.smsText = text;
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (cancel === false) {
                            return cb(null, $scope.smsText, $scope.addedFile);
                        } else {
                            return cb('nope');
                        }
                    }
                }],
                templateUrl: '/DialogTemplates/fileAndText.html',
            });
        },
        envoiIntervention: function(data, text, cb) {
            $mdDialog.show({
                controller: ["$scope", "$mdDialog", function DialogController($scope, $mdDialog) {
                    $scope.data = data;
                    $scope.smsText = text;
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (cancel === false) {
                            return cb(null, $scope.smsText, $scope.addedFile);
                        } else {
                            return cb('nope');
                        }
                    }
                }],
                templateUrl: '/DialogTemplates/envoi.html',
            });
        },
        editProduct: {
            open: function(produit, cb) {
                $mdDialog.show({
                    controller: ["$scope", "$mdDialog", function DialogController($scope, $mdDialog) {
                        $scope.produit = _.clone(produit);
                        $scope.mdDialog = $mdDialog;
                        $scope.answer = function(p) {
                            $mdDialog.hide(p);
                            return cb(p);
                        }
                    }],
                    templateUrl: '/DialogTemplates/edit.html',
                });
            }
        },
        selectSubProduct: function(elem, callback) {
            $mdDialog.show({
                controller: ["$scope", "$mdDialog", function DialogController($scope, $mdDialog) {
                    $scope.elem = elem
                    $scope.answer = function(cancel, item) {
                        $mdDialog.hide();
                        if (!cancel) {
                            return callback(item)
                        }
                    }
                }],
                templateUrl: '/DialogTemplates/selectSubProduct.html',
            });
        }
    }

}]);

angular.module('edison').factory('fourniture', function() {
    "use strict";

    return {
        init: function(fourniture) {
            this.fourniture = fourniture;
            if (!this.fourniture)
                this.fourniture = [];
            return this;
        },
        remove: function(index) {
            this.fourniture.splice(index, 1);
        },
        moveTop: function(index) {
            if (index !== 0) {
                var tmp = this.fourniture[index - 1];
                this.fourniture[index - 1] = this.fourniture[index];
                this.fourniture[index] = tmp;
            }

        },
        moveDown: function(index) {
            if (index !== this.fourniture.length - 1) {
                var tmp = this.fourniture[index + 1];
                this.fourniture[index + 1] = this.fourniture[index];
                this.fourniture[index] = tmp;
            }
        },
        add: function() {
            this.fourniture.push({
                bl: '0',
                title: 'Fourniture',
                quantite: 1,
                pu: 0
            });
        },
        total: function() {
            var total = 0;
            if (this.fourniture) {
                this.fourniture.forEach(function(e) {
                    total += (e.pu * e.quantite);
                })
            }
            return total
        }
    }

});

angular.module('edison')
    .factory('Intervention', ["$location", "$window", "openPost", "LxNotificationService", "LxProgressService", "dialog", "user", "config", "edisonAPI", "Devis", "$rootScope", "textTemplate", function($location, $window, openPost, LxNotificationService, LxProgressService, dialog, user, config, edisonAPI, Devis, $rootScope, textTemplate) {
        "use strict";

        var Intervention = function(data) {
            if (!(this instanceof Intervention)) {
                return new Intervention(data);
            }
            for (var k in data) {
                this[k] = data[k];
            }
        };

        var appelLocal = function(tel) {
            console.log('---->', tel);
            if (tel) {
                $window.open('callto:' + tel, '_self', false);
            }
        }

        Intervention.prototype.callTel1 = function() {
            appelLocal(this.client.telephone.tel1)
        }
        Intervention.prototype.callTel2 = function() {
            appelLocal(this.client.telephone.tel2)
        }
        Intervention.prototype.callTel3 = function() {
            appelLocal(this.client.telephone.tel3)
        }

        Intervention.prototype.callSst1 = function() {
            appelLocal(this.sst.telephone.tel1)
        }
        Intervention.prototype.callSst2 = function() {
            appelLocal(this.sst.telephone.tel2)
        }

        Intervention.prototype.callPayeur1 = function() {
            appelLocal(this.facture.tel)
        }

        Intervention.prototype.callPayeur2 = function() {
            appelLocal(this.facture.tel2)
        }

        Intervention.prototype.typeOf = function() {
            return 'Intervention';
        };
        Intervention.prototype.envoiDevis = function(cb) {
            Devis().envoi.bind(this)(cb)
        };

        Intervention.prototype.validerReglement = function(cb) {
            var _this = this;
            dialog.validationReglement(this, function(err, resp) {
                if (err) {
                    return cb && cb(err);
                }
                edisonAPI.intervention.save(_this).then(function(resp) {
                    LxNotificationService.success("L'intervention " + _this.id + " est modifié");
                }, function(err) {
                    LxNotificationService.error("Une erreur est survenu (" + err.data + ")");
                });
            })
        };


        Intervention.prototype.validerPaiement = function(cb) {
            var _this = this;
            dialog.validationPaiement(this, function(err, resp) {
                if (err) {
                    return cb && cb(err);
                }
                edisonAPI.intervention.save(_this).then(function(resp) {
                    LxNotificationService.success("L'intervention " + _this.id + " est modifié");
                }, function(err) {
                    LxNotificationService.error("Une erreur est survenu (" + err.data + ")");
                });
            })
        };

        Intervention.prototype.demarcher = function(cb) {
            edisonAPI.intervention.demarcher(this.id).success(function() {
                LxNotificationService.success("Vous demarchez l'intervention");
            }, function() {
                LxNotificationService.error("Une erreur est survenu");
            })
        };

        Intervention.prototype.facturePreview = function() {
            openPost('/api/intervention/facturePreview', {
                data: JSON.stringify(this),
                html: true
            })
        }

        Intervention.prototype.factureAcquittePreview = function() {

            openPost('/api/intervention/factureAcquittePreview', {
                data: JSON.stringify(this),
                html: true
            })
        }


        Intervention.prototype.sendFactureAcquitte = function(cb) {
            var _this = this;
            var datePlain = moment(this.date.intervention).format('LL');
            var template = textTemplate.mail.intervention.factureAcquitte.bind(_this)(datePlain)
            var mailText = (_.template(template)(this))
            dialog.envoiFacture(_this, mailText, true, function(err, text, acquitte, date) {
                if (err)
                    return cb('nope')
                LxProgressService.circular.show('#5fa2db', '#globalProgress');
                edisonAPI.intervention.sendFactureAcquitte(_this.id, {
                    text: text,
                    acquitte: acquitte,
                    date: date,
                    data: _this
                }).success(function(resp) {
                    LxProgressService.circular.hide();
                    var validationMessage = _.template("La facture de l'intervention {{id}} à été envoyé")(_this)
                    LxNotificationService.success(validationMessage);
                    if (typeof cb === 'function')
                        cb(null, resp);
                }).catch(function(err) {
                    LxProgressService.circular.hide();
                    var validationMessage = _.template("L'envoi de la facture {{id}} à échoué\n" + "(" + err.data + ")")(_this)
                    LxNotificationService.error(validationMessage);
                    if (typeof cb === 'function')
                        cb(err);
                })
            })
        }

        Intervention.prototype.sendFacture = function(cb) {
            var _this = this;
            var datePlain = moment(this.date.intervention).format('LL');
            var template = textTemplate.mail.intervention.envoiFacture.bind(_this)(datePlain)
            var mailText = (_.template(template)(this))
            dialog.envoiFacture(_this, mailText, false, function(err, text, acquitte, date) {
                if (err)
                    return cb('nope')
                LxProgressService.circular.show('#5fa2db', '#globalProgress');
                edisonAPI.intervention.sendFacture(_this.id, {
                    text: text,
                }).success(function(resp) {
                    LxProgressService.circular.hide();
                    var validationMessage = _.template("La facture de l'intervention {{id}} à été envoyé")(_this)
                    LxNotificationService.success(validationMessage);
                    if (typeof cb === 'function')
                        cb(null, resp);
                }).catch(function(err) {
                    LxProgressService.circular.hide();
                    var validationMessage = _.template("L'envoi de la facture {{id}} à échoué\n" + "(" + err.data + ")")(_this)
                    LxNotificationService.error(validationMessage);
                    if (typeof cb === 'function')
                        cb(err);
                })
            })
        }



        Intervention.prototype.ouvrirFicheV1 = function() {
            $window.open('http://electricien13003.com/alvin/5_Gestion_des_interventions/show_res_bis_2.php?id_client=' + this.id)
        }
        Intervention.prototype.autoFacture = function() {
            $window.open('/api/intervention/' + this.id + '/autoFacture')
        }
        Intervention.prototype.ouvrirFiche = function() {
            $location.url('/intervention/' + this.id)
        }
        Intervention.prototype.ouvrirRecapSST = function() {
            $location.url(['/artisan', this.artisan.id, 'recap'].join('/') + '#interventions')
        }
        Intervention.prototype.smsArtisan = function(cb) {

            var _this = this;
            var text = textTemplate.sms.intervention.demande.bind(this)(user, config);
            text = _.template(text)(this)
            dialog.getFileAndText(_this, text, [], function(err, text) {
                if (err) {
                    return cb(err)
                }
                edisonAPI.sms.send({
                    dest: _this.sst.nomSociete,
                    text: text,
                    to: _this.sst.telephone.tel1,
                }).success(function(resp) {
                    var validationMessage = _.template("Un sms a été envoyé à M. {{sst.representant.nom}}")(_this)
                    LxNotificationService.success(validationMessage);
                    if (typeof cb === 'function')
                        cb(null, resp);
                }).catch(function(err) {
                    LxNotificationService.success("L'envoi du sms a échoué");
                    if (typeof cb === 'function')
                        cb(err);
                })
            })
        };

        Intervention.prototype.callClient = function(cb) {
            var _this = this;
            var now = Date.now();
            $window.open('callto:' + _this.client.telephone.tel1, '_self', false)
            dialog.choiceText({
                subTitle: _this.client.telephone.tel1,
                title: 'Nouvel Appel Client',
            }, function(response, text) {
                edisonAPI.call.save({
                    date: now,
                    to: _this.client.telephone.tel1,
                    link: _this.id,
                    origin: _this.id || _this.tmpID || 0,
                    description: text,
                    response: response
                }).success(function(resp) {
                    if (typeof cb === 'function')
                        cb(null, resp);
                }).catch(function(err) {
                    if (typeof cb === 'function')
                        cb(err);
                })
            })
        }
        Intervention.prototype.callArtisan = function(cb) {
            var _this = this;
            var now = Date.now();
            $window.open('callto:' + _this.artisan.telephone.tel1, '_self', false)
            dialog.choiceText({
                subTitle: _this.artisan.telephone.tel1,
                title: 'Nouvel Appel',
            }, function(response, text) {
                edisonAPI.call.save({
                    date: now,
                    to: _this.artisan.telephone.tel1,
                    link: _this.artisan.id,
                    origin: _this.id || _this.tmpID || 0,
                    description: text,
                    response: response
                }).success(function(resp) {
                    if (typeof cb === 'function')
                        cb(null, resp);
                }).catch(function(err) {
                    if (typeof cb === 'function')
                        cb(err);
                })
            })
        };
        Intervention.prototype.save = function(cb) {
            var _this = this;

            var fournitureSansFournisseur = _.find(this.fourniture, function(e) {
                return !e.fournisseur;
            })
            var fournitureSansPU = _.find(this.fourniture, function(e) {
                    return !e.pu;
                })
                /*            if (_.get(this, 'client.telephone.tel1.length') !== 10) {
                                LxNotificationService.error("Le telephone est invalide");
                                return cb("Bad Phone")
                            }*/

            if (fournitureSansFournisseur) {
                LxNotificationService.error("Veuillez renseigner un fournisseur");
                return cb(fournitureSansFournisseur)
            }
            if (fournitureSansPU) {
                LxNotificationService.error("Veuillez renseigner un prix pour toutes les fournitures");
                return cb(fournitureSansPU)
            }
            edisonAPI.intervention.save(_this)
                .then(function(resp) {
                    var validationMessage = _.template("Les données de l'intervention {{id}} ont à été enregistré.")(resp.data)
                    if ((_this.tmpID && _this.sst) || (_this.sst__id && _this.sst && _this.sst__id !== _this.sst.id) && !_this.sst.tutelle) {
                        validationMessage += "\n\n Un sms à été envoyé";
                    }
                    LxNotificationService.success(validationMessage);
                    if (typeof cb === 'function')
                        cb(null, resp.data)
                }, function(error) {
                    LxNotificationService.error(error.data);
                    if (typeof cb === 'function')
                        cb(error.data)
                });
        };

        Intervention.prototype.envoi = function(cb) {
            var _this = this;
            if (!Intervention(_this).isEnvoyable()) {
                return LxNotificationService.error("Vous ne pouvez pas envoyer cette intervention");
            }
            var defaultText = textTemplate.sms.intervention.envoi.bind(_this)(_.find(window.app_users, 'login', _this.login.ajout));
            dialog.envoiIntervention(_this, defaultText, function(err, text, file) {
                if (err)
                    return cb && cb(err)
                LxProgressService.circular.show('#5fa2db', '#globalProgress');
                edisonAPI.intervention.envoi(_this.id, {
                    sms: text,
                    file: file
                }).then(function(resp) {
                    LxProgressService.circular.hide();
                    console.log('ok')
                    var validationMessage = _.template("L'intervention est envoyé")
                    LxNotificationService.success(validationMessage);
                    if (typeof cb === 'function')
                        cb(null, resp.data)

                }, function(error) {
                    LxProgressService.circular.hide();
                    console.log('error')
                    LxNotificationService.error(error.data);
                    if (typeof cb === 'function')
                        cb(error.data);
                });
            })
        };


        Intervention.prototype.reactivation = function(cb) {
            var _this = this;
            edisonAPI.intervention.reactivation(this.id).then(function() {
                LxNotificationService.success("L'intervention " + _this.id + " est à programmer");
            })
        };

        Intervention.prototype.annulation = function(cb) {
            var _this = this;
            dialog.getCauseAnnulation(_this, function(err, causeAnnulation, reinit, sms, textSms) {
                if (err) {
                    return typeof cb === 'function' && cb('err');
                }
                edisonAPI.intervention.annulation(_this.id, {
                        causeAnnulation: causeAnnulation,
                        reinit: reinit,
                        sms: sms,
                        textSms: textSms
                    })
                    .then(function(resp) {
                        var msg = "L'intervention {{id}} est annulé";
                        if (sms) {
                            msg += "\nUn sms à été envoyé au SST";
                        }
                        var validationMessage = _.template(msg)(resp.data)
                        LxNotificationService.success(validationMessage);
                        if (typeof cb === 'function') {
                            cb(null, resp.data)
                        }
                    });
            });
        };


        Intervention.prototype.envoiFactureVerif = function(cb) {
            var _this = this;

            if (!this.produits.length) {
                LxNotificationService.error("Veuillez renseigner les produits");
                return cb('nope')
            }
            _this.sendFacture(function(err) {
                if (err)
                    return cb(err);
                _this.verificationSimple(cb)
            })
        }

        Intervention.prototype.verificationSimple = function(cb) {
            var _this = this;
            LxProgressService.circular.show('#5fa2db', '#globalProgress');
            console.log('==>', Intervention(this).isVerifiable())
            if (!Intervention(this).isVerifiable()) {
                return LxNotificationService.error("Vous ne pouvez pas verifier cette intervention");
            }
            edisonAPI.intervention.verification(_this.id)
                .then(function(resp) {
                    LxProgressService.circular.hide()
                    var validationMessage = _.template("L'intervention {{id}} est vérifié")(resp.data)
                    LxNotificationService.success(validationMessage);
                    if (typeof cb === 'function') {
                        cb(null, resp.data);
                    }
                }, function(error) {
                    LxProgressService.circular.hide()
                    LxNotificationService.error(error.data);
                    cb(error.data);
                })
        }

        Intervention.prototype.verification = function(cb) {
            if (!Intervention(this).isVerifiable()) {
                return LxNotificationService.error("Vous ne pouvez pas verifier cette intervention");
            }
            var _this = this;
            if (!_this.reglementSurPlace) {
                return $location.url('/intervention/' + this.id)
            }
            dialog.verification(_this, function(inter) {
                Intervention(inter).save(function(err, resp) {
                    if (!err) {
                        return Intervention(resp).verificationSimple(cb);
                    }
                });
            });
        }


        Intervention.prototype.recouvrement = function(cb) {
            var _this = this;
            dialog.recouvrement(_this, function(inter) {
                Intervention(inter).save(function(err, resp) {
                    return (cb || _.noop)()
                });
            });
        }



        Intervention.prototype.fileUpload = function(file, cb) {

            var _this = this;

            if (file) {
                LxProgressService.circular.show('#5fa2db', '#fileUploadProgress');
                edisonAPI.file.upload(file, {
                    link: _this.id || _this.tmpID,
                    model: 'intervention',
                    type: 'fiche'
                }).success(function(resp) {
                    LxProgressService.circular.hide();
                    if (typeof cb === 'function')
                        cb(null, resp);
                }).catch(function(err) {
                    LxProgressService.circular.hide();
                    if (typeof cb === 'function')
                        cb(err);
                })
            }
        }

        Intervention.prototype.editCB = function() {
            var _this = this;
            edisonAPI.intervention.getCB(this.id).success(function(resp) {
                _this.cb = resp;
            }, function(error) {
                LxNotificationService.error(error.data);
            })
        }

        Intervention.prototype.reinitCB = function() {
            this.cb = {
                number: 0
            }
        }


        Intervention.prototype.isEnvoyable = function() {
            if (!this.sst) {
                return false;
            }
            if (!this.reglementSurPlace) {
                return true
            }
            if (this.sst.subStatus === 'QUA' ||  this.sst.blocked) {
                return user.root;
            }
            if (this.sst.subStatus === 'NEW' || this.sst.subStatus === 'TUT') {
                return user.root || user.service === 'PARTENARIAT'
            }
            return _.includes(["ANN", "APR", "ENC", undefined], this.status)
        }

        Intervention.prototype.isPayable = function() {
            return (this.status === 'ENC' || this.status === 'VRF') &&
                user.root ||  user.service === 'COMPTABILITE'
        }

        Intervention.prototype.isVerifiable = function() {
            if (!this.artisan) {
                return false;
            }
            /*            if (this.sst.subStatus === 'QUA') {
                            console.log('QUA')
                            return false;
                        }
                        if (this.sst.subStatus === 'NEW' || this.sst.subStatus === 'TUT') {
                            console.log('NOROOT/PART=>', user.root, user.service, user.service === 'PARTENARIAT')
                            return user.root || user.service === 'PARTENARIAT'
                        }*/
            return this.status === 'ENC'
        }



        return Intervention;
    }]);

 angular.module('edison').directive('whenScrollEnds', function() {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                var visibleHeight = element.height();
                var threshold = 100;

                element.scroll(function() {
                    var scrollableHeight = element.prop('scrollHeight');
                    var hiddenContentHeight = scrollableHeight - visibleHeight;

                    if (hiddenContentHeight - element.scrollTop() <= threshold) {
                        // Scroll is almost at the bottom. Loading more rows
                        scope.$apply(attrs.whenScrollEnds);
                    }
                });
            }
        };
    });
angular.module('edison').factory('Map', function() {
    "use strict";

    var Map = function() {
        this.display = false;
    }

    Map.prototype.setCenter = function(address) {
        var myLatLng = new google.maps.LatLng(address.lt, address.lg);
        this.center = address;
        if (window.map)
            window.map.setCenter(myLatLng)
    }

    Map.prototype.setZoom = function(value) {
       // throw new Error('lol')
         if (window.map)
            window.map.setZoom(value)
        this.zoom = value
    }
    Map.prototype.show = function() {
        this.display = true;
    }
    return Map;
});

angular.module('edison').factory('mapAutocomplete', ["$q", "Address", function($q, Address) {
        "use strict";
        var autocomplete = function() {
            this.service = new google.maps.places.AutocompleteService();
            this.geocoder = new google.maps.Geocoder();
        }

        autocomplete.prototype.search = function(input) {
            var deferred = $q.defer();
            this.service.getPlacePredictions({
                input: input,
                componentRestrictions: {
                    country: 'fr'
                }
            }, function(predictions) {
                if (predictions)
                    predictions.forEach(function(e) {
                        if (e.description === input)
                            predictions = null;
                    })
                deferred.resolve(predictions || []);
            });
            return deferred.promise;
        }

        autocomplete.prototype.getPlaceAddress = function(place) {
            var self = this;
            return $q(function(resolve, reject) {
                self.geocoder.geocode({
                    'address': place.description
                }, function(result, status) {
                    if (status !== google.maps.places.PlacesServiceStatus.OK)
                        return reject(status);
                    return resolve(Address(result[0]));
                });

            });
        };

        return new autocomplete();

    }
]);

angular.module('edison').factory('openPost', function() {
    "use strict";
    return function(url, data) {
        var mapForm = document.createElement("form");
        mapForm.target = "_blank";
        mapForm.method = "POST";
        mapForm.action = url;

        // Create an input
        _.each(data, function(e, i) {
                var mapInput = document.createElement("input");
                mapInput.type = "text";
                mapInput.name = i;
                mapInput.value = typeof e == 'object' ? JSON.stringify(e) : e;
                mapForm.appendChild(mapInput);
            })
            // Add the form to dom
        document.body.appendChild(mapForm);

        // Just submit
        mapForm.submit();
        mapForm.remove();
    }
});

angular.module('edison').factory('productsList', ["$q", "dialog", "openPost", "edisonAPI", function($q, dialog, openPost, edisonAPI) {
    "use strict";
    var Produit = function(produits) {
        this.produits = produits;
        var _this = this
        if (!this.ps) {
            edisonAPI.product.list().then(function(resp) {
                _this.ps = resp.data
            })
        }
        _.each(this.produits, function(e) {
            if (e.desc.toLowerCase() != e.title.toLowerCase()) {
                e.showDesc = true
            }
        })
        this.lastCall = _.now()
    }
    Produit.prototype = {
        remove: function(index) {
            this.produits.splice(index, 1);
        },
        moveTop: function(index) {
            if (index !== 0) {
                var tmp = this.produits[index - 1];
                this.produits[index - 1] = this.produits[index];
                this.produits[index] = tmp;
            }

        },
        moveDown: function(index) {
            if (index !== this.produits.length - 1) {
                var tmp = this.produits[index + 1];
                this.produits[index + 1] = this.produits[index];
                this.produits[index] = tmp;
            }
        },
        edit: function(index) {
            var _this = this;
            dialog.editProduct.open(this.produits[index], function(res) {
                _this.produits[index] = res;
            })
        },
        add: function(prod) {
            if (this.lastCall + 100 > _.now())
                return 0
            this.lastCall = _.now()
            this.searchText = '';
            prod.quantite = 1;
            this.produits.push(prod);
        },
        search: function(text) {
            var rtn = []
            for (var i = 0; i < this.ps.length; ++i) {
                if (text === this.ps[i].title)
                    return [];
                var needle = _.deburr(text).toLowerCase()

                var haystack = _.deburr(this.ps[i].title).toLowerCase();
                var haystack2 = _.deburr(this.ps[i].ref).toLowerCase();
                var haystack3 = _.deburr(this.ps[i].desc).toLowerCase();
                if (_.includes(haystack, needle) ||
                    _.includes(haystack2, needle) ||
                    _.includes(haystack3, needle)) {
                    var x = _.clone(this.ps[i])
                    x.random = _.random();
                    rtn.push(x)
                }
            }
            return rtn
        },
        /*        search: function(text) {
                    var deferred = $q.defer();
                    edisonAPI.searchProduct(text)
                        .success(function(resp) {
                            deferred.resolve(resp)
                        })
                    return deferred.promise;
                },*/
        getDetail: function(elem) {
            if (!elem)
                return 0
            var _this = this;
            dialog.selectSubProduct(elem, function(resp) {
                var rtn = {
                    showDesc: true,
                    quantite: 1,
                    ref: resp.ref,
                    title: elem.nom,
                    desc: resp.nom + '\n' + elem.description.split('-').join('\n'),
                    pu: Number(resp.prix)
                }
                _this.add(rtn)
            })
        },
        flagship: function() {
            return _.mapBy(this.produits, 'pu');
        },
        total: function() {
            var total = _.round(_.sum(this.produits, function(e)  {
                return (e.pu || 0) * (e.quantite || 0);
            }), 2)
            return total;
        },

    }

    return Produit;


}]);

angular.module('edison').factory('socket', ["socketFactory", function(socketFactory) {
	"use strict";
	console.log(location.protocol + "//" +  location.hostname + ':1995')
	return socketFactory({
		ioSocket: io.connect(location.protocol + "//" + location.hostname + ':1995')
	});
}]);

angular.module('edison').factory('taskList', ["dialog", "edisonAPI", function(dialog, edisonAPI) {
    "use strict";
    var Task = function(user) {
        edisonAPI.get({
            to: user,
            done: false
        })
    }
    Task.prototype = {
        check: function(_id) {
            edisonAPI.check({
                _id: _id
            })
        },
        add: function(params) {
            edisonAPI.add(params)

        }
    }
    return Task;


}]);

angular.module('edison').factory('user', ["$window", function($window) {
    "use strict";
    return $window.app_session;
}]);

 angular.module('edison').directive('infoAppelSst', ["mapAutocomplete", "edisonAPI", "config", function(mapAutocomplete, edisonAPI, config) {
    "use strict";
    return {
        restrict: 'E',
        templateUrl: '/Templates/info-appel-sst.html',
        scope: {
            data: "=",
        },
        link: function(scope, element, attrs) {
            scope.embedded = !!attrs.embedded
            console.log(attrs.embedded);
        },
    }

 }]);

 angular.module('edison').directive('infoConversation', ["mapAutocomplete", "edisonAPI", "config", function(mapAutocomplete, edisonAPI, config) {
    "use strict";
    return {
        restrict: 'E',
        templateUrl: '/Templates/info-conversation.html',
        scope: {
            data: "=",
        },
        link: function(scope, element, attrs) {
            scope.embedded = !!attrs.embedded
            console.log(attrs.embedded);
        },
    }

 }]);

 angular.module('edison').directive('infoFacture', ["mapAutocomplete", "edisonAPI", "config", function(mapAutocomplete, edisonAPI,config) {
     "use strict";
     return {
         restrict: 'E',
         templateUrl: '/Templates/info-facture.html',
         scope: {
             data: "=",
         },
         link: function(scope, element, attrs) {
             var model = scope.data;
             scope.config = config;
             scope.autocomplete = mapAutocomplete;
             scope.changeAddressFacture = function(place) {
                 mapAutocomplete.getPlaceAddress(place).then(function(addr) {
                     scope.data.facture = scope.data.facture ||  {}
                     scope.data.facture.address = addr;
                 });
             }
             edisonAPI.compte.list().then(function(resp) {
                 scope.grndComptes = resp.data
             })

             scope.changeGrandCompte = function() {
                 // var x = _.clone(config.compteFacturation[scope.data.facture.compte])
                 var x  = scope.data.facture.compte
                 scope.data.facture = _.find(scope.grndComptes, 'ref', scope.data.facture.compte);
                 scope.data.facture.payeur = "GRN";
                 scope.data.facture.compte = x;
             }
         },
     }

 }]);

angular.module('edison').directive('infoFourniture', ["config", "fourniture", function(config, fourniture) {
        "use strict";
        return {
            restrict: 'E',
            templateUrl: '/Templates/info-fourniture.html',
            scope: {
                data: "=",
                display: "=",
                small:"="
            },
            link: function(scope, element, attrs) {
                scope.config = config
                scope.dsp = scope.display || false
                scope.data.fourniture = scope.data.fourniture || [];
                scope.fourniture = fourniture.init(scope.data.fourniture);
            },
        }

    }
]);

angular.module('edison').directive('mainNavbar', ["$q", "edisonAPI", "TabContainer", "$timeout", "$rootScope", "$location", "$window", function($q, edisonAPI, TabContainer, $timeout, $rootScope, $location, $window) {
    "use strict";
    return {
        restrict: 'E',
        templateUrl: '/Templates/main-navbar.html',
        scope: {
            data: "=",
            display: "=",
            small: "="
        },
        link: function(scope, element, attrs) {
            scope.root = $rootScope;
            scope._ = _;
            scope.tabContainer = TabContainer;

            scope.select = function(model) {
                    if (scope.selectedTab == model) {
                        scope.selectedTab = null
                    } else {
                        scope.selectedTab = model
                    }
                }
                /*            $('input[type="search"]').ready(function() {
                                $timeout(function() {
                                    $('input[type="search"]').on('keyup', function(e, w) {
                                        if (e.which == 13) {
                                            if ($('ul.md-autocomplete-suggestions>li').length) {
                                                $location.url('/search/' + $(this).val())
                                                $(this).val("")
                                                $(this).blur()
                                            }
                                        }
                                    });
                                }, 10);
                            })
                */
            $rootScope.$on('closeContextMenu', function() {
                scope.selectedTab = null;
            })


            scope.search = function(text) {
                if (text.length > 2) {
                    $location.url('/search/' + text)
                }
            }

            scope.logout = function() {
                    edisonAPI.users.logout().then(function() {
                        $window.location.reload()
                    })
                }
                /*

                                                            $rootScope.$on('closeSearchBar', function() {
                                                                scope.searchBarSize = 100
                                                            })
                                                
                                            var searchInput = 'md-autocomplete.searchBar>md-autocomplete-wrap>input'
                                            $(searchInput).ready(function() {
                                                $timeout(function() {
                                                    $(searchInput).on('focus', function() {
                                                        scope.searchFocus = true
                                                        var selectors = ['.navbar-header', '.navbar-nav', '.dropdown-toggle.user-menu']
                                                        scope.searchBarSize = _.reduce(selectors, function(total, el) {
                                                            return total -= $(el).width();
                                                        }, $(window).width() - 70)
                                                    })
                                                    $(searchInput).on('blur', function() {
                                                        scope.searchFocus = false
                                                        scope.searchBarSize = 100
                                                    })
                                                }, 10);
                                            })
                */
            scope.changeUser = function(usr) {
                    $rootScope.displayUser = usr
                }
                /*
                            scope.searchBox = {
                                search: _.throttle(function(x) {
                                    var deferred = $q.defer();
                                    edisonAPI.searchText(x, {
                                        limit: 10,
                                        flat: true
                                    }).success(function(resp) {
                                        deferred.resolve(resp)
                                    })
                                    return deferred.promise;
                                }, 600),
                                change: function(x) {
                                    if (!x ||  !x.link)
                                        return 0;
                                    if (x) {
                                        $location.url(x.link)
                                    }
                                    $timeout(function() {
                                        $(searchInput).blur();
                                    });
                                    scope.searchText = "";
                                }
                            }*/


        },

    }

}]);

var archiveReglementController = function(edisonAPI, TabContainer, $routeParams, $location, LxProgressService) {

    var tab = TabContainer.getCurrentTab();
    var _this = this;
    _this.title = 'Archives Reglements'
    tab.setTitle('archives RGL')
    LxProgressService.circular.show('#5fa2db', '#globalProgress');
    edisonAPI.compta.archivesReglement().success(function(resp) {
        LxProgressService.circular.hide()
        _this.data = resp
    })
    _this.moment = moment;
    _this.openLink = function(link) {
        $location.url(link)
    }
}
archiveReglementController.$inject = ["edisonAPI", "TabContainer", "$routeParams", "$location", "LxProgressService"];

angular.module('edison').controller('archivesReglementController', archiveReglementController);

var archivesPaiementController = function(edisonAPI, TabContainer, $routeParams, $location, LxProgressService) {
    var _this = this;
    var tab = TabContainer.getCurrentTab();
    _this.type = 'paiement'
    _this.title = 'Archives Paiements'
    tab.setTitle('archives PAY')
    LxProgressService.circular.show('#5fa2db', '#globalProgress');
    edisonAPI.compta.archivesPaiement().success(function(resp) {
        LxProgressService.circular.hide()
        _this.data = resp
    })
    _this.moment = moment;
    _this.openLink = function(link) {
        $location.url(link)
    }
}
archivesPaiementController.$inject = ["edisonAPI", "TabContainer", "$routeParams", "$location", "LxProgressService"];

angular.module('edison').controller('archivesPaiementController', archivesPaiementController);

 angular.module('edison').directive('artisanCategorie', ["config", function(config) {
     "use strict";
     return {
         replace: true,
         restrict: 'E',
         templateUrl: '/Templates/artisan-categorie.html',
         transclude: true,
         scope: {
             model: "=",
         },
         link: function(scope, element, attrs) {
             scope.config = config
             scope.findColor = function(categorie) {
                 var f = _.find(scope.model.categories, function(e)  {
                     return e === categorie.short_name
                 })
                 return f ? categorie.color : "white";

             }
             scope.toggleCategorie = function(categorie) {
                var f = scope.model.categories.indexOf(categorie);
                if (f >= 0) {
                    scope.model.categories.splice(f, 1);
                } else {
                    scope.model.categories.push(categorie)
                }
             }
         },
     }

 }]);

var ArtisanCtrl = function(IBAN, $timeout, $rootScope, $scope, edisonAPI, $location, $routeParams, ContextMenu, LxProgressService, LxNotificationService, TabContainer, config, dialog, artisanPrm, Artisan) {
    "use strict";
    var _this = this;
    _this.config = config;
    _this.dialog = dialog;
    _this.moment = moment;
    _this.contextMenu = new ContextMenu('artisan')
    var tab = TabContainer.getCurrentTab();
    if (!tab.data) {
        var artisan = new Artisan(artisanPrm.data)
        tab.setData(artisan);
        if ($routeParams.id.length > 12) {
            _this.isNew = true;
            artisan.tmpID = $routeParams.id;
            tab.setTitle('SST  ' + moment((new Date(parseInt(artisan.tmpID))).toISOString()).format("HH:mm").toString());
        } else {
            tab.setTitle('SST  ' + $routeParams.id);
            if (!artisan) {
                LxNotificationService.error("Impossible de trouver les informations !");
                $location.url("/dashboard");
                TabContainer.remove(tab);
                return 0;
            }
        }
    } else {
        var artisan = tab.data;
    }
    _this.data = tab.data;
    _this.saveArtisan = function(options) {
        artisan.save(function(err, resp) {
            if (err) {
                return false
            } else if (options.contrat) {
                artisan = new Artisan(resp);
                artisan.envoiContrat.bind(resp)(options, function(err, res) {
                    if (!err) {
                        TabContainer.close(tab);
                    }
                });
            } else {
                TabContainer.close(tab);
            }
        })
    }
    _this.onArtisanFileUpload = function(file, name) {
        LxProgressService.circular.show('#5fa2db', '#fileUploadProgress');
        edisonAPI.artisan.upload(file, name, artisan.id).then(function() {
            console.log('reload')
            LxProgressService.circular.hide()
            _this.loadFilesList();
        })
    }

    _this.artisanClickTrigger = function(elem) {
        setTimeout(function() {
            angular.element("#file_" + elem + ">input").trigger('click');
        }, 0)

    }
    _this.rightClick = function($event) {
        console.log('rightClick')
        _this.contextMenu.setPosition($event.pageX, $event.pageY)
        _this.contextMenu.setData(artisan);
        _this.contextMenu.open();
    }

    _this.validIBAN = function(iban) {
        return !iban || IBAN.isValid(iban);
    }

    _this.fileExist = function(name) {
        if (!artisan.file)
            return false;
        return _.find(artisan.file, function(e) {
            return _.startsWith(e, name)
        });
    }

    _this.loadFilesList = function() {
        edisonAPI.artisan.getFiles(artisan.id).then(function(result) {
            artisan.file = result.data;
        }, console.log)
    }
    if (artisan.id) {
        _this.loadFilesList();
    }

    _this.addComment = function() {

        artisan.comments.push({
            login: $rootScope.user.login,
            text: _this.commentText,
            date: new Date()
        })
        if (artisan.id) {
            edisonAPI.artisan.comment(artisan.id, _this.commentText)
        }
        _this.commentText = "";
    }
    var updateTmpArtisan = _.after(5, _.throttle(function() {
        edisonAPI.artisan.saveTmp(artisan);

    }, 30000))

    if (!artisan.id) {
        $scope.$watch(function() {
            return artisan;
        }, updateTmpArtisan, true)
    }
}
ArtisanCtrl.$inject = ["IBAN", "$timeout", "$rootScope", "$scope", "edisonAPI", "$location", "$routeParams", "ContextMenu", "LxProgressService", "LxNotificationService", "TabContainer", "config", "dialog", "artisanPrm", "Artisan"];
angular.module('edison').controller('ArtisanController', ArtisanCtrl);

var AvoirsController = function(TabContainer, openPost, edisonAPI, $rootScope, LxProgressService, LxNotificationService, FlushList) {
    "use strict";
    var _this = this
    var tab = TabContainer.getCurrentTab();
    tab.setTitle('Avoirs')
    _this.loadData = function(prevChecked) {
        LxProgressService.circular.show('#5fa2db', '#globalProgress');
        edisonAPI.compta.avoirs().then(function(result) {
            console.log(result)
            $rootScope.avoirs = result.data
            LxProgressService.circular.hide()
        })
    }
    if (!$rootScope.avoirs)
        _this.loadData()

    _this.reloadAvoir = function() {
        _this.loadData()
    }

    _this.print = function(type) {
        openPost('/api/intervention/printAvoir', {
            data: $rootScope.avoirs
        });
    }
    _this.printChq = function(type) {
        openPost('/api/intervention/printAvoirChq', {
            data: $rootScope.avoirs
        });
    }

    _this.flush = function() {
        var list = _.filter($rootScope.avoirs, {
            checked: true
        })
        edisonAPI.compta.flushAvoirs(list).then(function(resp) {
            LxNotificationService.success(resp.data);
            _this.reloadAvoir()
        }).catch(function(err) {
            LxNotificationService.error(err.data);
        })
    }

}
AvoirsController.$inject = ["TabContainer", "openPost", "edisonAPI", "$rootScope", "LxProgressService", "LxNotificationService", "FlushList"];


angular.module('edison').controller('avoirsController', AvoirsController);

var DashboardController = function($rootScope, statsTelepro, dialog, user, edisonAPI, $scope, $filter, TabContainer,
  NgTableParams, $routeParams, $location, LxProgressService) {
  var _this = this;
  $scope._ = _;
  $scope.root = $rootScope;

  _this.openLink = function(link) {
    $location.url(link)
  }


  _this.addTask = function() {
    edisonAPI.task.add(_this.newTask).then(_.partial(_this.reloadTask, _this.newTask.to));
  }

  _this.check = function(task) {
    edisonAPI.task.check(task._id).then(_.partial(_this.reloadTask, _this.newTask.to))
  }

  edisonAPI.intervention.dashboardStats({
      date: moment().startOf('day').toDate()
    })
    .then(function(resp) {
      _this.statsTeleproBfm = _.sortBy(resp.data.weekStats, 'total').reverse()
    });



  _this.reloadTask = function(usr) {
    _this.newTask = {
      to: usr,
      from: user.login
    }
    edisonAPI.task.listRelevant({
      login: usr
    }).then(function(resp) {
      _this.taskList = resp.data;
    })
  }

  _this.reloadTask(user.login);

  _this.reloadDashboardStats = function(date) {

    edisonAPI.intervention.dashboardStats(date).then(function(resp) {
      _this.tableParams = new NgTableParams({
        count: resp.data.weekStats.length,
        sorting: {
          total: 'desc'
        }
      }, {
        counts: [],
        data: resp.data.weekStats
      });
      _this.stats = resp.data
    })
  }

  _this.dateSelect = [{
    nom: 'Du jour',
    date: moment().startOf('day').toDate()
    }, {
    nom: 'De la semaine',
    date: moment().startOf('week').toDate()
    }, {
    nom: 'Du mois',
    date: moment().startOf('month').toDate()
    }, {
    nom: "De l'année",
    date: moment().startOf('year').toDate()
    }]
  _this.dateChoice = _this.dateSelect[1];
  this.reloadDashboardStats(_this.dateChoice);

}
DashboardController.$inject = ["$rootScope", "statsTelepro", "dialog", "user", "edisonAPI", "$scope", "$filter", "TabContainer", "NgTableParams", "$routeParams", "$location", "LxProgressService"];



angular.module('edison').controller('DashboardController', DashboardController);


 angular.module('edison').directive('edisonMap', ["$window", "Map", "mapAutocomplete", "Address", function($window, Map, mapAutocomplete, Address) {
         "use strict";
         return {
             replace: true,
             restrict: 'E',
             templateUrl: '/Templates/autocomplete-map.html',
             scope: {
                 data: "=",
                 client: "=",
                 height: "@",
                 xmarkers: "=",
                 markerClick: '&',
                 isNew: "=",
                 firstAddress: "=",
                 showAddress: "="
             },
             link: function(scope, element, attrs) {
                 scope._height = scope.height || 315;
                 scope.map = new Map();
                 scope.map.setZoom(_.get(scope, 'client.address') ? 12 : 6)
                 if (scope.isNew) {
                     scope.map.show()
                 }
                 scope.autocomplete = mapAutocomplete;

                 scope.mapShow = function() {
                     scope.mapDisplay = true
                 }

                 if (_.get(scope, 'client.address.lt')) {
                     scope.client.address = Address(scope.client.address, true); //true -> copyContructor
                     scope.map.setCenter(scope.client.address);
                 } else {
                     scope.map.setCenter(Address({
                         lat: 46.3333,
                         lng: 2.6
                     }));
                     scope.map.setZoom(5)
                 }

                 scope.changeAddress = function(place) {
                     scope.firstAddress = true;
                     mapAutocomplete.getPlaceAddress(place).then(function(addr) {
                         scope.map.setZoom(12);
                         scope.map.setCenter(addr)
                         scope.client.address = addr;
                     });
                 }

                 scope.getStaticMap = function() {
                     if (!_.get(scope, 'data.client.address.lt') && !_.get(scope, 'data.address.lt'))
                         return 0
                     var q = "?width=" + Math.round($window.outerWidth * (scope.height === "small" ? 0.8 : 1.2));
                     if (scope.client && scope.client.address && scope.client.address.latLng)
                         q += ("&origin=" + scope.client.address.latLng);
                     if (scope.data.artisan && scope.data.artisan.address)
                         q += ("&destination=" + scope.data.artisan.address.lt + "," + scope.data.artisan.address.lg);
                     return "/api/mapGetStatic" + q;
                 }
                 scope.showClientMarker = function() {
                     return scope.client.address && scope.client.address.latLng;
                 }
                 scope.clickOnArtisanMarker = function(event, sst) {
                    scope.markerClick({
                        sst:sst
                    })
                 }
             }
         }
     }
 ]);

 angular.module('edison').directive('creditCard', ["config", function(config) {
     "use strict";
     return {
         replace: true,
         restrict: 'E',
         templateUrl: '/Templates/credit-card.html',
         scope: {
             model: "=",
         },
         link: function(scope, element, attrs) {
             scope.config = config
         },
     }

 }]);

var DevisCtrl = function(edisonAPI, $scope, $rootScope, $location, $routeParams, LxProgressService, LxNotificationService, TabContainer, config, dialog, devisPrm, Devis) {
    "use strict";
    var _this = this;
    _this.config = config;
    _this.dialog = dialog;
    _this.moment = moment;
    var tab = TabContainer.getCurrentTab();
    if (!tab.data) {
        var devis = new Devis(devisPrm.data)
        tab.setData(devis);
        if ($routeParams.id.length > 12) {
            _this.isNew = true;
            devis.tmpID = $routeParams.id;
            tab.setTitle('DEVIS ' + moment((new Date(parseInt(devis.tmpID))).toISOString()).format("HH:mm").toString());
        } else {
            tab.setTitle('DEVIS ' + $routeParams.id);
            if (!devis) {
                LxNotificationService.error("Impossible de trouver les informations !");
                $location.url("/dashboard");
                TabContainer.remove(tab);
                return 0;
            }
        }
    } else {
        var devis = tab.data;
    }
    _this.data = tab.data;

    var closeTab = function(err) {
        if (!err)
            TabContainer.close(tab);
    }



    _this.searchArtisans = function(categorie) {
        if (_.get(devis, 'client.address.lt')) {
            edisonAPI.artisan.getNearest(devis.client.address, categorie || devis.categorie)
                .success(function(result) {
                    _this.nearestArtisans = result;
                });
        }
    }
    _this.searchArtisans();

    _this.saveDevis = function(options) {
        if (!devis.produits ||  !devis.produits.length) {
            return LxNotificationService.error("Veuillez ajouter au moins 1 produit");
        }
        devis.save(function(err, resp) {
            if (err) {
                return false;
            } else if (options.envoi) {
                Devis(resp).sendDevis(closeTab);
            } else if (options.annulation) {
                Devis(resp).annulation(closeTab);
            } else if (options.transfert) {
                Devis(resp).transfert()
            } else {
                closeTab();
            }
        })
    }

    $scope.$watch(function() {
        return devis.client.civilite
    }, function(newVal, oldVal) {
        if (oldVal != newVal) {
            devis.tva = (newVal == 'Soc.' ? 20 : 10);
        }
    })

    var updateTmpDevis = _.after(5, _.throttle(function() {
        edisonAPI.devis.saveTmp(devis);
    }, 30000))

    if (!devis.id) {
        $scope.$watch(function() {
            return devis;
        }, updateTmpDevis, true)
    }

}
DevisCtrl.$inject = ["edisonAPI", "$scope", "$rootScope", "$location", "$routeParams", "LxProgressService", "LxNotificationService", "TabContainer", "config", "dialog", "devisPrm", "Devis"];
angular.module('edison').controller('DevisController', DevisCtrl);

 angular.module('edison').directive('infoCategorie', ["config", function(config) {
     "use strict";
     return {
         replace: true,
         restrict: 'E',
         templateUrl: '/Templates/info-categorie.html',
         transclude: true,
         scope: {
             model: "=",
             change: '&'
         },
         link: function(scope, element, attrs) {
             scope.config = config
             scope.callback = function(newCategorie) {
                 scope.model = newCategorie;
                 if (typeof scope.change === 'function')  {
                     scope.change({
                         newCategorie: newCategorie
                     })
                 }
             }
         },
     }

 }]);

 angular.module('edison').directive('infoClient', ["config", "edisonAPI", function(config, edisonAPI) {
     "use strict";
     return {
         replace: true,
         restrict: 'E',
         templateUrl: '/Templates/info-client.html',
         transclude: true,
         scope: {
             client: '=model',
             data: '=',
             noDetails:'@'
         },
         link: function(scope, element, attrs) {
             scope.config = config;
             scope.searchPhone = function(tel) {
                 if (tel.length > 2) {
                     edisonAPI.searchPhone(tel)
                         .success(function(tel) {
                             scope.searchedPhone = tel
                         }).catch(function() {
                             scope.searchedPhone = {};
                         })
                 }
             }
         }
     }

 }]);

angular.module('edison').directive('infoCompta',
    ["config", "Paiement", "Intervention", function(config, Paiement, Intervention) {
        "use strict";
        return {
            restrict: 'E',
            templateUrl: '/Templates/info-compta.html',
            scope: {
                data: "=",
                displayReglement: '@',
                dialog: '@',
                displayPaiement: '@',
                simulator: '@'
            },
            link: function(scope, element, attrs) {
                scope.config = config
                scope.Intervention = Intervention
                if (scope.displayReglement) {
                    scope.showPaiement = true
                }
                if (scope.displayPaiement) {
                    scope.showReglement = true
                }
                var reglement = scope.data.compta.reglement
                var paiement = scope.data.compta.paiement
                if (!scope.data.tva) {
                    scope.data.tva = (scope.data.client.civilite == 'Soc.' ? 20 : 10)
                }
                if (!paiement.mode) {
                    paiement.mode = _.get(scope.data.sst, 'document.rib.ok') ? "VIR" : "CHQ"
                }
                scope.format = function(nbr) {
                    return _.round(nbr, 2).toFixed(2);
                }
                scope.getPaiement = function(e) {
                    var x = _.cloneDeep(scope.data);
                    x.compta.paiement = _.cloneDeep(e);
                    return new Paiement(x);
                }
                scope.Paiement = Paiement;
                scope.compta = new Paiement(scope.data)
                reglement.montantTTC = scope.compta.getMontantTTC()

                scope.$watchGroup(['data.compta.reglement.montantTTC',
                    'data.compta.reglement.avoir',
                    'data.tva'
                ], function(current, prev) {
                    var montant = reglement.montantTTC || 0
                    var coeff = 100 * (100 / (100 + scope.data.tva));
                    reglement.montant = Paiement().applyCoeff(reglement.montantTTC, coeff)
                    if (!paiement.base) {
                        paiement.base = _.round(reglement.montant - (reglement.avoir ||  0), 2)
                    }
                })

                var change = function(newValues, oldValues, scope) {
                //    if (!_.isEqual(newValues, oldValues)) {
                        scope.compta = new Paiement(scope.data)
                        paiement.montant = scope.compta.montantTotalTTC
                  //  }
                }
                scope.$watch('data.fourniture', change, true)

                scope.$watch('data.compta.paiement.pourcentage.deplacement', change, true)

                scope.$watch('data.compta.paiement.pourcentage.maindOeuvre', change, true)

                scope.$watchGroup(['data.compta.reglement.montant',
                    'data.compta.paiement.base',
                    'data.compta.paiement.tva',
                    'data.compta.paiement.pourcentage.deplacement',
                    'data.compta.paiement.pourcentage.maindOeuvre',
                ], change, true);
                if (!scope.data.compta.paiement.base && scope.data.compta.reglement.montant) {
                    scope.data.compta.paiement.base = scope.data.compta.reglement.montant;
                    scope.compta = new Paiement(scope.data)
                    paiement.montant = scope.compta.montantTotalTTC
                }
            },

        }

    }]
);

 angular.module('edison').directive('produits',
     ["config", "productsList", "dialog", "openPost", "LxNotificationService", "Intervention", "Devis", "edisonAPI", function(config, productsList, dialog, openPost, LxNotificationService, Intervention, Devis, edisonAPI) {
         "use strict";
         return {
             restrict: 'E',
             templateUrl: '/Templates/info-produit.html',
             scope: {
                 data: "=",
                 tva: '=',
                 display: '@',
                 model: "@",
                 embedded: "="
             },
             link: function(scope, element, attrs) {
                 var model = scope.data;
                 scope.config = config
                 model.produits = model.produits || [];
                 scope.config = config;
                 scope.produits = new productsList(model.produits);
                 edisonAPI.combo.list().then(function(resp) {
                     scope.combo = resp.data
                 })

                 scope.Intervention = Intervention;
                 scope.Devis = Devis;

                 if (!scope.data.reglementSurPlace) {
                     scope.display = true;
                 }


                 scope.$watch('data.produits', function(curr, prev) {
                     if (!_.isEqual(curr, prev)) {
                         scope.data.prixFinal = scope.produits.total()
                         scope.data.prixAnnonce = scope.produits.total()
                     }
                 }, true)

                 scope.$watch('data.combo', function(curr, prev) {
                     if (curr && !_.isEqual(curr, prev)) {
                         var prod = _.find(scope.combo, function(e) {
                             return e.ref === curr;
                         })
                         _.each(prod.produits, function(e) {
                             if (!e.ref) {
                                 e.ref = e.desc.toUpperCase().slice(0, 3) + '0' + _.random(9, 99)
                             }
                         })
                         model.comboText = prod.text;
                         model.produits = prod.produits || [];
                         scope.produits = new productsList(model.produits);
                     }
                 }, true)

                 scope.displayfact = function() {
                     return scope.data.produits.length > 0 || !scope.data.reglementSurPlace || scope.dsf;
                 }

                 scope.changeElemTitle = function(elem) {
                     if (!elem.showDesc) {
                         elem.desc = elem.title
                     }
                 }

                 scope.createProd = function() {
                     /*                     scope.produits.add({
                                              ref: 'EDIXX',
                                              desc: "",
                                              pu: 10,
                                              quantite: 1,
                                              focus: true,
                                          })*/
                     model.produits.push({
                             showDesc: false,
                             desc: '',
                             title: '',
                             pu: 0,
                             quantite: 0,
                         })
                         /*  dialog.addProd(function(resp) {
                               console.log(resp);
                               model.produits.push(resp)
                           });*/
                 }
                 scope.printDevis = function() {
                     openPost('/api/intervention/printDevis', {
                         data: JSON.stringify(scope.data),
                         html: true
                     })
                 }

                 scope.printFactureAcquitte = function() {
                     openPost('/api/intervention/printFactureAcquitte', {
                         data: JSON.stringify(scope.data),
                         html: true
                     })
                 }
             },
         }

     }]
 );

var InterventionCtrl = function(Description, Signalement, ContextMenu, $window, $timeout, $rootScope, $scope, $location, $routeParams, dialog, fourniture, LxNotificationService, LxProgressService, TabContainer, edisonAPI, Address, $q, mapAutocomplete, productsList, config, interventionPrm, Intervention, Map) {
    "use strict";
    var _this = this;
    _this.config = config;
    _this.dialog = dialog;
    _this.autocomplete = mapAutocomplete;
    var tab = TabContainer.getCurrentTab();

    if (!tab.data) {
        var intervention = new Intervention(interventionPrm.data)

        intervention.sst__id = intervention.sst ? intervention.sst.id : 0;
        tab.setData(intervention);
        if ($routeParams.id.length > 12) {
            _this.isNew = true;
            intervention.tmpID = $routeParams.id;
            intervention.tmpDate = moment.unix(intervention.tmpID / 1000).format('HH[h]mm')
            tab.setTitle(intervention.tmpDate);
        } else {
            if (intervention && intervention.client.nom) {
                var __title = intervention.client.civilite + intervention.client.nom
                __title = __title.slice(0, 10);
            } else {
                var __title = '#' + $routeParams.id;
            }
            tab.setTitle(__title);
            if (!intervention) {
                LxNotificationService.error("Impossible de trouver les informations !");
                $location.url("/dashboard");
                TabContainer.remove(tab);
                return 0;
            }
        }
    } else {
        var intervention = tab.data;
    }
    if ($routeParams.d) {
        intervention.devisOrigine = parseInt($routeParams.d)
        intervention.date = {
            ajout: new Date(),
            intervention: new Date(),
        }
        intervention.reglementSurPlace = true;
        intervention.modeReglement = 'CH';
        intervention.remarque = 'PAS DE REMARQUES';
    }
    _this.data = tab.data;

    $scope.bv = {
        show: function(view) {
            if (this[view]) {
                return (this[view] = false);
            }
            this.historique = false;
            this.absence = false;
            this.signalement = false;
            this[view] = true;
        },
        init: function() {
            this.historique = this.absence = this.signalement = false;
            _this.searchArtisans(intervention.categorie)
            $timeout(function() {
                _this.searchArtisans(intervention.categorie)
            }, 666)
        }
    }

    var updateTitle = _.throttle(function() {
        tab.setTitle(_.template("{{typeof tmpDate == 'undefined' ? id : tmpDate}} - {{client.civilite}} {{client.nom}} ({{client.address.cp}})")(intervention));
    }, 1000)

    $scope.$watch('vm.data.client', updateTitle, true)
    updateTitle();
    _this.description = new Description(intervention);
    _this.signalement = new Signalement(intervention)
    _this.contextMenuIntervention = new ContextMenu('intervention')
    _this.contextMenuSST = new ContextMenu('artisan')
    _this.contextMenu = _this.contextMenuIntervention
    _this.contextMenu.setData(intervention);


    _this.isAbsent = function(abs) {
        if (!abs || !abs.length) {
            return false;
        }
        return moment().isAfter(abs[abs.length - 1].start) && moment().isBefore(abs[abs.length - 1].end)
    }


    _this.rowRightClick = function($event, inter) {
        if ($('.map-box').has($event.target).length) {
            var id = $event.target.getAttribute('id-sst') || _.get(intervention, 'sst.id')
            if (id) {
                _this.rightClickArtisan = id;
                edisonAPI.artisan.get(id).then(function(resp) {
                    _this.contextMenu = _this.contextMenuSST;
                    _this.contextMenu.setData(resp.data);
                    _this.contextMenu.setPosition($event.pageX, $event.pageY + 200)
                    _this.contextMenu.open().onClose(_.debounce(function(resp) {
                        _this.searchArtisans(intervention.categorie)
                    }, 500))
                })
            }

        } else if ($('.listeInterventions').has($event.target).length == 0) {
            _this.contextMenu = this.contextMenuIntervention;
            _this.contextMenu.setPosition($event.pageX, $event.pageY + 200)
            _this.contextMenu.open();
        }
    }

    Mousetrap.bind(['command+k', 'ctrl+k', 'command+f1', 'ctrl+f1'], function() {
        $window.open("appurl:", '_self');
        edisonAPI.intervention.scan(intervention.id).then(function() {
            $scope.loadFilesList();
            LxNotificationService.success("Le fichier est enregistré");
        })
        return false;
    });


    $scope.calculPrixFinal = function() {
        if (intervention.reglementSurPlace) {
            return 0;
        }
        intervention.prixFinal = 0;
        _.each(intervention.produits, function(e)  {
            intervention.prixFinal += (e.pu * e.quantite)
        })
        intervention.prixFinal = Math.round(intervention.prixFinal * 100) / 100;
    }



    $scope.addLitige = function() {
        dialog.getText({
            title: "Description du Litige",
            text: ""
        }, function(resp) {
            if (!intervention.litiges)
                intervention.litiges = [];
            intervention.litiges.push({
                date: new Date(),
                login: $rootScope.user.login,
                description: resp,
                regle: false
            })
        })
    }

    $scope.smsArtisan = function() {
        intervention.smsArtisan(function(err, resp) {
            if (!err)
                intervention.sst.sms.unshift(resp)
        })
    }


    $scope.clickTrigger = function(elem) {
        angular.element(elem).trigger('click');
    }


    $scope.$watch('fileupload', function(file) {
        if (file && file.length === 1) {
            intervention.fileUpload(file[0], function(err, resp) {
                $scope.fileUploadText = "";
                $scope.loadFilesList();
            });
        }
    })

    $scope.loadFilesList = function() {
        edisonAPI.intervention.getFiles(intervention.id || intervention.tmpID).then(function(result) {
            intervention.files = result.data;
        }, console.log)
    }

    $scope.loadFilesList();

    var postSave = function(options, resp, cb) {
        if (options && options.envoiFacture && options.verification) {
            intervention.envoiFactureVerif(cb)
        } else if (options && options.envoiFacture) {
            intervention.sendFacture(cb)
        } else if (options && options.envoi === true) {
            resp.files = intervention.files;
            intervention.envoi.bind(resp)(cb);
        } else if (options && options.annulation) {
            intervention.annulation(cb);
        } else if (options && options.verification) {
            intervention.verificationSimple(cb);
        } else {
            cb(null)
        }
    }

    var saveInter = function(options) {
        $scope.saveInter = function() {
            console.log('noope')
        }
        intervention.save(function(err, resp) {
            if (!err) {
                /*  var files = intervention.files
                  var tmp = intervention;
                  intervention = new Intervention(resp);
                  intervention.produits = tmp.produits;
                  intervention.fourniture = tmp.fourniture;
                  intervention.files = files*/
                postSave(options, resp, function(err) {
                    if (!err) {
                        TabContainer.close(tab);
                    }
                    $scope.saveInter = saveInter;
                })
            } else {
                $scope.saveInter = saveInter;
            }
        })
    }

    $scope.saveInter = saveInter;


    var latLng = function(add) {
        return add.lt + ', ' + add.lg
    }
    _this.selectArtisan = function(sst, first) {

        if (!sst) {
            intervention.sst = intervention.artisan = null
            return false;
        }
        $q.all([
            edisonAPI.artisan.get(sst.id, {
                cache: false
            }),
            edisonAPI.artisan.getStats(sst.id, {
                cache: true
            })
        ]).then(function(result) {
            intervention.sst = intervention.artisan = result[0].data;
            intervention.sst.stats = result[1].data
            if (!first) {
                intervention.compta.paiement.pourcentage = _.clone(intervention.sst.pourcentage);
              //  intervention.newOs = intervention.sst.newOs;
            }
            edisonAPI.getDistance(latLng(sst.address), latLng(intervention.client.address))
                .then(function(dir) {
                    intervention.sst.stats.direction = dir.data;
                })
            _this.recapFltr = {
                ai: intervention.sst.id
            }
        });
    }

    _this.showInterList = function() {
        //console.log('uauau')
        //$scope.interList = true;
    }

    _this.sstBase = intervention.sst;
    if (intervention.sst) {
        _this.selectArtisan(intervention.sst, true);
    }

    _this.searchArtisans = function(categorie) {
        if (_.get(intervention, 'client.address.lt')) {
            edisonAPI.artisan.getNearest(intervention.client.address, categorie || intervention.categorie)
                .success(function(result) {
                    _this.nearestArtisans = result;
                });
        }
    }
    _this.searchArtisans();

    $scope.$watch(function() {
        return intervention.client.address;
    }, function() {
        _this.searchArtisans(intervention.categorie);
    })


    $scope.$watch(function() {
        return intervention.client.civilite;
    }, function(curr, prev) {
        if (curr !== prev && curr === 'Soc.') {
            intervention.tva = 20;
            LxNotificationService.info("La TVA à été mise a 20%");
        }
    })

    var updateTmpIntervention = _.after(5, _.throttle(function() {
        edisonAPI.intervention.saveTmp(intervention);
    }, 30000))

    if (!intervention.id) {
        $scope.$watch(function() {
            return intervention;
        }, updateTmpIntervention, true)
    }

}
InterventionCtrl.$inject = ["Description", "Signalement", "ContextMenu", "$window", "$timeout", "$rootScope", "$scope", "$location", "$routeParams", "dialog", "fourniture", "LxNotificationService", "LxProgressService", "TabContainer", "edisonAPI", "Address", "$q", "mapAutocomplete", "productsList", "config", "interventionPrm", "Intervention", "Map"];

angular.module('edison').controller('InterventionController', InterventionCtrl);

var ContactArtisanController = function($scope, $timeout, TabContainer, LxProgressService, FiltersFactory, ContextMenu, edisonAPI, DataProvider, $routeParams, $location, $q, $rootScope, $filter, config, ngTableParams) {
    "use strict";
    var _this = this;

    _this.loadPanel = function(id) {
        edisonAPI.artisan.get(id)
            .then(function(resp) {
                _this.sst = resp.data;
                _this.tab.setTitle('@' + _this.sst.nomSociete.slice(0, 10));

            })
        edisonAPI.artisan.getStats(id).then(function(resp) {
            new Chartist.Pie('.ct-chart', {
                series: [{
                    value: resp.data.envoye.total,
                    name: 'En cours',
                    className: 'ct-orange',
                    meta: 'Meta One'
                }, {
                    value: resp.data.annule.total,
                    name: 'annulé',
                    className: 'ct-red',
                    meta: 'Meta One'
                }, {
                    value: resp.data.paye.total,
                    name: 'payé',
                    className: 'ct-green',
                    meta: 'Meta One'
                }]
            }, {
                total: resp.data.annule.total + resp.data.paye.total + resp.data.envoye.total,
                donut: true,
                startAngle: 270,
                donutWidth: 62,
            });
            _this.stats = resp.data
        })

    }

    _this.reloadStats = function() {
        edisonAPI.artisan.statsMonths($routeParams.sstid).then(function(resp) {
            var series = ['Annulé', 'Payé'];
            var labels = []
            var data = [
                [],
                []
            ];
            _.each(resp.data, function(e) {
                labels.push(_.capitalize(moment([e.year, e.month - 1]).format('MMMM YYYY')))
                data[0].push(e.annule);
                data[1].push(e.paye);
            })
            _this.sstChart = {
                series: series,
                data: data,
                labels: labels,
                options: {
                    scaleBeginAtZero: true,
                },
                colours: [
                    '#F7464A', // red
                    '#46BFBD', // green

                ]
            }
        });
    }


    _this.tbz = ['informations', 'interventions', 'historique', 'signalement', 'stats', 'paiements'];
    var ind = _this.tbz.indexOf($location.hash());
    $scope.selectedIndex = ind >= 0 ? ind : 0
    _this.tab = TabContainer.getCurrentTab();

    _this.recap = $location.url().includes('recap') ? $routeParams.sstid : undefined

    if (_this.recap) {
        _this.loadPanel(_this.recap)
    } else {
        LxProgressService.circular.show('#5fa2db', '#globalProgress');
        var dataProvider = new DataProvider('artisan');
        dataProvider.init(function(err, resp) {
            _this.config = config;
            _this.moment = moment;
            if (!dataProvider.isInit()) {
                dataProvider.setData(resp);
            }
            _this.tableFilter = "";
            _this.tableLimit = 20;
            $rootScope.expendedRow = $routeParams.sstid || 45
                // if (_this.recap) {
                //     $scope.selectedIndex = 1;
                // }
            _this.tableData = dataProvider.getData()
            _this.loadPanel(_this.tableData[0].id)
            LxProgressService.circular.hide();
        });
    }

    _this.getStaticMap = function(address) {
        if (_this.sst && this.sst.address)
            return "/api/mapGetStatic?width=500&height=400&precision=0&zoom=6&origin=" + _this.sst.address.lt + ", " + _this.sst.address.lg;
    }

    _this.reloadData = function() {
        _this.tableData = $filter('contactFilter')(dataProvider.getData(), _this.tableFilter);
    }

    _this.loadMore = function() {
        _this.tableLimit += 10;
    }

    /*
        $rootScope.$watch('tableilter', _this.reloadData);
    */
    $rootScope.$on('ARTISAN_CACHE_LIST_CHANGE', function() {
        if (_this.tab.fullUrl === TabContainer.getCurrentTab().fullUrl) {
            dataProvider.applyFilter(currentFilter, _this.tab.hash);
        }
    })

    _this.contextMenu = new ContextMenu('artisan')

    _this.rowRightClick = function($event, inter) {
        console.log('contactclick')
        _this.contextMenu.setPosition($event.pageX, $event.pageY + 200)
        edisonAPI.artisan.get(inter.id)
            .then(function(resp) {
                _this.contextMenu.setData(resp.data);
                _this.contextMenu.open();
            })
    }

    $scope.addComment = function() {
        edisonAPI.artisan.comment(_this.sst.id, $scope.commentText).then(function() {
            _this.loadPanel(_this.sst.id);
            $scope.commentText = "";
        })
    }

    _this.rowClick = function($event, inter) {
        if (_this.contextMenu.active)
            return _this.contextMenu.close();
        if ($event.metaKey || $event.ctrlKey) {
            TabContainer.addTab('/artisan/' + inter.id, {
                title: ('#' + inter.id),
                setFocus: false,
                allowDuplicates: false
            });
        } else {
            if ($rootScope.expendedRow === inter.id) {
                return 0;
            } else {
                $rootScope.expendedRow = inter.id
                _this.loadPanel(inter.id)
                $location.search('sstid', inter.id);
            }
        }
    }


    $scope.$watchCollection('[selectedIndex, expendedRow]', function(current, prev) {
        if (current && current[0] !== void(0)) {
            $location.hash(_this.tbz[current[0]]);
        }
        if (_this.tbz[current[0]] === 'stats') {
            _this.reloadStats();
        }
    })


}
ContactArtisanController.$inject = ["$scope", "$timeout", "TabContainer", "LxProgressService", "FiltersFactory", "ContextMenu", "edisonAPI", "DataProvider", "$routeParams", "$location", "$q", "$rootScope", "$filter", "config", "ngTableParams"];
angular.module('edison').controller('ContactArtisanController', ContactArtisanController);

var LpaController = function(user, openPost, socket, ContextMenu, $location, $window, TabContainer, edisonAPI, $rootScope, LxProgressService, LxNotificationService, FlushList) {
    "use strict";
    var _this = this
    var tab = TabContainer.getCurrentTab();
    tab.setTitle('LPA')
    _this.search = $location.search();
    _this.contextMenu = new ContextMenu('intervention')
    _this.user = user;
    _this.offsetX = 1;
    _this.offsetY = -5;
    console.log(user)
    _this.loadData = function(prevChecked) {
        LxProgressService.circular.show('#5fa2db', '#globalProgress');
        edisonAPI.compta.lpa($location.search()).then(function(result) {
            _.each(result.data, function(sst) {
                sst.list = new FlushList(sst.list, prevChecked);
                sst.numeroCheque = sst.list.getList()[0].numeroCheque
                if (_this.search.d) {
                    _this.checkArtisan(sst);
                }
                _this.reloadList(sst)
            })
            $rootScope.lpa = result.data
            LxProgressService.circular.hide()
        })
    }




    _this.rowRightClick = function($event, inter) {
        edisonAPI.intervention.get(inter.id, {
                populate: 'sst'
            })
            .then(function(resp) {
                _this.contextMenu.setData(resp.data);
                _this.contextMenu.setPosition($event.pageX, $event.pageY + 200)
                _this.contextMenu.open();
            })
    }



    if (!$rootScope.lpa)
        _this.loadData()
    _this.checkArtisan = function(sst) {

        sst.checked = !sst.checked
        _.each(sst.list.getList(), function(e) {
            e.checked = sst.checked;
        })
    }
    _this.updateNumeroCheque = function(index) {
        var base = $rootScope.lpa[index].numeroCheque;
        if (base) {
            for (var i = index; i < $rootScope.lpa.length; i++) {
                if ($rootScope.lpa[i].list.getList()[0].mode === 'CHQ' /*&& _.find($rootScope.lpa[i].list.getList(), 'checked', true)*/ ) {
                    $rootScope.lpa[i].numeroCheque = base++
                }
            };
        }
    }
    _this.flushMail = function() {
        var rtn = [];

        var lpa = [];
        _.each(_.cloneDeep($rootScope.lpa), function(e) {
            e.list.__list = _.filter(e.list.__list, 'checked', true);
            if (e.list.__list.length) {
                lpa.push(e);
            }
        })
        LxProgressService.circular.show('#5fa2db', '#globalProgress');
        edisonAPI.compta.flushMail(lpa).then(function(resp) {
            console.log('ok')
            LxProgressService.circular.hide()
            _this.reloadLPA()
        }, function() {
            console.log('failure')

            LxProgressService.circular.hide()
            _this.reloadLPA()
        })
    }
    _this.flush = function() {
        var rtn = [];

        var lpa = [];
        _.each(_.cloneDeep($rootScope.lpa), function(e) {
            e.list.__list = _.filter(e.list.__list, 'checked', true);
            if (e.list.__list.length) {
                lpa.push(e);
            }
        })
        LxProgressService.circular.show('#5fa2db', '#globalProgress');
        edisonAPI.compta.flush(lpa).then(function(resp) {
            LxProgressService.circular.hide()
                /*edisonAPI.compta.flushMail(lpa).then(function(resp) {
                      _this.reloadLPA()
                  });*/
            alert('Les éléments ont été flushés')
        }, function() {
            LxProgressService.circular.hide()
            alert('Les éléments ont été flushés')
                /*edisonAPI.compta.flushMail(lpa).then(function(resp) {
                    LxProgressService.circular.hide()
                    _this.reloadLPA()
                });*/
        })
    }

    socket.on('intervention_db_flushMail', function(data) {
        if (data === 100) {
            $rootScope.globalProgressCounter = "";
            LxProgressService.circular.hide();
            _this.reloadLPA()
        } else {
            $rootScope.globalProgressCounter = data + '%';
        }

    })

    _this.selectToggle = function(artisan, item) {
        if (this.search.d) {
            return false;
        }
        item.checked = !item.checked;
        _this.reloadList(artisan)
    }
    _this.reloadList = function(artisan) {

        artisan.total = artisan.list.getTotal()
        artisan.total = artisan.list.getTotal(true)
        artisan.total = artisan.list.getTotal()
    }
    _this.reloadLPA = function() {
        var rtn = [];
        _.each($rootScope.lpa, function(sst) {
            _.each(sst.list.getList(), function(e) {
                if (e.checked) {
                    rtn.push(e.id);
                }
            })
        })
        _this.loadData(rtn)
    }

    _this.clickTrigger = function(elem) {
        window.setTimeout(function() {
            angular.element(elem).trigger('click');
        }, 0)
    }

    _this.onFileUpload = function(file) {
        var ids = _($rootScope.lpa).map(_.partial(_.pick, _, 'numeroCheque', 'id')).value();
        LxProgressService.circular.show('#5fa2db', '#globalProgress');
        edisonAPI.file.uploadScans(file, {
            ids: ids,
            date: _this.search.d
        }).then(function(resp) {
            LxProgressService.circular.hide()
        })
    }

    _this.print = function(type) {
        console.log($rootScope.lpa)
        openPost('/api/intervention/print', {
            type: type,
            data: $rootScope.lpa,
            offsetX: _this.offsetX || 0,
            offsetY: _this.offsetY || 0
        });
    }
}
LpaController.$inject = ["user", "openPost", "socket", "ContextMenu", "$location", "$window", "TabContainer", "edisonAPI", "$rootScope", "LxProgressService", "LxNotificationService", "FlushList"];


angular.module('edison').controller('LpaController', LpaController);

angular.module('edison').controller('ListeArtisanController', _.noop);

angular.module('edison').controller('ListeDevisController', _.noop);

angular.module('edison').controller('ListeInterventionController', _.noop);

var listeSignalements = function(TabContainer, edisonAPI, $rootScope, $scope, $location, LxNotificationService, socket) {
    "use strict";
    var _this = this;
    _this.tab = TabContainer.getCurrentTab();
    _this.tab.setTitle('Liste Signalements');
    _this.activeTab = parseInt($location.search().level || 0)
    var q = $location.search();
    edisonAPI.signalement.list($location.search()).then(function(resp) {
        $scope.pl = resp.data;
    })

}
listeSignalements.$inject = ["TabContainer", "edisonAPI", "$rootScope", "$scope", "$location", "LxNotificationService", "socket"];
angular.module('edison').controller('listeSignalements', listeSignalements);

var SearchController = function(edisonAPI, TabContainer, $routeParams, $location, LxProgressService, config) {
    var tab = TabContainer.getCurrentTab();
    tab.setTitle('Search')
    var _this = this;
    _this.config = config;
    _this.routeParams = $routeParams
    LxProgressService.circular.show('#5fa2db', '#globalProgress');
    edisonAPI.bigSearch($routeParams.query).success(function(resp) {
        LxProgressService.circular.hide()
        _this.data = resp
    })
    _this.openLink = function(link) {
        $location.url(link)
    }
    _this.open = function(url) {
        $location.url(url);
    }
}
SearchController.$inject = ["edisonAPI", "TabContainer", "$routeParams", "$location", "LxProgressService", "config"];

angular.module('edison').controller('SearchController', SearchController);

var GStatsController = function(MomentIterator, TabContainer, $routeParams, edisonAPI, $rootScope, $scope, $location, LxProgressService, socket) {
  "use strict";
  edisonAPI.intervention.gstats().then(function(resp) {
    console.log(resp.data)
    $('#chartContainer').highcharts({
      chart: {
        type: 'column'
      },
      title: {
        text: 'Pourcentage de paiements'
      },
      xAxis: {
        categories:resp.data.categories
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Total fruit consumption'
        }
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        shared: true
      },
      plotOptions: {
        column: {
          stacking: 'percent'
        }
      },
      series: resp.data.series
    })
    console.log('okok')
  })
}
GStatsController.$inject = ["MomentIterator", "TabContainer", "$routeParams", "edisonAPI", "$rootScope", "$scope", "$location", "LxProgressService", "socket"];
angular.module('edison').controller('GStatsController', GStatsController);

var StatsNewController = function(dialog, MomentIterator, TabContainer, $routeParams, edisonAPI, $rootScope, $scope,
  $location, LxProgressService, socket) {
  "use strict";
  var _this = this;
  _this.tab = TabContainer.getCurrentTab();
  _this.tab.setTitle('Stats');
  $scope.showAll = false




  dialog.getPassword(function(err, resp) {
    console.log('==>', resp, resp === "OK")
    if (resp === "OK") {
      $scope.showAll = true
    }
  })



  var end = new Date();
  var start = new Date(2013, 8, 1)
  _this.dateSelect = MomentIterator(start, end).range('month').map(function(e) {
    return {
      t: e.format('MMM YYYY'),
      m: e.month() + 1,
      y: e.year(),
    }
  }).reverse()
  var dateTarget = _.pick(_this.dateSelect[0], 'm', 'y');

  _this.yearSelect = MomentIterator(start, end).range('year', {
    format: 'YYYY'
  }).map(function(e) {
    return parseInt(e)
  })

  var getChart = function(type, title, series, categories) {


    return {
      chart: {
        zoomType: 'x',
        type: type
      },
      title: {
        text: title
      },
      xAxis: {
        categories: categories
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Chiffre'
        },
      },
      tooltip: {
        shared: true,
        valueSuffix: ' €'
      },
      plotOptions: {
        animation: false,
        column: {
          pointPadding: 0,
          groupPadding: 0.04,
          borderWidth: 0,
          animation: false,
          //  stacking: 'normal',
        },
        area: {
          stacking: 'normal',
          lineColor: '#666666',
          lineWidth: 1,
          marker: {
            lineWidth: 1,
            lineColor: '#666666'
          }
        },
        areaspline: {
          stacking: 'normal',
        }
      },
      series: series
    }
  }


  _this.typeSelect = [
        'column',
        'areaspline',
        'area',
        'line',
        'pie',
        'bar',
        'spline',
    ]
  $scope.selectedType = 'column'

  _this.dividerSelect = [
        'categorie',
        'chiffre',
        'telepro'
    ]
  $scope.selectedDivider = 'chiffre'

  var monthChange = function() {
    edisonAPI.intervention.statsBen({
      month: $scope.selectedDate.m,
      year: $scope.selectedDate.y,
      group: 'day',
      model: 'ca',
      divider: $scope.selectedDivider,
    }).then(function(resp) {
      var d = resp.data;
      $('#chartContainer').highcharts(getChart($scope.selectedType, d.title, d.series, d.categories));
    });
  }

  var yearChange = function() {
    edisonAPI.intervention.statsBen({
      year: $scope.selectedDate.y,
      group: 'month',
      model: 'ca',
      divider: $scope.selectedDivider,
    }).then(function(resp) {
      setTotal(resp.data);
      var d = resp.data;
      $('#chartContainer2').highcharts(getChart($scope.selectedType, d.title, d.series, d.categories));
    });
  }

  var weekChange = function() {
    edisonAPI.intervention.statsBen({
      year: $scope.selectedDate.y,
      group: 'week',
      model: 'ca',
      divider: $scope.selectedDivider,
    }).then(function(resp) {
      var d = resp.data;
      $('#chartContainer3').highcharts(getChart($scope.selectedType, d.title, d.series, d.categories));
    });
  }


  $scope.$watch("selectedType", function()  {
    monthChange();
    yearChange();
    weekChange();
  });

  var setTotal = function(data) {
    $scope.totalYear =   {
      recu: 0,
      potentiel: 0,
    }
    _.times(data.categories.length, function(i) {
      $scope.totalYear[data.series[0].name] += data.series[0].data[i]
      $scope.totalYear[data.series[1].name] += data.series[1].data[i]
    })
  }

  $scope.$watch("selectedDivider", function()  {
    monthChange();
    yearChange();
    weekChange();
  });

  $scope.$watch("selectedYear", function() {

    yearChange();
    weekChange();

  });
  $scope.$watch("selectedDate", function(curr) {
    if (!curr ||  !curr.m || !curr.y)
      return false;
    $location.search('m', curr.m);
    $location.search('y', curr.y);
    monthChange(curr);
    yearChange();

  }, true);
  if ($location.search().m)  {
    dateTarget.m = parseInt($location.search().m)
  }
  if ($location.search().y)  {
    dateTarget.y = parseInt($location.search().y)
  }
  $scope.selectedDate = _.find(_this.dateSelect, dateTarget)
  $scope.selectedYear = $scope.selectedDate.y.toString();
}
StatsNewController.$inject = ["dialog", "MomentIterator", "TabContainer", "$routeParams", "edisonAPI", "$rootScope", "$scope", "$location", "LxProgressService", "socket"];
angular.module('edison').controller('StatsNewController', StatsNewController);

var StatsController = function(DateSelect, TabContainer, $routeParams, edisonAPI, $rootScope, $scope, $location, LxProgressService, socket) {
    "use strict";
    var _this = this;
    _this.tab = TabContainer.getCurrentTab();
    _this.tab.setTitle('Stats');


    var dateSelect = new DateSelect;
    _this.yearSelect = [];
    _.times(dateSelect.current.y - dateSelect.start.y + 1, function(k) {
        _this.yearSelect.push(dateSelect.start.y + k);
    })
    $scope.selectedYear = dateSelect.current.y

    $scope.$watch("selectedYear", function(curr) {
        edisonAPI.intervention.statsBen({
            y: curr
        }).then(function(resp) {
            console.log(resp.data)
            $('#chartContainer2 > *').remove()
            var svg = dimple.newSvg("#chartContainer2", 1070, 400);
            var myChart = new dimple.chart(svg, resp.data);
            myChart.setBounds(60, 30, 1000, 300)
            var x = myChart.addCategoryAxis("x", "mth");
            var y = myChart.addMeasureAxis("y", "montant");
            y.tickFormat = ',.0f';
            myChart.addSeries("potentiel", dimple.plot.bar);
            myChart.addLegend(60, 10, 410, 20, "right");
            myChart.draw();

            $scope.totalYear = {
                potentiel: 0,
                recu: 0
            }

            _.each(resp.data, function(e) {
                $scope.totalYear[e.potentiel ? 'potentiel' : 'recu'] += e.montant
            })
        })
    });




    $scope.$watch("selectedDate", function(curr) {
        if (!curr ||  !curr.m || !curr.y)
            return false;
        $location.search('m', curr.m);
        $location.search('y', curr.y);
        edisonAPI.intervention.statsBen(curr).then(function(resp) {
            $('#chartContainer > *').remove()
            var svg = dimple.newSvg("#chartContainer", 1300, 400);
            var myChart = new dimple.chart(svg, resp.data);
            myChart.setBounds(60, 30, 1000, 300)
            var x = myChart.addCategoryAxis("x", "day");
            //x.addOrderRule("dt");
            var y = myChart.addMeasureAxis("y", "prix");
            y.tickFormat = ',.0f';
            myChart.addSeries("recu", dimple.plot.bar);
            //myChart.addPctAxis("y", "paye");
            myChart.assignColor("En Attente", "#2196F3");
            myChart.assignColor("Encaissé", "#4CAF50");
            myChart.addLegend(60, 10, 410, 20, "right");
            myChart.draw();

        })
    })
    if ($location.search().m)  {
        dateSelect.current.m = parseInt($location.search().m)
    }
    if ($location.search().y)  {
        dateSelect.current.y = parseInt($location.search().y)
    }
    _this.dateSelect = dateSelect.list()
    $scope.selectedDate = _.find(dateSelect.list(), dateSelect.current)
}
StatsController.$inject = ["DateSelect", "TabContainer", "$routeParams", "edisonAPI", "$rootScope", "$scope", "$location", "LxProgressService", "socket"];
angular.module('edison').controller('StatsController', StatsController);

var commissionsPartenariat = function(MomentIterator, TabContainer, $routeParams, edisonAPI, $rootScope, $scope,
  $location, LxProgressService, socket) {
  "use strict";
  var _this = this;
  _this.tab = TabContainer.getCurrentTab();
  _this.dateSelectList = MomentIterator(new Date(2016, 1, 0),moment().add(1, 'months').toDate()).range('month').map(function(e) {
    return {
      date: new Date(e),
      name: moment(e).format("MM[/]YYYY")
    }
  })
  _this.changeSelectedDate = function() {
    LxProgressService.circular.show('#5fa2db', '#globalProgress');
    edisonAPI.artisan.tableauCom(_this.selectedDate).then(function(resp) {
      LxProgressService.circular.hide()
      console.log(resp.data)
      _this.data = resp.data
    })
  }
  _this.selectedDate = new Date(_this.dateSelectList[_this.dateSelectList.length - 1].date)
  _this.changeSelectedDate();
  _this.tab.setTitle('Coms.');
  // edisonAPI.artisan.tableauCom().then(function(resp) {
  //   LxProgressService.circular.hide()
  //   console.log(resp.data)
  //   _this.data = resp.data
  // })
}
commissionsPartenariat.$inject = ["MomentIterator", "TabContainer", "$routeParams", "edisonAPI", "$rootScope", "$scope", "$location", "LxProgressService", "socket"];
angular.module('edison').controller('commissionsPartenariat', commissionsPartenariat);

var CommissionsController = function(MomentIterator, TabContainer, $routeParams, edisonAPI, $rootScope, $scope, $location, LxProgressService, socket) {
    "use strict";

    // harald - Grand Compte - 1 janvier 2016 => 2%

    var _this = this;
    _this.tab = TabContainer.getCurrentTab();
    _this.tab.setTitle('Coms.');

    _this.xcalc = function(e) {
        if ((new Date(e.date.ajout)).getFullYear() >= 2016 && e.facture && e.facture.payeur === 'GRN' && e.login.ajout === 'harald_x' ) {
          e.exception1 = true
          return _.round((e.compta.reglement.montant || e.compta.paiement.base || e.prixFinal) * 0.02, 2);
        }
        if ((new Date(e.date.ajout)).getFullYear() >= 2016 && e.categorie === 'VT' && (e.login.ajout === 'maxime_s' || e.login.ajout === 'gregoire_e') ) {
          e.exception2 = true
          console.log('-->', e)
          return _.round((e.compta.reglement.montant || e.compta.paiement.base || e.prixFinal) * 0.005, 2);
        }
        return e.categorie === 'VT' ? 1.5 : _.round((e.compta.reglement.montant || e.compta.paiement.base || e.prixFinal) * 0.01, 2);
    }

    _this.getTotal = function() {
        var rtn = {
            com: 0,
            all: 0
        }
        _.each($scope.list, function(x) {
            rtn.com += _this.xcalc(x);
            rtn.all += x.compta.reglement.montant || 0
        })
        return rtn;
    }
    var end = new Date();
    var start = new Date(2013, 8, 1)
    _this.dateSelect = MomentIterator(start, end).range('month').map(function(e) {
        return {
            t:e.format('MMM YYYY'),
            m:e.month() + 1,
            y:e.year(),
        }
    }).reverse()

    var dateTarget = _.pick(_this.dateSelect[0], 'm', 'y');
    $scope.usrs = _.filter(window.app_users, 'service', 'INTERVENTION');

    $scope.selectedUser = $location.search().l ||  $scope.usrs[0].login

    var actualise = _.debounce(function() {
        LxProgressService.circular.show('#5fa2db', '#globalProgress');
        edisonAPI.intervention.commissions(_.merge($scope.selectedDate, {
            l: $scope.selectedUser
        })).then(function(resp) {
            LxProgressService.circular.hide();
            $scope.list = resp.data
            $scope.total = _this.getTotal()
        })
    }, 50)
    $scope.$watch("selectedUser", function(curr, prev) {
        $location.search('l', curr);
        actualise();
        /* */
    })
    $scope.$watch("selectedDate", function(curr, prev) {
        $location.search('m', curr.m);
        $location.search('y', curr.y);
        actualise();
    })
    if ($location.search().m)  {
        dateTarget.m = parseInt($location.search().m)
    }
    if ($location.search().y)  {
        dateTarget.y = parseInt($location.search().y)
    }
    $scope.selectedDate = _.find(_this.dateSelect, dateTarget)
}
CommissionsController.$inject = ["MomentIterator", "TabContainer", "$routeParams", "edisonAPI", "$rootScope", "$scope", "$location", "LxProgressService", "socket"];
angular.module('edison').controller('CommissionsController', CommissionsController);

var editCombos = function(TabContainer, edisonAPI, $rootScope, $scope, $location, LxNotificationService, socket) {
    "use strict";
    var _this = this;
    _this.tab = TabContainer.getCurrentTab();
    _this.tab.setTitle('Combos');


    var base = {
        "id": 29300,
        "categorie": "PL",
        "description": "RECHERCHE DE PANNE ELCTRIQUE",
        "sst": 31,
        "file": [],
        "tva": 10,
        "coutFourniture": 0,
        "enDemarchage": false,
        "aDemarcher": false,
        "reglementSurPlace": false,
        "prixFinal": 0,
        "prixAnnonce": 130,
        "modeReglement": "CH",
        "fourniture": [],
        "produits": [],
        "remarque": "Pas de remarque(s)",
        "descriptionTags": [],
        "artisan": {
            "id": 31,
            "nomSociete": "SODESEN"
        },
        "savEnCours": true,
        "litigesEnCours": true,
        "litiges": [],
        "sav": [],
        "client": {
            "civilite": "M.",
            "nom": "DELORME",
            "email": "",
            "location": [
                45.7592,
                4.77779
            ],
            "address": {
                "n": "19",
                "r": "RUE DES CERISIERS",
                "v": "TASSIN-LA-DEMI-LUNE",
                "cp": "69160",
                "lt": 45.7592,
                "lg": 4.77779
            },
            "telephone": {
                "tel1": "0478346059",
                "origine": "0478346059"
            },
            "prenom": "CHRISTIAN"
        },
        "facture": {
            "civilite": "M.",
            "nom": "DELORME",
            "email": "",
            "location": [
                45.7592,
                4.77779
            ],
            "address": {
                "n": "19",
                "r": "RUE DES CERISIERS",
                "v": "TASSIN-LA-DEMI-LUNE",
                "cp": "69160",
                "lt": 45.7592,
                "lg": 4.77779
            },
            "telephone": {
                "tel1": "0478346059",
                "origine": "0478346059"
            },
            "prenom": "CHRISTIAN"
        },
        "produits": [],
        "historique": [],
        "comments": [],
        "date": {
            "intervention": "2015-09-17T11:00:00.000Z",
            "envoi": "2015-09-17T09:11:14.000Z",
            "ajout": "2015-09-17T09:11:14.000Z"
        },
        "login": {
            "ajout": "clement_b",
            "envoi": "clement_b"
        },
        "status": "ENC"
    }



    edisonAPI.combo.list().then(function(resp) {
        $scope.plSave = resp.data
        $scope.pl = _.map(resp.data, _this.extend);
    })

    _this.extend = function(e) {
        var z = _.assign(_.clone(base), e)
        console.log(z, e);
        return z;
    }

    _this.save = function() {
        edisonAPI.combo.save($scope.pl).then(function(resp) {
            $scope.pl = _.map(resp.data, _this.extend);
            LxNotificationService.success("Les produits on été mis a jour");
        }, function(err) {
            LxNotificationService.error("Une erreur est survenu (" + JSON.stringify(err.data) + ')');
            //  edisonAPI.combo.save($scope.plSave);
        })
    }
    _this.remove = function(obj) {
        $scope.pl.splice(_.findIndex($scope.pl, '_id', obj._id), 1);
    }

    _this.getInter = function(prods)  {
        var x = _.clone(base)
        x.produits = prods.produits;
        return x;
    }

    _this.add = function() {
        $scope.pl.push({
            produits: [],
            title: '',
            open: true,
            text: ""
        })
    }



}
editCombos.$inject = ["TabContainer", "edisonAPI", "$rootScope", "$scope", "$location", "LxNotificationService", "socket"];
angular.module('edison').controller('editCombos', editCombos);

var editComptes = function(TabContainer, edisonAPI, $rootScope, $scope, $location, LxNotificationService, socket) {
    "use strict";
    var _this = this;
    _this.tab = TabContainer.getCurrentTab();
    _this.tab.setTitle('grand Comptes');

    edisonAPI.compte.list().then(function(resp) {
        $scope.pl = resp.data
        console.log($scope.pl)
    })


    _this.save = function() {
        edisonAPI.compte.save($scope.pl).then(function(resp) {
            LxNotificationService.success("Les comptes on été mis a jour");
        }, function(err) {
            LxNotificationService.error("Une erreur est survenu (" + JSON.stringify(err.data) + ')');
        })
    }
    _this.remove = function(obj) {
        $scope.pl.splice(_.findIndex($scope.pl, '_id', obj._id), 1);
    }
}
editComptes.$inject = ["TabContainer", "edisonAPI", "$rootScope", "$scope", "$location", "LxNotificationService", "socket"];

angular.module('edison').controller('editComptes', editComptes);

var editProducts = function(TabContainer, edisonAPI, $rootScope, $scope, $location, LxNotificationService, socket) {
    "use strict";
    var _this = this;
    _this.tab = TabContainer.getCurrentTab();
    _this.tab.setTitle('Produits');


    var single = function(e) {
        e.single = (_(e.desc).deburr().toLowerCase() !== _(e.title).deburr().toLowerCase())
        return e;
    }

    edisonAPI.product.list().then(function(resp) {
        $scope.pl = _.map(resp.data, single);
    })

    _this.remove = function(obj) {
        $scope.pl.splice(_.findIndex($scope.pl, '_id', obj._id), 1);
    }

    _this.save = function() {
        edisonAPI.product.save($scope.pl).then(function(resp) {
            $scope.pl = _.map(resp.data, single);
            LxNotificationService.success("Les produits on été mis a jour");
        }, function(err) {
            LxNotificationService.error("Une erreur est survenu (" + JSON.stringify(err.data) + ')');
        })
    }

    /* $scope.$watch('pl', function(curr, prev) {
         if (curr && prev && !_.isEqual(prev, curr)) {
             save()
         }
     }, true)*/


}
editProducts.$inject = ["TabContainer", "edisonAPI", "$rootScope", "$scope", "$location", "LxNotificationService", "socket"];
angular.module('edison').controller('editProducts', editProducts);

var editSignalements = function(TabContainer, edisonAPI, $rootScope, $scope, $location, LxNotificationService, socket) {
    "use strict";
    var _this = this;
    _this.tab = TabContainer.getCurrentTab();
    _this.tab.setTitle('Signalements');


    edisonAPI.signal.list().then(function(resp) {
        $scope.pl = resp.data;
    })

    _this.remove = function(_id) {
        var i = _.findIndex($scope.pl, '_id', _id)
        $scope.pl.splice(i, 1);
    }
    _this.save = function() {
        edisonAPI.signal.save($scope.pl).then(function(resp) {
            $scope.pl = resp.data;
            LxNotificationService.success("Les produits on été mis a jour");
        }, function(err) {
            LxNotificationService.error("Une erreur est survenu (" + JSON.stringify(err.data) + ')');
        })
    }


}
editSignalements.$inject = ["TabContainer", "edisonAPI", "$rootScope", "$scope", "$location", "LxNotificationService", "socket"];
angular.module('edison').controller('editSignalements', editSignalements);

var editUsers = function(TabContainer, edisonAPI, $rootScope, $scope, $location, LxNotificationService, socket) {
    "use strict";
    var _this = this;
    _this.tab = TabContainer.getCurrentTab();
    _this.tab.setTitle('Utilisateurs');



    edisonAPI.users.list().then(function(resp) {
        $scope.usrs = resp.data
    })

    _this.save = function() {
        edisonAPI.users.save($scope.usrs).then(function() {
            LxNotificationService.success("Les utilisateurs on été mis a jour");
        }, function(err) {
            LxNotificationService.error("Une erreur est survenu (" + JSON.stringify(err.data) + ')');
        })
    }
    _this.remove = function(obj) {
        $scope.usrs.splice(_.findIndex($scope.usrs, '_id', obj._id), 1);
    }


}
editUsers.$inject = ["TabContainer", "edisonAPI", "$rootScope", "$scope", "$location", "LxNotificationService", "socket"];
angular.module('edison').controller('editUsers', editUsers);

var telephoneMatch = function(TabContainer, edisonAPI, $rootScope, $scope, $location, LxProgressService, socket) {
    "use strict";
    var _this = this;
    _this.tab = TabContainer.getCurrentTab();
    _this.tab.setTitle('TelMatch');
    $scope.__txt_tel = $rootScope.__txt_tel
    $rootScope.getTelMatch = function() {
        LxProgressService.circular.show('#5fa2db', '#globalProgress');
        $rootScope.__txt_tel = $scope.__txt_tel
        edisonAPI.intervention.getTelMatch({
            q: $rootScope.__txt_tel
        }).then(_.noop, function() {
        LxProgressService.circular.hide()

        })
    }

    socket.on('intervention_db_telMatches', function(data) {
        $rootScope.globalProgressCounter = data + '%';
    })

    socket.on('telephoneMatch', function(data) {
        $rootScope.globalProgressCounter = ""
        LxProgressService.circular.hide()
        $scope.resp = data
    })

}
telephoneMatch.$inject = ["TabContainer", "edisonAPI", "$rootScope", "$scope", "$location", "LxProgressService", "socket"];
angular.module('edison').controller('telephoneMatch', telephoneMatch);

var userHistory = function(TabContainer, edisonAPI, $rootScope, $scope, $location, LxNotificationService, socket) {
	"use strict";
	var _this = this;
	_this.tab = TabContainer.getCurrentTab();
	_this.tab.setTitle('User History');
	edisonAPI.user.history($location.search().login).then(function(resp) {
		$scope.history = resp.data
	})
	_this.xclick = function(h) {
		_this.selectedRow = (_this.selectedRow == h.date ? null : h.date);
	}


}
userHistory.$inject = ["TabContainer", "edisonAPI", "$rootScope", "$scope", "$location", "LxNotificationService", "socket"];

angular.module('edison').controller('userHistory', userHistory);
