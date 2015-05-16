angular.module('edison', ['ngMaterial', 'lumx', 'ngAnimate', 'ngDialog', 'n3-pie-chart', 'btford.socket-io', 'ngFileUpload', 'pickadate', 'ngRoute', 'ngResource', 'ngTable', 'ngMap'])
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('indigo')
      .accentPalette('red');
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

angular.module('edison').config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      resolve: {
        interventions: getInterList,
        artisans: getArtisanList
      },
      redirectTo: '/dashboard',
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
        artisans: getArtisanList
      }
    })
    .when('/interventions/:fltr', {
      templateUrl: "Pages/ListeInterventions/listeInterventions.html",
      controller: "InterventionsController",
      resolve: {
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
        interventions: getInterList,
        artisans: getArtisanList
      }
    })
    .when('/intervention/:id', {
      templateUrl: "Pages/Intervention/intervention.html",
      controller: "InterventionController",
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
  console.log("swag");
  return function(sst, categorie){
    console.log("sst, categorie");
    return (sst.categories.indexOf(categorie) > 0);
  }
});
angular.module("edison").filter('categoryFilter', function(){
  return function(sst, categorie){
    return (sst.categories.indexOf(categorie) > 0);
  }
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

    for (k in data) {
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
    console.timeEnd("lol")
    return rtn;
  }
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
    }
    if (place.geometry) {
      this.lt = place.geometry.location.lat();
      this.lg = place.geometry.location.lng();
    }
    this.latLng = this.lt + ', ' + this.lg;
  };

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
        cache: options && options.cache,
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
    saveIntervention: function(data) {
      return $http({
        method: 'GET',
        url: "/api/intervention/save",
        params: data
      });
    },
    getNearestArtisans: function(address, categorie) {
      return $http({
        method: 'GET',
        url: "/api/artisan/rank",
        cache: true,
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
    }
  }
}]);

angular.module('edison').factory('config', [function() {

  var config = {};

  config.filters = {
    all: {
      short:'all',
      long:'Toutes les Inters',
      url:''
    },
    enCours: {
      short: 'enc',
      long:'En Cours',
      url:'/enCours'
    },
    aVerifier: {
      short: 'avr',
      long:'A Vérifier',
      url:'/aVerifier'
    },
    aRelancer: {
      short: 'arl',
      long:'A Relancer',
      url:'/aRelancer'
    }
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
      n: 'Electricité',
      c: 'yellow  darken-2 black-text'
    },
    PL: {
      n: 'Plomberie',
      c: 'blue'
    },
    CH: {
      n: 'Chauffage',
      c: 'red'
    },
    CL: {
      n: 'Climatisation',
      c: ' teal darken-3'
    },
    SR: {
      n: 'Serrurerie',
      c: 'brown'
    },
    VT: {
      n: 'Vitrerie',
      c: ' green darken-3'
    },
    CR: {
      n: 'Carrelage',
      c: ''
    },
    MN: {
      n: 'Menuiserie',
      c: ''
    },
    MC: {
      n: 'Maconnerie',
      c: ''
    },
    PT: {
      n: 'Peinture',
      c: ''
    }
  }

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

  config.etatsKV = {
    ENC: {
      n: 'En Cours',
      c: 'orange'
    },
    INT: {
      n: 'Confirmé',
      c: 'green accent-4'
    },
    APR: {
      n: 'A Progr.',
      c: 'blue'
    },
    ANN: {
      n: 'Annuler',
      c: 'red'
    },
    DEV: {
      n: 'Devis',
      c: 'light-blue'
    },
  };

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

  config.status = function(inter) {
    return {
      intervention: config.etatsKV[inter.status]
    }
  }

  return config;

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
angular.module('edison').controller('InterventionMapController', function($scope, $q, $interval, $window, $mdDialog, Address, mapAutocomplete, edisonAPI) {
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

  $scope.changeAddress = function(place) {
    mapAutocomplete.getPlaceAddress(place).then(function(addr)  {
        $scope.zoom = 12;
        $scope.mapCenter = addr;
        if (addr.streetAddress) {
          $scope.tab.data.client.address = addr;
          $scope.searchText = "lol";
        }
        $scope.searchArtisans();
      },
      function(err) {
        console.log(err);
      })
  }

  $scope.$watch('tab.data.sst', function(id_sst) {
    if (id_sst) {
      $q.all([
        edisonAPI.getArtisan(id_sst, {
          cache: true
        }),
        edisonAPI.getArtisanStats(id_sst, {
          cache: true
        }),
      ]).then(function(result)  {
        $scope.tab.data.artisan = result[0].data;
        $scope.tab.data.artisan.stats = result[1].data;
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

  function DialogController($scope, $mdDialog) {
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
    };
  };

  $scope.openDialog = function(ev) {
    $mdDialog.show({
        controller: DialogController,
        templateUrl: '/Pages/Intervention/dialog-box.html',
        targetEvent: ev,
      })
      .then(function(time) {
        var hours = 0;
        if (time === "TODAY") {
          hours = 23 - (new Date).getHours() + 1;
        } else {
          hours = parseInt(time);
        }
        start = new Date;
        end = new Date;
        end.setHours(end.getHours() + hours)
        edisonAPI.absenceArtisan($scope.tab.data.artisan.id, {
          start: start,
          end: end
        });
      });
  };

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
  function($scope, $location, $routeParams, ngDialog, LxNotificationService, Upload, tabContainer, edisonAPI, config, intervention, artisans) {
    $scope.artisans = artisans.data;
    $scope.config = config;
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
    $scope.showMap = false;

    $scope.onFileUpload = function(file) {
      if (file) {
        edisonAPI.uploadFile(file, {
          link: $scope.tab.data.id || $scope.tab.data.tmpID,
          model: 'intervention',
          type: 'fiche'
        }).success(function() {
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


    $scope.saveInter = function(send, cancel) {
      edisonAPI.saveIntervention({
        send: send,
        cancel: cancel,
        data: $scope.tab.data
      }).then(function(data) {
        LxNotificationService.success("L'intervention " + data.data + " à été enregistré");
        //$location.url("/interventions");
       // $scope.tabs.remove($scope.tab);
      }).catch(function(response) {
        LxNotificationService.error(response.data);
      });
    }

    $scope.clickOnArtisanMarker = function(event, sst) {
      $scope.tab.data.sst = sst.id;
    }

    $scope.searchArtisans = function() {
      edisonAPI.getNearestArtisans($scope.tab.data.client.address, $scope.tab.data.categorie)
        .success(function(result) {
          $scope.nearestArtisans = result;
        });
    }
    if ($scope.tab.data.client.address)
      $scope.searchArtisans();


  });

angular.module('edison').controller('InterventionsController', function(tabContainer, $window, edisonAPI, dataProvider, $routeParams, $location, $scope, $q, $rootScope, $filter, config, ngTableParams, interventions) {
  $scope.tab = tabContainer.getCurrentTab();

  $scope.recap = $routeParams.artisanID;
  if ($scope.recap) {
    $scope.tab.setTitle("Recap@" + $routeParams.artisanID)

    $scope.data = [
  {label: "Four", value: 44, color: "#F44336"},
  {label: "Five", value: 55, color: "#ff9800"},
  {label: "Six", value: 66, color: "#00C853"}
    ];
    $scope.options = {thickness: 200};
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

  $scope.getStaticMap = function(inter) {
    q = "?width=500&height=250&precision=0&zoom=10&origin=" + inter.client.address.lt + ", " + inter.client.address.lg;
    return "/api/map/staticDirections" + q;
  }
  
  $scope.rowClick = function($event, inter, doubleClick) {
    if (doubleClick) {
      $location.url('/intervention/' + inter.id)

    } else if ($event.metaKey || $event.ctrlKey) {
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
