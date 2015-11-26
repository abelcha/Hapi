angular.module('edison').factory('dialog', function(openPost, $mdDialog, edisonAPI, config, $window, LxNotificationService) {
    "use strict";

    return {

        declareBug: function(tabs, cb) {
            $mdDialog.show({
                controller: function($scope, $mdDialog, config) {
                    $scope.resp = {
                        location: tabs.getCurrentTab().path,
                    }
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (!cancel) {
                            return cb(null, $scope.resp)
                        }
                    }
                },
                templateUrl: '/DialogTemplates/declare-bug.html',
            });
        },

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
        recouvrement: function(inter, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog, config) {
                    $scope.data = inter
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (!cancel) {
                            cb(inter);
                        }
                    }
                },
                templateUrl: '/DialogTemplates/recouvrement.html',
            });
        },
        validationReglement: function(inter, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    $scope.data = inter
                    $scope.answer = function(resp) {
                        $scope.data = inter;
                        $mdDialog.hide();
                        if (resp === null) {
                            return cb('nope')
                        }
                        if ($scope.data.compta.reglement.montant !== 0) {
                            $scope.data.compta.reglement.recu = resp;
                        }
                        return cb(null, $scope.data);
                    }
                },
                templateUrl: '/DialogTemplates/validationReglement.html',
            });
        },
        validationPaiement: function(inter, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    $scope.data = inter
                    $scope.preview = function() {
                        openPost('/api/intervention/autofacture', {
                            data: JSON.stringify($scope.data),
                            html: true
                        });
                    }
                    $scope.answer = function(resp) {
                        $scope.data = inter;
                        $mdDialog.hide();
                        if (resp === null) {
                            return cb('nope')
                        }
                        return cb(null, $scope.data);
                    }
                },
                templateUrl: '/DialogTemplates/validationPaiement.html',
            });
        },
        facturierDeviseur: function(artisan, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog, config) {
                    $scope.sst = artisan
                    $scope.deviseur = true;
                    $scope.facturier = true;
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
        envoiFacture: function(inter, text, showAcquitte, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    $scope.text = text
                    $scope.date = new Date();
                    $scope.showAcquitte = showAcquitte;
                    $scope.acquitte = showAcquitte;
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
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (!cancel) {
                            return cb($scope.prod);
                        }
                    }
                },
                templateUrl: '/DialogTemplates/getProd.html',
            });
        },
        getCauseAnnulation: function(inter, cb) {
            $mdDialog.show({
                controller: function($scope, config) {
                    $scope.causeAnnulation = config.causeAnnulation;
                    inter.datePlain = moment(inter.date.intervention).format('DD/MM/YYYY')
                    $scope.textSms = _.template("L'intervention {{id}} chez {{client.civilite}} {{client.nom}} à {{client.address.v}} le {{datePlain}} a été annulé. \nMerci de ne pas intervenir. \nEdison Services")(inter)
                    $scope.answer = function(resp) {
                        if (resp && !$scope.ca) {
                            return LxNotificationService.error("Veuillez renseigner une raison d'annulation");
                        }
                        $mdDialog.hide();
                        if (resp)
                            return cb(null, $scope.ca, $scope.reinit, $scope.sendSms, $scope.textSms);
                        return cb('nope');
                    }
                },
                templateUrl: '/DialogTemplates/causeAnnulation.html',
            });
        },
        sendContrat: function(options, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    $scope.options = options;
                    console.log(options.signe)
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
                    $scope.Math = Math
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
        envoiIntervention: function(data, text, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    $scope.data = data;
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
                templateUrl: '/DialogTemplates/envoi.html',
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
