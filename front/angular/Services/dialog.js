angular.module('edison').factory('dialog', ['$mdDialog', 'edisonAPI', 'config', function($mdDialog, edisonAPI, config) {
    "use strict";

    return {
        verification: function(inter, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog, config) {
                    $scope.data = inter
                    $scope.config = config;
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        $scope.inter = inter;
                        if (!cancel) {
                            cb(inter);
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
        envoiFacture: function(inter, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    var template = "{{client.civilite}} {{client.nom}}, \n" +
                        "Vous trouverez ci-joint la facture de notre intervention\n" +
                        "Cordialement\n" +
                        "Edison Services"
                    $scope.text = _.template(template)(inter);
                    $scope.date = new Date();
                    $scope.acquitte = false;
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (!cancel) {
                            cb($scope.text, $scope.acquitte, $scope.date);
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
        addProd: function( cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    $scope.answer = function(resp, text) {
                        $mdDialog.hide();
                        return cb({
                             quantite: $scope.quantite,
                             ref: $scope.ref,
                             title: $scope.title,
                             desc: $scope.title,
                             pu: $scope.pu
                         });
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
                            return false;
                        $mdDialog.hide();
                        if (resp)
                            return cb(resp);
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
        getFileAndText: function(data, text, files, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {

                    $scope.xfiles = _.clone(files ||  []);
                    $scope.smsText = text;
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (cancel === false) {
                            console.log('-->', $scope.addedFile)
                            return cb($scope.smsText, $scope.addedFile);
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
        absence: function(cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    $scope.absenceTime = 'TODAY';
                    $scope.absence = [{
                        title: 'Toute la journée',
                        value: 'TODAY'
                    }, {
                        title: '1 Heure',
                        value: '1'
                    }, {
                        title: '2 Heure',
                        value: '2'
                    }, {
                        title: '3 Heure',
                        value: '3'
                    }, {
                        title: '4 Heure',
                        value: '4'
                    }]
                    $scope.hide = function() {
                        $mdDialog.hide();
                    };
                    $scope.cancel = function() {
                        $mdDialog.cancel();
                    };
                    $scope.answer = function(answer) {
                        $mdDialog.hide(answer);
                        var hours = 0;
                        if (answer === "TODAY") {
                            hours = 23 - (new Date()).getHours() + 1;
                        } else {
                            hours = parseInt(answer);
                        }
                        var start = new Date();
                        var end = new Date();
                        end.setHours(end.getHours() + hours)
                        cb(start, end);

                    };
                },
                templateUrl: '/DialogTemplates/absence.html',
            });
        }
    }

}]);
