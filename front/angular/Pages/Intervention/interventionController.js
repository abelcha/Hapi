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
    this.display = true;
}


var InterventionCtrl = function($rootScope, $window, $scope, $location, $routeParams, dialog, fourniture, LxNotificationService, tabContainer, edisonAPI, Address, $q, mapAutocomplete, productsList, config, intervention, artisans, actionIntervention) {
    var _this = this;
    _this.artisans = artisans.data;
    _this.config = config;
    _this.dialog = dialog;
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



    _this.changeAddressFacture = function(place) {
        mapAutocomplete.getPlaceAddress(place).then(function(addr)  {
            _this.data.facture.address = addr;
        });
    }
    $scope.envoiSAV = function(sav) {
        sav.status = "ENV"
    }
    $scope.changeArtisan = function(sav) {
        sav.artisan = _.find(_this.artisans, function(e) {
            return e.id === sav.sst;
        })
    }

    $scope.addSAV = function() {
        dialog.getText({
            title: "Description du SAV",
            text: ""
        }, function(resp) {
            if (!_this.data.sav)
                _this.data.sav = [];
            _this.data.sav.push({
                date: new Date,
                login: $rootScope.user.login,
                description: resp,
                regle: false
            })
            console.log(_this.data.sav);
        })
    }

    $scope.envoiFacture = function() {
        actionIntervention.envoiFacture(_this.data, function(err, res) {
            _this.data.date.envoiFacture = new Date;
        })
    }


    $scope.recapArtisan = function(sst) {
        edisonAPI.artisan.lastInters(sst.id)
            .success(dialog.recap);
    }

    $scope.smsArtisan = function() {
        actionIntervention.smsArtisan(_this.data, function(err, resp) {
            if (!err)
                _this.data.artisan.calls.unshift(resp)
        })
    }

    $scope.callArtisan = function() {
        actionIntervention.callArtisan(_this.data, function(err, resp) {
            if (!err)
                _this.data.artisan.calls.unshift(resp)
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
            _this.data.files = result.data;
        }, console.log)
    }
    $scope.loadFilesList();


    var closeTab = function() {
        $location.url("/interventions");
        tabContainer.remove(tab)
    }

    $scope.saveInter = function(options) {
        actionIntervention.save(_this.data, function(err, resp) {
            if (err) {
                return false;
            } else if (options && options.envoi == true) {
                actionIntervention.envoi(resp, closeTab);
            } else if (options && options.annulation) {
                actionIntervention.annulation(resp, closeTab);
            } else if (options && options.verification) {
                actionIntervention.verification(resp, closeTab);
            } else {
                closeTab();
            }
        })

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
        });
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
        if (id) {
            dialog.absence.open(id, _this.searchArtisans())
        }
    }


    $scope.getStaticMap = function() {
        var q = "?width=" + Math.round($window.outerWidth * 0.8);
        if (_this.data.client && _this.data.client.address && _this.data.client.address.latLng)
            q += ("&origin=" + _this.data.client.address.latLng);
        if (_this.data.artisan && _this.data.artisan.id)
            q += ("&destination=" + _this.data.artisan.address.lt + "," + _this.data.artisan.address.lg);
        return "/api/mapGetStatic" + q;
    }




}

angular.module('edison').controller('InterventionController', InterventionCtrl);
