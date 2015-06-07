angular.module('edison')
    .factory('actionIntervention', ['$window', 'LxNotificationService', 'dialog', 'edisonAPI',
        function($window, LxNotificationService, dialog, edisonAPI) {
            "use strict";
            return {
                envoiFacture: function(inter, cb) {
                    dialog.envoiFacture(inter, function(text, acquitte, date) {
                        edisonAPI.intervention.envoiFacture(inter.id, {
                            text: text,
                            acquitte: acquitte,
                            date: date,
                            data: inter,
                        }).success(function(resp) {
                            var validationMessage = _.template("La facture de l'intervention {{id}} à été envoyé")(inter)
                            LxNotificationService.success(validationMessage);
                            if (typeof cb === 'function')
                                cb(null, resp);
                        }).catch(function(err) {
                            var validationMessage = _.template("L'envoi de la facture {{id}} à échoué")(inter)
                            LxNotificationService.error(validationMessage);
                            if (typeof cb === 'function')
                                cb(err);
                        })

                    })
                },
                smsArtisan: function(inter, cb) {
                    dialog.getText({
                        title: "Texte du SMS",
                        text: "\nEdison Service"
                    }, function(text) {
                        edisonAPI.sms.save({
                            link: inter.artisan.id,
                            origin: inter.id || inter.tmpID,
                            text: text,
                            to: "0633138868"
                        }).success(function(resp) {
                            if (typeof cb === 'function')
                                cb(null, resp);
                        }).catch(function(err) {
                            if (typeof cb === 'function')
                                cb(err);
                        })
                    })
                },
                callArtisan: function(inter, cb) {
                    var now = Date.now();
                    $window.open('callto:' + inter.artisan.telephone.tel1, '_self', false)
                    dialog.choiceText({
                        title: 'Nouvel Appel',
                    }, function(response, text) {
                        edisonAPI.call.save({
                            date: now,
                            to: inter.artisan.telephone.tel1,
                            link: inter.artisan.id,
                            origin: inter.id || inter.tmpID || 0,
                            description: text,
                            response: response
                        }).success(function(resp) {
                            if (typeof cb === 'function')
                                cb(null, resp);
                        }).catch(function(err) {
                            if (typeof cb === 'function')
                                cb(err);
                        })
                    })
                },
                save: function(inter, cb) {
                    edisonAPI.intervention.save(inter)
                        .then(function(resp) {
                            console.log("yey")
                            var validationMessage = _.template("Les données de l'intervention {{id}} ont à été enregistré")(resp.data)
                            LxNotificationService.success(validationMessage);
                            if (typeof cb === 'function')
                                cb(null, resp.data)
                        }).catch(function(error) {
                            LxNotificationService.error(error.data);
                            if (typeof cb === 'function')
                                cb(error.data)
                        });
                },
                envoi: function(inter, cb) {
                    dialog.getFileAndText(inter, inter.files, function(text, file) {
                        edisonAPI.intervention.envoi(inter.id, {
                            sms: text,
                            file: file
                        }).then(function(resp) {
                            var validationMessage = _.template("L'intervention {{id}} est envoyé")(resp.data)
                            LxNotificationService.success(validationMessage);
                            if (typeof cb === 'function')
                                cb(null, resp.data)

                        }).catch(function(error) {
                            LxNotificationService.error(error.data);
                            if (typeof cb === 'function')
                                cb(error.data);
                        });
                    })
                },
                annulation: function(inter, cb) {
                    edisonAPI.intervention.annulation(inter.id)
                        .then(function(resp) {
                            console.log(resp.data)
                            var validationMessage = _.template("L'intervention {{id}} est annulé")(resp.data)
                            LxNotificationService.success(validationMessage);
                            if (typeof cb === 'function')
                                cb(null, resp.data)
                        });
                },
                verification: function(inter, cb) {
                    edisonAPI.intervention.verification(inter.id)
                        .then(function(resp) {
                            var validationMessage = _.template("L'intervention {{id}} est vérifié")(resp.data)
                            LxNotificationService.success(validationMessage);
                            if (typeof cb === 'function')
                                cb(resp.data);
                        }).catch(function(error) {
                            LxNotificationService.error(error.data);
                            if (typeof cb === 'function')
                                cb(error.data);
                        })
                }
            }
        }
    ]);
