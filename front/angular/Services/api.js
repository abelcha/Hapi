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
            archives: function() {
                return $http.get('/api/intervention/archive');
            }
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
