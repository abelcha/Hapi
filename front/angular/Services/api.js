angular.module('edison').factory('edisonAPI', ['$http', '$location', 'dataProvider', 'Upload', function($http, $location, dataProvider, Upload) {
    "use strict";
    return {
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
        },
        intervention: {
            getStats: function() {
                return $http({
                    method: 'GET',
                    cache: false,
                    url: '/api/intervention/stats'
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
            },
            envoiDevis: function(id, options) {
                return $http.post("/api/intervention/" + id + "/envoiDevis", options);
            },
        },
        artisan: {
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
                    cache: options && options.cache,
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
                        maxDistance: 50
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
                    method: 'GET',
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
                        link: link,
                        // origin: origin
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
                        link: link,
                        origin: origin
                    }
                })
            },
            save: function(params) {
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
    }
}]);
