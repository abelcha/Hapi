angular.module('edison', ['browserify', 'ui.slimscroll', 'ngMaterial', 'lumx', 'ngAnimate', 'xeditable', 'btford.socket-io', 'ngFileUpload', 'pickadate', 'ngRoute', 'ngResource', 'ngTable', 'ngMap'])
    .config(function($mdThemingProvider) {
        "use strict";
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('blue-grey');
    });


angular.module('edison').controller('MainController', function($timeout, $q, DataProvider, tabContainer, $scope, socket, config, $rootScope, $location, edisonAPI, taskList, $window) {
    "use strict";


    edisonAPI.getUser().success(function(result) {
        $rootScope.user = result;
        reloadStats();
    });
    $scope.sidebarHeight = $("#main-menu-bg").height();
    $scope.config = config;
    $rootScope.loadingData = true;
    $rootScope.$on('$routeChangeSuccess', function() {
        $window.scrollTo(0, 0);
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
        edisonAPI.intervention.getStats()
            .success(function(result) {
                $scope.userStats = _.find(result, function(e) {
                    return e.login === $scope.user.login;
                });
                $rootScope.interventionsStats = result;
            });
    };

    $rootScope.openTab = function(tab) {
        console.log('-->', tab);
    }

    $rootScope.closeContextMenu = function() {
        $rootScope.$broadcast('closeContextMenu');
    }

    var interventionDataProvider = new DataProvider('intervention')
    socket.on('interventionListChange', reloadStats);

    var devisDataProvider = new DataProvider('devis')
    socket.on('devisListChange', reloadStats);

    var artisanDataProvider = new DataProvider('artisan')
    socket.on('artisanListChange', reloadStats);



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
                    tva: 10,
                    remarque: 'PAS DE REMARQUES',
                    modeReglement: 'CH',
                    client: {
                        civilite: 'M.'
                    },
                    facture: {

                    },
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
    if ($route.current.params.i) {
        return edisonAPI.intervention.get($route.current.params.i, {
            transform: true
        });
    } else if (id.length > 10) {
        return $q(function(resolve) {
            resolve({
                data: {
                    isDevis: true,
                    produits: [],
                    tva: 10,
                    client: {
                        civilite: 'M.'
                    },
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
    $http.get("/Directives/artisan-recap.html", {
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

angular.module('edison').directive('artisanRecap', function(edisonAPI, config, $q, $timeout) {
    "use strict";

    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/Directives/artisan-recap.html',
        scope: {
            id: "=",
        },
        link: function(scope, element, attrs) {
            var reload = function() {
              //  $("#chartContainer").empty()
                    edisonAPI.artisan.extendedStats(scope.id).success(function(resp) {
                        var svg;
                        if (!svg)
                            svg = dimple.newSvg("#chartContainer", 1000, 200);
                        var myChart = new dimple.chart(svg, resp);
                        myChart.setBounds(60, 30, 700, 120)
                        var x = myChart.addCategoryAxis("x", "date");
                        x.addOrderRule("dt");
                        myChart.addMeasureAxis("y", "total");
                        myChart.addSeries("status", dimple.plot.bar);
                        myChart.addLegend(60, 10, 680, 20, "right");
                        myChart.assignColor("ANN", "#F44336");
                        myChart.assignColor("ENC", "#FDD835");
                        myChart.assignColor("VRF", "#4CAF50");
                        myChart.draw();
                    })
            }
            reload()
            scope.$watch('id', function(current, prev) {
                if (current && prev !== current)
                    reload();
            })
        }
    };
});

 angular.module('edison').directive('box', [function() {
     "use strict";
     return {
         replace: true,
         restrict: 'E',
         template: '',
         scope: {

         },
         link:function() {

         }
     }
 }]);

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
            scope._model = scope.model || "intervention"

            scope.expendedStyle = {
                height: 0,
                overflow: 'hidden'
            };
            scope.expendedReady = false;
            scope.data = {};
            scope.config = config
            $timeout(function() {
                $("#expended").velocity({
                    height: 205,
                }, 200);
            }, 50)

            if (scope._model === "intervention") {
                edisonAPI.intervention.get(scope.row.id, {
                    extended: true
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
                    edisonAPI.devis.get(scope.row.id),
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

            scope.getStaticMap = function(address) {
                var q = "?width=500&height=200&precision=0&zoom=11&origin=" + address.lt + ", " + address.lg;
                return "/api/mapGetStatic" + q;
            }

        }
    };
});

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
/*angular.module('edison').directive('materialSelect', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="select-style text-field">' +
      '<select ng-model>' +
      '<option disabled>{{defaultName}}</option>' +
      '</select>' +
      '</div>'
  }
});
*/
angular.module('edison').directive('ngRightClick', function($parse) {
    "use strict";
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {
                    $event: event
                });
            });
        });
    };
});

angular.module('edison').directive('select', function($interpolate) {
    return {
        restrict: 'E',
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl) {
            var defaultOptionTemplate;
            if (attrs.defaultOption) {
                scope.defaultOptionText = attrs.defaultOption || 'Select...';
                defaultOptionTemplate = '<option value="" disabled selected style="display: none;">{{defaultOptionText}}</option>';
                elem.prepend($interpolate(defaultOptionTemplate)(scope));
            }
        }
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
             textWhite:'@',
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
             scope._color = (scope.color || 'success')
             scope._model = scope.model || 'intervention';
             var filtersFactory = new FiltersFactory(scope._model);
             scope.exFltr = filtersFactory.getFilterByName(scope.fltr);
             scope.total = findTotal();
             scope._url = scope.exFltr.url.length ? "/" + scope.exFltr.url : scope.exFltr.url;
             scope._login = scope.login ? ("#" + scope.login) : '';
             scope._hashModel = scope.hashModel ? ("?hashModel=" + scope.hashModel) : '';
             scope.fullUrl = scope.url || ('/' + scope._model + '/list' + scope._url + scope._hashModel + scope._login)
         }
     };
 }]);

 angular.module('edison').directive('simpleLink', ['FiltersFactory', '$rootScope', function(FiltersFactory, $rootScope) {
     "use strict";
     return {
         restrict: 'AE',
         replace: true,
         template: '<li>' +
             '      <a href="{{url}}" >' +
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
         replace: true,
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
    return function(date, no) {
        return moment((date + 1370000000) * 1000).fromNow(no).toString()
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
        } else if (!strictMode){
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

    return function(dataContainer, inputs, strictMode) {
        var rtn = [];
        console.log(inputs)
        console.time('fltr')
        inputs = _.mapValues(inputs, clean);
        _.each(dataContainer, function(data) {
            if (data.id) {
                var psh = true;
                _.each(inputs, function(input, k) {
                    if (input && input.length > 0) {
                        if (k.charAt(0) === '_') {
                            if (!compareCustom(k, data, input)) {
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
        console.timeEnd('fltr')

        return rtn;
    }
}]);

angular.module('edison').filter('total', function() {
    "use strict";
    return function(obj) {
        if (obj && obj.total) {
        	return obj.total;
        }
        return "0";
    };
});

angular.module('edison').filter('montant', function() {
    "use strict";
    return function(obj) {
        if (obj && obj.montant) {
        	return (obj.montant > 999 ? (obj.montant / 1000).toFixed(0) + 'k' : obj.montant.toFixed(0)) + '€';
        }
        return "0€";
    };
});



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
        compta: [{
            name: 'Régulation',
            id: 'REGULATION',
            fn: function() {
                console.log('REGULATION')
            }
        }]
    }
    return Signalement;
});

angular.module('edison').factory('TabContainer', function($location, $window, $q, edisonAPI) {
    "use strict";


    var Tab = function(url, title, hash) {

        this.url = url;
        this.hash = hash;
        this.title = title;
    }

    Tab.setTitle = function(title) {
        this.title = title;
    }


    var TabContainer = function() {
        if (!(this instanceof TabContainer)) {
            return new TabContainer();
        }
    }

    TabContainer.prototype.init = function() {
        this.add($location.path(), "...", $location.path(), $location.hash())
    }

    TabContainer.prototype.selectedIndex = 0;
    
    TabContainer.prototype.add = function(url, title, hash) {
        var tab = new Tab(url, title, hash);
        this.tabs.push(tab);
        console.log(tab)
    }


    TabContainer.prototype.tabs = [];

    TabContainer.prototype.getTab = function(tab) {
        _.each(this.tabs, function(e) {
            console.log(e, tab)
        })
    }
    TabContainer.prototype.getCurrentTab = function() {
        return this.getTab(this.tab[this.selectedIndex])
    }

    TabContainer.prototype.open = function(url, hash) {
        var _this = this;
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
        compta: {
            lpa: function() {
                return $http({
                    method: 'GET',
                    cache: false,
                    url: '/api/intervention/lpa',
                }).success(function(result) {
                    return result;
                });
            },
            flush: function(data) {
                return $http.post('/api/intervention/flush', data);
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
                return $http.post("/api/devis", params);
            },
            envoi: function(id, options) {
                return $http.post("/api/devis/envoi", options);
            },
            annulation: function(id, causeAnnulation) {
                return $http.post("/api/devis/" + id + "/annulation", {
                    causeAnnulation: causeAnnulation
                });
            },
            list: function(options) {
                return $http({
                    method: 'GET',
                    cache: options && options.cache,
                    url: '/api/devis/list'
                })
            },
        },
        intervention: {
            getStats: function() {
                return $http({
                    method: 'GET',
                    cache: false,
                    url: '/api/intervention/stats'
                })
            },
            demarcher: function(id) {
                return $http({
                    method: 'POST',
                    url: '/api/intervention/' + id + '/demarcher'
                })
            },
            list: function(options) {
                return $http({
                    method: 'GET',
                    cache: options && options.cache,
                    url: '/api/intervention/list'
                })
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
                return $http.post("/api/intervention", params);
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
            annulation: function(id, causeAnnulation) {
                return $http.post("/api/intervention/" + id + "/annulation", {
                    causeAnnulation: causeAnnulation
                });
            },
            envoi: function(id, options) {
                return $http.post("/api/intervention/" + id + "/envoi", options);
            },
            envoiFacture: function(id, options) {
                return $http.post("/api/intervention/" + id + "/envoiFacture", options);
            }
        },
        artisan: {
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
            reaStats: function() {
                return $http.get('/api/artisan/reaStats')
            },
            extendedStats: function(id) {
                return $http.get('/api/artisan/' + id + "/extendedStats")
            },
            save: function(params) {
                return $http.post("/api/artisan", params);
            },
            list: function(options) {
                return $http({
                    method: 'GET',
                    cache: options && options.cache,
                    url: '/api/artisan/list'
                }).success(function(result) {
                    return result;
                })
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
            setAbsence: function(id, options) {
                return $http({
                    method: 'POST',
                    url: '/api/artisan/' + id + '/absence',
                    params: options
                })
            },
        },
        task: {
            get: function(params) {
                return $http({
                    method: 'GET',
                    url: '/api/taks/get',
                    params: params
                })
            },
            add: function(params) {
                return $http({
                    method: 'GET',
                    url: '/api/task/add',
                    params: params
                })
            },
            check: function(params) {
                return $http({
                    method: 'GET',
                    url: '/api/task/add',
                    params: params
                })
            },
        },
        file: {
            upload: function(file, options) {
                return Upload.upload({
                    url: '/api/document/upload',
                    fields: options,
                    file: file
                })
            },
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
                return $http.post("/api/sms", params)
            },

        },
        getDistance: function(options) {
            return $http({
                method: 'GET',
                cache: true,
                url: '/api/mapGetDistance',
                params: options
            }).success(function(result) {
                return result;
            });
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
    .factory('Artisan', ['$window', '$rootScope', '$location', 'LxNotificationService', 'LxProgressService', 'dialog', 'edisonAPI', 'textTemplate',
        function($window, $rootScope, $location, LxNotificationService, LxProgressService, dialog, edisonAPI, textTemplate) {
            "use strict";
            var Artisan = function(data) {
                if (!(this instanceof Artisan)) {
                    return new Artisan(data);
                }
                for (var k in data) {
                    this[k] = data[k];
                }
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
                dialog.facturierDeviseur(this, function(facturier, deviseur) {
                    console.log(facturier, deviseur)
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
                console.log('save')
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
                    title: "Texte envoi devis",
                    text: textTemplate.mail.artisan.envoiContrat.bind(_this)($rootScope.user),
                    width: "60%",
                    height: "80%"
                }, function(options) {
                    edisonAPI.artisan.envoiContrat(_this.id, {
                        text: options.text,
                        signe: options.signe
                    }).success(function(resp) {
                        LxNotificationService.success("le contrat a été envoyé");
                        if (typeof cb === 'function')
                            cb(null, resp);
                    }).catch(function(err) {
                        LxNotificationService.error("L'envoi du contrat à échoué\n");
                        if (typeof cb === 'function')
                            cb(err);
                    });
                });
            }

            Artisan.prototype.ouvrirFiche = function() {
                $location.url("/artisan/" + this.id);
            }
            return Artisan;
        }
    ]);

angular.module('edison').factory('Compta', function() {
    "use strict";

    var Compta = function(inter) {
        var _this = this
        if (!(this instanceof Compta))
            return new Compta(inter)
        if (inter) {
            _this.inter = function() {
                return inter;
            }
            var reglement = inter.compta.reglement
            var paiement = inter.compta.paiement
            if (!_.get(inter, 'compta.paiement.pourcentage.deplacement')) {
                paiement.pourcentage = _.clone(inter.artisan.pourcentage)
            }

            reglement.montant = _.get(inter, 'compta.reglement.montant', 0);
            reglement.avoir = _.get(inter, 'compta.reglement.avoir', 0);
            _this.pourcentage = inter.compta.paiement.pourcentage;
            _this.fourniture = this.getFourniture(inter);
            _this.prixHT = inter.compta.paiement.base
            _this.montantHT = _this.prixHT - _this.fourniture.total
            _this.baseDeplacement = _this.prixDeplacement()
            _this.remunerationDeplacement = _this.applyCoeff(_this.baseDeplacement, _this.pourcentage.deplacement);
            _this.baseMaindOeuvre = _this.prixMaindOeuvre();
            _this.remunerationMaindOeuvre = _this.applyCoeff(_this.baseMaindOeuvre, _this.pourcentage.maindOeuvre);
            _this.venteFourniture = _this.prixHT - (_this.baseDeplacement + _this.baseMaindOeuvre);
            _this.coutFourniture = _this.fourniture.total;
            _this.baseMargeFourniture = _this.venteFourniture - _this.coutFourniture;
            _this.remunerationMargeFourniture = _this.applyCoeff(_this.baseMargeFourniture, _this.pourcentage.fourniture);
            _this.remboursementFourniture = _this.fourniture.artisan;
            _this.montantTotal = _this.remunerationDeplacement + _this.remunerationMargeFourniture + _this.remunerationMaindOeuvre + _this.remboursementFourniture;
        }
    }


    Compta.prototype = {
        inter: {},
        applyCoeff: function(number, Coeff) {
            return _.round(number * (Coeff / 100), 2);
        },
        prixDeplacement: function() {
            if (this.montantHT <= 65) {
                return this.montantHT;
            } else {
                return 65;
            }
        },
        prixMaindOeuvre: function() {
            if (this.montantHT <= 65) {
                return 0;
            } else if (this.montant <= 65) {
                return this.montantHT - 65;
            } else {
                return 65;
            }
        },
        getFourniture: function(inter) {
            var _this = this;
            var fourniture = {
                artisan: 0,
                edison: 0,
                total: 0
            };
            _.each(inter.fourniture, function(e) {
                fourniture[e.fournisseur === 'ARTISAN' ? 'artisan' : 'edison'] += _.round(e.pu * e.quantite, 2);
                fourniture.total += _.round(e.pu * e.quantite, 2);
            })
            return fourniture;
        },
        getMontantTTC: function() {
            return this.applyCoeff(this.inter().compta.reglement.montant, 100 + this.inter().tva)
        }
    }
    return Compta
});

angular.module('edison').factory('ContextMenu', function($rootScope, $location, edisonAPI, $window, dialog, Devis, Intervention, Artisan, contextMenuData) {
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
        this.list.forEach(function(e) {
            e.hidden = e.hide && e.hide(_this.data);
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

angular.module('edison').factory('DataProvider', ['edisonAPI', 'socket', '$rootScope', 'config', function(edisonAPI, socket, $rootScope, config) {
    "use strict";
    var DataProvider = function(model, hashModel) {
        var _this = this;
        this.model = model;
        this.hashModel = hashModel || 't';
            socket.on(model + 'ListChange', function(newData) {
                if (_this.getData()) {
                    _this.updateData(newData);
                }
            });
    }

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
        console.timeEnd("interFilter")

    }

    DataProvider.prototype.updateData = function(newRow) {
        var _this = this;
        if (this.getData()) {
            var index = _.findIndex(this.getData(), function(e) {
                return e.id === newRow.id
            });
            if (index === -1) {
                _this.getData().unshift(newRow)
            } else {
                _this.getData()[index] = newRow;
            }
            $rootScope.$broadcast(_this.model + 'ListChange', newRow);
        }
    }

    DataProvider.prototype.getData = function() {
        return this.data[this.model];
    }


    DataProvider.prototype.isInit = function() {
        return this.model && this.data && this.data[this.model];
    }
    return DataProvider;

}]);

angular.module('edison')
    .factory('Devis', ['$window', '$rootScope', '$location', 'LxNotificationService', 'dialog', 'edisonAPI', 'textTemplate',
        function($window, $rootScope, $location, LxNotificationService, dialog, edisonAPI, textTemplate) {
            "use strict";
            var Devis = function(data) {
                if (!(this instanceof Devis)) {
                    return new Devis(data);
                }
                for (var k in data) {
                    this[k] = data[k];
                }
            }
            Devis.prototype.typeOf = function() {
                return 'Devis';
            }
            Devis.prototype.save = function(cb) {
                var _this = this;

                edisonAPI.devis.save(_this)
                    .then(function(resp) {
                        var validationMessage = _.template("Les données du devis {{id}} ont à été enregistré")(resp.data);
                        LxNotificationService.success(validationMessage);
                        if (typeof cb === 'function')
                            cb(null, resp.data)
                    }).catch(function(error) {
                        LxNotificationService.error(error.data);
                        if (typeof cb === 'function')
                            cb(error.data)
                    });
            };
            Devis.prototype.envoi = function(cb) {
                console.log("envoiDevis")
                var _this = this;
                dialog.getText({
                    title: "Texte envoi devis",
                    text: textTemplate.mail.devis.envoi.bind(_this)($rootScope.user),
                    width: "60%",
                    height: "80%"
                }, function(text) {
                    edisonAPI.devis.envoi(_this.id, {
                        text: text,
                        data: _this,
                    }).success(function(resp) {
                        var validationMessage = _.template("le devis {{id}} à été envoyé")(_this);
                        LxNotificationService.success(validationMessage);
                        if (typeof cb === 'function')
                            cb(null, resp);
                    }).catch(function(err) {
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
                dialog.getCauseAnnulation(function(causeAnnulation) {
                    edisonAPI.devis.annulation(_this.id, causeAnnulation)
                        .then(function(resp) {
                            var validationMessage = _.template("Le devis {{id}} est annulé")(resp.data)
                            LxNotificationService.success(validationMessage);
                            if (typeof cb === 'function')
                                cb(null, resp.data)
                        });
                });
            };
            Devis.prototype.ouvrirFiche = function() {
                $location.url("/devis/" + this.id);
            }
            Devis.prototype.transfert = function() {
                $location.url("/intervention?devis=" + this.id);
            }
            return Devis;
        }
    ]);

angular.module('edison').factory('dialog', ['$mdDialog', 'edisonAPI', 'config', function($mdDialog, edisonAPI, config) {
    "use strict";

    return {
        verification: function(inter, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog, config) {
                    $scope.data = inter
                    $scope.config = config;
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        $scope.inter = inter;
                        if (!cancel) {
                            cb(inter);
                        }
                    }
                },
                templateUrl: '/DialogTemplates/verification.html',
            });
        },
        facturierDeviseur: function(artisan, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog, config) {
                    $scope.sst = artisan
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
        envoiFacture: function(inter, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    var template = "{{client.civilite}} {{client.nom}}, \n" +
                        "Vous trouverez ci-joint la facture de notre intervention\n" +
                        "Cordialement\n" +
                        "Edison Services"
                    $scope.text = _.template(template)(inter);
                    $scope.date = new Date();
                    $scope.acquitte = false;
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (!cancel) {
                            cb($scope.text, $scope.acquitte, $scope.date);
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
        addProd: function( cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    $scope.answer = function(resp, text) {
                        $mdDialog.hide();
                        return cb({
                             quantite: $scope.quantite,
                             ref: $scope.ref,
                             title: $scope.title,
                             desc: $scope.title,
                             pu: $scope.pu
                         });
                    }
                },
                templateUrl: '/DialogTemplates/getProd.html',
            });
        },
        getCauseAnnulation: function(cb) {
            $mdDialog.show({
                controller: function($scope, config) {
                    $scope.causeAnnulation = config.causeAnnulation;
                    $scope.answer = function(resp) {
                        if (!$scope.ca && resp)
                            return false;
                        $mdDialog.hide();
                        if (resp)
                            return cb(resp);
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
        getFileAndText: function(data, text, files, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {

                    $scope.xfiles = _.clone(files ||  []);
                    $scope.smsText = text;
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (cancel === false) {
                            console.log('-->', $scope.addedFile)
                            return cb($scope.smsText, $scope.addedFile);
                        }
                    }
                },
                templateUrl: '/DialogTemplates/fileAndText.html',
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
        absence: function(cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    $scope.absenceTime = 'TODAY';
                    $scope.absence = [{
                        title: 'Toute la journée',
                        value: 'TODAY'
                    }, {
                        title: '1 Heure',
                        value: '1'
                    }, {
                        title: '2 Heure',
                        value: '2'
                    }, {
                        title: '3 Heure',
                        value: '3'
                    }, {
                        title: '4 Heure',
                        value: '4'
                    }]
                    $scope.hide = function() {
                        $mdDialog.hide();
                    };
                    $scope.cancel = function() {
                        $mdDialog.cancel();
                    };
                    $scope.answer = function(answer) {
                        $mdDialog.hide(answer);
                        var hours = 0;
                        if (answer === "TODAY") {
                            hours = 23 - (new Date()).getHours() + 1;
                        } else {
                            hours = parseInt(answer);
                        }
                        var start = new Date();
                        var end = new Date();
                        end.setHours(end.getHours() + hours)
                        cb(start, end);

                    };
                },
                templateUrl: '/DialogTemplates/absence.html',
            });
        }
    }

}]);

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
    .factory('Intervention', function($location, $window, LxNotificationService, LxProgressService, dialog, edisonAPI, Devis, $rootScope, textTemplate) {
        "use strict";

        var Intervention = function(data) {
            if (!(this instanceof Intervention)) {
                return new Intervention(data);
            }
            for (var k in data) {
                this[k] = data[k];
            }
        };


        Intervention.prototype.typeOf = function() {
            return 'Intervention';
        };
        Intervention.prototype.envoiDevis = function(cb) {
            Devis().envoi.bind(this)(cb)
        };

        Intervention.prototype.demarcher = function(cb) {
            edisonAPI.intervention.demarcher(this.id).success(function() {
                LxNotificationService.success("Vous demarchez l'intervention");
            }, function() {
                LxNotificationService.error("Une erreur est survenu");
            })
        };

        Intervention.prototype.envoiFacture = function(cb) {
            var _this = this;
            dialog.envoiFacture(_this, function(text, acquitte, date) {
                edisonAPI.intervention.envoiFacture(_this.id, {
                    text: text,
                    acquitte: acquitte,
                    date: date,
                    data: _this,
                }).success(function(resp) {
                    var validationMessage = _.template("La facture de l'intervention {{id}} à été envoyé")(_this)
                    LxNotificationService.success(validationMessage);
                    if (typeof cb === 'function')
                        cb(null, resp);
                }).catch(function(err) {
                    var validationMessage = _.template("L'envoi de la facture {{id}} à échoué")(_this)
                    LxNotificationService.error(validationMessage);
                    if (typeof cb === 'function')
                        cb(err);
                })

            })
        };
        Intervention.prototype.ouvrirFiche = function() {
            $location.url('/intervention/' + this.id)
        }
        Intervention.prototype.ouvrirRecapSST = function() {
            $location.url(['/artisan', this.artisan.id, 'recap'].join('/'))
        }
        Intervention.prototype.smsArtisan = function(cb) {
            var _this = this;
            var text = textTemplate.sms.intervention.demande.bind(_this)($rootScope.user)
            dialog.getFileAndText(_this, text, [], function(text) {
                edisonAPI.sms.send({
                    link: _this.artisan.id,
                    origin: _this.id || _this.tmpID,
                    text: text,
                    to: $rootScope.user.portable || "0633138868"
                }).success(function(resp) {
                    var validationMessage = _.template("Un sms a été envoyé à M. {{artisan.representant.nom}}")(_this)
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
        Intervention.prototype.absenceArtisan = function(cb) {
            var _this = this;
            dialog.absence(function(start, end) {
                edisonAPI.artisan.setAbsence(_this.artisan.id, {
                    start: start,
                    end: end
                }).success(cb)
            })
        }
        Intervention.prototype.save = function(cb) {
            var _this = this;
            edisonAPI.intervention.save(_this)
                .then(function(resp) {
                    var validationMessage = _.template("Les données de l'intervention {{id}} ont à été enregistré")(resp.data)
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
            var defaultText = textTemplate.sms.intervention.envoi.bind(_this)($rootScope.user);
            dialog.getFileAndText(_this, defaultText, _this.files, function(text, file) {
                edisonAPI.intervention.envoi(_this.id, {
                    sms: text,
                    file: file
                }).then(function(resp) {
                    console.log('ok')
                    var validationMessage = _.template("L'intervention est envoyé")
                    LxNotificationService.success(validationMessage);
                    if (typeof cb === 'function')
                        cb(null, resp.data)

                }, function(error) {
                    console.log('error')
                    LxNotificationService.error(error.data);
                    if (typeof cb === 'function')
                        cb(error.data);
                });
            })
        };

        Intervention.prototype.annulation = function(cb) {
            var _this = this;
            dialog.getCauseAnnulation(function(causeAnnulation) {
                edisonAPI.intervention.annulation(_this.id, causeAnnulation)
                    .then(function(resp) {
                        var validationMessage = _.template("L'intervention {{id}} est annulé")(resp.data)
                        LxNotificationService.success(validationMessage);
                        if (typeof cb === 'function')
                            cb(null, resp.data)
                    });
            });
        };


        Intervention.prototype.envoiFactureVerif = function(cb) {
            var _this = this;
            if (!this.produits.length)
                return LxNotificationService.error("Veuillez renseigner les produits");
            _this.envoiFacture(function() {
                _this.verificationSimple(cb)
            })
        }

        Intervention.prototype.verificationSimple = function(cb) {
            var _this = this;
            edisonAPI.intervention.verification(_this.id)
                .then(function(resp) {
                    var validationMessage = _.template("L'intervention {{id}} est vérifié")(resp.data)
                    LxNotificationService.success(validationMessage);
                    if (typeof cb === 'function') {
                        cb(null, resp.data);
                    }
                }, function(error) {
                    LxNotificationService.error(error.data);
                })
        }

        Intervention.prototype.verification = function(cb) {
            var _this = this;
            if (!_this.reglementSurPlace) {
                return $location.url('/intervention/' + this.id + "#facture")
            }
            dialog.verification(_this, function(inter) {
                Intervention(inter).save(function(err, resp) {
                    if (!err) {
                        return Intervention(resp).verificationSimple(cb);
                    }
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

angular.module('edison').factory('productsList', ['dialog', 'openPost', function(dialog, openPost) {
    "use strict";
    var ps = [{
        quantite: 1,
        ref: "EDI001",
        title: "Main d'œuvre",
        desc: "Main d'œuvre",
        pu: 65
    }, {
        quantite: 1,
        ref: "EDI002",
        title: "Déplacement",
        desc: "Déplacement",
        pu: 65
    }, {
        quantite: 1,
        ref: "EDI005",
        title: "Forfait Intervention",
        desc: "Forfait INSTALLATION / MAIN D\'OUVRAGEEssais et mise en service inclus",
        pu: 130
    }, {
        quantite: 1,
        ref: "FRN001",
        title: "Fourniture",
        desc: "",
        pu: 0
    }, {
        quantite: 1,
        ref: "BAL001",
        title: "ballon mural vertical",
        desc: "Chauffe-eau électrique mural vertical\nRésistance blindée anti-calcaire\nPuissance : 1800 W\nType de courant : monophasé\nV = 200L\n\nRACCORDEMENT ÉLECTRIQUE MONO 220V (HEURE CREUSE / PLEINE)\n\nMARQUE ATLANTIC CERTIFIE\n\nGarantie constructeur : Jusqu'à 5 ans\nGarante pièce d'origine : Jusqu'à 2 ans\n\nAssistance et dépannage constructeur inclus jusqu'à 2 ans\n\nESSAIS ET MISE EN SERVICE INCLUS",
        pu: 432.1

    }, {
        quantite: 1,
        ref: "BAL002",
        title: "groupe de securité",
        desc: "Groupe de sécurité anti-calcaire 3/4.Robinet à sphère.\nClapet démontable\nRaccordement eau froide et chauffe eau : 20/27.Echappement 26/34.7 bars.\nEntonnoir siphon",
        pu: 69.97
    }, {
        quantite: 1,
        ref: "BAL003",
        title: "Raccordement hydraulique",
        desc: "Raccordement hydraulique\nFlexibles inox de 50 cm F20/27 ø 16 mm",
        pu: 16.33
    }, {
        quantite: 1,
        ref: "BAL004",
        title: "Trépied Ballon",
        desc: "Trépied pour chauffe-eau électrique.\nAccessoire obligatoire pour l'installation d'un chauffe-eau électrique de 100, 150, ou 200 litres sur un mur non porteur",
        pu: 93.21
    }, {
        quantite: 1,
        ref: 'VIT001',
        title: "Remplacement Vitrage",
        desc: "Remplacement d'un vitrage suite a un bris de glace \nporte fenêtre\ndouble vitrage\nvitrage clair\n2000 x 1000\nchâssis pvc / alu / bois\n\ncommande spéciale sur mesure\nadaptation et fixation sur place\n\nremplacement a l'identique",
        pu: 297.13
    }, {
        quantite: 1,
        ref: "VIT002",
        title: "Pack Vitrerie",
        desc: "depose/livraison + mise a la decharge + taxe energie",
        pu: 75
    }, {
        quantite: 1,
        ref: "SANI001",
        title: "Pack Sanibroyeur",
        desc: "PACK COMPLET SANIBROYEUR PRO\nRefoulement horizontal < 100m\nRefoulement vertical > 5m\nRégime moteur > 2800 tr/min\nNorme européenne \nEN 12050-3\nRaccordement hydraulique\nRaccordement électrique\nGarantie constructeur",
        pu: 672.21
    }, {
        quantite: 1,
        ref: "CAM001",
        title: "Camion D'assainisement",
        desc: "DÉGORGEMENT CANALISATION TRÈS HAUTE PRESSION PAR CAMION D’ASSAINISSEMENT : \nCurage et nettoyage complet de la canalisation jusqu\'à 10M",
        pu: 696.25
    }, {
        quantite: 1,
        ref: "AUT001",
        title: "Autre",
        desc: "",
        pu: 0
    }];

    var Produit = function(produits) {
        this.produits = produits;
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
            this.produits.push(prod);
        },
        search: function(text) {
            var rtn = []
            for (var i = 0; i < ps.length; ++i) {
                if (text === ps[i].title)
                    return [];
                var needle = _.deburr(text).toLowerCase()

                var haystack = _.deburr(ps[i].title).toLowerCase();
                var haystack2 = _.deburr(ps[i].ref).toLowerCase();
                var haystack3 = _.deburr(ps[i].desc).toLowerCase();
                if (_.includes(haystack, needle) ||
                    _.includes(haystack2, needle) ||
                    _.includes(haystack3, needle)) {
                    var x = _.clone(ps[i])
                    x.random = _.random();
                    rtn.push(x)
                }
            }
            return rtn
        },
        flagship:function() {
            return _.max(this.produits, 'pu');
        },
        total: function() {
            var total = _.round(_.sum(this.produits, 'pu'), 2)
            return total;
        },
        previsualise: function(data) {
            openPost('/api/intervention/facturePreview', {
                data: JSON.stringify(data),
                html: true
            })
        }
    }

    return Produit;


}]);

angular.module('edison').factory('socket', function(socketFactory) {
    "use strict";
    return socketFactory();
});

angular.module('edison').factory('tabContainer', ['$location', '$window', '$q', 'edisonAPI', function($location, $window, $q, edisonAPI) {
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

    TabContainer.prototype.close= function(tab) {
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
        if (this.noClose) {
            tab = this._tabs[0]
        }
        else if ((_.startsWith(url, '/search')  || _.startsWith(url, '/artisan/contact')) && this.getTabSimple(url)) {
            tab = this.getTabSimple(url);
        }
        else if (this.noClose || this.isOpen(url, options)) {
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
    return $window.user;
});

 angular.module('edison').directive('infoFacture', ['config', 'mapAutocomplete',
     function(config, mapAutocomplete) {
         "use strict";
         return {
             restrict: 'E',
             templateUrl: '/Templates/info-facture.html',
             scope: {
                 data: "=",
             },
             link: function(scope, element, attrs) {
                 var model = scope.data;
                 scope.config = config
                 scope.autocomplete = mapAutocomplete;
                 scope.changeAddressFacture = function(place) {
                     mapAutocomplete.getPlaceAddress(place).then(function(addr) {
                         scope.data.facture = scope.data.facture ||  {}
                         scope.data.facture.address = addr;
                     });
                 }
                 scope.changeGrandCompte = function() {
                     // var x = _.clone(config.compteFacturation[scope.data.facture.compte])
                     scope.data.facture = _.find(config.compteFacturation, {
                         short_name: scope.data.facture.compte
                     });
                     scope.data.facture.payeur = "GRN";
                 }
             },
         }

     }
 ]);

angular.module('edison').directive('infoFourniture', ['config', 'fourniture',
    function(config, fourniture) {
        "use strict";
        return {
            restrict: 'E',
            templateUrl: '/Templates/info-fourniture.html',
            scope: {
                data: "=",
                display: "="
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

angular.module('edison').directive('listeIntervention', function(tabContainer, FiltersFactory, ContextMenu, LxProgressService, edisonAPI, DataProvider, $routeParams, $location, $rootScope, $filter, config, ngTableParams) {
    "use strict";
    return {
        restrict: 'E',
        templateUrl: '/Templates/listeIntervention.html',
        scope: {
            id: "=",
            //display: "="
        },
        link: function(scope, element, attrs) {
            var currentFilter;
            var currentHash = undefined;
            var dataProvider = new DataProvider('intervention');
            var filtersFactory = new FiltersFactory('intervention')

            var title = currentFilter ? currentFilter.long_name : "Interventions";
            scope.recap = $routeParams.sstID ? parseInt($routeParams.sstID) : false;


            dataProvider.init(function(err, resp) {
                scope.config = config;

                scope.customFilter = function(inter) {
                    return inter.ai === scope.id;
                }

                dataProvider.applyFilter(currentFilter, undefined, scope.customFilter);
                var tableParameters = {
                    page: 1, // show first page
                    total: dataProvider.filteredData.length,
                    filter: {},
                    sorting: {
                        id: 'desc'
                    },
                    count: 100 // count per page
                };
                var tableSettings = {
                    //groupBy:$rootScope.config.selectedGrouping,
                    total: dataProvider.filteredData,
                    getData: function($defer, params) {
                        var data = dataProvider.filteredData;
                        if (!_.isEqual(params.filter(), scope.currentFilter))
                            data = $filter('tableFilter')(data, params.filter());
                        scope.currentFilter = _.clone(params.filter());
                        params.total(data.length);
                        data = $filter('orderBy')(data, params.orderBy());
                        $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    },
                    filterDelay: 100
                }
                scope.tableParams = new ngTableParams(tableParameters, tableSettings);
            })
            var lastChange = 0;
            $rootScope.$on('interventionListChange', function(event, newData) {
                if (scope.tab.fullUrl === tabContainer.getCurrentTab().fullUrl && newData._date > lastChange) {
                    dataProvider.applyFilter(currentFilter, scope.tab.hash, scope.customFilter);
                    scope.tableParams.reload();
                }
                lastChange = newData._date;
            })

            scope.contextMenu = new ContextMenu('intervention')


            scope.rowRightClick = function($event, inter) {
                edisonAPI.intervention.get(inter.id, {
                        extend: true
                    })
                    .then(function(resp) {
                        scope.contextMenu.setData(resp.data);
                        scope.contextMenu.setPosition($event.pageX - 40, $event.pageY)
                        scope.contextMenu.open();
                    })
            }
            scope.rowClick = function($event, inter) {
                if (scope.contextMenu.active)
                    return scope.contextMenu.close();
                if ($event.metaKey || $event.ctrlKey) {
                    tabContainer.addTab('/intervention/' + inter.id, {
                        title: ('#' + inter.id),
                        setFocus: false,
                        allowDuplicates: false
                    });
                } else {
                    if (scope.expendedRow === inter.id) {
                        scope.expendedRow = undefined;
                    } else {
                        scope.expendedRow = inter.id
                    }
                }
            }
            scope.$watch('id', function(current, prev) {
                if (current && current !== prev) {
                    scope.customFilter = function(inter) {
                        return inter.ai === current;
                    }
                    dataProvider.applyFilter(currentFilter, undefined, scope.customFilter);
                    if (scope.tableParams)
                        scope.tableParams.reload();

                }
            })

        }
    }

});

var archiveReglementController = function(edisonAPI, tabContainer, $routeParams, $location, LxProgressService) {

    var tab = tabContainer.getCurrentTab();
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

var archivesPaiementController = function(edisonAPI, tabContainer, $routeParams, $location, LxProgressService) {
    var _this = this;
    var tab = tabContainer.getCurrentTab();
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

var ArtisanCtrl = function($rootScope, $location, $routeParams, ContextMenu, LxNotificationService, tabContainer, config, dialog, artisanPrm, Artisan) {
    "use strict";
    var _this = this;
    _this.config = config;
    _this.dialog = dialog;
    _this.moment = moment;
    _this.contextMenu = new ContextMenu('artisan')

    var tab = tabContainer.getCurrentTab();
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
                tabContainer.remove(tab);
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
                return false;
            } else if (options.contrat) {
                artisan.envoiContrat.bind(resp)(tabContainer.close);
            } else {
                tabContainer.close(tab);
            }
        })
    }
    _this.onFileUpload = function(file, name) {
        artisan.upload(file, name);
    }

    _this.clickTrigger = function(elem) {
        angular.element("#file_" + elem + ">input").trigger('click');
    }
    _this.rightClick = function($event) {
        console.log('rightClick')
        _this.contextMenu.setPosition($event.pageX, $event.pageY)
        _this.contextMenu.setData(artisan);
        _this.contextMenu.open();
    }

    _this.leftClick = function($event, inter) {
        console.log('leftClick')

        if (_this.contextMenu.active)
            return _this.contextMenu.close();
    }

    _this.addComment = function() {
        artisan.comments.push({
            login: $rootScope.user.login,
            text: _this.commentText,
            date: new Date()
        })
        _this.commentText = "";
    }
}
angular.module('edison').controller('ArtisanController', ArtisanCtrl);

var AvoirsController = function(tabContainer, edisonAPI, $rootScope, LxProgressService, LxNotificationService, FlushList) {
    "use strict";
    var _this = this
    var tab = tabContainer.getCurrentTab();
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

var ContactArtisanController = function($scope, $timeout, tabContainer, LxProgressService, FiltersFactory, ContextMenu, edisonAPI, DataProvider, $routeParams, $location, $q, $rootScope, $filter, config, ngTableParams) {
    "use strict";
    var _this = this;
    _this.loadPanel = function(id) {
        edisonAPI.artisan.get(id)
            .then(function(resp) {
                _this.sst = resp.data;
                _this.tab.setTitle('@' + _this.sst.nomSociete.slice(0, 10));

            })
    }

    var dataProvider = new DataProvider('artisan');
    var filtersFactory = new FiltersFactory('artisan')
    var currentFilter;
    if ($routeParams.fltr) {
        currentFilter = filtersFactory.getFilterByUrl($routeParams.fltr)
    }
    var currentHash = $location.hash();
    var title = currentFilter ? currentFilter.long_name : "Artisan";

    LxProgressService.circular.show('#5fa2db', '#globalProgress');
    dataProvider.init(function(err, resp) {

        _this.tab = tabContainer.getCurrentTab();
        _this.tab.setTitle(title, currentHash);
        _this.tab.hash = currentHash;
        _this.config = config;
        _this.moment = moment;
        if (!dataProvider.isInit()) {
            dataProvider.setData(resp);
        }

        dataProvider.applyFilter(currentFilter, _this.tab.hash);
        _this.tableFilter = "";
        _this.tableLimit = 20;
        $rootScope.expendedRow = $routeParams.id || 45
        _this.recap = $location.url().includes('recap') ? $routeParams.id : undefined
            // if (_this.recap) {
            //     $scope.selectedIndex = 1;
            // }
        _this.loadPanel($rootScope.expendedRow)
        _this.tableData = dataProvider.filteredData;
        LxProgressService.circular.hide();
    });
    _this.getStaticMap = function(address) {
        if (_this.sst && this.sst.address)
            return "/api/mapGetStatic?width=500&height=400&precision=0&zoom=6&origin=" + _this.sst.address.lt + ", " + _this.sst.address.lg;
    }

    _this.reloadData = function() {
        _this.tableData = $filter('contactFilter')(dataProvider.filteredData, _this.tableFilter);
    }

    _this.loadMore = function() {
        _this.tableLimit += 10;
    }

    /*
        $rootScope.$watch('tableilter', _this.reloadData);
    */
    $rootScope.$on('artisanListChange', function() {
        if (_this.tab.fullUrl === tabContainer.getCurrentTab().fullUrl) {
            dataProvider.applyFilter(currentFilter, _this.tab.hash);
        }
    })

    _this.contextMenu = new ContextMenu('artisan')

    _this.rowRightClick = function($event, inter) {
        console.log('contactclick')
        _this.contextMenu.setPosition($event.pageX, $event.pageY)
        edisonAPI.artisan.get(inter.id)
            .then(function(resp) {
                _this.contextMenu.setData(resp.data);
                _this.contextMenu.open();
            })
    }

    _this.rowClick = function($event, inter) {
        if (_this.contextMenu.active)
            return _this.contextMenu.close();
        if ($event.metaKey || $event.ctrlKey) {
            tabContainer.addTab('/artisan/' + inter.id, {
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
                $location.search('id', inter.id);
            }
        }
    }


    $scope.$watchCollection('[selectedIndex, expendedRow]', function(current, prev) {
        if (prev[1] && $scope.selectedIndex == 4) {
            $scope.compteTiers = undefined
            edisonAPI.artisan.getCompteTiers($rootScope.expendedRow).success(function(resp) {
                $scope.compteTiers = resp;
            })
        }
    })
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

var DashboardController = function(edisonAPI, tabContainer, $routeParams, $location, LxProgressService) {
    var tab = tabContainer.getCurrentTab();
    tab.setTitle('Dashboard')
    var _this = this;
    //LxProgressService.circular.show('#5fa2db', '#globalProgress');

    _this.openLink = function(link) {
        $location.url(link)
    }
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
                 addressChange: '&',
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

                 if (_.get(scope, 'client.address')) {
                     scope.client.address = Address(scope.client.address, true); //true -> copyContructor
                     scope.map.setCenter(scope.client.address);
                 } else {
                     scope.map.setCenter(Address({
                         lat: 46.3333,
                         lng: 2.6
                     }));
                 }

                 scope.changeAddress = function(place) {
                     scope.firstAddress = true;
                     mapAutocomplete.getPlaceAddress(place).then(function(addr) {
                         scope.map.setZoom(12);
                         scope.map.setCenter(addr)
                         scope.client.address = addr;
                         scope.addressChange({
                             test: 123
                         });
                     });
                 }

                 scope.getStaticMap = function() {
                     if (!_.get(scope, 'data.artisan.address.lt'))
                         return 0
                     var q = "?width=" + Math.round($window.outerWidth * (scope.height === "small" ? 0.8 : 1.2));
                     if (scope.client && scope.client.address && scope.client.address.latLng)
                         q += ("&origin=" + scope.client.address.latLng);
                     if (scope.data.artisan && scope.data.artisan.id)
                         q += ("&destination=" + scope.data.artisan.address.lt + "," + scope.data.artisan.address.lg);
                     return "/api/mapGetStatic" + q;
                 }
                 scope.showClientMarker = function() {
                     return scope.client.address && scope.client.address.latLng;
                 }
                 scope.clickOnArtisanMarker = function(event, sst) {
                     scope.data.sst = sst.id;
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

var DevisCtrl = function($scope, $rootScope, $location, $routeParams, LxNotificationService, tabContainer, config, dialog, devisPrm, Devis) {
    "use strict";
    var _this = this;
    _this.config = config;
    _this.dialog = dialog;
    _this.moment = moment;
    var tab = tabContainer.getCurrentTab();
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
                tabContainer.remove(tab);
                return 0;
            }
        }
    } else {
        var devis = tab.data;
    }
    _this.data = tab.data;
    
    var closeTab = function() {
        tabContainer.close(tab);
    }

    _this.saveDevis = function(options) {
        devis.save(function(err, resp) {
            if (err) {
                return false;
            } else if (options.envoi) {
                devis.envoi.bind(resp)(closeTab);
            } else if (options.annulation) {
                devis.annulation(closeTab);
            } else if (options.transfert) {
                devis.transfert()
            } else {
                closeTab();
            }
        })
    }
    $scope.$watch(function() {
        return devis.client.civilite
    }, function(newVal, oldVal) {
        if (oldVal !== newVal)
            devis.tva = 20;
    })

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
            },
            link: function(scope, element, attrs) {
                scope.config = config
                var reglement = scope.data.compta.reglement
                var paiement = scope.data.compta.paiement
                if (!scope.data.tva) {
                    scope.data.tva = (scope.data.client.civilite == 'Soc.' ? 20 : 10)
                }
                if (!paiement.mode) {
                    console.log('-->', scope.data.artisan)
                    paiement.mode = _.get(scope.data.artisan, 'document.rib.file') ? "VIR" : "CHQ"
                }
                console.log('==<', paiement.mode)
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

                scope.$watchGroup(['data.compta.reglement.montant',
                    'data.compta.paiement.base',
                    'data.compta.paiement.tva',
                    'data.compta.paiement.pourcentage.deplacement',
                    'data.compta.paiement.pourcentage.fourniture',
                    'data.compta.paiement.pourcentage.maindOeuvre'
                ], function(newValues, oldValues, scope) {
                    if (!_.isEqual(newValues, oldValues)) {
                        scope.compta = new Paiement(scope.data)
                        paiement.montant = scope.compta.montantTotal
                    }
                }, true);
            },
        }

    }
]);

var InterventionCtrl = function(Description, Signalement, ContextMenu, $window, $timeout, $rootScope, $scope, $location, $routeParams, dialog, fourniture, LxNotificationService, LxProgressService, tabContainer, edisonAPI, Address, $q, mapAutocomplete, productsList, config, interventionPrm, Intervention, Map) {
    "use strict";

    var _this = this;
    _this.config = config;
    _this.dialog = dialog;
    _this.autocomplete = mapAutocomplete;
    var tab = tabContainer.getCurrentTab();
    if (!tab.data) {
        var intervention = new Intervention(interventionPrm.data)

        intervention.sst = intervention.artisan ? intervention.artisan.id : 0;
        tab.setData(intervention);
        if ($routeParams.id.length > 12) {
            _this.isNew = true;
            intervention.tmpID = $routeParams.id;
            tab.setTitle('#' + moment((new Date(parseInt(intervention.tmpID))).toISOString()).format("HH:mm").toString());
        } else {
            tab.setTitle('#' + $routeParams.id);
            if (!intervention) {
                LxNotificationService.error("Impossible de trouver les informations !");
                $location.url("/dashboard");
                tabContainer.remove(tab);
                return 0;
            }
        }
    } else {
        var intervention = tab.data;
    }
    if ($routeParams.d) {
        intervention.devisOrigine = parseInt($routeParams.d)
    }
    _this.data = tab.data;
    _this.description = new Description(intervention);
    _this.signalement = new Signalement(intervention)
    _this.contextMenu = new ContextMenu('intervention')
    _this.contextMenu.setData(intervention);
    _this.rowRightClick = function($event, inter) {
        _this.contextMenu.setPosition($event.pageX, $event.pageY)
        _this.contextMenu.open();
    }


    $scope.changeArtisan = function(sav) {
        sav.artisan = _.find(_this.artisans, function(e) {
            return e.id === sav.sst;
        })
    }

    $scope.calculPrixFinal = function() {
        intervention.prixFinal = 0;
        _.each(intervention.produits, function(e)  {
            intervention.prixFinal += (e.pu * e.quantite)
        })
        intervention.prixFinal = Math.round(intervention.prixFinal * 100) / 100;
    }

    $scope.addSAV = function() {
        dialog.getText({
            title: "Description du SAV",
            text: ""
        }, function(resp) {
            if (!intervention.sav)
                intervention.sav = [];
            intervention.sav.push({
                date: new Date(),
                login: $rootScope.user.login,
                description: resp,
                regle: false
            })
        })
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


    $scope.recapArtisan = function(sst) {
        edisonAPI.artisan.lastInters(sst.id)
            .success(dialog.recap);
    }

    $scope.smsArtisan = function() {
        intervention.smsArtisan(function(err, resp) {
            if (!err)
                intervention.artisan.sms.unshift(resp)
        })
    }

    $scope.callArtisan = function() {
        intervention.callArtisan(function(err, resp) {
            if (!err)
                intervention.artisan.calls.unshift(resp)
        })
    }


    $scope.addProductSupp = function(prod) {
        $scope.produitsSupp.add(prod);
        $scope.searchProd = "";
    }


    $scope.addProduct = function(prod) {
        $scope.produits.add(prod);
        $scope.searchProd = "";
    }

    $scope.clickTrigger = function(elem) {
        angular.element(elem).trigger('click');
    }

    $scope.addComment = function() {
        intervention.comments.push({
            login: $rootScope.user.login,
            text: $scope.commentText,
            date: new Date()
        })
        $scope.commentText = "";
    }

    $scope.onFileUpload = function(file) {
        intervention.fileUpload(file, function(err, resp) {
            $scope.fileUploadText = "";
            $scope.loadFilesList();
        });
    }
    $scope.loadFilesList = function() {
        edisonAPI.intervention.getFiles(intervention.id || intervention.tmpID).then(function(result) {
            intervention.files = result.data;
        }, console.log)
    }
    $scope.loadFilesList();

    var closeTab = function() {
        tabContainer.close(tab);
    }

    $scope.saveInter = function(options) {
        intervention.save(function(err, resp) {
            if (err) {
                return false;
            } else if (options && options.envoiFacture && options.verification) {
                intervention.envoiFactureVerif(function() {
                    closeTab()
                })
            } else if (options && options.envoi === true) {
                resp.files = intervention.files;
                intervention.envoi.bind(resp)(closeTab);
            } else if (options && options.annulation) {
                intervention.annulation(closeTab);
            } else if (options && options.verification) {
                intervention.verificationSimple(closeTab);
            } else {
                closeTab()
            }
        })

    }

    $scope.clickOnArtisanMarker = function(event, sst) {
        intervention.sst = sst.id;
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
        return intervention.client.civilite
    }, function(newVal, oldVal) {
        if (oldVal !== newVal) {
            intervention.tva = (newVal == 'Soc.' ? 20 : 10);
        }
    })

    $scope.$watch(function() {
        return intervention.sst;
    }, function(id_sst) {
        if (id_sst) {
            $q.all([
                edisonAPI.artisan.get(id_sst, {
                    cache: false
                }),
                edisonAPI.artisan.getStats(id_sst, {
                    cache: true
                }),
                edisonAPI.call.get(intervention.id || intervention.tmpID, id_sst),
                edisonAPI.sms.get(intervention.id || intervention.tmpID, id_sst)
            ]).then(function(result) {
                intervention.artisan = result[0].data;
                intervention.artisan.stats = result[1].data;
                intervention.artisan.calls = result[2].data;
                intervention.artisan.sms = result[3].data;
                if (result[0].data.address) {
                    edisonAPI.getDistance({
                            origin: result[0].data.address.lt + ", " + result[0].data.address.lg,
                            destination: intervention.client.address.lt + ", " + intervention.client.address.lg
                        })
                        .then(function(result) {
                            intervention.artisan.stats.direction = result.data;
                        })
                }
            });
        }
    })


    $scope.smoothTransition = function(value) {
        if (!$scope.displaySAV) {
            $scope.savStyle = {
                height: '0',
                overflow: 'hidden',
            }
            $scope.displaySAV = true
            $timeout(function() {
                $("#SAV").velocity({
                    height: $("#SAV>div").height(),
                }, 200, function() {
                    delete $scope.savStyle.height
                });
            }, 10)
        } else {
            $("#SAV").velocity({
                height: 0,
            }, 200, function() {
                $scope.displaySAV = false
            });
        }
    }

    $scope.sstAbsence = function(id) {
        if (id) {
            intervention.absenceArtisan(_this.searchArtisans);
        }
    }
}

angular.module('edison').controller('InterventionController', InterventionCtrl);

 angular.module('edison').directive('produits',
     function(config, productsList, dialog) {
         "use strict";
         return {
             restrict: 'E',
             templateUrl: '/Templates/produits.html',
             scope: {
                 data: "=",
                 tva: '=',
                 display: '@',
                 model: "@"
             },
             link: function(scope, element, attrs) {
                 var model = scope.data;
                 scope.config = config
                 model.produits = model.produits || [];
                 scope.config = config;
                 scope.produits = new productsList(model.produits);

                 if (!scope.data.reglementSurPlace) {
                     scope.display = true;
                 }

                 scope.createProd = function() {
                     dialog.addProd(function(resp) {
                         model.produits.push(resp)
                     });
                 }

                 scope.envoiFacture = function() {
                     model.envoiFacture(function(err, res) {
                         if (!err)
                             model.date.envoiFacture = new Date();
                     })
                 }


                 scope.envoiDevis = function() {
                     model.envoiDevis(function(err, res) {
                         if (!err)
                             model.date.envoiFacture = new Date();
                     })
                 }
             },
         }

     }
 );

var LpaController = function(openPost, $window, tabContainer, edisonAPI, $rootScope, LxProgressService, LxNotificationService, FlushList) {
    "use strict";
    var _this = this
    var tab = tabContainer.getCurrentTab();
    tab.setTitle('LPA')
    _this.loadData = function(prevChecked) {
        LxProgressService.circular.show('#5fa2db', '#globalProgress');
        edisonAPI.compta.lpa().then(function(result) {
            _.each(result.data, function(sst) {
                sst.list = new FlushList(sst.list, prevChecked);
                _this.reloadList(sst)
            })
            $rootScope.lpa = result.data
            LxProgressService.circular.hide()
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
                $rootScope.lpa[i].numeroCheque = ++base
            };
        }
    }
    _this.flush = function() {
        var rtn = [];
        _.each($rootScope.lpa, function(sst) {
            _.each(sst.list.getList(), function(e) {
                if (e.checked) {
                    e.numeroCheque = sst.numeroCheque
                    rtn.push(e);
                }
            })
        })
        edisonAPI.compta.flush(rtn).then(function(resp) {
            LxNotificationService.success(resp.data);
            _this.reloadLPA()
        }).catch(function(err) {
            LxNotificationService.error(err.data);
        })
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

    _this.print = function(type) {
        openPost('/api/intervention/print', {
            type: type,
            data: $rootScope.lpa
        });
    }
}


angular.module('edison').controller('LpaController', LpaController);

var ArtisanController = function($timeout, tabContainer, LxProgressService, FiltersFactory, ContextMenu, edisonAPI, DataProvider, $routeParams, $location, $q, $rootScope, $filter, config, ngTableParams) {
    "use strict";
    var _this = this;
    var dataProvider = new DataProvider('artisan');
    var filtersFactory = new FiltersFactory('artisan')
    var currentFilter;
    if ($routeParams.fltr) {
        currentFilter = filtersFactory.getFilterByUrl($routeParams.fltr)
    }
    var currentHash = $location.hash();
    var title = currentFilter ? currentFilter.long_name : "Artisan";

    LxProgressService.circular.show('#5fa2db', '#globalProgress');
    dataProvider.init(function(err, resp) {

        _this.tab = tabContainer.getCurrentTab();
        _this.tab.setTitle(title, currentHash);
        _this.tab.hash = currentHash;
        _this.config = config;
        _this.moment = moment;
        if (!dataProvider.isInit()) {
            dataProvider.setData(resp);
        }
        dataProvider.applyFilter(currentFilter, _this.tab.hash);
        var tableParameters = {
            page: 1, // show first page
            total: dataProvider.filteredData.length,
            filter: {},
            sorting: {
                id: 'desc'
            },
            count: 100 // count per page
        };
        var tableSettings = {
            //groupBy:$rootScope.config.selectedGrouping,
            total: dataProvider.filteredData,
            getData: function($defer, params) {
                var data = dataProvider.filteredData;
                data = $filter('tableFilter')(data, params.filter());
                params.total(data.length);
                data = $filter('orderBy')(data, params.orderBy());
                $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            },
            filterDelay: 100
        }
        _this.tableParams = new ngTableParams(tableParameters, tableSettings);
        LxProgressService.circular.hide();
    });

    $rootScope.$on('artisanListChange', function() {
        if (_this.tab.fullUrl === tabContainer.getCurrentTab().fullUrl) {
            dataProvider.applyFilter(currentFilter, _this.tab.hash);
            _this.tableParams.reload();
        }
    })

    _this.contextMenu = new ContextMenu('artisan')

    _this.rowRightClick = function($event, inter) {
        _this.contextMenu.setPosition($event.pageX, $event.pageY)
        edisonAPI.artisan.get(inter.id)
            .then(function(resp) {
                _this.contextMenu.setData(resp.data);
                _this.contextMenu.open();
            })
    }

    _this.rowClick = function($event, inter) {
        if (_this.contextMenu.active)
            return _this.contextMenu.close();
        if ($event.metaKey || $event.ctrlKey) {
            tabContainer.addTab('/artisan/' + inter.id, {
                title: ('#' + inter.id),
                setFocus: false,
                allowDuplicates: false
            });
        } else {
            if ($rootScope.expendedRow === inter.id) {
                $rootScope.expendedRow = undefined;
            } else {
                $rootScope.expendedRow = inter.id
            }
        }
    }

}
angular.module('edison').controller('ListeArtisanController', ArtisanController);

var DevisController = function($timeout, tabContainer, FiltersFactory, ContextMenu, edisonAPI, DataProvider, $routeParams, $location, $q, $rootScope, $filter, config, ngTableParams, LxProgressService) {
    "use strict";
    var _this = this;
    var dataProvider = new DataProvider('devis');
    var filtersFactory = new FiltersFactory('devis')
    var currentFilter;
    if ($routeParams.fltr) {
        currentFilter = filtersFactory.getFilterByUrl($routeParams.fltr)
    }
    var currentHash = $location.hash();
    var title = currentFilter ? currentFilter.long_name : "Devis";

    LxProgressService.circular.show('#5fa2db', '#globalProgress');
    dataProvider.init(function(err, resp) {
        _this.tab = tabContainer.getCurrentTab();
        _this.recap = $routeParams.artisanID;
        _this.tab.setTitle(title, currentHash);
        _this.tab.hash = currentHash;
        _this.config = config;
        _this.moment = moment;
        dataProvider.applyFilter(currentFilter, _this.tab.hash);
        var tableParameters = {
            page: 1, // show first page
            total: dataProvider.filteredData.length,
            filter: {},
            sorting: {
                id: 'desc'
            },
            count: 100 // count per page
        };
        var tableSettings = {
            //groupBy:$rootScope.config.selectedGrouping,
            total: dataProvider.filteredData,
            getData: function($defer, params) {
                var data = dataProvider.filteredData;
                data = $filter('tableFilter')(data, params.filter());
                params.total(data.length);
                data = $filter('orderBy')(data, params.orderBy());
                $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            },
            filterDelay: 100
        }
        _this.tableParams = new ngTableParams(tableParameters, tableSettings);
        LxProgressService.circular.hide();
    });

    $rootScope.$on('devisListChange', function() {
        if (_this.tab.fullUrl === tabContainer.getCurrentTab().fullUrl) {
            dataProvider.applyFilter(currentFilter, _this.tab.hash);
            _this.tableParams.reload();
        }
    })

    _this.contextMenu = new ContextMenu('devis')

    _this.rowRightClick = function($event, inter) {
        console.log('yay');
        
        _this.contextMenu.setPosition($event.pageX, $event.pageY)
        _this.contextMenu.setData(inter);
        _this.contextMenu.open();
        edisonAPI.devis.get(inter.id)
            .then(function(resp) {
                _this.contextMenu.setData(resp.data);
            })
    }

    _this.rowClick = function($event, inter) {
        if (_this.contextMenu.active)
            return _this.contextMenu.close();
        if ($event.metaKey || $event.ctrlKey) {
            tabContainer.addTab('/devis/' + inter.id, {
                title: ('#' + inter.id),
                setFocus: false,
                allowDuplicates: false
            });
        } else {
            if ($rootScope.expendedRow === inter.id) {
                $rootScope.expendedRow = undefined;
            } else {
                $rootScope.expendedRow = inter.id
            }
        }
    }

}
angular.module('edison').controller('ListeDevisController', DevisController);

angular.module('edison').controller('statsController', function($scope) {
    "use strict";
    $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
    $scope.data = [300, 500, 100];
});

var InterventionsController = function($q, tabContainer, FiltersFactory, ContextMenu, LxProgressService, edisonAPI, DataProvider, $routeParams, $location, $rootScope, $filter, config, ngTableParams) {
    "use strict";
    var _this = this;
    var currentFilter;
    var currentHash = $location.hash();
    var dataProvider = new DataProvider('intervention', $routeParams.hashModel);
    var filtersFactory = new FiltersFactory('intervention')
    if ($routeParams.fltr) {
        currentFilter = filtersFactory.getFilterByUrl($routeParams.fltr)
    }

    var title = currentFilter ? currentFilter.long_name : "Interventions";
    _this.recap = $routeParams.sstID ? parseInt($routeParams.sstID) : false;


    LxProgressService.circular.show('#5fa2db', '#globalProgress');
    dataProvider.init(function(err, resp) {
        _this.tab = tabContainer.getCurrentTab();
        _this.tab.setTitle(title, currentHash);
        _this.tab.hash = currentHash;
        _this.config = config;

        if (_this.recap) {
            _this.customFilter = function(inter) {
                return inter.ai === _this.recap;
            }
            _this.tab.setTitle('Recap ' + _this.recap)
        }

        dataProvider.applyFilter(currentFilter, _this.tab.hash, _this.customFilter);
        var tableParameters = {
            page: 1, // show first page
            total: dataProvider.filteredData.length,
            filter: {},
            sorting: {
                id: 'desc'
            },
            count: 100 // count per page
        };
        var tableSettings = {
            //groupBy:$rootScope.config.selectedGrouping,
            total: dataProvider.filteredData,
            getData: function($defer, params) {
                var data = dataProvider.filteredData;
                if (!_.isEqual(params.filter(), _this.currentFilter))
                    data = $filter('tableFilter')(data, params.filter());
                _this.currentFilter = _.clone(params.filter());
                params.total(data.length);
                data = $filter('orderBy')(data, params.orderBy());
                $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            },
            filterDelay: 100
        }
        _this.tableParams = new ngTableParams(tableParameters, tableSettings);
        LxProgressService.circular.hide();
    })
    var lastChange = 0;
    $rootScope.$on('interventionListChange', function(event, newData) {
        if (_this.tab.fullUrl === tabContainer.getCurrentTab().fullUrl && newData._date > lastChange) {
            dataProvider.applyFilter(currentFilter, _this.tab.hash, _this.customFilter);
            _this.tableParams.reload();
        }
        lastChange = newData._date;
    })

    _this.contextMenu = new ContextMenu('intervention')


    _this.rowRightClick = function($event, inter) {
        edisonAPI.intervention.get(inter.id, {
                extended: true
            })
            .then(function(resp) {
                _this.contextMenu.setData(resp.data);
                console.log(resp.data)
                _this.contextMenu.setPosition($event.pageX, $event.pageY)
                _this.contextMenu.open();
            })
    }

    _this.rowClick = function($event, inter) {
        if (_this.contextMenu.active)
            return _this.contextMenu.close();
        if ($event.metaKey || $event.ctrlKey) {
            tabContainer.addTab('/intervention/' + inter.id, {
                title: ('#' + inter.id),
                setFocus: false,
                allowDuplicates: false
            });
        } else {
            if ($rootScope.expendedRow === inter.id) {
                $rootScope.expendedRow = undefined;
            } else {
                $rootScope.expendedRow = inter.id
            }
        }
    }
}
angular.module('edison').controller('InterventionsController', InterventionsController);

var SearchController = function(edisonAPI, tabContainer, $routeParams, $location, LxProgressService) {
    var tab = tabContainer.getCurrentTab();
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

//# sourceMappingURL=all.js.map