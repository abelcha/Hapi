angular.module('edison').factory('edisonAPI', ['$http', '$location', 'Upload', function($http, $location, Upload) {
    "use strict";
    return {
        product: {
            list: function() {
                return $http.get('/api/product/list');
            },
            save: function(data) {
                return $http.post('/api/product/__save', data);
            }
        },
        stats: {
            telepro: function() {
                return $http.get('/api/stats/telepro');
            }
        },
        users: {
            logout: function() {
                return $http.get('/logout');
            },
            save: function(data) {
                return $http.post('/api/user/__save', data);
            },
            list: function() {
                return $http.get('/api/user/list');
            }
        },
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
            saveTmp: function(data) {
                return $http.post('/api/devis/temporarySaving', data);
            },
            getTmp: function(id) {
                return $http.get('/api/devis/temporarySaving?id=' + id);
            },
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
                if (!params.id) {
                    return $http.post("/api/devis", params)
                } else {
                    return $http.post("/api/devis/" + params.id, params)

                }
            },
            envoi: function(id, options) {
                return $http.post("/api/devis/" + id + "/envoi", options);
            },
            annulation: function(id, causeAnnulation) {
                return $http.post("/api/devis/" + id + "/annulation");
            },
            list: function() {
                return $http.get('api/devis/getCacheList')
            },
        },
        intervention: {

            getTelMatch: function(text) {
                return $http.post('/api/intervention/telMatches', text);
            },
            saveTmp: function(data) {
                return $http.post('/api/intervention/temporarySaving', data);
            },
            getTmp: function(id) {
                return $http.get('/api/intervention/temporarySaving?id=' + id);
            },
            demarcher: function(id) {
                return $http({
                    method: 'POST',
                    url: '/api/intervention/' + id + '/demarcher'
                })
            },
            reactivation: function(id) {
                return $http.post('api/intervention/' + id + '/reactivation')
            },
            list: function() {
                return $http.get('api/intervention/getCacheList')
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
                if (!params.id) {
                    return $http.post("/api/intervention", params)
                } else {
                    return $http.post("/api/intervention/" + params.id, params)

                }
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
            annulation: function(id, options) {
                return $http.post("/api/intervention/" + id + "/annulation", options);
            },
            envoi: function(id, options) {
                return $http.post("/api/intervention/" + id + "/envoi", options);
            },
            sendFacture: function(id, options) {
                return $http.post("/api/intervention/" + id + "/sendFacture", options);
            },
            sendFactureAcquitte: function(id, options) {
                return $http.post("/api/intervention/" + id + "/sendFactureAcquitte", options);
            },
            statsBen: function(options) {
                return $http({
                    method: 'GET',
                    url: "/api/intervention/statsBen",
                    params: options
                });
            }
        },
        artisan: {
            comment: function(id, text) {
                return $http.post('/api/artisan/' + id + '/comment', {
                    text: text
                })
            },
            sendFacturier: function(id, facturier, deviseur) {
                console.log('==>', facturier, deviseur)
                return $http.post('/api/artisan/' + id + '/sendFacturier', {
                    facturier: facturier,
                    deviseur: deviseur,
                });
            },
            saveTmp: function(data) {
                return $http.post('/api/artisan/temporarySaving', data);
            },
            getTmp: function(id) {
                return $http.get('/api/artisan/temporarySaving?id=' + id);
            },
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
                if (!params.id) {
                    return $http.post("/api/artisan", params)
                } else {
                    return $http.post("/api/artisan/" + params.id, params)

                }
            },
            list: function(options) {
                return $http.get('api/artisan/getCacheList')
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
            scan: function(options) {
                return $http.post('/api/document/scan', options);
            }
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
                return $http.post("/api/sms/__save", params)
            },

        },
        getDistance: function(origin, destination) {
            return $http({
                method: 'GET',
                cache: true,
                url: '/api/mapGetDistance',
                params: {
                    origin: origin,
                    destination: destination
                }
            })
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
