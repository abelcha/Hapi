angular.module('edison')
    .factory('Devis', function(openPost, $window, $rootScope, $location, LxNotificationService, LxProgressService, dialog, edisonAPI, textTemplate) {
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
            console.log('yay')
            edisonAPI.devis.save(_this)
                .then(function(resp) {
                    console.log('resp')
                    var validationMessage = _.template("Les données du devis {{id}} ont à été enregistré")(resp.data);
                    LxNotificationService.success(validationMessage);
                    if (typeof cb === 'function')
                        cb(null, resp.data)
                }, function(error) {
                    console.log('err')
                    LxNotificationService.error(error.data);
                    if (typeof cb === 'function')
                        cb("une erreur est " + error.data)
                }).catch(function(e) {
                    console.log('ERRRR:>', e)
                })
        };

        Devis.prototype.devisPreview = function() {
            if (!this.client.nom || !this.client.prenom || !this.client.address.r || !this.client.address.v ||  !this.client.address.cp || !this.client.address.n) {
                return LxNotificationService.error('Les coordonées du devis sont incompletes');
            }
            if (!this.produits || !this.produits.length) {
                return LxNotificationService.error('Veuillez renseigner au moins 1 produits');
            }
            openPost('/api/intervention/devisPreview', {
                data: JSON.stringify(this),
                html: true
            })
        }

        Devis.prototype.sendDevis = function(cb) {
            var _this = this;
            var preview = Devis(this).devisPreview.bind(this)
            dialog.getTextDevis(preview, {
                text: textTemplate.mail.devis.envoi.bind(_this)($rootScope.user),
                width: "900px",
                height: "700px"
            }, function(text) {
                LxProgressService.circular.show('#5fa2db', '#globalProgress');
                edisonAPI.devis.envoi(_this.id, {
                    text: text,
                }).success(function(resp) {
                    LxProgressService.circular.hide()
                    var validationMessage = _.template("le devis {{id}} à été envoyé")(_this);
                    LxNotificationService.success(validationMessage);
                    if (typeof cb === 'function') {
                        console.log('yes cb')
                        cb(null, resp);
                    }
                }, function(err) {
                    LxProgressService.circular.hide()
                    var validationMessage = _.template("L'envoi du devis {{id}} à échoué\n")(_this)
                    if (err && err.data && typeof err.data === 'string')
                        validationMessage += ('\n(' + err.data + ')')
                    LxNotificationService.error(validationMessage);
                    if (typeof cb === 'function')
                        cb(err);
                }).catch(function(err) {
                    LxProgressService.circular.hide()
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
