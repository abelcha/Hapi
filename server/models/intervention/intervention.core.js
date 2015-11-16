    var _ = require('lodash');
    module.exports = {
        name: 'intervention',
        Name: 'Intervention',
        NAME: 'INTERVENTION',
        redisCacheListName: 'INTERVENTION_CACHE_LIST',
        listChange: 'INTERVENTION_CACHE_LIST_CHANGE'
    }

    module.exports.redisTemporarySaving = function(id) {
        return 'INTERVENTION_TMP_SAVING___' + id;
    }
    module.exports.model = function() {
        return db.model('intervention');
    }

    module.exports.singleDumpUrl = function(id) {
        var key = requireLocal('config/_keys');
        return key.alvin.url + "dumpIntervention.php?devis=false&id=" + id + "&key=" + key.alvin.pass
    }

    module.exports.multiDumpUrl = function(limit) {
        var key = requireLocal('config/_keys');
        return key.alvin.url + "dumpIntervention.php?limit=" + limit + "&key=" + key.alvin.pass
    }


    module.exports.postUpdate = function(prev, curr, session) {

    }


    var sendArtisanChangedSms = function(curr) {
        setTimeout(function() {
            db.model('intervention').find({
                id: curr.id
            }).then(function(resp) {
                if (resp.status !== 'APR')  {
                    //si on a envoyer l'intervention entre temps
                    return false;
                }
                var moment = require('moment')
                var textTemplate = requireLocal('config/textTemplate');
                var config = requireLocal('config/dataList');
                var text = _.template(textTemplate.sms.intervention.demande.bind(curr)(session, config, moment))(curr)
                sms.send({
                    link: curr.sst.id,
                    origin: curr.id,
                    text: text,
                    to: envProd ? curr.sst.telephone.tel1 : '0633138868',
                })
            })
        }, 10000)
    }


    module.exports.postSave = function(prev, curr, session) {
        try {
            if (envProd && curr.artisan && curr.artisan.id && curr.artisan.subStatus !== 'TUT') {
                sendArtisanChangedSms(curr);
            }

            if (curr.devisOrigine) {
                db.model('devis').findOne({
                        id: curr.devisOrigine
                    })
                    .then(function(devis) {
                        if (!devis)
                            return false;
                        devis.status = "TRA";
                        devis.transfertId = curr.id;
                        devis.save()
                    })
            }

        } catch (e) {
            __catch(e)
        }

        if (curr.aDemarcher && !prev.aDemarcher) {
            edison.event('INTER_ADM')
                .login(session.login)
                .id(curr.id)
                .service('PARTENARIAT')
                .color('blue')
                .message(_.template("L'intervention {{id}} est à démarcher ({{client.address.v}} - {{client.address.cp}}) ")(curr))
                .send()
                .save()
        }

    }

    module.exports.preUpdate = function(prev, curr, session) {
        if (curr.artisan && curr.artisan.id && curr.artisan.id !== prev.artisan.id) {
            prev.status = 'APR';
        }
        if (curr.compta.reglement.recu && !prev.compta.reglement.recu) {
            curr.compta.reglement.historique.push({
                login: session.login,
                montant: curr.compta.reglement.avoir.montant,
            })
            if (!curr.compta.reglement.date) {
                curr.compta.reglement.date = Date.now()
                curr.compta.reglement.login = session.login
            }

        }
        if (curr.compta.paiement.ready && !prev.compta.paiement.ready) {
            curr.compta.paiement.login = session.login
            curr.compta.paiement.date = Date.now()
        }

        if (curr.sav && curr.sav.status === 'ENC' && prev.sav.status !== 'ENC') {

            edison.event('INTER_SAV')
                .login(session.login)
                .id(curr.id)
                .broadcast(curr.login.ajout)
                .color('blue')
                .message(_.template("Un S.A.V à été ouvert sur votre intervention {{id}} chez {{client.civilite}} {{client.nom}} ({{client.address.cp}}) ")(curr))
                .send()
                .save()

        }

        if (curr.litige && curr.litige.open === true && prev.litige.open === void(0)) {

            curr.litige.opened = new Date();
            curr.litige.openedBy = session.login;

            edison.event('INTER_LITIGE')
                .login(session.login)
                .id(curr.id)
                .broadcast(curr.login.ajout)
                .color('red')
                .message(_.template("Un litige à été ouvert par {{litige.openedBy}} sur votre intervention {{id}} chez {{client.civilite}} {{client.nom}} ({{client.address.cp}}) ")(curr))
                .send()
                .save()

        }
        if (curr.litige && curr.litige.open === false && prev.litige.open === true) {
            curr.litige.closed = new Date();
            curr.litige.closedBy = session.login;
        }

        if (curr.artisan && curr.artisan.id && curr.artisan.id !== prev.artisan.id && curr.artisan.subStatus !== 'TUT') {
            curr.status = 'APR';
            if (envProd) {
                db.model('artisan').findOne({
                    id: curr.artisan.id
                }).then(function(sst) {
                    if (!sst) {
                        return false;
                    }
                    curr.sst = JSON.parse(JSON.stringify(sst));
                    sendArtisanChangedSms();
                })
            }
        }



    }

    module.exports.defaultDoc = function(timestamp) {
        var ms = require('milliseconds')
        return {
            prixAnnonce: 0,
            coutFourniture: 0,
            comments: [],
            produits: [],
            tva: 10,
            remarque: 'PAS DE REMARQUES',
            modeReglement: 'CH',
            client: {
                civilite: 'M.',
                telephone: {},
                address: {}
            },
            facture: {

            },
            litige: {

            },
            compta: {
                paiement: {

                },
                reglement: {

                }
            },
            reglementSurPlace: true,
            date: {
                ajout: new Date(timestamp),
                intervention: new Date(timestamp + ms.hours(2))
            }
        }
    }


    module.exports.minify = function(e) {
        var config = requireLocal('config/dataList')
        var d = requireLocal('config/dates.js')
        var ms = require('milliseconds')
        var _ = require("lodash")

        var getPaiementArtisan = function(e) {
            if (e.compta.paiement.effectue) {
                return 2;
            } else if (e.compta.paiement.ready) {
                return 1;
            } else {
                return undefined
            }
        }

        try {
            if (e.status === "ENC" && Date.now() > (new Date(e.date.intervention)).getTime() + ms.hours(1)) {
                e._status = 'AVR';
            } else {
                e._status = e.status
            }

            var rtn = {
                t: e.login.ajout,
                id: e.id,
                f: !e.reglementSurPlace ? 1 : undefined,
                ai: e.artisan.id,
                l: !e.compta.reglement.recu && e.recouvrement.level || undefined,
                s: config.etats[e._status].order,
                c: config.categories[e.categorie].order,
                n: e.client.civilite + ' ' + e.client.nom + ' ' + e.client.prenom,
                a: e.artisan.nomSociete,
                pa: e.prixFinal || e.prixAnnonce,
                da: d(e.date.ajout),
                di: d(e.date.intervention),
                rc: e.compta.reglement.recu ? 1 : 0,
                ps: getPaiementArtisan(e),
                ad: e.client.address.cp + ', ' + e.client.address.v,
                dm: e.login.demarchage || undefined,
            };
            if (e.aDemarcher && !e.sst) {
                rtn.d = e.enDemarchage ? 2 : 1;
            }
        } catch (e) {
            __catch(e)
        }
        return _.omit(rtn, _.isUndefined);
    }































    module.exports.toV2 = function(d) {
        var ms = require('milliseconds')
        var config = requireLocal('config/dataList');
        var sanitizeHtml = require('sanitize-html');
        var Entities = require('html-entities').XmlEntities;
        var entities = new Entities();



        var addProp = function(obj, prop, name) {
            if (prop) {
                obj[name] = prop;
            }
        }

        var toDate = function(str, randomize) {
            var rand = randomize ? _.random(ms.hours(7), ms.hours(19)) : 0;
            var d = new Date(parseInt(str) * 1000 + rand);
            return d
        }


        /* DATES */
        var date = {};

        addProp(date, toDate(d.t_stamp), 'ajout');
        addProp(date, toDate(d.t_stamp_intervention), 'intervention');

        if (d.date_edition_facture) {
            addProp(date, toDate(d.date_edition_facture, true), 'verification')
            addProp(date, toDate(d.date_edition_facture, true), 'envoiFacture')
        }
        /* CLIENT */
        var client = {
            civilite: d.civilite,
            prenom: d.prenom,
            nom: d.nom,
            email: d.email,
            address:  {
                n: d.numero || "0",
                r: d.adresse,
                v: d.ville,
                cp: d.code_postal,
                lt: d.lat,
                lg: d.lng
            },
            location: [parseFloat(d.lat), parseFloat(d.lng)],
        };

        client.telephone = {};
        if (d.tel1)
            client.telephone.tel1 = d.tel1.replace(/[^0-9]/g, '');
        else {
            client.telephone.tel1 = '0633138868'
        }
        if (d.tel2)
            client.telephone.tel2 = d.tel2.replace(/[^0-9]/g, '');
        client.telephone.origine = d.numero_origine
            /* COMMENTS */
        var user = edison.users.search(d.ajoute_par)
        var comments = [];
        if (d.remarque_interne) {
            comments.push({
                login: user,
                date: toDate(d.t_stamp),
                text: d.remarque_interne
            });
        }

        if (d.etat_reglement == "CHEQUE RECUPERE" ||  d.date_edition_facture) {
            d.etat_intervention = "INT"
        }
        var v2 = (d.v2 && JSON.parse(d.v2)) ||  {}
        console.log(v2)
        var rtn = _.merge(v2, {
            tva: d.tva_facture  || (d.civilite === 'Soc.' ? 20 : 10),
            aDemarcher: d.A_DEMARCHE,
            id: d.id,
            _id: d.id,
            fourniture: [],
            login: {
                ajout: user,
            },
            comments: comments,
            status: d.etat_intervention,
            date: date,
            client: client,
            sms: d.id_sms || null,
            smsStatus: d.status_sms || 0,
        })

        var isJson = require('is-json');

        if (d.relance && isJson(d.relance)) {
            rtn.relance = JSON.parse(d.relance);
        }

        if (d.devis && d.id > 13740) {
            rtn.devisOrigine = d.id;
            var devis = JSON.parse(d.devis.split('<br>').join(""));
            rtn.produits = devis.devisTab;
            rtn.tva = parseInt(devis.tva) || 10;
            rtn.produits.map(function(p) {
                p.quantite = typeof p.quantite === 'string' ? p.quantite.replace(/[^\d.-]/g, '') : p.quantite
                p.desc = sanitizeHtml(entities.decode(p.desc))
                p.ref = sanitizeHtml(entities.decode(p.ref || 'EDI042'))
                p.pu = typeof p.pu === 'number' ? p.pu : (parseFloat(p.pu.replace(/[^\d.-]/g, '')) || 0)
                p.ref = p.ref.replace(' ', '');
                if (p.ref.startsWith("CAM"))
                    p.ref = "CAM001";
                if (p.ref.startsWith("EDI003") ||  p.ref.startsWith("FRN"))
                    p.ref = "FRN001";
                var origin = _.find(edison.produits, function(e) {
                    return e.ref === p.ref;
                });
                if (origin) {
                    p.title = origin.title;
                } else {
                    p.title = p.desc.toUpperCase().split(' ').slice(0, 3).join(' ')
                    if (!p.ref || p.ref == 'AUT001')
                        p.ref = p.desc.toUpperCase().slice(0, 3) + '0' + _.random(9, 99)
                }
                return p
            });
        }
        rtn.fourniture = [];


        rtn.categorie = d.categorie;
        rtn.description = d.description || "PAS DE DESCRIPTION";
        rtn.remarque = d.remarque || "PAS DE REMARQUES";

        rtn.modeReglement = d.mode_reglement;


        if (rtn.status === 'INT' || rtn.status === 'ENC') {
            rtn.date.envoi = rtn.date.ajout;
            rtn.login.envoi = rtn.login.ajout
        }
        if (rtn.status === "INT") {
            rtn.login.verification = rtn.login.ajout
            if (!rtn.reglementSurPlace) {
                rtn.login.envoiFacture = edison.users.search(d.facture_editee_par || rtn.login.ajout)
                rtn.login.verification = rtn.login.envoiFacture
            }
            rtn.date.verification = rtn.date.intervention || rtn.date.ajout;
            rtn.status = 'VRF'

        }

        rtn.prixAnnonce = d.prix_ht_annonce;
        rtn.prixFinal = d.comptaPrixFinal || d.prix_ht_final || d.montant_ht_facture || undefined;
        if (!rtn.prixFinal && rtn.status === 'VRF') {
            rtn.prixFinal = rtn.prixAnnonce || 0;
        }


        rtn.recouvrement = {
            level: d.recouvrement
        }

        rtn.reglementSurPlace = !d.fact;
        if (d.id_annulation) {
            var tmp = _.find(config.causeAnnulation, function(e) {
                return e.oldId === d.id_annulation
            })
            rtn.causeAnnulation = tmp ? tmp.short_name : undefined
        }

        if (d.nom_societe) {
            rtn.artisan = {
                id: d.id_sst_selectionne,
                nomSociete: d.nom_societe
            }
            rtn.sst = d.id_sst_selectionne;
        }

        if (d.nom_facture) {
            rtn.facture = {
                payeur: config.typeClient[parseInt(d.type_client) || 0],
                email: d.mail_facture,
                nom: d.nom_facture,
                prenom: d.prenom_facture,
                tel: d.tel_facture,
                address: {
                    n: d.numero_facture || "0",
                    r: d.adresse_facture,
                    v: d.ville_facture,
                    cp: d.code_postal_facture
                },
            }
        }

        if (rtn.status == "ANN") {
            rtn.login.annulation = rtn.login.ajout
            rtn.date.annulation = rtn.date.ajout
        }




        var fournitureArtisan = parseFloat(d.comptaFournitureArtisan)
        var fournitureEdison = parseFloat(d.comptaTotalFourniture) - fournitureArtisan
        if (fournitureArtisan) {
            rtn.fourniture.push({
                bl: "0",
                title: "Inconnu",
                fournisseur: "ARTISAN",
                pu: fournitureArtisan,
                quantite: 1
            })
        }
        if (fournitureEdison) {
            if (!d.fournisseur || d.fournisseur == "ARTISAN")
                d.fournisseur = "EDISON";
            rtn.fourniture.push({
                bl: "0",
                title: "Inconnu",
                fournisseur: d.fournisseur,
                pu: fournitureEdison,
                quantite: 1
            })
        }
        if (!fournitureArtisan && !fournitureEdison && d.cout_fourniture > 0) {
            rtn.fourniture.push({
                bl: "0",
                title: "Inconnu",
                fournisseur: d.fournisseur,
                pu: parseFloat(d.cout_fourniture),
                quantite: 1
            });
        }





        rtn.compta = {
            paiement: {
                dette: d.etat_reglement === "DETTE"
            }
        }
        if (d.comptaPrixFinal) {
            rtn.compta = {
                paiement: {
                    date: toDate(d.date_paiement_sst),
                    tva: d.comptaTVA || 0,
                    mode: d.pVirement == "0" ? "CHQ" : "VIR",
                    base: d.comptaPrixFinal,
                    montant: d.comptaMontantFinal,
                    ready: false /*rtn.id > 25000*/ ,
                    effectue: true /*rtn.id <= 25000*/ ,
                    pourcentage: {
                        deplacement: d.pDeplacement,
                        maindOeuvre: d.pMaindOeuvre,
                        fourniture: d.pFourniture
                    },
                    historique: /* rtn.id > 25000 ? [] :*/ [{
                        tva: d.comptaTVA || 0,
                        dateFlush: toDate(d.date_paiement_sst),
                        dateAjout: toDate(d.date_paiement_sst),
                        base: d.comptaPrixFinal,
                        final: d.comptaMontantFinal,
                        montant: d.comptaMontantFinal,
                        fourniture: {
                            artisan: fournitureArtisan,
                            edison: fournitureEdison,
                            total: fournitureArtisan + fournitureEdison
                        },
                        payed: d.comptaMontantFinal,
                        mode: (d.pVirement == "0" ? "CHQ" : "VIR"),
                        pourcentage: {
                            deplacement: d.pDeplacement,
                            maindOeuvre: d.pMaindOeuvre,
                            fourniture: d.pFourniture
                        },
                        numeroCheque: d.comptaNumeroCheque ||  undefined,
                    }]
                },
            }
        }
        if (d.date_paiement_client) {
            rtn.compta.reglement = {
                date: toDate(d.date_paiement_client),
                recu: true,
                montant: rtn.prixFinal,
                historique: [{
                    date: toDate(d.date_paiement_client),
                    montant: rtn.prixFinal,
                }]
            }
        }
        if (!rtn.reglementSurPlace && (!rtn.produits ||  !rtn.produits.length)) {
            rtn.produits = [{
                ref: 'EDX121',
                title: rtn.description,
                desc: rtn.description,
                pu: rtn.prixFinal ||  rtn.prixAnnonce || 0,
                quantite: 1
            }]
        }

        return rtn;
    }
