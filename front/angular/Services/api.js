angular.module('edison').factory('edisonAPI', ['$http', '$location', 'Upload', function($http, $location, Upload) {
  "use strict";
  return {
    bug: {
      declare: function(params) {
        return $http.post('/api/bug/declare', params)
      },
    },
    user: {
      history: function(login) {
        return $http.get('/api/user/' + login + '/history')
      },
    },
    product: {
      list: function() {
        return $http.get('/api/product/list');
      },
      save: function(data) {
        return $http.post('/api/product/__save', data);
      }
    },
    signal: {
      list: function() {
        return $http.get('/api/signal/list');
      },
      save: function(data) {
        return $http.post('/api/signal/__save', data);
      }
    },
    compte: {
      list: function() {
        return $http.get('/api/compte/list');
      },
      save: function(data) {
        return $http.post('/api/compte/__save', data);
      }
    },
    combo: {
      list: function() {
        return $http.get('/api/combo/list');
      },
      save: function(data) {
        return $http.post('/api/combo/__save', data);
      }
    },
    stats: {
      telepro: function() {
        return $http.get('/api/stats/telepro');
      },
      day: function() {
        return $http.get('/api/stats/day');
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
    bfm: {
      get: function() {
        return $http.get('/api/bfm');
      }
    },
    compta: {
      lpa: function(data) {
        return $http.get('/api/intervention/lpa?d=' + (data.d ||  ''));
      },
      flush: function(data) {
        return $http.post('/api/intervention/flush', data);
      },
      flushMail: function(data) {
        return $http.post('/api/intervention/flushMail', data);
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
      dashboardStats: function(options) {
        return $http.get('/api/intervention/dashboardStats', {
          params: options
        });
      },
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
      },
      gstats: function(options) {
        return $http({
          method: 'GET',
          url: "/api/intervention/gstats",
          params: options
        });
      },
      statsBenYear: function(options) {
        return $http({
          method: 'GET',
          url: "/api/intervention/statsBenYearly",
          params: options
        });
      },
      commissions: function(options) {
        return $http({
          method: 'GET',
          url: "/api/intervention/commissions",
          params: options
        });
      },
      scan: function(id) {
        return $http.post("/api/intervention/" + id + "/scan");
      }
    },
    artisan: {
      tableauCom: function() {
        return $http.get('/api/artisan/tableauCom');
      },
      manage: function(id) {
        return $http.post('/api/artisan/' + id + '/manage')
      },
      comment: function(id, text) {
        return $http.post('/api/artisan/' + id + '/comment', {
          text: text
        })
      },
      absence: function(id, absence) {
        return $http.post('/api/artisan/' + id + '/absence', absence)
      },
      needFacturier: function(id) {
        return $http.post('/api/artisan/' + id + '/needFacturier')
      },
      sendFacturier: function(id, facturier, deviseur) {
        return $http.post('/api/artisan/' + id + '/sendFacturier', {
          facturier: facturier,
          deviseur: deviseur,
        });
      },
      saveTmp: function(data) {
        return $http.post('/api/artisan/temporarySaving', data);
      },
      fullHistory: function(id) {
        return $http.get('/api/artisan/' + id + '/fullHistory');
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
      getFiles: function(id) {
        return $http({
          method: 'GET',
          url: "/api/artisan/" + id + "/getFiles"
        });
      },
      extendedStats: function(id) {
        return $http.get('/api/artisan/' + id + "/extendedStats")
      },
      statsMonths: function(id) {
        return $http.get('/api/artisan/' + id + "/statsMonths")
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
            limit: 150,
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
    tasklist: {
      get: function(date, login) {
        return $http.get('/api/tasklist/' + date + '/' + login);
      },
      check: function(listid, taskid) {
        return $http.post('/api/tasklist/' + listid + '/check/' + taskid);
      },
      update: function(task) {
        return $http.post('/api/tasklist/', {
          task: task
        });
      }
    },
    task: {
      add: function(params) {
        return $http.post('/api/task/add', params)
      },
      check: function(id) {
        return $http.post('/api/task/' + id + '/check')
      },
      listRelevant: function(options) {
        return $http.get('/api/task/relevant', {
          params: options
        });
      }
    },
    signalement: {
      check: function(id, text) {
        return $http.post('/api/signalement/' + id + '/check', {
          text: text
        })
      },
      add: function(params) {
        return $http.post('/api/signalement/add', params)
      },
      list: function(params) {
        return $http.get('/api/signalement/list', {
          params: params
        })
      },
      stats: function() {
        return $http.get('/api/signalement/stats')
      }
    },
    file: {
      uploadScans: function(file, options) {
        return Upload.upload({
          url: '/api/document/uploadScans',
          fields: options,
          file: file
        })
      },
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
        return $http.post("/api/sms/send", params)
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
    },
    bigSearch: function(text, options) {
      return $http({
        method: 'GET',
        params: options,
        url: ['api', 'bigSearch', text].join('/')
      })
    }
  }
}]);
