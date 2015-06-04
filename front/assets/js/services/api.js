angular.module('edison').factory('edisonAPI', ['$http', '$location', function($http, $location) {

  var apiUrl = ($location.host() == "127.0.0.1" ? "http://127.0.0.1:3000/" : "https://edsx.herokuapp.com/");

  return {
    getArtisans: function(cache) {
      console.log("artisans");
      return $http({ method: 'GET', cache:cache, url: apiUrl + "artisans"}).success(function(result) {
        return result.data;
      });
    },

    getInterventions: function(cache) {
      console.log("interventions");
      return $http({ method: 'GET', cache:cache, url: apiUrl + "interventions" }).success(function(result) {
        return result.data;
      });
    }
  }
}]);

