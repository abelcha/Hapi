angular.module('edison', ['ngMaterial', 'lumx', 'ngAnimate', 'xeditable', 'ngDialog', 'btford.socket-io', 'ngFileUpload', 'pickadate', 'ngRoute', 'ngResource', 'ngTable', 'ngMap'])
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('blue-grey');
    });


angular.module('edison').controller('MainController', function(tabContainer, $scope, socket, config, dataProvider, $rootScope, $location, edisonAPI) {

    $scope.config = config;
    $rootScope.loadingData = true;
    $rootScope.$on('$routeChangeSuccess', function(e, curr, prev) {
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
    })
    $rootScope.options = {
        showMap: true
    };

    var initTabs = function(baseUrl) {
        $scope.tabsInitialized = true;
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
        if (!$scope.tabsInitialized) {
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


    $scope.linkClick = function($event, tab) {
        $event.preventDefault();
        $event.stopPropagation();
        console.log(tab);

    }

    $scope.tabIconClick = function($event, tab) {
        $event.preventDefault();
        $event.stopPropagation();
        if ($scope.tabs.remove(tab)) {
            $location.url($scope.tabs.getCurrentTab().url);
        }
    }
});

var getInterList = function(edisonAPI) {
    return edisonAPI.listInterventions({
        cache: true
    });
}
var getArtisanList = function(edisonAPI) {
    return edisonAPI.listArtisans({
        cache: true
    });
}

var getArtisan = function($route, $q, edisonAPI) {
    var id = $route.current.params.id;

    if (id.length > 10) {
        return $q(function(resolve, reject) {
            resolve({
                data: {
                    telephone:  {},
                    pourcentage: {},
                    add: {},
                    representant: {},
                }
            })
        });
    } else {
        return edisonAPI.getArtisan(id, {
            cache: true,
            extend: true
        });
    }
};

var getIntervention = function($route, $q, edisonAPI) {
    var id = $route.current.params.id;

    if (id.length > 10) {
        return $q(function(resolve, reject) {
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
            })
        });
    } else {
        return edisonAPI.getIntervention(id, {
            cache: true,
            extend: true
        });
    }
}


var whoAmI = function(edisonAPI) {
    return edisonAPI.getUser();
}

angular.module('edison').config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            resolve: {
                user: whoAmI,
                interventions: getInterList,
                artisans: getArtisanList
            },
            redirectTo: '/dashboard',
        })
        .when('/artisan/:id', {
            templateUrl: "Pages/Artisan/artisan.html",
            controller: "ArtisanController",
            resolve: {
                user: whoAmI,
                artisan: getArtisan,
                interventions: getInterList,
                artisans: getArtisanList
            }
        })
        .when('/interventions', {
            templateUrl: "Pages/ListeInterventions/listeInterventions.html",
            controller: "InterventionsController",
            resolve: {
                user: whoAmI,
                interventions: getInterList,
                artisans: getArtisanList
            }
        })
        .when('/interventions/:fltr', {
            templateUrl: "Pages/ListeInterventions/listeInterventions.html",
            controller: "InterventionsController",
            resolve: {
                user: whoAmI,
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
                user: whoAmI,
                interventions: getInterList,
                artisans: getArtisanList
            }
        })
        .when('/intervention/:id', {
            templateUrl: "Pages/Intervention/intervention.html",
            controller: "InterventionController",
            resolve: {
                user: whoAmI,
                interventions: getInterList,
                intervention: getIntervention,
                artisans: getArtisanList

            }
        })
        .when('/dashboard', {
            controller: 'DashboardController',
            templateUrl: "Pages/Dashboard/dashboard.html",
            resolve: {
                user: whoAmI,
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
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

angular.module('edison').directive('capitalize', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(input) {
                return input ? input.toUpperCase() : "";
            });
            element.css("text-transform","uppercase");
        }
    };
})


angular.module('edison').directive('ngEnter', function () {
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

angular.module('edison').directive('newlines', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(input) {
                return input ? input.replace(/\n/g, '<br/>') : "";
            });
        }
    };
})


angular.module('edison').directive('ngRightClick', function($parse) {
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

angular.module('edison').directive('sglclick', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
          var fn = $parse(attr['sglclick']);
          var delay = 300, clicks = 0, timer = null;
          element.on('click', function (event) {
            clicks++;  //count clicks
            if(clicks === 1) {
              timer = setTimeout(function() {
                scope.$apply(function () {
                    fn(scope, { $event: event });
                }); 
                clicks = 0;             //after action performed, reset counter
              }, delay);
              } else {
                clearTimeout(timer);    //prevent single-click action
                clicks = 0;             //after action performed, reset counter
              }
          });
        }
    };
}])
angular.module("edison").filter('addressPrettify', function() {
  return function(address) {
    return (address.n + " " +
      address.r + " " +
      address.cp + ", " +
      address.v + ", " +
      "France")
  };
});

angular.module("edison").filter('addressXY', function() {
  return function(address) {
    if (!address ||  !address.lt || !address.lg)
      return ("0, 0");
    return (address.lt + ", " + address.lg);
  };
});

angular.module("edison").filter('placeToXY', function() {
  return function(place) {
    var location = place.geometry.location;
    console.log(location)
    return location.lat() + ', ' + location.lng();
  }
});


angular.module("edison").filter('placeToAddress', function() {
  return function(place) {
    var address = function(place) {
      if (place.address_components) {
        var a = place.address_components;
        this.n = a[0] && a[0].short_name;
        this.r = a[1] && a[1].short_name;
        this.cp = a[6] && a[6].short_name;
        this.v = a[2] && a[2].short_name;
      }
      this.lt = place.geometry.location.lat();
      this.lg = place.geometry.location.lng();
    };
    address.prototype.isStreetAddress = (this.n && this.r);
    address.prototype.latLng = this.isStreetAddress ? (this.lt + ', ' + this.lg) : '0, 0'
    
    return new address(place);
  }
});


angular.module("edison").filter('artisanPractice', function(){
  return function(sst, categorie){
    return (sst.categories.indexOf(categorie) > 0);
  }
});
angular.module("edison").filter('categoryFilter', function(){
  return function(sst, categorie){
    return (sst.categories.indexOf(categorie) > 0);
  }
});
angular.module('edison').filter('crlf', function() {
    return function(text) {
        return text.split(/\n/g).join('<br>');
    };
});

angular.module("edison").filter('pricify', function() {
	return function(price) {
		if (price > 800)
			return 900;
		return (price - (price % 100)) + 200;
	}
});
function pad(number) {
  return number < 10 ? '0' + number : number
}
angular.module("edison").filter('relativeDate', function() {

  var minute = 60 * 1000;
  var hour = 60 * minute;
  var day = 24 * hour;
  var week = 7 * day;
  var month = 4 * week;
  var year = 12 * month;

  return function(date) {
    var now = Date.now();
    var date = new Date(date);
    var today = (new Date()).setHours(0, 0, 0, 0);

    var diff = now - date.getTime();
    if (diff < minute)
      return ("à l'instant");
    if (diff < hour)
      return Math.round(diff / minute) + ' minutes';
    if (diff < day) {
      if (date > today) {
        return 'Auj. ' + pad(date.getHours()) + "H" + pad(date.getMinutes());
      } else {
        return 'Hier ' + pad(date.getHours()) + "H" + pad(date.getMinutes());
      }
    }
    if (diff < week)
      return Math.round(diff / day) + ' jours';
    if (diff < month)
      return Math.round(diff / week) + ' semaines'
    if (diff < year)
      return Math.round(diff / week) + ' ans'
  }
});

angular.module('edison').filter('reverse', function() {
  return function(items) {
  	if (!items)
  		return [];
    return items.slice().reverse();
  };
});
function getValue(path, origin) {
  if (origin === void 0 || origin === null) origin = self ? self : this;
  if (typeof path !== 'string') path = '' + path;
  var c = '',
    pc, i = 0,
    n = path.length,
    name = '';
  if (n)
    while (i <= n)((c = path[i++]) == '.' || c == '[' || c == ']' || c == void 0) ? (name ? (origin = origin[name], name = '') : (pc == '.' || pc == '[' || pc == ']' && c == ']' ? i = n + 2 : void 0), pc = c) : name += c;
  if (i == n + 2) throw "Invalid path: " + path;
  return origin;
}

function cleanString(str) {
  str = str.toString().toLowerCase();
  str = str.replace(/[éèeê]/g, "e");
  str = str.replace(/[àâ]/g, "a");
  return str;
}

angular.module("edison").filter('tableFilter', function() {
  return function(data, fltr, c) {
    var rtn = [];
    for (x in fltr) {
      fltr[x] = cleanString(fltr[x]);
    }

    for (var k in data) {
      if (data[k].id) {
        var psh = true;
        for (x in fltr) {
          var str = data[k][x];
          if (!str || str.length === 0 || cleanString(str).indexOf(fltr[x]) < 0) {
            psh = false;
            break;
          }
        }
        if (psh)
          rtn.push(data[k]);
      }
    }
    return rtn;
  }
});

angular.module('edison').factory('Address', function() {


    var Address = function(place, copyContructor) {
        if (place.lat && place.lng) {
            this.lt = place.lat;
            this.lg = place.lng;
        } else if (copyContructor) {
            this.getAddressProprieties(place);
            this.streetAddress = true;
        } else if (this.isStreetAddress(place)) {
            this.getPlaceProprieties(place);
        } else if (this.isLocalityAddress(place)){
           this.getPlaceLocalityProprieties(place);
        }
        if (place.geometry) {
            this.lt = place.geometry.location.lat();
            this.lg = place.geometry.location.lng();
        }
        this.latLng = this.lt + ', ' + this.lg;
    };

    Address.prototype.getPlaceLocalityProprieties = function(place) {
      console.log(place);
        var a = place.address_components;
/*        this.n = a[0] && a[0].short_name;
        this.r = a[1] && a[1].short_name;*/
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
        this.n = address.n,
            this.r = address.r,
            this.cp = address.cp,
            this.v = address.v,
            this.lt = address.lt,
            this.lg = address.lg
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

    Address.prototype.toString = function()  {
        return (this.n + " " + this.r + " " + this.cp + ", " + this.v + ", France")
    }

    return (function(place, copyContructor) {
        return new Address(place, copyContructor);
    })
});

angular.module('edison').factory('edisonAPI', ['$http', '$location', 'dataProvider', 'Upload', function($http, $location, dataProvider, Upload) {

    return {
        listInterventions: function(options) {
            return $http({
                method: 'GET',
                cache: options && options.cache,
                url: '/api/intervention/list'
            }).success(function(result) {
                return result;
            })
        },
        listArtisans: function(options) {
            return $http({
                method: 'GET',
                cache: options && options.cache,
                url: '/api/artisan/list'
            }).success(function(result) {
                return result;
            })
        },
        getArtisans: function(cache) {
            return $http({
                method: 'GET',
                cache: cache,
                url: "/api/search/artisan/{}"
            }).success(function(result) {
                return result;
            });
        },
        getInterventions: function(cache) {
            return $http({
                method: 'GET',
                cache: cache,
                url: '/api/search/intervention/{"limit":1000, "sort":"-id"}'
            }).success(function(result) {
                dataProvider('interventions', result);
                return result;
            });
        },
        getArtisan: function(id, options) {
            return $http({
                method: 'GET',
                cache: options && options.cache,
                url: '/api/artisan/' + id,
                params: options ||  {}
            }).success(function(result) {
                return result;
            });
        },
        getIntervention: function(id, options) {
            return $http({
                method: 'GET',
                cache: false,
                url: '/api/intervention/' + id,
                params: options ||  {}
            }).success(function(result) {
                return result;
            });
        },
        getDistance: function(options) {
            return $http({
                method: 'GET',
                cache: true,
                url: '/api/map/direction',
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
        saveIntervention: function(params) {
            return $http({
                method: 'GET',
                url: "/api/intervention/save",
                params: params
            });
        },
        getNearestArtisans: function(address, categorie) {
            return $http({
                method: 'GET',
                url: "/api/artisan/rank",
                cache: false,
                params:  {
                    categorie: categorie,
                    lat: address.lt,
                    lng: address.lg,
                    limit: 50,
                    maxDistance: 50
                }
            });
        },
        getFilesList: function(id) {
            return $http({
                method: 'GET',
                url: "/api/intervention/" + id + "/getFiles"
            });
        },
        uploadFile: function(file, options) {
            return Upload.upload({
                url: '/api/document/upload',
                fields: options,
                file: file
            })
        },
        envoiInter: function(id, options) {
            return $http({
                method: 'GET',
                params: options,
                url: "/api/intervention/" + id + "/envoi"
            });
        },
        verificationInter: function(id, options) {
            return $http({
                method: 'GET',
                params: options,
                url: "/api/intervention/" + id + "/verification"
            });
        },
        annulationInter: function(id) {
            return $http({
                method: 'GET',
                url: "/api/intervention/" + id + "/annulation"
            });
        },
        getArtisanStats: function(id_sst) {
            return $http({
                method: 'GET',
                url: "/api/artisan/" + id_sst + "/stats"
            });
        },
        absenceArtisan: function(id, options) {
            return $http({
                method: 'GET',
                url: '/api/artisan/' + id + '/absence',
                params: options
            })
        },
        sendSMS: function(text, telephone) {
            return $http({
                method: 'GET',
                url: '/api/sms/send',
                params: {
                    to: telephone,
                    text: text
                }
            })
        },
        getCalls: function(id, sst) {
            return $http({
                method: 'GET',
                url: '/api/calls/get',
                params: {
                    link: sst,
                    origin: id
                }
            })
        },
        call: function(params) {
            return $http({
                method: 'GET',
                url: '/api/calls/add',
                params: params
            })
        },
        getUser: function(id_sst) {
            return $http({
                method: 'GET',
                url: "/api/whoAmI"
            });
        },
    }
}]);

angular.module('edison').factory('config', [function() {

    var config = {};

    config.filters = {
        all:  {
            short: 'all',
            long: 'Toutes les Inters',
            url: ''
        },
        envoye: {
            short: 'env',
            long: 'Envoyé',
            url: '/envoye'
        },
        aVerifier: {
            short: 'avr',
            long: 'A Vérifier',
            url: '/aVerifier'
        },
        clientaRelancer: {
            short: 'carl',
            long: 'Client A Relancer',
            url: '/clientaRelancer'
        },
        clientaRelancerUrgent: {
            short: 'Ucarl',
            long: 'Client A Relancer Urgent',
            url: '/clientaRelancerUrgent'
        },
        sstaRelancer: {
            short: 'sarl',
            long: 'SST A Relancer',
            url: '/sstaRelancer'
        },
        sstaRelancerUrgent: {
            short: 'Usarl',
            long: 'SST A Relancer Urgent',
            url: '/sstaRelancerUrgent'
        },
    }

    config.civilites = [{
        short_name: 'M.',
        long_name: 'Monsieur'
    }, {
        short_name: 'Mme.',
        long_name: 'Madame'
    }, {
        short_name: 'Soc.',
        long_name: 'Société'
    }];

    config.civilitesTab = ['M.', 'Mme.', 'Soc.'];

    config.categoriesKV = {
        EL: {
            s: 'EL',
            o: 2,
            n: 'Electricité',
            c: 'yellow  accent-4 black-text'
        },
        PL: {
            s: 'PL',
            o: 0,
            n: 'Plomberie',
            c: 'blue white-text'
        },
        CH: {
            s: 'CH',
            o: 1,
            n: 'Chauffage',
            c: 'red white-text'
        },
        CL: {
            s: 'CL',
            o: 6,
            n: 'Climatisation',
            c: 'teal white-text'
        },
        SR: {
            s: 'SR',
            o: 3,
            n: 'Serrurerie',
            c: 'brown white-text'
        },
        VT: {
            s: 'VT',
            o: 4,
            n: 'Vitrerie',
            c: 'green white-text'
        },
        AS: {
            s: 'AS',
            o: 5,
            n: 'Assainissement',
            c: 'orange white-text'
        },
        PT: {
            s: 'PT',
            o: 7,
            n: 'Peinture',
            c: 'deep-orange white-text'
        }
    }
    config.categoriesAKV = [];
    _.each(config.categoriesKV, function(e) {
        config.categoriesAKV[e.o] = e;
    })

    config.fournisseur = [{
        short_name: 'EDISON SERVICES',
        type: 'Fourniture Edison'
    }, {
        short_name: 'CEDEO',
        type: 'Fourniture Artisan'
    }, {
        short_name: 'BROSSETTE',
        type: 'Fourniture Artisan'
    }, {
        short_name: 'REXEL',
        type: 'Fourniture Artisan'
    }, {
        short_name: 'COAXEL',
        type: 'Fourniture Artisan'
    }, {
        short_name: 'YESSS ELECTRIQUE',
        type: 'Fourniture Artisan'
    }, {
        short_name: 'CGED',
        type: 'Fourniture Artisan'
    }, {
        short_name: 'COSTA',
        type: 'Fourniture Artisan'
    }, {
        short_name: 'FORUM DU BATIMENT',
        type: 'Fourniture Artisan'
    }]

    config.categories = [{
        short_name: 'EL',
        long_name: 'Electricité'
    }, {
        short_name: 'PL',
        long_name: 'Plomberie'
    }, {
        short_name: 'CH',
        long_name: 'Chauffage'
    }, {
        short_name: 'CL',
        long_name: 'Climatisation'
    }, {
        short_name: 'SR',
        long_name: 'Serrurerie'
    }, {
        short_name: 'VT',
        long_name: 'Vitrerie'
    }, {
        short_name: 'CR',
        long_name: 'Carrelage'
    }, {
        short_name: 'MN',
        long_name: 'Menuiserie'
    }, {
        short_name: 'MC',
        long_name: 'Maconnerie'
    }, {
        short_name: 'PT',
        long_name: 'Peinture'
    }];

    config.modeDeReglements = [{
        short_name: 'CB',
        long_name: 'Carte Bancaire'
    }, {
        short_name: 'CH',
        long_name: 'Chèque'
    }, {
        short_name: 'CA',
        long_name: 'Espèces'
    }];

    config.tva = [{
        long_name: 10,
    }, {
        long_name: 20
    }];
    config.typePayeur = [{
        short_name: 'SOC',
        long_name: 'Société'
    }, {
        short_name: 'PRO',
        long_name: 'Propriétaire'
    }, {
        short_name: 'LOC',
        long_name: 'Locataire'
    }, {
        short_name: 'IMO',
        long_name: 'Agence Immobilière'
    }, {
        short_name: 'CUR',
        long_name: 'Curatelle'
    }, {
        short_name: 'AUT',
        long_name: 'Autre'
    }];

    config.etatsKV = {
        ENV: {
            n: 'Envoyé',
            c: 'orange'
        },
        RGL: {
            n: 'Reglé',
            c: 'green'
        },
        PAY: {
            n: 'Payé',
            c: 'green accent-4'
        },
        ATT: {
            n: 'Reglement En Attente',
            c: 'purple'
        },
        ATTC: {
            n: 'RC En Attente',
            c: 'purple'
        },
        ATTS: {
            n: 'RS En Attente',
            c: 'pink darken-4'
        },
        APR: {
            n: 'A Progr.',
            c: 'blue'
        },
        AVR: {
            n: 'A Vérifier',
            c: 'brown darken-3'
        },
        ANN: {
            n: 'Annuler',
            c: 'red'
        },
        DEV: {
            n: 'Devis',
            c: 'light-blue'
        },
    }

    config.status = function(inter) {
        return {
            intervention: config.etatsKV[inter.status]
        }
    }
    return config;

}]);

angular.module('edison').factory('contextMenu', ['$location', 'edisonAPI', 'LxNotificationService', '$window', 'dialog', function($location, edisonAPI, LxNotificationService, $window, dialog) {

    var content = {};

    content.interventionList = [{
        hidden: false,
        title: 'Ouvrir Fiche',
        click: function(inter) {
            $location.url('/intervention/' + inter.id)
        }
    }, {
        hidden: false,
        title: "Appeler l'artisan",
        click: function(inter) {
            if (inter.artisan) {
                win = $window.open("callto:" + inter.artisan.telephone.tel1, "_self", "");
                //  win.close();
            }
        },
        hide: function(inter) {
            return !inter.ai
        }
    }, {
        hidden: false,
        title: "SMS artisan",
        click: function(inter) {
            dialog.getText({
                title: "Texte du SMS",
                text: "\nEdison Service"
            }, function(text) {
                edisonAPI.sendSMS(text, "0633138868").success(function(e) {
                    console.log(e);
                }).error(function(err) {
                    console.log(err)
                })
            })
        },
        hide: function(inter) {
            return !inter.ai
        }
    }, {
        hidden: false,
        title: "Envoyer",
        click: function(inter) {
            dialog.addFiles.open(inter, [], function(text, file) {
                edisonAPI.envoiInter(inter.id, {
                    sms: text,
                    file: file
                }).then(function(res) {
                    console.log(res)
                    LxNotificationService.success(res.data);
                }).catch(function(error) {
                    console.log(error)
                    LxNotificationService.error(error.data);
                });
            })
        }
    }, {
        hidden: false,
        title: "Annuler",
        click: function(inter) {
            edisonAPI.annulationInter(inter.id).then(function(res) {
                LxNotificationService.success("L'intervention " + inter.id + " à été annulé");
            });
        },

    }]

    var ContextMenu = function(page) {
        this.content = content[page];
    }

    ContextMenu.prototype.setData = function(data) {
        this.data = data;
    }

    ContextMenu.prototype.setPosition = function(x, y) {
        this.style.left = (x - 60);
        this.style.top = y;
    }

    ContextMenu.prototype.active = false;

    ContextMenu.prototype.open = function() {
        var _this = this;
        this.content.forEach(function(e) {
            e.hidden = e.hide && e.hide(_this.data);
        })
        this.style.display = "block";
        this.active = true;
    }

    ContextMenu.prototype.close = function() {
        this.style.display = "none";
        this.active = false;

    }

    ContextMenu.prototype.style = {
        left: 0,
        top: 0,
        display: "none"
    }

    return function(page) {
        return new ContextMenu(page);
    }

}]);

angular.module('edison').factory('dataProvider', ['socket', '$rootScope', 'config', '_', function(socket, $rootScope, config, _) {

  var dataProvider = function() {
    var _this = this;
    socket.on('interventionListChange', function(data) {
      _this.updateInterventionList(data);
    });
  }
  dataProvider.prototype.setInterventionList = function(data) {
    this.interventionList = data;
  };

  dataProvider.prototype.refreshInterventionListFilter = function(params) {
    var _this = this;

    this.interventionListFiltered = this.interventionList;

    if (this.interventionList && params) {
      if (params.fltr && params.fltr !== 'all' && config.filters[params.fltr]) {
        this.interventionListFiltered = _.filter(this.interventionList, function(e) {
          return e.fltr[config.filters[params.fltr].short];
        })
      } else if (params.artisanID) {
        var artisanID = parseInt(params.artisanID);
        this.interventionListFiltered = _.filter(this.interventionList, function(e) {
          return e.ai === artisanID;
        })
      }
    }
  }

  dataProvider.prototype.updateInterventionList = function(data) {
    var _this = this;
    if (this.interventionList) {
      var index = _.findIndex(this.interventionList, function(e) {
        return e.id === data.id
      });
      _this.interventionList[index] = data;
      $rootScope.$broadcast('InterventionListChange');
    }
  }

  dataProvider.prototype.getInterventionList = function() {
    return this.interventionList;
  }

  return new dataProvider;

}]);

angular.module('edison').factory('dialog', ['$mdDialog', 'edisonAPI', 'config', function($mdDialog, edisonAPI, config) {


    return {
        callsList: function(sst) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog, config) {
                    $scope.sst = sst;
                    $scope.answer = function() {
                        $mdDialog.hide();
                    }
                },
                templateUrl: '/DialogTemplates/callsList.html',
            });
        },
        choiceText: function(options, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog, config) {
                    $scope.options = options;
                    $scope.answer = function(resp, text) {
                        $mdDialog.hide();
                        return cb(resp, text);
                    }
                },
                templateUrl: '/DialogTemplates/choiceText.html',
            });
        },
        getText: function(options, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog, config) {
                    $scope.options = options;
                    $scope.answer = function() {
                        $mdDialog.hide();
                        return cb($scope.options.text);
                    }
                },
                templateUrl: '/DialogTemplates/text.html',
            });
        },
        addFiles: {
            open: function(data, files, cb) {
                $mdDialog.show({
                    controller: function DialogController($scope, $mdDialog, config) {

                        var getSMS = function() {
                            var sms = data.id ? "OS " + data.id + ". " : "";
                            sms += "Intervention chez " + data.client.civilite + " " +
                                data.client.prenom + " " + data.client.nom + " au " +
                                data.client.address.n + " " + data.client.address.r + " " +
                                data.client.address.cp + ", " + data.client.address.v + " le " +
                                moment(data.date.intervention).format("LLLL") + ". ";
                            sms += data.prixAnnonce ? data.prixAnnonce + "€ HT. " : "Pas de prix annoncé. ";
                            sms += "Merci de prendre rdv avec le client au " + data.client.telephone.tel1;
                            sms += data.client.telephone.tel2 ? "ou au " + data.client.telephone.tel2 : ""
                            return sms + ".\nEdison Services."
                        }
                        $scope.xfiles = files
                        $scope.smsText = getSMS();
                        $scope.answer = function(p, t) {
                            $mdDialog.hide();
                            return cb($scope.smsText, $scope.addedFile);
                        }
                    },
                    templateUrl: '/DialogTemplates/files.html',
                });
            }
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
        absence: {
            open: function(id, cb) {
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
                                hours = 23 - (new Date).getHours() + 1;
                            } else {
                                hours = parseInt(answer);
                            }
                            start = new Date;
                            end = new Date;
                            end.setHours(end.getHours() + hours)
                            edisonAPI.absenceArtisan(id, {
                                start: start,
                                end: end
                            }).success(cb)
                        };
                    },
                    templateUrl: '/DialogTemplates/absence.html',
                });
            }
        }
    }

}]);

angular.module('edison').factory('_', ['$window',
  function($window) {
    return $window._;
  }
])

angular.module('edison').factory('mapAutocomplete', ['$q', 'Address',
    function($q, Address) {

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
            }, function(predictions, status) {
                if (predictions)
                    predictions.forEach(function(e) {
                        if (e.description == input)
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

        return new autocomplete;

    }
]);

angular.module('edison').factory('produits', ['dialog', function(dialog) {
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
        desc: "DÉGORGEMENT CANALISATION TRÈS HAUTE PRESSION PAR CAMION D’ASSAINISSEMENT : \nCurage et nettoyage complet de la canalisation jusqu\'à 10M",
        pu: 696.25
    }, {
        quantite: 1,
        ref: "AUT001",
        title: "Autre",
        desc: "",
        pu: 0
    }];
    return {
        init: function(produits) {
            this.produits = produits;
            return this;
        },
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
            this.produits.push(prod);
        },
        search: function(text) {
            var rtn = []
            for (var i = 0; i < ps.length; ++i) {
                if (text == ps[i].title)
                    return [];
                var needle = _.deburr(text).toLowerCase()
                var haystack = _.deburr(ps[i].title).toLowerCase();
                if (haystack.indexOf(needle) >= 0) {
                    rtn.push(_.clone(ps[i]))
                }
            }
            return rtn
        },
        total: function() {
            var total = 0;
            if (this.produits) {
                this.produits.forEach(function(e) {
                    total += (e.pu * e.quantite);
                })
            }
            return total
        }
    }

}]);

angular.module('edison').factory('socket', function (socketFactory) {
  return socketFactory();
});
angular.module('edison').factory('tabContainer', ['$location', '$window', '$q', 'edisonAPI','_', function($location, $window, $q, edisonAPI, _) {

  var Tab = function(args) {

    if (typeof args === 'object') {
      //copy constructor
      for (var k in args) {
        this[k] = args[k];
      }
    } else {
      this.url = args;
      this.title = '';
      this.position = null;
      this.deleted = false;
      this._timestamp = Date.now();
    }
  }

  Tab.prototype.setData = function(data) {
    //slice create a copy
    this._data = JSON.parse(JSON.stringify(data));
    this.data = JSON.parse(JSON.stringify(data));
  }

  Tab.prototype.setTitle = function(title) {
    this.title = title;
  }

  var TabContainer = function() {

    var self = this;
    this._tabs = [];
    this.selectedTab = 0;
  }

  TabContainer.prototype.loadSessionTabs = function(currentUrl) {
    var self = this;

    return $q(function(resolve, reject) {
      var currentUrlInSessionTabs = false;
      edisonAPI.request({
        fn: "getSessionData",
      }).then(function(result) {
        self.selectedTab = result.data.selectedTab;
        for (var i = 0; i < result.data._tabs.length; i++) {
          self._tabs.push(new Tab(result.data._tabs[i]))
          if (result.data._tabs[i].url === currentUrl) {
            self.selectedTab = i;
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

  TabContainer.prototype.createTab = function(url, title) {
    var tab = new Tab(url);

    tab.position = this._tabs.length;
    this._tabs.push(tab);
    return (tab);
  }

  TabContainer.prototype.isOpen = function(url) {
    var index = _.findIndex(this._tabs, function(e) {
      return ((!e.deleted && e.url === url));
    });
    return (index >= 0);
  };

  TabContainer.prototype.getTab = function(url) {

    return _.find(this._tabs, function(e) {
      return ((!e.deleted && e.url === url));
    });
  };

  TabContainer.prototype.len = function() {
    var size = 0;

    this._tabs.forEach(function(e, i) {
      size += !e.deleted;
    })
    return (size);
  }

  TabContainer.prototype.getPrevTab = function(tab) {

    for (var i = tab.position - 1; i >= 0; i--) {
      if (this._tabs[i].deleted == false)
        return (this._tabs[i]);
    };

  };

  TabContainer.prototype.remove = function(tab) {
    var newTabs = [];
    var j = 0;

    if (this._tabs.length <= 1) {
      return false;
    }
    var reload = (this.selectedTab == tab.position);
    for (var i = 0; i < this._tabs.length; i++) {
      if (i != tab.position) {
        newTabs.push(this._tabs[i]);
        newTabs[j].position = j;
        ++j;
      }
    };
    this._tabs = newTabs;

    if (this.selectedTab == tab.position && this.selectedTab != 0) {
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
    if (!this.isOpen(url)) {
      tab = this.createTab(url);
    } else {
      tab = this.getTab(url)
    }
    if (!(options && options.setFocus === false)) {
      this.setFocus(tab)
    }
    if (options && options.title) {
      tab.setTitle(options.title);
    }
  }

  return (new TabContainer);

}]);

/*
 * Detects on which browser the user is navigating
 *
 * Usage:
 * var browser = detectBrowser();
 *
 */
angular.module('edison').service('detectBrowser', ['$window',
  function($window) {

    // http://stackoverflow.com/questions/22947535/how-to-detect-browser-using-angular
    return function() {
      var userAgent = $window.navigator.userAgent,
        browsers = {
          chrome: /chrome/i,
          safari: /safari/i,
          firefox: /firefox/i,
          ie: /internet explorer/i
        };

      for (var key in browsers) {
        if (browsers[key].test(userAgent)) {
          return key;
        }
      }

      return 'unknown';
    }
  }
]);

/*
 * Get window height and width
 *
 * Usage:
 * windowDimensions.height();
 * windowDimensions.width();
 *
 */
angular.module('edison').factory('windowDimensions', ['$window', 'detectBrowser',
  function($window, detectBrowser) {
    var browser = detectBrowser();

    return {
      height: function() {
        return (browser === 'safari') ? document.documentElement.clientHeight : window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      },

      width: function() {
        console.log('watchDimensions')
        return (browser === 'safari') ? document.documentElement.clientWidth : window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      }
    }
  }
]);

/*
 * Watch window resizing event to set new window dimensions,
 * and broadcast the event to the app
 *
 * Usage:
 * <html watch-window-resize>...</html>
 *
 * Bind the resize event:
   $scope.$on('watchWindowResize::resize', function() {
       // Do something
   });
 *
 */
angular.module('edison').directive('watchWindowResize', ['$window', '$timeout', 'windowDimensions',
  function($window, $timeout, windowDimensions) {

    return {
      link: function($scope) {
        // Get window's dimensions
        $scope.getDimensions = function() {

          // Namespacing events with name of directive + event to avoid collisions
          // http://stackoverflow.com/questions/23272169/what-is-the-best-way-to-bind-to-a-global-event-in-a-angularjs-directive
          $scope.$broadcast('watchWindowResize::resize', {
            height: windowDimensions.height(),
            width: windowDimensions.width()
          });
        }

        // On window resize...
        angular.element($window).on('resize', function(e) {

          // Reset timeout
          $timeout.cancel($scope.resizing);

          // Add a timeout to not call the resizing function every pixel
          $scope.resizing = $timeout(function() {

            $scope.getDimensions();
          }, 300);
        });
      }
    }
  }
]);

angular.module('edison').controller('ArtisanController', function(tabContainer, $location, $mdSidenav, $interval, ngDialog, LxNotificationService, edisonAPI, config, $routeParams, $scope, windowDimensions, artisan) {
  $scope.config = config;
  $scope.tab = tabContainer.getCurrentTab();
  var id = parseInt($routeParams.id);

  if (!$scope.tab.data) {
    if ($routeParams.id.length > 12) {
      $scope.tab.isNew = true;
      $scope.tab.setTitle('@' + moment().format("HH:mm").toString());
    } else {
      $scope.tab.setTitle('@' + $routeParams.id);
      if (!artisan) {
        alert("Impossible de trouver les informations !");
        $location.url("/dashboard");
        $scope.tabs.remove($scope.tab);
        return 0;
      }
    }
    $scope.tab.setData(artisan.data);
  }
});

angular.module('edison').controller('DashboardController', function(tabContainer, $location, $scope, $rootScope, interventions, artisans){

	$scope.tab = tabContainer.getCurrentTab();
	$scope.tab.setTitle('dashBoard')
});
angular.module('edison').controller('InterventionMapController', function($scope, $q, $interval, $window, Address, dialog, mapAutocomplete, edisonAPI) {
    $scope.autocomplete = mapAutocomplete;
    if (!$scope.tab.data.client.address) {
        $scope.mapCenter = Address({
            lat: 46.3333,
            lng: 2.6
        });
        $scope.zoom = 6;
    } else {
        if ($scope.tab.data.artisan) {
            $scope.zoom = 12;
            //$scope.tab.data.artisan.address = Address($scope.tab.data.artisan.address, true);
        }
        if ($scope.tab.data.client.address) {
            $scope.tab.data.client.address = Address($scope.tab.data.client.address, true); //true -> copyContructor
            $scope.mapCenter = $scope.tab.data.client.address;
        }
    }


    $scope.showInterMarker = function() {
        if (!$scope.mapCenter ||  !$scope.mapCenter.latLng || !$scope.tab.data.client || !$scope.tab.data.client.address ||  !$scope.tab.data.client.address.latLng) {
            return (false)
        }
        return ($scope.tab.data.client.address.latLng == $scope.mapCenter.latLng);
    }


    $scope.changeAddress = function(place, searchText) {
        mapAutocomplete.getPlaceAddress(place).then(function(addr)  {
                $scope.zoom = 12;
                $scope.mapCenter = addr;
                $scope.tab.data.client.address = addr;
                $scope.searchArtisans();
            },
            function(err) {
                console.log(err);
            })
    }

    $scope.$watch('tab.data.sst', function(id_sst) {
        console.log("==>", id_sst)
        if (id_sst) {
            $q.all([
                edisonAPI.getArtisan(id_sst, {
                    cache: true
                }),
                edisonAPI.getArtisanStats(id_sst, {
                    cache: true
                }),
                edisonAPI.getCalls($scope.tab.data.id || $scope.tab.data.tmpID, id_sst)
            ]).then(function(result)  {
                $scope.tab.data.artisan = result[0].data;
                $scope.tab.data.artisan.stats = result[1].data;
                $scope.tab.data.artisan.calls = result[2].data;
                if (result[0].data.address) {
                    edisonAPI.getDistance({
                            origin: result[0].data.address.lt + ", " + result[0].data.address.lg,
                            destination: $scope.tab.data.client.address.lt + ", " + $scope.tab.data.client.address.lg
                        })
                        .then(function(result) {
                            $scope.tab.data.artisan.stats.direction = result.data;
                        })
                }
            });
        }
    })

    $scope.dialog = dialog;

    $scope.sstAbsence = function(id) {
        if (id)
            dialog.absence.open(id, function() {
                $scope.searchArtisans();
            })
    }

    $scope.showMap = function() {
        $scope.loadMap = true;
    }

    $scope.loadMap = $scope.tab.isNew;

    $scope.getStaticMap = function() {
        var q = "?width=" + $window.outerWidth * 0.8;
        if ($scope.tab.data.client && $scope.tab.data.client.address && $scope.tab.data.client.address.latLng)
            q += ("&origin=" + $scope.tab.data.client.address.latLng);
        if ($scope.tab.data.artisan && $scope.tab.data.artisan.id)
            q += ("&destination=" + $scope.tab.data.artisan.address.lt + "," + $scope.tab.data.artisan.address.lg);
        return "/api/map/staticDirections" + q;
    }
});

angular.module('edison').controller('InterventionController',
    function($window, $scope, $location, $routeParams, ngDialog, dialog, LxNotificationService, Upload, tabContainer, edisonAPI, mapAutocomplete, produits, config, intervention, artisans, user) {
        $scope.artisans = artisans.data;
        $scope.config = config;
        $scope.autocomplete = mapAutocomplete;
        $scope.tab = tabContainer.getCurrentTab();
        var id = parseInt($routeParams.id);
        if (!$scope.tab.data) {
            $scope.tab.setData(intervention.data);
            $scope.tab.data.sst = intervention.data.artisan ? intervention.data.artisan.id : 0;

            if ($routeParams.id.length > 12) {
                $scope.tab.isNew = true;
                $scope.tab.data.tmpID =  $routeParams.id;
                $scope.tab.setTitle('#' + moment((new Date(parseInt($scope.tab.data.tmpID))).toISOString()).format("HH:mm").toString());
            } else {
                $scope.tab.setTitle('#' + $routeParams.id);
                if (!intervention) {
                    alert("Impossible de trouver les informations !");
                    $location.url("/dashboard");
                    $scope.tabs.remove($scope.tab);
                    return 0;
                }
            }
        }
        $scope.tab.data.login = {
            ajout: user.data.login
        }
        $scope.showMap = false;
        $scope.produits = produits.init($scope.tab.data.produits ||  []);


        $scope.callsList = function(sst) {
            dialog.callsList(sst);
        }

        $scope.changeAddressFacture = function(place) {
             mapAutocomplete.getPlaceAddress(place).then(function(addr)  {
               $scope.tab.data.facture.address = addr;
             });
        }

        $scope.call = function(sst) {
            var now = Date.now();
            var x = $window.open('callto:' + sst.telephone.tel1, '_self', false)
            dialog.choiceText({
                title: 'Nouvel Appel',
            }, function(response, text) {
                edisonAPI.call({
                    date: now,
                    to: sst.telephone.tel1,
                    link: sst.id,
                    origin: $scope.tab.data.id || $scope.tab.data.tmpID,
                    description: text,
                    response: response
                }).success(function(resp) {
                    sst.calls.unshift(resp)
                })
            })
        }

        $scope.addProduct = function(prod) {
            produits.add(prod);
            $scope.searchProd = "";
        }

        $scope.clickUpload = function() {
            angular.element('.input-file__input').trigger('click');
        }
        $scope.previsualiseFacture = function() {
            var url = '/api/intervention/facturePreview?html=true&data=';
            $window.open(url + JSON.stringify($scope.tab.data), "_blank");
        }

        $scope.addComment = function() {
            $scope.tab.data.comments.push({
                login: user.data.login,
                text: $scope.commentText,
                date: new Date()
            })
            $scope.commentText = "";
        }

        $scope.changeCategorie = function(key) {
            $scope.tab.data.categorie = key;
        }

        $scope.onFileUpload = function(file) {
            if (file) {
                edisonAPI.uploadFile(file, {
                    link: $scope.tab.data.id || $scope.tab.data.tmpID,
                    model: 'intervention',
                    type: 'fiche'
                }).success(function() {
                    $scope.fileUploadText = "";
                    $scope.loadFilesList();
                })
            }
        }


        $scope.loadFilesList = function() {
            edisonAPI.getFilesList($scope.tab.data.id || $scope.tab.data.tmpID).then(function(result) {
                $scope.files = result.data;
            }, console.log)
        }
        $scope.loadFilesList();


        var action = {
            envoi: function(result) {
                dialog.addFiles.open($scope.tab.data, $scope.files, function(text, file) {
                    edisonAPI.envoiInter(result.data.id, {
                        sms: text,
                        file: file
                    }).then(function(res) {
                        LxNotificationService.success(res.data);

                    }).catch(function(error) {
                        console.log(error)
                        LxNotificationService.error(error.data);
                    });
                    $location.url("/interventions");
                    $scope.tabs.remove($scope.tab);
                })
            },
            annulation: function(result) {
                edisonAPI.annulationInter(result.data.id).then(function(res) {
                    LxNotificationService.success("L'intervention " + result.data.id + " à été annulé");
                    $scope.tab.data.status = "ANN";
                });
            },
            verification: function(result) {
                edisonAPI.verificationInter(result.data.id).then(function(res) {
                    LxNotificationService.success("L'intervention " + result.data.id + " à été vérifié");

                    $location.url("/interventions");
                    $scope.tabs.remove($scope.tab);
                }).catch(function(error) {
                    LxNotificationService.error(error.data);
                })
            }
        }

        $scope.saveInter = function(options) {
                edisonAPI.saveIntervention({
                    data: $scope.tab.data
                }).then(function(result) {
                    LxNotificationService.success("Les données de l'intervention " + result.data.id + " ont à été enregistré");
                    if (options && options.envoi == true) {
                        action.envoi(result);
                    } else if (options && options.annulation) {
                        action.annulation(result);
                    } else if (options && options.verification) {
                        action.verification(result);
                    } else {
                        $location.url("/interventions");
                        tabContainer.remove($scope.tab)
                    }
                }).catch(function(error) {
                    LxNotificationService.error(error.data);
                });
            }
            /*
                    $scope.saveInter = function(options) {
                        if (options && options.envoi == true) {
                            dialog.addFiles.open($scope.tab.data, $scope.files, function(files, text) {
                                console.log(files, text);
                            })
                        } else {
                            saveInter(options)
                        }

                    }*/

        $scope.clickOnArtisanMarker = function(event, sst) {
            $scope.tab.data.sst = sst.id;
        }

        $scope.searchArtisans = function() {
            console.log("search");
            edisonAPI.getNearestArtisans($scope.tab.data.client.address, $scope.tab.data.categorie)
                .success(function(result) {
                    $scope.nearestArtisans = result;
                });
        }
        if ($scope.tab.data.client.address)
            $scope.searchArtisans();


    });

angular.module('edison').controller('statsController', function($scope) {

    console.log("hey")
  $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
  $scope.data = [300, 500, 100];
});

angular.module('edison').controller('InterventionsController', function(tabContainer, $window, contextMenu, edisonAPI, dataProvider, $routeParams, $location, $scope, $q, $rootScope, $filter, config, ngTableParams, interventions) {
    $scope.tab = tabContainer.getCurrentTab();
        console.log(tabContainer)

    $scope.recap = $routeParams.artisanID;
    if ($scope.recap) {
        $scope.tab.setTitle("Recap@" + $routeParams.artisanID)
    } else {
        $scope.tab.setTitle($routeParams.fltr ? config.filters[$routeParams.fltr].long : 'Interventions');
    }
    $scope.api = edisonAPI;
    $scope.config = config;
    $scope.dataProvider = dataProvider;

    if (!$scope.dataProvider.getInterventionList()) {
        $scope.dataProvider.setInterventionList(interventions.data);
    }

    $scope.dataProvider.refreshInterventionListFilter($routeParams);

    var tableParameters = {
        page: 1, // show first page
        total: $scope.dataProvider.interventionListFiltered.length,
        filter: {},
        count: 100 // count per page
    };
    var tableSettings = {
        //groupBy:$rootScope.config.selectedGrouping,
        total: $scope.dataProvider.interventionListFiltered,
        getData: function($defer, params) {
            var data = $scope.dataProvider.interventionListFiltered;
            data = $filter('tableFilter')(data, params.filter());
            params.total(data.length);
            data = $filter('orderBy')(data, params.orderBy());
            $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        filterDelay: 150
    }
    $scope.tableParams = new ngTableParams(tableParameters, tableSettings);

    $rootScope.$on('InterventionListChange', function() {
        $scope.dataProvider.refreshInterventionListFilter($routeParams);
        $scope.tableParams.reload();
    })

    $scope.contextMenu = contextMenu('interventionList')


    $scope.getStaticMap = function(inter) {
        var q = "?width=500&height=250&precision=0&zoom=10&origin=" + inter.client.address.lt + ", " + inter.client.address.lg;
        return "/api/map/staticDirections" + q;
    }
    $scope.rowRightClick = function($event, inter) {
        $scope.contextMenu.setPosition($event.pageX, $event.pageY)
        $scope.contextMenu.setData(inter);
        $scope.contextMenu.open();
        edisonAPI.getIntervention(inter.id, {
                extend: true
            })
            .then(function(resp) {
                $scope.contextMenu.setData(resp.data);
            })
    }

    $scope.rowClick = function($event, inter, doubleClick) {
        if ($scope.contextMenu.active)
            return $scope.contextMenu.close();
        /*        if (doubleClick) {
                  return   

                } */
        if ($event.metaKey || $event.ctrlKey) {
            tabContainer.addTab('/intervention/' + inter.id, {
                title: ('#' + inter.id),
                setFocus: false,
                allowDuplicates: false
            });
        } else {
            if ($rootScope.expendedRow === inter.id) {
                $rootScope.expendedRow = -1;
            } else {
                $q.all([
                    edisonAPI.getIntervention(inter.id),
                    edisonAPI.getArtisanStats(inter.ai)
                ]).then(function(result)  {

                    $rootScope.expendedRow = inter.id;
                    $rootScope.expendedRowData = result[0].data;
                    $rootScope.expendedRowData.artisanStats = result[1].data
                })
            }
        }
    }

});

//# sourceMappingURL=assets/all.js.map