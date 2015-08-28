angular.module('edison')
    .factory('Intervention', function($location, $window, openPost, LxNotificationService, LxProgressService, dialog, edisonAPI, Devis, $rootScope, textTemplate) {
        "use strict";

        var Intervention = function(data) {
            if (!(this instanceof Intervention)) {
                return new Intervention(data);
            }
            for (var k in data) {
                this[k] = data[k];
            }
        };

        var appelLocal = function(tel) {
            console.log('---->', tel);
            if (tel) {
                $window.open('callto:' + tel, '_self', false);
            }
        }

        Intervention.prototype.callTel1 = function() {
            appelLocal(this.client.telephone.tel1)
        }
        Intervention.prototype.callTel2 = function() {
            appelLocal(this.client.telephone.tel2)
        }
        Intervention.prototype.callTel3 = function() {
            appelLocal(this.client.telephone.tel3)
        }

        Intervention.prototype.callSst1 = function() {
            appelLocal(this.sst.telephone.tel1)
        }
        Intervention.prototype.callSst2 = function() {
            appelLocal(this.sst.telephone.tel2)
        }

        Intervention.prototype.callPayeur1 = function() {
            appelLocal(this.facture.tel)
        }

        Intervention.prototype.callPayeur2 = function() {
            appelLocal(this.facture.tel2)
        }

        Intervention.prototype.typeOf = function() {
            return 'Intervention';
        };
        Intervention.prototype.envoiDevis = function(cb) {
            Devis().envoi.bind(this)(cb)
        };


        Intervention.prototype.demarcher = function(cb) {
            edisonAPI.intervention.demarcher(this.id).success(function() {
                LxNotificationService.success("Vous demarchez l'intervention");
            }, function() {
                LxNotificationService.error("Une erreur est survenu");
            })
        };

        Intervention.prototype.facturePreview = function() {
            openPost('/api/intervention/facturePreview', {
                data: JSON.stringify(this),
                html: true
            })
        }

        Intervention.prototype.factureAcquittePreview = function() {

            openPost('/api/intervention/factureAcquittePreview', {
                data: JSON.stringify(this),
                html: true
            })
        }


        Intervention.prototype.sendFacture = function(cb) {
            var _this = this;
            var datePlain = moment(this.date.intervention).format('LL');
            console.log(_this)
            var template = textTemplate.mail.intervention.envoiFacture.bind(_this)(datePlain)
            var mailText = (_.template(template)(this))
            dialog.envoiFacture(_this, mailText, false, function(err, text, acquitte, date) {
                if (err)
                    return cb('nope')
                LxProgressService.circular.show('#5fa2db', '#globalProgress');
                edisonAPI.intervention.sendFacture(_this.id, {
                    text: text,
                }).success(function(resp) {
                    LxProgressService.circular.hide();
                    var validationMessage = _.template("La facture de l'intervention {{id}} à été envoyé")(_this)
                    LxNotificationService.success(validationMessage);
                    if (typeof cb === 'function')
                        cb(null, resp);
                }).catch(function(err) {
                    LxProgressService.circular.hide();
                    var validationMessage = _.template("L'envoi de la facture {{id}} à échoué\n" + "(" + err.data + ")")(_this)
                    LxNotificationService.error(validationMessage);
                    if (typeof cb === 'function')
                        cb(err);
                })
            })
        }

        Intervention.prototype.ouvrirFicheV1 = function() {
            $window.open('http://electricien13003.com/alvin/5_Gestion_des_interventions/show_res_bis_2.php?id_client=' + this.id)
        }
        Intervention.prototype.ouvrirFiche = function() {
            $location.url('/intervention/' + this.id)
        }
        Intervention.prototype.ouvrirRecapSST = function() {
            $location.url(['/artisan', this.artisan.id, 'recap'].join('/') + '#interventions')
        }
        Intervention.prototype.smsArtisan = function(cb) {
            var _this = this;
            var text = textTemplate.sms.intervention.demande.bind(_this)($rootScope.user)
            dialog.getFileAndText(_this, text, [], function(err, text) {
                if (err) {
                    return cb(err)
                }
                edisonAPI.sms.send({
                    link: _this.artisan.id,
                    origin: _this.id || _this.tmpID,
                    text: text,
                    to: $rootScope.user.portable || "0633138868"
                }).success(function(resp) {
                    var validationMessage = _.template("Un sms a été envoyé à M. {{artisan.representant.nom}}")(_this)
                    LxNotificationService.success(validationMessage);
                    if (typeof cb === 'function')
                        cb(null, resp);
                }).catch(function(err) {
                    LxNotificationService.success("L'envoi du sms a échoué");
                    if (typeof cb === 'function')
                        cb(err);
                })
            })
        };

        Intervention.prototype.callClient = function(cb) {
            var _this = this;
            var now = Date.now();
            $window.open('callto:' + _this.client.telephone.tel1, '_self', false)
            dialog.choiceText({
                subTitle: _this.client.telephone.tel1,
                title: 'Nouvel Appel Client',
            }, function(response, text) {
                edisonAPI.call.save({
                    date: now,
                    to: _this.client.telephone.tel1,
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
        }
        Intervention.prototype.callArtisan = function(cb) {
            var _this = this;
            var now = Date.now();
            $window.open('callto:' + _this.artisan.telephone.tel1, '_self', false)
            dialog.choiceText({
                subTitle: _this.artisan.telephone.tel1,
                title: 'Nouvel Appel',
            }, function(response, text) {
                edisonAPI.call.save({
                    date: now,
                    to: _this.artisan.telephone.tel1,
                    link: _this.artisan.id,
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
        Intervention.prototype.absenceArtisan = function(cb) {
            var _this = this;
            dialog.absence(function(start, end) {
                edisonAPI.artisan.setAbsence(_this.artisan.id, {
                    start: start,
                    end: end
                }).success(cb)
            })
        }
        Intervention.prototype.save = function(cb) {
            var _this = this;
            edisonAPI.intervention.save(_this)
                .then(function(resp) {
                    var validationMessage = _.template("Les données de l'intervention {{id}} ont à été enregistré")(resp.data)
                    LxNotificationService.success(validationMessage);
                    if (typeof cb === 'function')
                        cb(null, resp.data)
                }, function(error) {
                    LxNotificationService.error(error.data);
                    if (typeof cb === 'function')
                        cb(error.data)
                });
        };

        Intervention.prototype.envoi = function(cb) {
            var _this = this;
            var defaultText = textTemplate.sms.intervention.envoi.bind(_this)($rootScope.user);
            dialog.getFileAndText(_this, defaultText, _this.files, function(err, text, file) {
                if (err)
                    return cb(err)
                LxProgressService.circular.show('#5fa2db', '#globalProgress');
                edisonAPI.intervention.envoi(_this.id, {
                    sms: text,
                    file: file
                }).then(function(resp) {
                    LxProgressService.circular.hide();
                    console.log('ok')
                    var validationMessage = _.template("L'intervention est envoyé")
                    LxNotificationService.success(validationMessage);
                    if (typeof cb === 'function')
                        cb(null, resp.data)

                }, function(error) {
                    LxProgressService.circular.hide();
                    console.log('error')
                    LxNotificationService.error(error.data);
                    if (typeof cb === 'function')
                        cb(error.data);
                });
            })
        };


        Intervention.prototype.reactivation = function(cb) {
            var _this = this;
            edisonAPI.intervention.reactivation(this.id).then(function() {
                LxNotificationService.success("L'intervention " + _this.id + " est à programmer");
            })
        };

        Intervention.prototype.annulation = function(cb) {
            var _this = this;
            dialog.getCauseAnnulation(function(err, causeAnnulation) {
                if (err) {
                    return cb('err');
                }
                edisonAPI.intervention.annulation(_this.id, causeAnnulation)
                    .then(function(resp) {
                        var validationMessage = _.template("L'intervention {{id}} est annulé")(resp.data)
                        LxNotificationService.success(validationMessage);
                        if (typeof cb === 'function') {
                            cb(null, resp.data)
                        }
                    });
            });
        };


        Intervention.prototype.envoiFactureVerif = function(cb) {
            var _this = this;

            if (!this.produits.length) {
                LxNotificationService.error("Veuillez renseigner les produits");
                return cb('nope')
            }
            _this.sendFacture(function(err) {
                if (err)
                    return cb(err);
                _this.verificationSimple(cb)
            })
        }

        Intervention.prototype.verificationSimple = function(cb) {
            var _this = this;
            LxProgressService.circular.show('#5fa2db', '#globalProgress');

            edisonAPI.intervention.verification(_this.id)
                .then(function(resp) {
                    LxProgressService.circular.hide()
                    var validationMessage = _.template("L'intervention {{id}} est vérifié")(resp.data)
                    LxNotificationService.success(validationMessage);
                    if (typeof cb === 'function') {
                        cb(null, resp.data);
                    }
                }, function(error) {
                    LxProgressService.circular.hide()
                    LxNotificationService.error(error.data);
                    cb(error.data);
                })
        }

        Intervention.prototype.verification = function(cb) {
            var _this = this;
            if (!_this.reglementSurPlace) {
                return $location.url('/intervention/' + this.id)
            }
            dialog.verification(_this, function(inter) {
                Intervention(inter).save(function(err, resp) {
                    if (!err) {
                        return Intervention(resp).verificationSimple(cb);
                    }
                });
            });
        }
        Intervention.prototype.fileUpload = function(file, cb) {

            var _this = this;

            if (file) {
                LxProgressService.circular.show('#5fa2db', '#fileUploadProgress');
                edisonAPI.file.upload(file, {
                    link: _this.id || _this.tmpID,
                    model: 'intervention',
                    type: 'fiche'
                }).success(function(resp) {
                    LxProgressService.circular.hide();
                    if (typeof cb === 'function')
                        cb(null, resp);
                }).catch(function(err) {
                    LxProgressService.circular.hide();
                    if (typeof cb === 'function')
                        cb(err);
                })
            }
        }

        Intervention.prototype.editCB = function() {
            var _this = this;
            edisonAPI.intervention.getCB(this.id).success(function(resp) {
                _this.cb = resp;
            }, function(error) {
                LxNotificationService.error(error.data);
            })
        }

        Intervention.prototype.reinitCB = function() {
            this.cb = {
                number: 0
            }
        }



        return Intervention;
    });
