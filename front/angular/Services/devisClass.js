angular.module('edison')
    .factory('Devis', function(openPost, $window, $rootScope, $location, LxNotificationService, dialog, edisonAPI, textTemplate) {
        "use strict";
        var Devis = function(data) {
            if (!(this instanceof Devis)) {
                return new Devis(data);
            }
            for (var k in data) {
                this[k] = data[k];
            }
        }
        Devis.prototype.typeOf = function() {
            return 'Devis';
        }
        Devis.prototype.save = function(cb) {
            var _this = this;

            edisonAPI.devis.save(_this)
                .then(function(resp) {
                    var validationMessage = _.template("Les données du devis {{id}} ont à été enregistré")(resp.data);
                    LxNotificationService.success(validationMessage);
                    if (typeof cb === 'function')
                        cb(null, resp.data)
                }).catch(function(error) {
                    LxNotificationService.error(error.data);
                    if (typeof cb === 'function')
                        cb(error.data)
                });
        };

        Devis.prototype.devisPreview = function() {
            openPost('/api/intervention/devisPreview', {
                data: JSON.stringify(this),
                html: true
            })
        }

        Devis.prototype.envoi = function(cb) {
            console.log("envoiDevis")
            var _this = this;
            dialog.getText({
                title: "Texte envoi devis",
                text: textTemplate.mail.devis.envoi.bind(_this)($rootScope.user),
                width: "60%",
                height: "80%"
            }, function(text) {
                edisonAPI.devis.envoi(_this.id, {
                    text: text,
                    data: _this,
                }).success(function(resp) {
                    var validationMessage = _.template("le devis {{id}} à été envoyé")(_this);
                    LxNotificationService.success(validationMessage);
                    if (typeof cb === 'function')
                        cb(null, resp);
                }).catch(function(err) {
                    var validationMessage = _.template("L'envoi du devis {{id}} à échoué\n")(_this)
                    if (err && err.data && typeof err.data === 'string')
                        validationMessage += ('\n(' + err.data + ')')
                    LxNotificationService.error(validationMessage);
                    if (typeof cb === 'function')
                        cb(err);
                })

            })
        }
        Devis.prototype.annulation = function(cb) {
            var _this = this;
            dialog.getCauseAnnulation(function(causeAnnulation) {
                edisonAPI.devis.annulation(_this.id, causeAnnulation)
                    .then(function(resp) {
                        var validationMessage = _.template("Le devis {{id}} est annulé")(resp.data)
                        LxNotificationService.success(validationMessage);
                        if (typeof cb === 'function')
                            cb(null, resp.data)
                    });
            });
        };

        Devis.prototype.ouvrirFiche = function() {
            $location.url("/devis/" + this.id);
        }
        Devis.prototype.transfert = function() {
            $location.url("/intervention?devis=" + this.id);
        }
        return Devis;
    });
