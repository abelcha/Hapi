angular.module('edison').factory('edisonAPI', ['$http', '$location', 'dataProvider', function($http, $location, dataProvider) {

  return {
    listInterventions: function() {
      return $http({
        method: 'GET',
        cache: true,
        url: '/api/intervention/list'
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
      console.log(options && options.cache);
      return $http({
        method: 'GET',
        cache: options && options.cache,
        url: '/api/artisan/' + id,
        params: options || {}
      }).success(function(result) {
        return result;
      });
    },
    getIntervention: function(id, options) {
      return $http({
        method: 'GET',
        cache: options && options.cache,
        url: '/api/intervention/' + id,
        params: options || {}
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
        cache:true,
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
