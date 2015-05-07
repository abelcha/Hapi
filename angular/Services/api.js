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
