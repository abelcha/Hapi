var InterventionCtrl = function(Description, Signalement, ContextMenu, $window, $timeout, $rootScope, $scope, $location, $routeParams, dialog, fourniture, LxNotificationService, LxProgressService, TabContainer, edisonAPI, Address, $q, mapAutocomplete, productsList, config, interventionPrm, Intervention, Map) {
    "use strict";
    var _this = this;
    _this.config = config;
    _this.dialog = dialog;
    _this.autocomplete = mapAutocomplete;
    var tab = TabContainer.getCurrentTab();

    if (!tab.data) {
        var intervention = new Intervention(interventionPrm.data)

        intervention.sst__id = intervention.sst ? intervention.sst.id : 0;
        tab.setData(intervention);
        if ($routeParams.id.length > 12) {
            _this.isNew = true;
            intervention.tmpID = $routeParams.id;
            intervention.tmpDate = moment.unix(intervention.tmpID / 1000).format('HH[h]mm')
            tab.setTitle(intervention.tmpDate);
        } else {
            if (intervention && intervention.client.nom) {
                var __title = intervention.client.civilite + intervention.client.nom
                __title = __title.slice(0, 10);
            } else {
                var __title = '#' + $routeParams.id;
            }
            tab.setTitle(__title);
            if (!intervention) {
                LxNotificationService.error("Impossible de trouver les informations !");
                $location.url("/dashboard");
                TabContainer.remove(tab);
                return 0;
            }
        }
    } else {
        var intervention = tab.data;
    }
    if ($routeParams.d) {
        intervention.devisOrigine = parseInt($routeParams.d)
        intervention.date = {
            ajout: new Date(),
            intervention: new Date(),
        }
        intervention.reglementSurPlace = true;
        intervention.modeReglement = 'CH';
        intervention.remarque = 'PAS DE REMARQUES';
    }
    _this.data = tab.data;

    $scope.bv = {
        show: function(view) {
            if (this[view]) {
                return (this[view] = false);
            }
            this.historique = false;
            this.absence = false;
            this.signalement = false;
            this[view] = true;
        },
        init: function() {
            this.historique = this.absence = this.signalement = false;
            _this.searchArtisans(intervention.categorie)
            $timeout(function() {
                _this.searchArtisans(intervention.categorie)
            }, 666)
        }
    }

    var updateTitle = _.throttle(function() {
        tab.setTitle(_.template("{{typeof tmpDate == 'undefined' ? id : tmpDate}} - {{client.civilite}} {{client.nom}} ({{client.address.cp}})")(intervention));
    }, 1000)

    $scope.$watch('vm.data.client', updateTitle, true)
    updateTitle();
    _this.description = new Description(intervention);
    _this.signalement = new Signalement(intervention)
    _this.contextMenuIntervention = new ContextMenu('intervention')
    _this.contextMenuSST = new ContextMenu('artisan')
    _this.contextMenu = _this.contextMenuIntervention
    _this.contextMenu.setData(intervention);


    _this.rowRightClick = function($event, inter) {
        if ($('.map-box').has($event.target).length) {
            var id = $event.target.getAttribute('id-sst') || _.get(intervention, 'sst.id')
            if (id) {
                _this.rightClickArtisan = id;
                edisonAPI.artisan.get(id).then(function(resp) {
                    _this.contextMenu = _this.contextMenuSST;
                    _this.contextMenu.setData(resp.data);
                    _this.contextMenu.setPosition($event.pageX, $event.pageY + 200)
                    _this.contextMenu.open()
                })
            }

        } else if ($('.listeInterventions').has($event.target).length == 0) {
            _this.contextMenu = this.contextMenuIntervention;
            _this.contextMenu.setPosition($event.pageX, $event.pageY + 200)
            _this.contextMenu.open();
        }
    }

    Mousetrap.bind(['command+k', 'ctrl+k', 'command+f1', 'ctrl+f1'], function() {
        $window.open("appurl:", '_self');
        edisonAPI.intervention.scan(intervention.id).then(function() {
            $scope.loadFilesList();
            LxNotificationService.success("Le fichier est enregistré");
        })
        return false;
    });


    $scope.calculPrixFinal = function() {
        intervention.prixFinal = 0;
        _.each(intervention.produits, function(e)  {
            intervention.prixFinal += (e.pu * e.quantite)
        })
        intervention.prixFinal = Math.round(intervention.prixFinal * 100) / 100;
    }



    $scope.addLitige = function() {
        dialog.getText({
            title: "Description du Litige",
            text: ""
        }, function(resp) {
            if (!intervention.litiges)
                intervention.litiges = [];
            intervention.litiges.push({
                date: new Date(),
                login: $rootScope.user.login,
                description: resp,
                regle: false
            })
        })
    }

    $scope.smsArtisan = function() {
        intervention.smsArtisan(function(err, resp) {
            if (!err)
                intervention.sst.sms.unshift(resp)
        })
    }


    $scope.clickTrigger = function(elem) {
        angular.element(elem).trigger('click');
    }


    $scope.$watch('fileupload', function(file) {
        if (file && file.length === 1) {
            intervention.fileUpload(file[0], function(err, resp) {
                $scope.fileUploadText = "";
                $scope.loadFilesList();
            });
        }
    })

    $scope.loadFilesList = function() {
        edisonAPI.intervention.getFiles(intervention.id || intervention.tmpID).then(function(result) {
            intervention.files = result.data;
        }, console.log)
    }

    $scope.loadFilesList();

    var postSave = function(options, resp, cb) {
        if (options && options.envoiFacture && options.verification) {
            intervention.envoiFactureVerif(cb)
        } else if (options && options.envoiFacture) {
            intervention.sendFacture(cb)
        } else if (options && options.envoi === true) {
            resp.files = intervention.files;
            intervention.envoi.bind(resp)(cb);
        } else if (options && options.annulation) {
            intervention.annulation(cb);
        } else if (options && options.verification) {
            intervention.verificationSimple(cb);
        } else {
            cb(null)
        }
    }

    var saveInter = function(options) {
        $scope.saveInter = function() {
            console.log('noope')
        }
        intervention.save(function(err, resp) {
            if (!err) {
                var files = intervention.files
                intervention = new Intervention(resp);
                intervention.files = files
                postSave(options, resp, function(err) {
                    if (!err) {
                        TabContainer.close(tab);
                    }
                    $scope.saveInter = saveInter;
                })
            } else {
                $scope.saveInter = saveInter;
            }
        })
    }

    $scope.saveInter = saveInter;


    var latLng = function(add) {
        return add.lt + ', ' + add.lg
    }
    _this.selectArtisan = function(sst, first) {

        if (!sst) {
            intervention.sst = intervention.artisan = null
            return false;
        }
        $q.all([
            edisonAPI.artisan.get(sst.id, {
                cache: false
            }),
            edisonAPI.artisan.getStats(sst.id, {
                cache: true
            })
        ]).then(function(result) {
            intervention.sst = intervention.artisan = result[0].data;
            intervention.sst.stats = result[1].data
            if (!first) {
                intervention.compta.paiement.pourcentage = _.clone(intervention.sst.pourcentage);
                intervention.newOs = intervention.sst.newOs;
            }
            edisonAPI.getDistance(latLng(sst.address), latLng(intervention.client.address))
                .then(function(dir) {
                    intervention.sst.stats.direction = dir.data;
                })
            _this.recapFltr = {
                ai: intervention.sst.id
            }
        });
    }

    _this.showInterList = function() {
        //console.log('uauau')
        //$scope.interList = true;
    }

    _this.sstBase = intervention.sst;
    if (intervention.sst) {
        _this.selectArtisan(intervention.sst, true);
    }

    _this.searchArtisans = function(categorie) {
        if (_.get(intervention, 'client.address.lt')) {
            edisonAPI.artisan.getNearest(intervention.client.address, categorie || intervention.categorie)
                .success(function(result) {
                    _this.nearestArtisans = result;
                });
        }
    }
    _this.searchArtisans();

    $scope.$watch(function() {
        return intervention.client.address;
    }, function() {
        _this.searchArtisans(intervention.categorie);
    })


    $scope.$watch(function() {
        return intervention.client.civilite;
    }, function(curr, prev) {
        if (curr !== prev && curr === 'Soc.') {
            intervention.tva = 20;
            LxNotificationService.info("La TVA à été mise a 20%");
        }
    })

    var updateTmpIntervention = _.after(5, _.throttle(function() {
        edisonAPI.intervention.saveTmp(intervention);
    }, 2000))

    if (!intervention.id) {
        $scope.$watch(function() {
            return intervention;
        }, updateTmpIntervention, true)
    }

}

angular.module('edison').controller('InterventionController', InterventionCtrl);
