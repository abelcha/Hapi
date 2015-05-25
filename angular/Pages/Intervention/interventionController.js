angular.module('edison').controller('InterventionController',
    function($window, $scope, $location, $routeParams, ngDialog, dialog, LxNotificationService, Upload, tabContainer, edisonAPI, produits, config, intervention, artisans, user) {
        $scope.artisans = artisans.data;
        $scope.config = config;
        $scope.tab = tabContainer.getCurrentTab();

        var id = parseInt($routeParams.id);
        if (!$scope.tab.data) {
            $scope.tab.setData(intervention.data);
            $scope.tab.data.sst = intervention.data.artisan ? intervention.data.artisan.id : 0;

            if ($routeParams.id.length > 12) {
                $scope.tab.isNew = true;
                $scope.tab.data.tmpID =  $routeParams.id;
                $scope.tab.setTitle('#' + moment((new Date(parseInt($scope.tab.data.tmpID))).toISOString()).format("HH:mm").toString());
            } else {
                $scope.tab.setTitle('#' + $routeParams.id);
                if (!intervention) {
                    alert("Impossible de trouver les informations !");
                    $location.url("/dashboard");
                    $scope.tabs.remove($scope.tab);
                    return 0;
                }
            }
        }
        $scope.showMap = false;
        $scope.produits = produits.init($scope.tab.data.produits ||  []);


        $scope.addProduct = function(prod) {
            produits.add(prod);
            $scope.searchProd = "";
        }

        $scope.clickUpload = function() {
            angular.element('.input-file__input').trigger('click');
        }
        $scope.previsualiseFacture = function() {
            var url = '/api/intervention/facturePreview?html=true&data=';
            $window.open(url + JSON.stringify($scope.tab.data), "_blank");
        }

        $scope.addComment = function() {
            $scope.tab.data.comments.push({
                login: user.data.login,
                text: $scope.commentText,
                date: new Date()
            })
            $scope.commentText = "";
        }

        $scope.changeCategorie = function(key) {
            $scope.tab.data.categorie = key;
        }

        $scope.onFileUpload = function(file) {
            if (file) {
                edisonAPI.uploadFile(file, {
                    link: $scope.tab.data.id || $scope.tab.data.tmpID,
                    model: 'intervention',
                    type: 'fiche'
                }).success(function() {
                    $scope.fileUploadText = "";
                    $scope.loadFilesList();
                })
            }
        }


        $scope.loadFilesList = function() {
            edisonAPI.getFilesList($scope.tab.data.id || $scope.tab.data.tmpID).then(function(result) {
                $scope.files = result.data;
            }, console.log)
        }
        $scope.loadFilesList();


        var action = {
            envoi: function(result) {
                dialog.addFiles.open($scope.tab.data, $scope.files, function(text, file) {
                    edisonAPI.envoiInter(result.data.id, {
                        sms: text,
                        file: file
                    }).then(function(res) {
                        LxNotificationService.success(res.data);

                    }).catch(function(error) {
                        console.log(error)
                        LxNotificationService.error(error.data);
                    });
                    $location.url("/interventions");
                    $scope.tabs.remove($scope.tab);
                })
            },
            annulation: function(result) {
                edisonAPI.annulationInter(result.data.id).then(function(res) {
                    LxNotificationService.success("L'intervention " + result.data.id + " à été annulé");
                    $scope.tab.data.status = "ANN"; 
                });
            },
            verification: function(result) {
                edisonAPI.verificationInter(result.data.id).then(function(res) {
                    LxNotificationService.success("L'intervention " + result.data.id + " à été vérifié");

                    $location.url("/interventions");
                    $scope.tabs.remove($scope.tab);
                }).catch(function(error) {
                    LxNotificationService.error(error.data);
                })
            }
        }

        $scope.saveInter = function(options) {
                edisonAPI.saveIntervention({
                    data: $scope.tab.data
                }).then(function(result) {
                    LxNotificationService.success("Les données de l'intervention " + result.data.id + " ont à été enregistré");
                    if (options && options.envoi == true) {
                        action.envoi(result);
                    } else if (options && options.annulation) {
                        action.annulation(result);
                    } else if (options && options.verification) {
                        action.verification(result);
                    } else {
                        console.log("here")
                        $location.url("/interventions");
                    }
                    $scope.tab.setData(intervention.data);
                }).catch(function(error) {
                    LxNotificationService.error(error.data);
                });
            }
            /*
                    $scope.saveInter = function(options) {
                        if (options && options.envoi == true) {
                            dialog.addFiles.open($scope.tab.data, $scope.files, function(files, text) {
                                console.log(files, text);
                            })
                        } else {
                            saveInter(options)
                        }

                    }*/

        $scope.clickOnArtisanMarker = function(event, sst) {
            $scope.tab.data.sst = sst.id;
        }

        $scope.searchArtisans = function() {
            console.log("search");
            edisonAPI.getNearestArtisans($scope.tab.data.client.address, $scope.tab.data.categorie)
                .success(function(result) {
                    $scope.nearestArtisans = result;
                });
        }
        if ($scope.tab.data.client.address)
            $scope.searchArtisans();


    });
