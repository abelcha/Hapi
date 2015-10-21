angular.module('edison', ['browserify', 'ui.slimscroll', 'ngMaterial', 'lumx', 'ngAnimate', 'xeditable', 'btford.socket-io', 'ngFileUpload', 'pickadate', 'ngRoute', 'ngResource', 'ngTable', 'ngMap'])
    .config(function($mdThemingProvider) {
        "use strict";
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('blue-grey');
    })
    .run(function(editableOptions) {
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
    }).config(function($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|callto|mailto|file|tel):/);
    });

angular.module('edison').controller('MainController', function($timeout, LxNotificationService, $q, DataProvider, TabContainer, $scope, socket, config, $rootScope, $location, edisonAPI, taskList, $window) {
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

    var bfm = function() {
        edisonAPI.bfm.get().then(function(resp) {
            $rootScope.events = resp.data;
        })
    }
    socket.on('event', _.debounce(bfm, _.random(0, 3000)));

    bfm();

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
    socket.on('notification', function(data) {
        console.log('notification==>', data)
        if (data.dest === $rootScope.user.login && data.dest !== data.origin || data.self) {
            LxNotificationService.notify(data.message, 'android', false, data.color);
        }
    })


    $rootScope.openTab = function(tab) {
        //   console.log('-->', tab);
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

    $scope.tabIconClick = function($event, tab) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.tabs.close(tab)
    };
});

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
var getArtisan = function($route, $q, edisonAPI) {
    "use strict";
    var id = $route.current.params.id;
    if (id.length > 10) {
        return edisonAPI.artisan.getTmp(id);
    } else {
        return edisonAPI.artisan.get(id);
    }
}

angular.module('edison').config(function($routeProvider, $locationProvider) {
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
                artisanPrm: getIntervention,
            }
        })
        .when('/dashboard', {
            controller: 'DashboardController',
            templateUrl: "Pages/Dashboard/dashboard.html",
            controllerAs: "vm",
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
        .otherwise({
            redirectTo: '/dashboard'
        });
    // use the HTML5 History API
    $locationProvider.html5Mode(true);
});

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

angular.module('edison').directive('dropdownRow', function(Devis, productsList, edisonAPI, config, $q, $timeout, Intervention) {
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
});

angular.module('edison').directive('elastic', [
    '$timeout',
    function($timeout) {
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
 angular.module('edison').directive('infoComment', function(user) {
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
 });

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

 angular.module('edison').directive('infoSav', function(config) {
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
            console.log(config.savStatus)
         }
     }
 });

 var Controller = function($timeout, TabContainer, FiltersFactory, user, ContextMenu, LxProgressService, edisonAPI, DataProvider, $routeParams, $location, $rootScope, $filter, config, ngTableParams) {
     var _this = this;
     LxProgressService.circular.show('#5fa2db', '#globalProgress');
     var currentFilter;
     var currentHash = $location.hash();
     var dataProvider = new DataProvider(_this.model, $routeParams.hashModel);
     var filtersFactory = new FiltersFactory(_this.model)
     if ($routeParams.fltr) {
         currentFilter = filtersFactory.getFilterByUrl($routeParams.fltr)
     }


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
             return _.contains($routeParams.sstids_in, inter.id);
         }
     }

     var actualiseUrl = _.throttle(function(fltrs, page) {
         $location.search('page', page !== 1 ? page : undefined);
         _.each(fltrs, function(e, k) {
             // console.log(e, k)
             if (!e) e = undefined;
             if (e !== "hashModel") {
                 $location.search(k, e);

             } else {
                 //console.log(e)
             }
         })
     }, 250)
     if (_this.routeParamsFilter === 'relanceClient') {
         sorting = {
             l: 'asc'
         }
     } else {
         sorting = {
             id: 'desc'
         }
     }
     dataProvider.init(function(err, resp) {


         dataProvider.applyFilter(currentFilter, _this.tab.hash, _this.customFilter);
         var tableParameters = {
             page: $location.search()['page'] ||  1,
             total: dataProvider.filteredData.length,
             filter: _.omit($location.search(), 'hashModel', 'page', 'sstid'),
             sorting: sorting,
             count: _this.limit || 100
         };
         var tableSettings = {
             total: dataProvider.filteredData,
             getData: function($defer, params) {
                 actualiseUrl(params.filter(), params.page())
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
             //_this.tableParams.orderBy(_this.tableParams.$params.sorting)
             //_this.tableParams.filter(_this.tableParams.$params.filter)
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
             // $('.drpdwn').remove()
             if (_this.expendedRow === inter.id) {
                 _this.expendedRow = undefined;
             } else {
                 _this.expendedRow = inter.id
             }
         }
     }
 }



 angular.module('edison').directive('lineupIntervention', function($timeout, TabContainer, FiltersFactory, user, ContextMenu, LxProgressService, edisonAPI, DataProvider, $routeParams, $location, $rootScope, $filter, config, ngTableParams) {
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
         controller: function($scope) {

             $scope.model = 'intervention'
             Controller.apply($scope, arg)
         }
     }
 });

 angular.module('edison').directive('lineupDevis', function($timeout, TabContainer, FiltersFactory, user, ContextMenu, LxProgressService, edisonAPI, DataProvider, $routeParams, $location, $rootScope, $filter, config, ngTableParams) {
     "use strict";
     var arg = arguments;
     return {
         replace: false,
         restrict: 'E',
         templateUrl: '/Templates/lineup-devis.html',
         scope: {
             filter: '=',
         },
         controller: function($scope) {
             $scope.model = 'devis'
             Controller.apply($scope, arg)
         }
     }
 });

 angular.module('edison').directive('lineupArtisan', function($timeout, TabContainer, FiltersFactory, user, ContextMenu, LxProgressService, edisonAPI, DataProvider, $routeParams, $location, $rootScope, $filter, config, ngTableParams) {
     "use strict";
     var arg = arguments;
     return {
         replace: false,
         restrict: 'E',
         templateUrl: '/Templates/lineup-artisan.html',
         scope: {

         },
         controller: function($scope) {
             $scope.model = 'artisan'

             Controller.apply($scope, arg)
         }
     }
 });

angular.module('edison').directive('ngRightClick', function($parse) {
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
});

 angular.module('edison').directive('link', ['FiltersFactory', '$rootScope', function(FiltersFactory, $rootScope) {
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

 angular.module('edison').directive('simpleLink', ['FiltersFactory', '$rootScope', function(FiltersFactory, $rootScope) {
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


 angular.module('edison').directive('linkSeparator', [function() {
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
 }]);


 angular.module('edison').service('sidebarSM', function() {

     var C = function() {
         this.display = false;
     };
     C.prototype.set = function(name, value) {
         this[name] = value;
     }
     return new C();

 });



 angular.module('edison').directive('sideBar', ['sidebarSM', function(sidebarSM) {
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

 angular.module('edison').directive('dropDown', ['config', 'sidebarSM', '$timeout', function(config, sidebarSM, $timeout) {
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

 angular.module('edison').directive('signalement', function() {
     "use strict";
     return {
         replace: false,
         restrict: 'E',
         templateUrl: '/Templates/signalement.html',
         scope: {
             sst: '=',
             exit: '&',
         },
         link: function(scope, elem) {
             console.log('==>', scope.exit);
             scope.hide = function() {
                scope.exit()
             }
         }
     }
 });

angular.module("edison").filter('contactFilter', ['config', function(config) {
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
        var d = moment((date + 1370000000) * 1000);
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

angular.module("edison").filter('tableFilter', ['config', function(config) {
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
        var md = (data[key] + 1370000000) * 1000;
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
            return {
                start: new Date(2015, month - 1),
                end: new Date(2015, month)
            }
        } else if (x.length === 2)  {
            var day = parseInt(x[0]);
            var month = parseInt(x[1]);
            return {
                start: new Date(2015, month - 1, day),
                end: new Date(2015, month - 1, day + 1)
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

angular.module('edison').factory('TabContainer', ['$location', '$window', '$q', 'edisonAPI', function($location, $window, $q, edisonAPI) {
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

angular.module('edison').factory('Signalement', function() {
    "use strict";

    var Signalement = function(inter) {
        this.intervention = inter;
    }

    Signalement.prototype.list = {
        intervention: [{
            name: 'Indisponibilité',
            id: 'INDISPO',
            fn: function() {
                console.log('yay')
            }
        }],
        partenariat: [{
            name: 'Facturier / Deviseur',
            id: 'FACT_DEV',
            fn: function() {
                console.log('FACTDEV')
            }
        }, {
            name: 'Erreur SST',
            id: 'ERREUR',
            fn: function() {
                console.log('ERR')
            }
            // N'A PAS COMPTÉ LA TVA
            // 
        }, {
            name: 'Plainte SST',
            id: 'PLAINTE',
            fn: function() {
                console.log('PLAINTE')
            }
        }],
        compta: []
    }
    return Signalement;
});

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

angular.module('edison').factory('TabContainer', function(Tab, $location) {
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
        $location.url('/intervention/list');
    }



    TabContainer.add = function(location) {
        var tab = this.find(location);
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
                var dest =  _.endsWith(e.model, 's') ? e.model : e.model + 's';
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

});

angular.module('edison').factory('Address', function() {
    "use strict";

    var Address = function(place, copyContructor) {
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

angular.module('edison').factory('edisonAPI', ['$http', '$location', 'Upload', function($http, $location, Upload) {
    "use strict";
    return {
        product: {
            list: function() {
                return $http.get('/api/product/list');
            },
            save: function(data) {
                return $http.post('/api/product/__save', data);
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
                return $http.get('/api/intervention/dashboardStats', options);
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
            comment: function(id, text) {
                return $http.post('/api/artisan/' + id + '/comment', {
                    text: text
                })
            },
            sendFacturier: function(id, facturier, deviseur) {
                console.log('==>', facturier, deviseur)
                return $http.post('/api/artisan/' + id + '/sendFacturier', {
                    facturier: facturier,
                    deviseur: deviseur,
                });
            },
            saveTmp: function(data) {
                return $http.post('/api/artisan/temporarySaving', data);
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
            reaStats: function() {
                return $http.get('/api/artisan/reaStats')
            },
            extendedStats: function(id) {
                return $http.get('/api/artisan/' + id + "/extendedStats")
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
                        limit: 50,
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
        task: {
            add: function(params) {
                return $http.post('/api/task/add', params)
            },
            check: function(id) {
                return $http.post('/api/task/' + id + '/check')
            },
            listRelevant:function() {
                return $http.get('/api/task/relevant');
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
        }
    }
}]);

angular.module('edison')
    .factory('Artisan', function($window, $rootScope, user, $location, LxNotificationService, LxProgressService, dialog, edisonAPI, textTemplate) {
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
            console.log('---->', tel);
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
        Artisan.prototype.call = function(cb) {
            var _this = this;
            var now = Date.now();
            $window.open('callto:' + _this.telephone.tel1, '_self', false)
                /*                dialog.choiceText({
                                    title: 'Nouvel Appel',
                                    subTitle: _this.telephone.tel1
                                }, function(response, text) {
                                    edisonAPI.call.save({
                                        date: now,
                                        to: _this.telephone.tel1,
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
                                })*/
        };


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

        Artisan.prototype.envoiContrat = function(cb) {
            var _this = this;
            dialog.sendContrat({
                data: _this,
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
        Artisan.prototype.rappelContrat = function(cb) {
            var _this = this;
            _this.datePlain = moment(_this.date.ajout).format('ll')
            dialog.sendContrat({
                data: _this,
                text: _.template(textTemplate.mail.artisan.rappelContrat())(_this),
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
    });

angular.module('edison').factory('ContextMenu', function($rootScope, $location, edisonAPI, $window, $timeout, dialog, Devis, Intervention, Artisan, contextMenuData) {
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
                e.hidden = e.hide && e.hide(_this.data);
            }
        });
        this.style.display = "block";
        this.active = true;
    }

    ContextMenu.prototype.close = function() {
        this.style.display = "none";
        this.active = false;

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

});

angular.module('edison').factory('DataProvider',function($timeout, edisonAPI, socket, $rootScope, config) {
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

    DataProvider.prototype.setData = function(data) {
        this.data[this.model] = data;
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
            var id_list = _(newRows).flatten().map('id').value();
            for (var i = 0; i < _this.getData().length && id_list.length; i++) {
                var pos = id_list.indexOf(_this.getData()[i].id)
                if (pos >= 0) {
                    _this.getData()[i] = newRows[pos];
                    id_list.splice(pos, 1);
                }
            };
            if (id_list.length) {
                console.log('lol')
                var z = _.filter(newRows, function(e) {
                    return _.includes(id_list, e.id);
                })
                _.each(z, function(x) {
                    console.log('NEW DATA')
                    _this.getData().unshift(x)
                })
            }
            $rootScope.$broadcast(_this.socketListChange());
        }

    }

    DataProvider.prototype.getData = function() {
        return this.data[this.model];
    }


    DataProvider.prototype.isInit = function() {
        return this.model && this.data && this.data[this.model];
    }
    return DataProvider;

});

angular.module('edison').factory('DateSelect', function() {
    "use strict";
    var DateSelect = function() {

        var _this = this;
        var d = new Date();
        _this.start = {
            m: 9,
            y: 2013
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
                    t: frenchMonths[mth] + ' ' + (_this.start.y + yr)
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
    .factory('Devis', function(openPost, $window, $rootScope, $location, LxNotificationService, LxProgressService, dialog, edisonAPI, textTemplate) {
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
                return LxNotificationService.error('Les coordonées du devis sont incompletes');
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
    });

angular.module('edison').factory('dialog', function(openPost, $mdDialog, edisonAPI, config, $window, LxNotificationService) {
    "use strict";

    return {
        verification: function(inter, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog, config) {
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
                },
                templateUrl: '/DialogTemplates/verification.html',
            });
        },
        recouvrement: function(inter, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog, config) {
                    $scope.data = inter
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (!cancel) {
                            cb(inter);
                        }
                    }
                },
                templateUrl: '/DialogTemplates/recouvrement.html',
            });
        },
        validationReglement: function(inter, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    $scope.data = inter
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
                },
                templateUrl: '/DialogTemplates/validationReglement.html',
            });
        },
        validationPaiement: function(inter, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    $scope.data = inter
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
                },
                templateUrl: '/DialogTemplates/validationPaiement.html',
            });
        },
        facturierDeviseur: function(artisan, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog, config) {
                    $scope.sst = artisan
                    $scope.deviseur = true;
                    $scope.facturier = true;
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (!cancel) {
                            cb($scope.facturier, $scope.deviseur);
                        }
                    }
                },
                templateUrl: '/DialogTemplates/facturierDeviseur.html',
            });
        },
        envoiFacture: function(inter, text, showAcquitte, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
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
                },
                templateUrl: '/DialogTemplates/envoiFacture.html',
            });
        },
        recap: function(inters) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog, config) {
                    $scope.inters = inters;
                    $scope.config = config
                    $scope.answer = function() {
                        $mdDialog.hide();
                    }
                },
                templateUrl: '/DialogTemplates/recapList.html',
            });
        },
        callsList: function(sst) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    $scope.sst = sst;
                    $scope.answer = function() {
                        $mdDialog.hide();
                    }
                },
                templateUrl: '/DialogTemplates/callsList.html',
            });
        },
        smsList: function(sst) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    $scope.sst = sst;
                    $scope.answer = function() {
                        $mdDialog.hide();
                    }
                },
                templateUrl: '/DialogTemplates/smsList.html',
            });
        },
        choiceText: function(options, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    $scope.options = options;
                    $scope.answer = function(resp, text) {
                        $mdDialog.hide();
                        return cb(resp, text);
                    }
                },
                templateUrl: '/DialogTemplates/choiceText.html',
            });
        },
        addProd: function(cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog, $window) {
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
                },
                templateUrl: '/DialogTemplates/getProd.html',
            });
        },
        getCauseAnnulation: function(inter, cb) {
            $mdDialog.show({
                controller: function($scope, config) {
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
                },
                templateUrl: '/DialogTemplates/causeAnnulation.html',
            });
        },
        sendContrat: function(options, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    options.signe = true;
                    $scope.options = options;
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (!cancel)
                            return cb($scope.options);
                    }
                },
                templateUrl: '/DialogTemplates/sendContrat.html',
            });
        },
        getText: function(options, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    $scope.options = options;
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (!cancel)
                            return cb($scope.options.text);
                    }
                },
                templateUrl: '/DialogTemplates/text.html',
            });
        },
        getTextDevis: function(previewFunction, options, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    $scope.options = options;
                    $scope.previewFunction = previewFunction;
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (!cancel)
                            return cb($scope.options.text);
                    }
                },
                templateUrl: '/DialogTemplates/textDevis.html',
            });
        },
        getFileAndText: function(data, text, files, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
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
                },
                templateUrl: '/DialogTemplates/fileAndText.html',
            });
        },
         envoiIntervention: function(data, text, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
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
                },
                templateUrl: '/DialogTemplates/envoi.html',
            });
        },
        editProduct: {
            open: function(produit, cb) {
                $mdDialog.show({
                    controller: function DialogController($scope, $mdDialog) {
                        $scope.produit = _.clone(produit);
                        $scope.mdDialog = $mdDialog;
                        $scope.answer = function(p) {
                            $mdDialog.hide(p);
                            return cb(p);
                        }
                    },
                    templateUrl: '/DialogTemplates/edit.html',
                });
            }
        },
        selectSubProduct: function(elem, callback) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    $scope.elem = elem
                    $scope.answer = function(cancel, item) {
                        $mdDialog.hide();
                        if (!cancel) {
                            return callback(item)
                        }
                    }
                },
                templateUrl: '/DialogTemplates/selectSubProduct.html',
            });
        }
    }

});

angular.module('edison').factory('fourniture', [function() {
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
                fournisseur: 'ARTISAN',
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

}]);

angular.module('edison')
    .factory('Intervention', function($location, $window, openPost, LxNotificationService, LxProgressService, dialog, user, config, edisonAPI, Devis, $rootScope, textTemplate) {
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
                    link: _this.sst.id,
                    origin: _this.id || _this.tmpID,
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
            edisonAPI.intervention.save(_this)
                .then(function(resp) {
                    var validationMessage = _.template("Les données de l'intervention {{id}} ont à été enregistré.")(resp.data)
                    if ((_this.tmpID && _this.sst) || (_this.sst__id && _this.sst && _this.sst__id !== _this.sst.id)) {
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
            var defaultText = textTemplate.sms.intervention.envoi.bind(_this)(user);
            dialog.envoiIntervention(_this, defaultText, function(err, text, file) {
                if (err)
                    return cb(err)
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
                        var validationMessage = _.template("L'intervention {{id}} est annulé")(resp.data)
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



        return Intervention;
    });

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

angular.module('edison').factory('mapAutocomplete', ['$q', 'Address',
    function($q, Address) {
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

angular.module('edison').factory('openPost', [function() {
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
}]);

angular.module('edison').factory('productsList', function($q, dialog, openPost, edisonAPI) {
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
            return _.max(this.produits, 'pu');
        },
        total: function() {
            var total = _.round(_.sum(this.produits, function(e)  {
                return (e.pu || 0) * (e.quantite || 0);
            }), 2)
            return total;
        },

    }

    return Produit;


});

angular.module('edison').factory('socket', function(socketFactory) {
    "use strict";
    return socketFactory();
});

angular.module('edison').factory('taskList', ['dialog', 'edisonAPI', function(dialog, edisonAPI) {
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

angular.module('edison').factory('user', function($window) {
    "use strict";
    return $window.app_session;
});

 angular.module('edison').directive('infoAppelSst', function(mapAutocomplete, edisonAPI,config) {
     "use strict";
     return {
         restrict: 'E',
         templateUrl: '/Templates/info-appel-sst.html',
         scope: {
             data: "=",
         },
         link: function(scope, element, attrs) {
             console.log('sweg');
         },
     }

 });

 angular.module('edison').directive('infoFacture', function(mapAutocomplete, edisonAPI,config) {
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

 });

angular.module('edison').directive('infoFourniture', ['config', 'fourniture',
    function(config, fourniture) {
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

angular.module('edison').directive('mainNavbar', function($q, edisonAPI, TabContainer, $timeout, $rootScope, $location, $window) {
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
            $('input[type="search"]').ready(function() {
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

            $rootScope.$on('closeContextMenu', function() {
                scope.selectedTab = null;
            })




            scope.logout = function() {
                edisonAPI.users.logout().then(function() {
                    $window.location.reload()
                })
            }


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

            scope.changeUser = function(usr) {
                $rootScope.displayUser = usr
            }

            scope.searchBox = {
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
                    $timeout(function() {
                        $(searchInput).blur();
                    });
                    scope.searchText = "";
                }
            }



        },
    }

});

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

angular.module('edison').controller('archivesPaiementController', archivesPaiementController);

 angular.module('edison').directive('artisanCategorie', ['config', function(config) {
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

var ArtisanCtrl = function($timeout, $rootScope, $scope, edisonAPI, $location, $routeParams, ContextMenu, LxProgressService, LxNotificationService, TabContainer, config, dialog, artisanPrm, Artisan) {
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
                artisan.envoiContrat.bind(resp)(TabContainer.close);
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
            console.log('==>', artisan.file)
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
        _this.commentText = "";
    }
    var updateTmpArtisan = _.after(5, _.throttle(function() {
        edisonAPI.artisan.saveTmp(artisan);

    }, 2000))

    if (!artisan.id) {
        $scope.$watch(function() {
            return artisan;
        }, updateTmpArtisan, true)
    }
}
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
        console.log($rootScope.avoirs);
        openPost('/api/intervention/printAvoir', {
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


angular.module('edison').controller('avoirsController', AvoirsController);

var ContactArtisanController = function($scope, $timeout, TabContainer, LxProgressService, FiltersFactory, ContextMenu, edisonAPI, DataProvider, $routeParams, $location, $q, $rootScope, $filter, config, ngTableParams) {
    "use strict";
    var _this = this;
    _this.loadPanel = function(id) {
        edisonAPI.artisan.get(id)
            .then(function(resp) {
                _this.sst = resp.data;
                _this.tab.setTitle('@' + _this.sst.nomSociete.slice(0, 10));

            })
    }
    _this.tbz = ['informations', 'interventions', 'historique', 'stats', 'paiements'];
    var ind = _this.tbz.indexOf($location.hash());
    $scope.selectedIndex = ind >= 0 ? ind : 0
    _this.tab = TabContainer.getCurrentTab();

    _this.recap = $location.url().includes('recap') ? $routeParams.sstid : undefined

    if (_this.recap) {
        _this.loadPanel(_this.recap)
    } else {
        console.log('-->', 'yay')
        LxProgressService.circular.show('#5fa2db', '#globalProgress');
        var dataProvider = new DataProvider('artisan');
        dataProvider.init(function(err, resp) {
            console.log('init')
            _this.config = config;
            _this.moment = moment;
            if (!dataProvider.isInit()) {
                dataProvider.setData(resp);
            }

            _this.tableFilter = "";
            _this.tableLimit = 20;
            $rootScope.expendedRow = $routeParams.sstid || 45
            console.log(_this.recap, $location.url())
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
            if (prev[1] && $scope.selectedIndex == 4) {
                $scope.compteTiers = undefined
                edisonAPI.artisan.getCompteTiers($rootScope.expendedRow).success(function(resp) {
                    $scope.compteTiers = resp;
                })
            }
        })
        /*
            $scope.$on('$locationChangeSuccess', function(event) {
                if ($route.current.$$route.controller === 'CurrencyConvertCtrl') {
                    // Will not load only if my view use the same controller
                    $route.current = lastRoute;
                }
            });
        */
    $scope.$watch('selectedIndex', function(current, prev) {
        if (current !== void(0) && prev !== current)  {
            $('md-tabs-content-wrapper').hide()
            $timeout(function() {
                $('md-tabs-content-wrapper').show()
            }, 500)
        }
    })

}
angular.module('edison').controller('ContactArtisanController', ContactArtisanController);

var DashboardController = function($rootScope, dialog, user, edisonAPI, $scope, $filter, TabContainer, NgTableParams, $routeParams, $location, LxProgressService) {
    // var tab = TabContainer.getCurrentTab();
    //   tab.setTitle('Dashboard')
    var _this = this;
    //LxProgressService.circular.show('#5fa2db', '#globalProgress');
    $scope._ = _;
    $scope.root = $rootScope;
    _this.openLink = function(link) {
            $location.url(link)
        }
        /*    edisonAPI.stats.day().then(function(resp) {

                _this.statsTelepro = resp.data;

            })*/



    _this.addTask = function() {
        edisonAPI.task.add(_this.newTask).then(reloadTask);
    }

    _this.check = function(task) {
        edisonAPI.task.check(task._id).then(reloadTask)
    }


    var reloadTask = function() {
        _this.newTask = {
            to: user.login,
            from: user.login
        }
        edisonAPI.task.listRelevant({
            user: $rootScope.displayUser
        }).then(function(resp) {
            _this.taskList = resp.data;
        })
    }

    reloadTask();

    edisonAPI.intervention.dashboardStats({
        user: user.login
    }).then(function(resp) {
        _this.tableParams = new NgTableParams({
            count: resp.data.weekStats.length,
            sorting: {
                total: 'desc'
            }
        }, {
            counts: [],
            data: resp.data.weekStats
        });
        _this.result = resp.data
    })
}

angular.module('edison').controller('DashboardController', DashboardController);


 angular.module('edison').directive('edisonMap', ['$window', 'Map', 'mapAutocomplete', 'Address',
     function($window, Map, mapAutocomplete, Address) {
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
                 firstAddress: "="
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

 angular.module('edison').directive('creditCard', ['config', function(config) {
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
        console.log('=========>', err)
        if (!err)
            TabContainer.close(tab);
    }

    _this.saveDevis = function(options) {
        if (!devis.produits ||  !devis.produits.length) {
            return LxNotificationService.error("Veuillez ajouter au moins 1 produit");
        }
        devis.save(function(err, resp) {
            if (err) {
                return false;
            } else if (options.envoi) {
                console.log(resp);
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
        if (oldVal !== newVal) {
            devis.tva = (newVal == 'Soc.' ? 20 : 10);
        }
    })

    var updateTmpDevis = _.after(5, _.throttle(function() {
        edisonAPI.devis.saveTmp(devis);
    }, 2000))

    if (!devis.id) {
        $scope.$watch(function() {
            return devis;
        }, updateTmpDevis, true)
    }

}
angular.module('edison').controller('DevisController', DevisCtrl);

 angular.module('edison').directive('infoCategorie', ['config', function(config) {
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

 angular.module('edison').directive('infoClient', ['config', 'edisonAPI', function(config, edisonAPI) {
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

angular.module('edison').directive('infoCompta', ['config', 'Paiement',
    function(config, Paiement) {
        "use strict";
        return {
            restrict: 'E',
            templateUrl: '/Templates/info-compta.html',
            scope: {
                data: "=",
                displayReglement: '@',
                dialog: '@',
                displayPaiement: '@',
            },
            link: function(scope, element, attrs) {
                scope.config = config
                var reglement = scope.data.compta.reglement
                var paiement = scope.data.compta.paiement
                if (!scope.data.tva) {
                    scope.data.tva = (scope.data.client.civilite == 'Soc.' ? 20 : 10)
                }
                if (!paiement.mode) {
                    paiement.mode = _.get(scope.data.sst, 'document.rib.file') ? "VIR" : "CHQ"
                }

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
                    if (!_.isEqual(newValues, oldValues)) {
                        scope.compta = new Paiement(scope.data)
                        paiement.montant = scope.compta.montantTotal
                    }
                }
                scope.$watch('data.fourniture', change, true)
                scope.$watchGroup(['data.compta.reglement.montant',
                    'data.compta.paiement.base',
                    'data.compta.paiement.tva',
                    'data.compta.paiement.pourcentage.deplacement',
                    'data.compta.paiement.pourcentage.fourniture',
                    'data.compta.paiement.pourcentage.maindOeuvre',
                ], change, true);
                if (!scope.data.compta.paiement.base && scope.data.compta.reglement.montant) {
                    scope.data.compta.paiement.base = scope.data.compta.reglement.montant;
                    scope.compta = new Paiement(scope.data)
                    paiement.montant = scope.compta.montantTotal
                }
            },

        }

    }
]);

 angular.module('edison').directive('produits',
     function(config, productsList, dialog, openPost, LxNotificationService, Intervention, Devis, Combo, edisonAPI) {
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

     }
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

    var updateTitle = _.throttle(function() {
        tab.setTitle(_.template("{{typeof tmpDate == 'undefined' ? id : tmpDate}} - {{client.civilite}} {{client.nom}} ({{client.address.cp}})")(intervention));
    }, 1000)

    $scope.$watch('vm.data.client', updateTitle, true)
    updateTitle();
    _this.description = new Description(intervention);
    _this.signalement = new Signalement(intervention)
    _this.contextMenu = new ContextMenu('intervention')
    _this.contextMenu.setData(intervention);
    _this.rowRightClick = function($event, inter) {
        if ($('.listeInterventions').has($event.target).length == 0) {
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

    $scope.hideSignalements = function() {
        $scope.showSignalement = false;
    }

    $scope.calculPrixFinal = function() {
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
                var files = intervention.files
                intervention = new Intervention(resp);
                intervention.files = files
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
    }, 2000))

    if (!intervention.id) {
        $scope.$watch(function() {
            return intervention;
        }, updateTmpIntervention, true)
    }

}

angular.module('edison').controller('InterventionController', InterventionCtrl);

var LpaController = function(openPost, socket, ContextMenu, $location, $window, TabContainer, edisonAPI, $rootScope, LxProgressService, LxNotificationService, FlushList) {
    "use strict";
    var _this = this
    var tab = TabContainer.getCurrentTab();
    tab.setTitle('LPA')
    _this.search = $location.search();
    _this.contextMenu = new ContextMenu('intervention')

    _this.loadData = function(prevChecked) {
        LxProgressService.circular.show('#5fa2db', '#globalProgress');
        edisonAPI.compta.lpa($location.search()).then(function(result) {
            _.each(result.data, function(sst) {
                sst.list = new FlushList(sst.list, prevChecked);
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
                if ($rootScope.lpa[i].list.getList()[0].mode === 'CHQ') {
                    $rootScope.lpa[i].numeroCheque = ++base
                }
            };
        }
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
        console.log(lpa);
        LxProgressService.circular.show('#5fa2db', '#globalProgress');
        edisonAPI.compta.flush(lpa).then(function(resp) {
            edisonAPI.compta.flushMail(lpa).then(function(resp) {
                console.log('yayaya')
            });
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
        console.log('swad')
        var ids = _($rootScope.lpa).map(_.partial(_.pick, _, 'numeroCheque', 'id')).value();
        LxProgressService.circular.show('#5fa2db', '#globalProgress');
        edisonAPI.file.uploadScans(file, {
                ids: ids,
                date: _this.search.d
            }).then(function(resp) {
                LxProgressService.circular.hide()
                console.log('==>', resp);
            })
            //_.each($rootScope.lpa, function(sst) {
            /*    _.each(sst.list.getList(), function(e) {
                    if (e.checked) {
                        rtn.push(e.id);
                    }
                })
            })
            _this.loadData(rtn)*/
    }

    _this.print = function(type) {
        openPost('/api/intervention/print', {
            type: type,
            data: $rootScope.lpa
        });
    }
}


angular.module('edison').controller('LpaController', LpaController);

angular.module('edison').controller('ListeArtisanController', _.noop);

angular.module('edison').controller('ListeDevisController', _.noop);

angular.module('edison').controller('ListeInterventionController', _.noop);

var SearchController = function(edisonAPI, TabContainer, $routeParams, $location, LxProgressService) {
    var tab = TabContainer.getCurrentTab();
    tab.setTitle('Search')
    var _this = this;
    LxProgressService.circular.show('#5fa2db', '#globalProgress');
    edisonAPI.searchText($routeParams.query).success(function(resp) {
        LxProgressService.circular.hide()
        _this.data = resp
    })
    _this.openLink = function(link) {
        $location.url(link)
    }
}

angular.module('edison').controller('SearchController', SearchController);

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
            console.log($scope.totalYear);
            /*
                        $('#chartContainer3 > *').remove()
                        var svg2 = dimple.newSvg("#chartContainer3", 100, 400);
                        var myChart2 = new dimple.chart(svg2, resp.data);
                        myChart.setBounds(60, 30, 50, 300)
            */
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
angular.module('edison').controller('StatsController', StatsController);

var CommissionsController = function(DateSelect, TabContainer, $routeParams, edisonAPI, $rootScope, $scope, $location, LxProgressService, socket) {
    "use strict";
    var _this = this;
    _this.tab = TabContainer.getCurrentTab();
    _this.tab.setTitle('Coms.');

    _this.xcalc = function(e) {
        return e.categorie === 'VT' ? 1.5 : _.round(e.compta.reglement.montant * 0.01, 2);
    }

    _this.getTotal = function() {
        var rtn = {
            com: 0,
            all: 0
        }
        _.each($scope.list, function(x) {
            rtn.com += _this.xcalc(x);
            console.log(x.id, x.compta.reglement.montant)
            rtn.all += x.compta.reglement.montant || 0
        })
        return rtn;
    }

    var dateSelect = new DateSelect;

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
    console.log('test')
    $scope.$watch("selectedUser", function(curr, prev) {
        $location.search('l', curr);
        actualise();
        /* */
    })
    $scope.$watch("selectedDate", function(curr, prev) {
        $location.search('m', curr.m);
        $location.search('y', curr.y);
        actualise();
        /* $location.search('m', curr.m);
         $location.search('y', curr.y);
         edisonAPI.intervention.commissions(curr).then(function(resp) {
             console.log('==>', resp.data)
         })*/
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
angular.module('edison').controller('CommissionsController', CommissionsController);

var editCombos = function(TabContainer, edisonAPI, $rootScope, $scope, $location, LxNotificationService, socket) {
    "use strict";
    var _this = this;
    _this.tab = TabContainer.getCurrentTab();
    _this.tab.setTitle('Combos');


    var base = {
        "id": 29300,
        "categorie": "EL",
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
angular.module('edison').controller('editProducts', editProducts);

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
        console.log('uyau')
        $rootScope.globalProgressCounter = data + '%';
    })

    socket.on('telephoneMatch', function(data) {
        $rootScope.globalProgressCounter = ""
        LxProgressService.circular.hide()
        $scope.resp = data
    })

}
angular.module('edison').controller('telephoneMatch', telephoneMatch);

//# sourceMappingURL=all.js.map
