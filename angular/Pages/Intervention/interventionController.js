var InterventionCtrl = function($window, $scope, $location, $q, $routeParams, dialog, LxNotificationService, tabContainer, edisonAPI, mapAutocomplete, produits, config, intervention, artisans, user) {
    var _this = this;
    _this.artisans = artisans.data;
    _this.config = config;
    _this.autocomplete = mapAutocomplete;
    var tab = tabContainer.getCurrentTab();
    var id = parseInt($routeParams.id);
    if (!tab.data) {
        tab.setData(intervention.data);
        tab.data.sst = intervention.data.artisan ? intervention.data.artisan.id : 0;

        if ($routeParams.id.length > 12) {
            _this.isNew = true;
            tab.data.tmpID =  $routeParams.id;
            tab.setTitle('#' + moment((new Date(parseInt(tab.data.tmpID))).toISOString()).format("HH:mm").toString());
        } else {
            tab.setTitle('#' + $routeParams.id);
            if (!intervention) {
                alert("Impossible de trouver les informations !");
                $location.url("/dashboard");
                tabContainer.remove(tab);
                return 0;
            }
        }
    }

    _this.data = tab.data;
    _this.data.login = {
        ajout: user.data.login
    }
    $scope.showMap = false;
    $scope.produits = produits.init(_this.data.produits ||  []);



    $scope.changeAddressFacture = function(place) {
        mapAutocomplete.getPlaceAddress(place).then(function(addr)  {
            _this.data.facture.address = addr;
        });
    }
    $scope.sms = function(sst) {
        dialog.getText({
            title: "Texte du SMS",
            text: "\nEdison Service"
        }, function(text) {
            edisonAPI.sms.send({
                link: sst.id,
                origin: _this.data.id || _this.data.tmpID,
                text: text,
                to: "0633138868"
            }).success(function(resp) {
                sst.sms.unshift(resp)
            }).error(function(err) {
                console.log(err)
            })
        })
    }

    $scope.smsList = function(sst) {
        dialog.smsList(sst);
    }

    $scope.recap = function(sst) {
        edisonAPI.artisan.lastInters(sst.id)
            .success(dialog.recap);
    }

    $scope.callsList = function(sst) {
        dialog.callsList(sst);
    }

    $scope.call = function(sst) {
        var now = Date.now();
        var x = $window.open('callto:' + sst.telephone.tel1, '_self', false)
        dialog.choiceText({
            title: 'Nouvel Appel',
        }, function(response, text) {
            edisonAPI.call.save({
                date: now,
                to: sst.telephone.tel1,
                link: sst.id,
                origin: _this.data.id || _this.data.tmpID,
                description: text,
                response: response
            }).success(function(resp) {
                sst.calls.unshift(resp)
            })
        })
    }

    $scope.addProduct = function(prod) {
        produits.add(prod);
        $scope.searchProd = "";
    }

    $scope.clickUpload = function() {
        angular.element('.input-file__input').trigger('click');
    }
    $scope.previsualiseFacture = function() {
        var url = '/api/intervention/facturePreview?html=true&data=';
        $window.open(url + JSON.stringify(_this.data), "_blank");
    }

    $scope.addComment = function() {
        _this.data.comments.push({
            login: user.data.login,
            text: $scope.commentText,
            date: new Date()
        })
        $scope.commentText = "";
    }

    $scope.changeCategorie = function(key) {
        _this.data.categorie = key;
    }

    $scope.onFileUpload = function(file) {
        if (file) {
            edisonAPI.file.upload(file, {
                link: _this.data.id || _this.data.tmpID,
                model: 'intervention',
                type: 'fiche'
            }).success(function() {
                $scope.fileUploadText = "";
                $scope.loadFilesList();
            })
        }
    }


    $scope.loadFilesList = function() {
        edisonAPI.intervention.getFiles(_this.data.id || _this.data.tmpID).then(function(result) {
            $scope.files = result.data;
        }, console.log)
    }
    $scope.loadFilesList();


    var action = {
        envoi: function(result) {
            dialog.getFileAndText(_this.data, $scope.files, function(text, file) {
                console.log(text, file);
                edisonAPI.intervention.envoi(result.data.id, {
                    sms: text,
                    file: file
                }).then(function(res) {
                    LxNotificationService.success(res.data);

                }).catch(function(error) {
                    console.log(error)
                    LxNotificationService.error(error.data);
                });
                $location.url("/interventions");
                tabContainer.remove(tab);
            })
        },
        annulation: function(result) {
            edisonAPI.intervention.annulation(result.data.id).then(function(res) {
                LxNotificationService.success("L'intervention " + result.data.id + " à été annulé");
                _this.data.status = "ANN";
            });
        },
        verification: function(result) {
            edisonAPI.intervention.verification(result.data.id).then(function(res) {
                LxNotificationService.success("L'intervention " + result.data.id + " à été vérifié");

                $location.url("/interventions");
                tabContainer.remove(tab);
            }).catch(function(error) {
                LxNotificationService.error(error.data);
            })
        }
    }


    $scope.saveInter = function(options) {
        edisonAPI.intervention.save({
            data: _this.data
        }).then(function(result) {
            LxNotificationService.success("Les données de l'intervention " + result.data.id + " ont à été enregistré");
            if (options && options.envoi == true) {
                action.envoi(result);
            } else if (options && options.annulation) {
                action.annulation(result);
            } else if (options && options.verification) {
                action.verification(result);
            } else {
                $location.url("/interventions");
                tabContainer.remove(tab)
            }
        }).catch(function(error) {
            LxNotificationService.error(error.data);
        });
    }

    $scope.clickOnArtisanMarker = function(event, sst) {
        _this.data.sst = sst.id;
    }

    _this.searchArtisans = function() {
        edisonAPI.artisan.getNearest(_this.data.client.address, _this.data.categorie)
            .success(function(result) {
                _this.nearestArtisans = result;
            });
    }
    if (_this.data.client.address)
        _this.searchArtisans();

    $scope.$watch(function() {
        return _this.data.sst;
    }, function(id_sst) {
        if (id_sst) {
            $q.all([
                edisonAPI.artisan.get(id_sst, {
                    cache: true
                }),
                edisonAPI.artisan.getStats(id_sst, {
                    cache: true
                }),
                edisonAPI.call.get(_this.data.id || _this.data.tmpID, id_sst),
                edisonAPI.sms.get(_this.data.id || _this.data.tmpID, id_sst)
            ]).then(function(result)  {
                _this.data.artisan = result[0].data;
                _this.data.artisan.stats = result[1].data;
                _this.data.artisan.calls = result[2].data;
                _this.data.artisan.sms = result[3].data;
                if (result[0].data.address) {
                    edisonAPI.getDistance({
                            origin: result[0].data.address.lt + ", " + result[0].data.address.lg,
                            destination: _this.data.client.address.lt + ", " + _this.data.client.address.lg
                        })
                        .then(function(result) {
                            _this.data.artisan.stats.direction = result.data;
                        })
                }
            });
        }
    })


}

angular.module('edison').controller('InterventionController', InterventionCtrl);
