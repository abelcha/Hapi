angular.module('edison').factory('edisonAPI', ['$http', '$location', 'dataProvider', 'Upload', function($http, $location, dataProvider, Upload) {

    return {
        intervention:  {
            list: function(options) {
                return $http({
                    method: 'GET',
                    cache: options && options.cache,
                    url: '/api/intervention/list'
                }).success(function(result) {
                    return result;
                })
            },
            get: function(id, options) {
                return $http({
                    method: 'GET',
                    cache: false,
                    url: '/api/intervention/' + id,
                    params: options ||  {}
                }).success(function(result) {
                    return result;
                });
            },
            save: function(params) {
                return $http({
                    method: 'GET',
                    url: "/api/intervention/save",
                    params: params
                });
            },
            getFiles: function(id) {
                return $http({
                    method: 'GET',
                    url: "/api/intervention/" + id + "/getFiles"
                });
            },
            verification: function(id, options) {
                return $http({
                    method: 'GET',
                    params: options,
                    url: "/api/intervention/" + id + "/verification"
                });
            },
            annulation: function(id) {
                return $http({
                    method: 'GET',
                    url: "/api/intervention/" + id + "/annulation"
                });
            },
            envoi: function(id, options) {
            return $http({
                method: 'GET',
                params: options,
                url: "/api/intervention/" + id + "/envoi"
            });
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
            get: function(id, options) {
                return $http({
                    method: 'GET',
                    cache: options && options.cache,
                    url: '/api/artisan/' + id,
                    params: options ||  {}
                }).success(function(result) {
                    return result;
                });
            },
            getNearest: function(address, categorie) {
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
        lastInters: function(id) {
            return $http({
                method: 'GET',
                url: '/api/artisan/' + id + '/lastInters',
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
