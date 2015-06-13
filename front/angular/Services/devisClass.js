angular.module('edison')
    .factory('Devis', ['$window', 'LxNotificationService', 'dialog', 'edisonAPI', 'textTemplate',
        function($window, LxNotificationService, dialog, edisonAPI, textTemplate) {
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
            Devis.prototype.envoi = function(cb) {
                // console.log(_.template(textTemplate.mail.devis.envoi)(_this));
                var _this = this;
                dialog.getText({
                    title: "Texte envoi devis",
                    text: _.template("Voici le devis de l'inter {{id}}\nEdison Services")(_this)
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
                        var validationMessage = _.template("L'envoi du devis {{id}} à échoué")(_this)
                        LxNotificationService.error(validationMessage);
                        if (typeof cb === 'function')
                            cb(err);
                    })

                })
            }
            return Devis;
        }
    ]);
