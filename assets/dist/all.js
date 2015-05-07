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

if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.findIndex appelé sur null ou undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate doit être une fonction');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
}

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find a été appelé sur null ou undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate doit être une fonction');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}
function gMap(client) {

  var self = this;

  ZOOM_OVERVIEW = 6;
  ZOOM_BASIC = 10;
  ZOOM_MAX = 17;

  ICON_GREY = "/img/map/grey.png";
  ICON_RED = "/img/map/red.png";
  ICON_BLUE = "/img/map/blue.png";
  ICON_GREEN = "/img/map/green.png";

  INFOWINDOW_PRELOADER = '<div id="InfoWindow"><img style="margin-left:23px;width:40px" src="/img/map/preloader.gif"></div>';

  INPUT_CLIENT = document.getElementById('pac-input');
  INPUT_FACTURATION = document.getElementById('facture_geocoder');

  this.directionsDisplay = new google.maps.DirectionsRenderer();
  this.directionsService = new google.maps.DirectionsService();
  this.circles = [];


  this.getMap = function() {
    return (self.map);
  }

  this.createMarker = function(options, visibility) {
    options.map = self.map;
    options.anchorPoint = new google.maps.Point(0, -29);
    var marker = new google.maps.Marker(options);
    marker.setVisible(visibility);
    if (options.onclick) {
      google.maps.event.addListener(marker, 'click', options.onclick);
    } 
    return (marker)
  }


  this.showArtisanRoute = function(newArtisan, client) {
    if (client.address) {
      var request = {
          origin: client.serializeAddress(newArtisan.add),
          destination: client.serializeAddress(client.address),
          travelMode: google.maps.TravelMode.DRIVING
      };
      self.directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
          self.directionsDisplay.setMap(self.getMap());
          self.directionsDisplay.setOptions({ preserveViewport: true, suppressMarkers: true });
          self.directionsDisplay.setDirections(response);
      }
      });
    }
  }


  this.drawCircle = function(add, radius, id) {
  
    self.circles[id] = new google.maps.Circle({
      center:new google.maps.LatLng(add.lt,add.lg),
      radius:radius,
      strokeColor:"#2680F3",
      strokeOpacity:0.9,
      strokeWeight:3,
      fillColor:"#2680F3",
      fillOpacity:0.01
    });
    self.circles[id].setMap(self.getMap());
  }

  this.setClientPlace = function(newPlace) {
            
        // If the place has a geometry, then present it on a map.

/*--------------------------- Center Map -----------------------------*/   

      if (newPlace.geometry.viewport) {
        self.map.fitBounds(newPlace.geometry.viewport);
      } else {
        self.map.setCenter(newPlace.geometry.location);
        self.map.setZoom(ZOOM_BASIC);
      }

/*----------------------------- Marker -----------------------------*/   

      if (client.marker) {
        client.marker.setMap(null);
      }

      client.marker = self.createMarker({
        title: 'Client',
        animation: google.maps.Animation.DROP,
        position: newPlace.geometry.location,
        icon: ICON_GREY,
        onclick:function() {
          self.map.setCenter(client.marker.position)
          self.map.setZoom(self.map.getZoom() == ZOOM_MAX ? ZOOM_BASIC : ZOOM_MAX); 
        }
      }, false);


/*--------------------------- InfoWindow ----------------------------*/        

      client.infoWindow = new google.maps.InfoWindow({
        content: INFOWINDOW_PRELOADER,
        pixelOffset: new google.maps.Size(0, 25)
      });

      client.infoWindow.open(self.map, client.marker);
        google.maps.event.addListener(client.infoWindow,'closeclick',function() {
        client.marker.setVisible(true);
      });
/*      window.setTimeout(function() { 
        client.infoWindow.close();
        client.marker.setVisible(true);
      }, 15000);*/

/*-------------------------- Adress Input -----------------------------*/      
    if (newPlace.address_components) {
       client.setAddress(newPlace); 
    } 
      self.map.setZoom(ZOOM_BASIC);
       
  }



/*-----------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------*/
/*------------------------------- CONSTRUCTOR  --------------------------------*/
/*-----------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------*/


    // Create the map
    self.map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: new google.maps.LatLng(46.52863469527167,2.43896484375),
      zoom: ZOOM_OVERVIEW,

    });


    // Add input for adress autocomplete
      
    self.map.controls[google.maps.ControlPosition.TOP_LEFT].push(INPUT_CLIENT);
    self.autocomplete = new google.maps.places.Autocomplete(INPUT_CLIENT);
    self.autocomplete.setComponentRestrictions();
    self.autocomplete.bindTo('bounds', self.map);
      
    //When user enters new address
    self.placeChanged = function() {

      place = self.autocomplete.getPlace();
      //if the user hit enter without selecting proposition
      if(typeof place.address_components == 'undefined') {
        // find list of predictions
          new google.maps.places.AutocompleteService().getPlacePredictions({
            input: place.name,
            offset: place.length
          }, function(list, status) {
              // geocode the first proposition    
              new google.maps.Geocoder().geocode({
                address: list[0].description
              }, function(results, status) {
                  // if everything is OK actualise client address
                  if (status == google.maps.GeocoderStatus.OK)
                     self.setClientPlace(results[0]);
              });
          });

      } 
      else {
        // the user have selected a proposition
        self.setClientPlace(place);
        client.getInfoQuartier(place);
      }
    };

  // si une autre personne regle la facture on autocomplete ses coordonnées
  var payeurAutocomplete = new google.maps.places.Autocomplete((INPUT_FACTURATION), {types:['geocode']});
  google.maps.event.addListener(payeurAutocomplete, 'place_changed', function() {
      console.log("payer adress have changed");
  });

};

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

angular.module('edison').factory('edisonAPI', ['$http', '$location', 'dataProvider', function($http, $location, dataProvider) {

  return {
    getArtisans: function(cache) {
      return $http({
        method: 'GET',
        cache: cache,
        url: "/api/search/artisan/{}"
      }).success(function(result) {
        dataProvider('artisans', result);
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
        params:  {
          categorie: categorie,
          lat: address.lt,
          lng: address.lg,
          limit: 50,
          maxDistance: 50
        }
      });
    },
    getArtisanStats: function(id_sst) {
      return $http({
        method: 'GET',
        url: "/api/artisan/stats",
        params: {
          id: id_sst
        }
      });
    },
    absenceArtisan: function(id, date) {
      return $http({
        method: 'GET',
        url: '/api/artisan/absence',
        params: {
          id: id,
          date: date
        }
      })
    }
  }
}]);

angular.module('edison').factory('config', [function() {

  var config = {};

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

angular.module('edison').factory('dataProvider', [function() {
	var self = this;
	if (!this.data) {
		return (function(data) {
			self.data = data;
		})
	} else {
		return (this.data);
	}

}]);
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

angular.module('edison').factory('tabContainer', ['$location', '$window', '$q', 'edisonAPI', function($location, $window, $q, edisonAPI) {

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
    var index = this._tabs.findIndex(function(e) {
      return ((!e.deleted && e.url === url));
    });
    return (index >= 0);
  };

  TabContainer.prototype.getTab = function(url) {

    return this._tabs.find(function(e) {
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
    console.time("lol");
    var rtn = [];
    for (x in fltr) {
    	fltr[x] = cleanString(fltr[x]);
    }

    for (k in data) {
      if (data[k].id) {
        var psh = true;
        for (x in fltr) {
          var str = getValue(x, data[k]);
          if (str && cleanString(str).indexOf(fltr[x]) < 0) {
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

angular.module('edison').controller('DashboardController', function(tabContainer, $location, $scope, $rootScope, interventions, artisans){

	$scope.tab = tabContainer.getCurrentTab();
	$scope.tab.setTitle('dashBoard')
});
angular.module('edison').controller('InterventionController', function(tabContainer, $location, $mdSidenav, $interval, ngDialog, LxNotificationService, edisonAPI, config, $routeParams, $scope, windowDimensions, interventions, artisans) {
  $scope.windowDimensions = windowDimensions;
  $scope.config = config;
  $scope.tab = tabContainer.getCurrentTab();
  $scope.artisans = artisans.data.sort(function(a, b) {
    return a.nomSociete > b.id;
  });
  var id = parseInt($routeParams.id);

  if (!$scope.tab.data) {
    if ($routeParams.id.length > 12) {
      $scope.tab.isNew = true;
      $scope.tab.setTitle('#' + moment().format("HH:mm").toString());
      $scope.tab.setData({
        client: {},
        reglementSurPlace: true,
        date: {
          ajout: Date.now(),
          intervention: Date.now()
        }
      });
    } else {
      $scope.tab.setTitle('#' + $routeParams.id);
      var inter = interventions.data.find(function(e) {
        return e.id === id
      });
      if (!inter) {
        alert("Impossible de trouver les informations !");
        $location.url("/dashboard");
        $scope.tabs.remove($scope.tab);
        return 0;
      }
      inter.sst = inter.artisan ? inter.artisan.id : 0;
      if (inter.sst > 0) {
        inter.artisan = artisans.data.find(function(e) {
          return e.id === inter.sst;
        });
      }
      $scope.tab.setData(inter);
    }
  }
  $scope.showMap = false;

  $scope.saveInter = function(send, cancel) {
    edisonAPI.saveIntervention({
      send: send,
      cancel: cancel,
      data: $scope.tab.data
    }).then(function(data) {
      LxNotificationService.success("L'intervention " + data.data + " à été enregistré");
      $location.url("/interventions");
      $scope.tabs.remove($scope.tab);
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
  if ($scope.tab.data.artisan)
    $scope.searchArtisans();

});




angular.module('edison').controller('InterventionMapController', function($scope, $window, $mdDialog, Address, mapAutocomplete, edisonAPI) {
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
      $scope.tab.data.artisan.add = Address($scope.tab.data.artisan.add, true);
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
          $scope.searchText = "";
        }
        $scope.searchArtisans();
      },
      function(err) {
        console.log(err);
      })
  }

  $scope.$watch('tab.data.sst', function(id_sst) {
    $scope.tab.data.artisan = $scope.artisans.find(function(e) {
      return e.id === id_sst;
    });
    console.log(id_sst)
    if (id_sst && id_sst !== 0) {
      edisonAPI.getArtisanStats(id_sst).success(function(stats) {
        $scope.tab.data.artisan.stats = stats
      })
    }
  })

  function DialogController($scope, $mdDialog) {
    $scope.absenceTime = 'TODAY';
    $scope.absence = [{
      title: 'Toute la journée',
      value: 'TODAY'
    }, {
      title: '1 Heure',
      value: '1H'
    }, {
      title: '2 Heure',
      value: '2H'
    }, {
      title: '3 Heure',
      value: '3H'
    }, {
      title: '4 Heure',
      value: '4H'
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
         edisonAPI.absenceArtisan($scope.tab.data.artisan.id, time);
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
    if ($scope.tab.data.artisan)
      q += ("&destination=" + $scope.tab.data.artisan.add.lt + "," + $scope.tab.data.artisan.add.lg);
    return "/api/map/staticDirections" + q;
  }
});

angular.module('edison').controller('InterventionsController', function(tabContainer, $window, edisonAPI, $location, $scope, $filter, config, ngTableParams, interventions) {

  $scope.api = edisonAPI;

  $scope.config = config;
  if (!$scope.tableParams) {
    var tableParameters = {
      page: 1, // show first page
      total: interventions.data.length,
      filter: {},
      count: 100 // count per page
    };
    var tableSettings = {
      //groupBy:$rootScope.config.selectedGrouping,
      total: interventions.data,
      getData: function($defer, params) {
        var data = interventions.data;
        data = $filter('tableFilter')(data, params.filter());
        params.total(data.length);
        data = $filter('orderBy')(data, params.orderBy());
        $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      },
      filterDelay: 150
    }
    $scope.tableParams = new ngTableParams(tableParameters, tableSettings);
  };

  $scope.tab = tabContainer.getCurrentTab();
  $scope.tab.setTitle('Interventions');

  $scope.getStaticMap = function(inter) {
    q = "?width=500&height=250&precision=0&zoom=10&origin=" + inter.client.address.lt + ", " + inter.client.address.lg;
    return "/api/map/staticDirections" + q;
  }


  $scope.expendedRow = -1;
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
      if ($scope.expendedRow === inter.id) {
        $scope.expendedRow = -1;
      } else {

        $scope.expendedRow = inter.id;
      }
    }
  }

});
