var Map = function() {
    this.display = false;
}

Map.prototype.setCenter = function(address) {
    this.center = address;
}

Map.prototype.setZoom = function(value) {
    this.zoom = value
}
Map.prototype.show = function() {
    console.log("here")
    this.display = true;
}


var InterventionCtrl = function($rootScope, $window, $scope, $location, $routeParams, dialog, fourniture, LxNotificationService, tabContainer, edisonAPI, Address, $q, mapAutocomplete, productsList, config, intervention, artisans) {
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
    if (!_this.data.id)
        _this.data.login = {
            ajout: $rootScope.user.login
        }

    _this.data.produits = _this.data.produits || [];
    $scope.produits = new productsList(_this.data.produits);

    _this.data.fourniture = _this.data.fourniture || [];
    $scope.fourniture = fourniture.init(_this.data.fourniture);



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
        _this.data.comments.push({
            login: $rootScope.user.login,
            text: $scope.commentText,
            date: new Date()
        })
        $scope.commentText = "";
    }

    $scope.changeCategorie = function(key) {
        _this.data.categorie = key;
        if (_this.data.client.address)
            _this.searchArtisans();
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
        edisonAPI.intervention.save(_this.data)
            .then(function(result) {
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


    /*MAP CONTROLLER*/
    _this.map = new Map;
    _this.map.setZoom(_this.data.client.address ? 12 : 6)
    if (_this.isNew) {
        _this.map.show();
    }
    _this.autocomplete = mapAutocomplete;

    if (_this.data.client.address) {
        _this.data.client.address = Address(_this.data.client.address, true); //true -> copyContructor
        _this.map.setCenter(_this.data.client.address);
    } else {
        _this.map.setCenter(Address({
            lat: 46.3333,
            lng: 2.6
        }));
    }

    _this.showInterMarker = function() {
        return _this.data.client.address && _this.data.client.address.latLng;
    }

    _this.changeAddress = function(place, searchText) {
        mapAutocomplete.getPlaceAddress(place).then(function(addr)  {
                _this.map.zoom = 12;
                _this.map.center = addr;
                _this.data.client.address = addr;
                _this.searchArtisans();
            },
            function(err) {
                console.log(err);
            })
    }


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


    $scope.sstAbsence = function(id) {
        if (id)
            dialog.absence.open(id, function() {
                _this.searchArtisans();
            })
    }


    $scope.getStaticMap = function() {
        var q = "?width=" + $window.outerWidth * 0.8;
        if (_this.data.client && _this.data.client.address && _this.data.client.address.latLng)
            q += ("&origin=" + _this.data.client.address.latLng);
        if (_this.data.artisan && _this.data.artisan.id)
            q += ("&destination=" + _this.data.artisan.address.lt + "," + _this.data.artisan.address.lg);
        return "/api/mapGetStatic" + q;
    }




}

angular.module('edison').controller('InterventionController', InterventionCtrl);
