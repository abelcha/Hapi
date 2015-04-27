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
        url: '/api/search/intervention/{"limit":100000, "sort":"-id"}'
      }).success(function(result) {
        dataProvider('interventions', result);
        return result;
      });
    },
    request: function(options) {
      return $http({
        method: options.method || 'GET',
        url:'/api/' + options.fn,
        params:options.data
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
          categorie:categorie,
          lat: address.lt,
          lng: address.lg,
          limit:20,
          maxDistance:150
        }
      });
    }
  }
}]);
