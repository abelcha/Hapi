var InterventionCtrl = function(Description, Signalement, ContextMenu, $window, $timeout, $rootScope, $scope, $location, $routeParams, dialog, fourniture, LxNotificationService, LxProgressService, tabContainer, edisonAPI, Address, $q, mapAutocomplete, productsList, config, interventionPrm, Intervention, Map) {
    "use strict";
    var _this = this;
    _this.config = config;
    _this.dialog = dialog;
    _this.autocomplete = mapAutocomplete;
    var tab = tabContainer.getCurrentTab();

    if (!tab.data) {
        var intervention = new Intervention(interventionPrm.data)

        intervention.sst = intervention.artisan ? intervention.artisan.id : 0;
        tab.setData(intervention);
        if ($routeParams.id.length > 12) {
            _this.isNew = true;
            intervention.tmpID = $routeParams.id;
            tab.setTitle('#' + moment((new Date(parseInt(intervention.tmpID))).toISOString()).format("HH:mm").toString());
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
                tabContainer.remove(tab);
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
    _this.description = new Description(intervention);
    _this.signalement = new Signalement(intervention)
    _this.contextMenu = new ContextMenu('intervention')
    _this.contextMenu.setData(intervention);
    _this.rowRightClick = function($event, inter) {
        _this.contextMenu.setPosition($event.pageX, $event.pageY)
        _this.contextMenu.open();
    }

    Mousetrap.bind(['command+k', 'ctrl+k'], function() {
        $window.open("appurl:", '_self');
        edisonAPI.file.scan({
            type: 'SCAN',
            model: 'intervention',
            link: intervention.id
        }).then(function() {
            $scope.loadFilesList();
            LxNotificationService.success("Le fichier est enregistré");
        })
        return false;
    });

    $scope.changeArtisan = function(sav) {
        sav.artisan = _.find(_this.artisans, function(e) {
            return e.id === sav.sst;
        })
    }

    $scope.calculPrixFinal = function() {
        intervention.prixFinal = 0;
        _.each(intervention.produits, function(e)  {
            intervention.prixFinal += (e.pu * e.quantite)
        })
        intervention.prixFinal = Math.round(intervention.prixFinal * 100) / 100;
    }

    $scope.addSAV = function() {
        dialog.getText({
            title: "Description du SAV",
            text: ""
        }, function(resp) {
            if (!intervention.sav)
                intervention.sav = [];
            intervention.sav.push({
                date: new Date(),
                login: $rootScope.user.login,
                description: resp,
                regle: false
            })
        })
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


    $scope.recapArtisan = function(sst) {
        edisonAPI.artisan.lastInters(sst.id)
            .success(dialog.recap);
    }

    $scope.smsArtisan = function() {
        intervention.smsArtisan(function(err, resp) {
            if (!err)
                intervention.artisan.sms.unshift(resp)
        })
    }

    $scope.callArtisan = function() {
        intervention.callArtisan(function(err, resp) {
            if (!err)
                intervention.artisan.calls.unshift(resp)
        })
    }


    $scope.addProductSupp = function(prod) {
        $scope.produitsSupp.add(prod);
        $scope.searchProd = "";
    }


    $scope.addProduct = function(prod) {
        $scope.produits.add(prod);
        $scope.searchProd = "";
    }

    $scope.clickTrigger = function(elem) {
        angular.element(elem).trigger('click');
    }

    $scope.addComment = function() {
        intervention.comments.push({
            login: $rootScope.user.login,
            text: $scope.commentText,
            date: new Date()
        })
        $scope.commentText = "";
    }

    $scope.onFileUpload = function(file) {
        intervention.fileUpload(file, function(err, resp) {
            $scope.fileUploadText = "";
            $scope.loadFilesList();
        });
    }
    $scope.loadFilesList = function() {
        edisonAPI.intervention.getFiles(intervention.id || intervention.tmpID).then(function(result) {
            intervention.files = result.data;
        }, console.log)
    }
    $scope.loadFilesList();



    var postSave = function(options, resp, cb) {
        if (options && options.envoiFacture && options.verification) {
            intervention.envoiFactureVerif(cb)
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
                postSave(options, resp, function(err) {
                    if (!err) {
                        tabContainer.close(tab);
                    }
                    $scope.saveInter = saveInter;
                })
            } else {
                $scope.saveInter = saveInter;
            }
        })
    }

    $scope.saveInter = saveInter;

    $scope.clickOnArtisanMarker = function(event, sst) {
        intervention.sst = sst.id;
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
        return intervention.client.civilite
    }, function(newVal, oldVal) {
        if (oldVal !== newVal) {
            intervention.tva = (newVal == 'Soc.' ? 20 : 10);
        }
    })

    $scope.$watch(function() {
        return intervention.sst;
    }, function(id_sst) {
        if (id_sst) {
            $q.all([
                edisonAPI.artisan.get(id_sst, {
                    cache: false
                }),
                edisonAPI.artisan.getStats(id_sst, {
                    cache: true
                }),
                edisonAPI.call.get(intervention.id || intervention.tmpID, id_sst),
                edisonAPI.sms.get(intervention.id || intervention.tmpID, id_sst)
            ]).then(function(result) {
                intervention.artisan = result[0].data;
                intervention.artisan.stats = result[1].data;
                intervention.artisan.calls = result[2].data;
                intervention.artisan.sms = result[3].data;
                if (result[0].data.address) {
                    edisonAPI.getDistance({
                            origin: result[0].data.address.lt + ", " + result[0].data.address.lg,
                            destination: intervention.client.address.lt + ", " + intervention.client.address.lg
                        })
                        .then(function(result) {
                            intervention.artisan.stats.direction = result.data;
                        })
                }
            });
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

    $scope.smoothTransition = function(value) {
        if (!$scope.displaySAV) {
            $scope.savStyle = {
                height: '0',
                overflow: 'hidden',
            }
            $scope.displaySAV = true
            $timeout(function() {
                $("#SAV").velocity({
                    height: $("#SAV>div").height(),
                }, 200, function() {
                    delete $scope.savStyle.height
                });
            }, 10)
        } else {
            $("#SAV").velocity({
                height: 0,
            }, 200, function() {
                $scope.displaySAV = false
            });
        }
    }

    $scope.sstAbsence = function(id) {
        if (id) {
            intervention.absenceArtisan(_this.searchArtisans);
        }
    }
}

angular.module('edison').controller('InterventionController', InterventionCtrl);
