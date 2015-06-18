angular.module('edison')
    .factory('Artisan', ['$window', '$rootScope', '$location', 'LxNotificationService', 'dialog', 'edisonAPI', 'textTemplate',
        function($window, $rootScope, $location, LxNotificationService, dialog, edisonAPI, textTemplate) {
            "use strict";
            var Artisan = function(data) {
                if (!(this instanceof Artisan)) {
                    return new Artisan(data);
                }
                for (var k in data) {
                    this[k] = data[k];
                }
            }
            Artisan.prototype.typeOf = function() {
                return 'Artisan';
            }
            Artisan.prototype.ouvrirFiche = function() {
                $location.url("/artisan/" + this.id);
            }
            Artisan.prototype.ouvrirRecap = function() {
                $location.url("/artisan/" + this.id + '/recap');
            }

            Artisan.prototype.call = function(cb) {
                var _this = this;
                var now = Date.now();
                $window.open('callto:' + _this.telephone.tel1, '_self', false)
                dialog.choiceText({
                    title: 'Nouvel Appel',
                }, function(response, text) {
                    edisonAPI.call.save({
                        date: now,
                        to: _this.telephone.tel1,
                        link: _this.id,
                        origin: _this.id || _this.tmpID || 0,
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
            };

            Artisan.prototype.save = function(cb) {
                console.log('save')
                var _this = this;

                edisonAPI.artisan.save(_this)
                    .then(function(resp) {
                        LxNotificationService.success("Les données ont à été enregistré");
                        if (typeof cb === 'function')
                            cb(null, resp.data)
                    }).catch(function(error) {
                        LxNotificationService.error(error.data);
                        if (typeof cb === 'function')
                            cb(error.data)
                    });
            };
            Artisan.prototype.envoiContrat = function(cb) {
                console.log("envoi")
                    /*  var _this = this;
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

                      })*/
            }

            Artisan.prototype.ouvrirFiche = function() {
                $location.url("/artisan/" + this.id);
            }
            return Artisan;
        }
    ]);
