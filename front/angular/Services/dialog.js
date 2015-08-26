angular.module('edison').factory('dialog', function($mdDialog, edisonAPI, config, $window, LxNotificationService) {
    "use strict";

    return {
        verification: function(inter, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog, config) {
                    $scope.data = inter
                    $scope.config = config;
                    $scope.answer = function(cancel) {
                        $scope.window = $window;
                        $scope.inter = inter;
                        if (!cancel) {
                            if (!$scope.inter.prixFinal) {
                                LxNotificationService.error("Veuillez renseigner un prix final");
                            } else {
                                $mdDialog.hide();
                                cb(inter);
                            }
                        } else {
                                $mdDialog.hide();
                        }
                    }
                },
                templateUrl: '/DialogTemplates/verification.html',
            });
        },
        facturierDeviseur: function(artisan, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog, config) {
                    $scope.sst = artisan
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();

                        if (!cancel) {
                            cb($scope.facturier, $scope.deviseur);
                        }
                    }
                },
                templateUrl: '/DialogTemplates/facturierDeviseur.html',
            });
        },
        envoiFacture: function(inter, text, options, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    $scope.text = text
                    $scope.date = new Date();
                    $scope.options = options
                    $scope.acquitte = false;
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (!cancel) {
                            cb(null, $scope.text, $scope.acquitte, $scope.date);
                        } else {
                            cb('nope')
                        }
                    }
                },
                templateUrl: '/DialogTemplates/envoiFacture.html',
            });
        },
        recap: function(inters) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog, config) {
                    $scope.inters = inters;
                    $scope.config = config
                    $scope.answer = function() {
                        $mdDialog.hide();
                    }
                },
                templateUrl: '/DialogTemplates/recapList.html',
            });
        },
        callsList: function(sst) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    $scope.sst = sst;
                    $scope.answer = function() {
                        $mdDialog.hide();
                    }
                },
                templateUrl: '/DialogTemplates/callsList.html',
            });
        },
        smsList: function(sst) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    $scope.sst = sst;
                    $scope.answer = function() {
                        $mdDialog.hide();
                    }
                },
                templateUrl: '/DialogTemplates/smsList.html',
            });
        },
        choiceText: function(options, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    $scope.options = options;
                    $scope.answer = function(resp, text) {
                        $mdDialog.hide();
                        return cb(resp, text);
                    }
                },
                templateUrl: '/DialogTemplates/choiceText.html',
            });
        },
        addProd: function(cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog, $window) {
                    $scope.pu = 0;
                    $scope.window = $window
                    $scope.quantite = 1;
                    $scope.prod = {
                        quantite: 1,
                        pu: 0,
                        title: "",
                        ref: ""
                    }
                    $scope.$watch('prod', function() {
                        $scope.prod.ref = $scope.prod.ref.toUpperCase();
                        $scope.prod.title = $scope.prod.title.toUpperCase();
                        $scope.prod.desc = $scope.prod.title;
                        $scope.prod.pu = $scope.prod.pu;
                        $scope.prod.quantite = $scope.prod.quantite;
                    }, true)
                    $scope.answer = function(resp, text) {
                        $mdDialog.hide();
                        return cb($scope.prod);
                    }
                },
                templateUrl: '/DialogTemplates/getProd.html',
            });
        },
        getCauseAnnulation: function(cb) {
            $mdDialog.show({
                controller: function($scope, config) {
                    $scope.causeAnnulation = config.causeAnnulation;
                    $scope.answer = function(resp) {
                        if (!$scope.ca && resp)
                            return cb('nope');
                        $mdDialog.hide();
                        if (resp)
                            return cb(null, resp);
                        return cb('nop')
                    }
                },
                templateUrl: '/DialogTemplates/causeAnnulation.html',
            });
        },
        sendContrat: function(options, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    options.signe = true;
                    $scope.options = options;
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (!cancel)
                            return cb($scope.options);
                    }
                },
                templateUrl: '/DialogTemplates/sendContrat.html',
            });
        },
        getText: function(options, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    $scope.options = options;
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (!cancel)
                            return cb($scope.options.text);
                    }
                },
                templateUrl: '/DialogTemplates/text.html',
            });
        },
        getTextDevis: function(previewFunction, options, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    $scope.options = options;
                    $scope.previewFunction = previewFunction;
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (!cancel)
                            return cb($scope.options.text);
                    }
                },
                templateUrl: '/DialogTemplates/textDevis.html',
            });
        },
        getFileAndText: function(data, text, files, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {

                    $scope.xfiles = _.clone(files ||  []);
                    $scope.smsText = text;
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (cancel === false) {
                            return cb(null, $scope.smsText, $scope.addedFile);
                        } else {
                            return cb('nope');
                        }
                    }
                },
                templateUrl: '/DialogTemplates/fileAndText.html',
            });
        },
        editProduct: {
            open: function(produit, cb) {
                $mdDialog.show({
                    controller: function DialogController($scope, $mdDialog) {
                        $scope.produit = _.clone(produit);
                        $scope.mdDialog = $mdDialog;
                        $scope.answer = function(p) {
                            $mdDialog.hide(p);
                            return cb(p);
                        }
                    },
                    templateUrl: '/DialogTemplates/edit.html',
                });
            }
        },
        selectSubProduct: function(elem, callback) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    $scope.elem = elem
                    $scope.answer = function(cancel, item) {
                        $mdDialog.hide();
                        if (!cancel) {
                            return callback(item)
                        }
                    }
                },
                templateUrl: '/DialogTemplates/selectSubProduct.html',
            });
        }
    }

});
