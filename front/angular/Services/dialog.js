angular.module('edison').factory('dialog', ['$mdDialog', 'edisonAPI', 'config', function($mdDialog, edisonAPI, config) {


    return {
        recap: function(inters) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog, config) {
                    $scope.inters = inters;
                    $scope.answer = function() {
                        $mdDialog.hide();
                    }
                },
                templateUrl: '/DialogTemplates/recapList.html',
            });
        },
        callsList: function(sst) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog, config) {
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
                controller: function DialogController($scope, $mdDialog, config) {
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
                controller: function DialogController($scope, $mdDialog, config) {
                    $scope.options = options;
                    $scope.answer = function(resp, text) {
                        $mdDialog.hide();
                        return cb(resp, text);
                    }
                },
                templateUrl: '/DialogTemplates/choiceText.html',
            });
        },
        getText: function(options, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog, config) {
                    $scope.options = options;
                    $scope.answer = function() {
                        $mdDialog.hide();
                        return cb($scope.options.text);
                    }
                },
                templateUrl: '/DialogTemplates/text.html',
            });
        },
        getFileAndText: function(data, files, cb) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog, config) {

                    var getSMS = function() {
                        var sms = data.id ? "OS " + data.id + ". \n" : "";
                        sms += "Intervention chez " + data.client.civilite + " " +
                            data.client.prenom + " " + data.client.nom + " au " +
                            data.client.address.n + " " + data.client.address.r + " " +
                            data.client.address.cp + ", " + data.client.address.v + " le " +
                            moment(data.date.intervention).format("LLLL") + ". \n";
                        sms += data.prixAnnonce ? data.prixAnnonce + "€ HT. " : "Pas de prix annoncé. ";
                        sms += "\nMerci de prendre rdv avec le client au " + data.client.telephone.tel1;
                        sms += data.client.telephone.tel2 ? "ou au " + data.client.telephone.tel2 : ""
                        return sms + ".\nEdison Services."
                    }
                    $scope.xfiles = files
                    $scope.smsText = getSMS();
                    $scope.answer = function(cancel) {
                        $mdDialog.hide();
                        if (cancel == false) {
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
        absence: {
            open: function(id, cb) {
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
                                hours = 23 - (new Date).getHours() + 1;
                            } else {
                                hours = parseInt(answer);
                            }
                            start = new Date;
                            end = new Date;
                            end.setHours(end.getHours() + hours)
                            edisonAPI.artisan.setAbsence(id, {
                                start: start,
                                end: end
                            }).success(cb)
                        };
                    },
                    templateUrl: '/DialogTemplates/absence.html',
                });
            }
        }
    }

}]);
