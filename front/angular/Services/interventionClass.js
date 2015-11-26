angular.module('edison')
    .factory('Intervention', function($location, $window, openPost, LxNotificationService, LxProgressService, dialog, user, config, edisonAPI, Devis, $rootScope, textTemplate) {
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

        Intervention.prototype.validerReglement = function(cb) {
            var _this = this;
            dialog.validationReglement(this, function(err, resp) {
                if (err) {
                    return cb && cb(err);
                }
                edisonAPI.intervention.save(_this).then(function(resp) {
                    LxNotificationService.success("L'intervention " + _this.id + " est modifié");
                }, function(err) {
                    LxNotificationService.error("Une erreur est survenu (" + err.data + ")");
                });
            })
        };


        Intervention.prototype.validerPaiement = function(cb) {
            var _this = this;
            dialog.validationPaiement(this, function(err, resp) {
                if (err) {
                    return cb && cb(err);
                }
                edisonAPI.intervention.save(_this).then(function(resp) {
                    LxNotificationService.success("L'intervention " + _this.id + " est modifié");
                }, function(err) {
                    LxNotificationService.error("Une erreur est survenu (" + err.data + ")");
                });
            })
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


        Intervention.prototype.sendFactureAcquitte = function(cb) {
            var _this = this;
            var datePlain = moment(this.date.intervention).format('LL');
            var template = textTemplate.mail.intervention.factureAcquitte.bind(_this)(datePlain)
            var mailText = (_.template(template)(this))
            dialog.envoiFacture(_this, mailText, true, function(err, text, acquitte, date) {
                if (err)
                    return cb('nope')
                LxProgressService.circular.show('#5fa2db', '#globalProgress');
                edisonAPI.intervention.sendFactureAcquitte(_this.id, {
                    text: text,
                    acquitte: acquitte,
                    date: date,
                    data: _this
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

        Intervention.prototype.sendFacture = function(cb) {
            var _this = this;
            var datePlain = moment(this.date.intervention).format('LL');
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
            var text = textTemplate.sms.intervention.demande.bind(this)(user, config);
            text = _.template(text)(this)
            dialog.getFileAndText(_this, text, [], function(err, text) {
                if (err) {
                    return cb(err)
                }
                edisonAPI.sms.send({
                    dest: _this.sst.nomSociete,
                    text: text,
                    to: _this.sst.telephone.tel1,
                }).success(function(resp) {
                    var validationMessage = _.template("Un sms a été envoyé à M. {{sst.representant.nom}}")(_this)
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
        Intervention.prototype.save = function(cb) {
            var _this = this;

            var fournitureSansFournisseur = _.find(this.fourniture, function(e) {
                    return !e.fournisseur;
                })
                /*            if (_.get(this, 'client.telephone.tel1.length') !== 10) {
                                LxNotificationService.error("Le telephone est invalide");
                                return cb("Bad Phone")
                            }*/

            if (fournitureSansFournisseur) {
                LxNotificationService.error("Veuillez renseigner un fournisseur");
                return cb(fournitureSansFournisseur)
            }
            edisonAPI.intervention.save(_this)
                .then(function(resp) {
                    var validationMessage = _.template("Les données de l'intervention {{id}} ont à été enregistré.")(resp.data)
                    if ((_this.tmpID && _this.sst) || (_this.sst__id && _this.sst && _this.sst__id !== _this.sst.id) && !_this.sst.tutelle) {
                        validationMessage += "\n\n Un sms à été envoyé";
                    }
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
            if (!Intervention(_this).isEnvoyable()) {
                return LxNotificationService.error("Vous ne pouvez pas envoyer cette intervention");
            }
            var defaultText = textTemplate.sms.intervention.envoi.bind(_this)(user);
            dialog.envoiIntervention(_this, defaultText, function(err, text, file) {
                if (err)
                    return cb && cb(err)
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
            dialog.getCauseAnnulation(_this, function(err, causeAnnulation, reinit, sms, textSms) {
                if (err) {
                    return typeof cb === 'function' && cb('err');
                }
                edisonAPI.intervention.annulation(_this.id, {
                        causeAnnulation: causeAnnulation,
                        reinit: reinit,
                        sms: sms,
                        textSms: textSms
                    })
                    .then(function(resp) {
                        console.log('==>', !!sms, !!textSms)
                        var msg = "L'intervention {{id}} est annulé";
                        if (sms) {
                            msg += "\nUn sms à été envoyé au SST";
                        }
                        var validationMessage = _.template(msg)(resp.data)
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
            console.log('==>', Intervention(this).isVerifiable())
            if (!Intervention(this).isVerifiable()) {
                return LxNotificationService.error("Vous ne pouvez pas verifier cette intervention");
            }
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
            if (!Intervention(this).isVerifiable()) {
                return LxNotificationService.error("Vous ne pouvez pas verifier cette intervention");
            }
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


        Intervention.prototype.recouvrement = function(cb) {
            var _this = this;
            dialog.recouvrement(_this, function(inter) {
                Intervention(inter).save(function(err, resp) {
                    return (cb || _.noop)()
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


        Intervention.prototype.isEnvoyable = function() {
            if (!this.sst) {
                return false;
            }
            if (this.sst.subStatus === 'QUA' ||  this.sst.blocked) {
                return false;
            }
            if (this.sst.subStatus === 'NEW' || this.sst.subStatus === 'TUT') {
                return user.root || user.service === 'PARTENARIAT'
            }
            return _.includes(["ANN", "APR", "ENC", undefined], this.status)
        }

        Intervention.prototype.isVerifiable = function() {
            if (!this.artisan) {
                return false;
            }
            if (this.sst.subStatus === 'QUA' ||  this.sst.blocked) {
                return false;
            }
            if (this.sst.subStatus === 'NEW' || this.sst.subStatus === 'TUT') {
                return user.root || user.service === 'PARTENARIAT'
            }
            return this.status === 'ENC'
        }



        return Intervention;
    });
