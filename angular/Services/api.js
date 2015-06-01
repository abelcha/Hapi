angular.module('edison').factory('edisonAPI', ['$http', '$location', 'dataProvider', 'Upload', function($http, $location, dataProvider, Upload) {

    return {
        intervention:  {
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
                return $http({
                    method: 'GET',
                    url: '/api/calls/add',
                    params: params
                })
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
            send: function(params) {
                console.log(params)
                return $http({
                    method: 'GET',
                    url: '/api/sms/send',
                    params: params
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

        getUser: function(id_sst) {
            return $http({
                method: 'GET',
                cache:true,
                url: "/api/whoAmI"
            });
        },
    }
}]);
