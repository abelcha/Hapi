    var key = requireLocal('config/_keys');
    var users = requireLocal('config/_users');
    var config = requireLocal('config/dataList');
    var request = require("request");
    var sanitizeHtml = require('sanitize-html');
    var Entities = require('html-entities').XmlEntities;
    var _ = require('lodash');
    var async = require('async')
    var ms = require('milliseconds')
    var V1 = requireLocal('config/_convert_V1');
    var entities = new Entities();

    module.exports = function(schema) {

        var addProp = function(obj, prop, name) {
            if (prop) {
                obj[name] = prop;
            }
        }

        var toDate = function(str) {
            var d = new Date(parseInt(str) * 1000);
            return d
        }

        var translateModel = function(d) {

            /* DATES */
            var date = {};

            addProp(date, toDate(d.t_stamp), 'ajout');
            addProp(date, toDate(d.t_stamp_intervention), 'intervention');


            if (d.date_edition_facture) {
                addProp(date, toDate(d.date_edition_facture), 'verification')
                addProp(date, toDate(d.date_edition_facture), 'envoiFacture')
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
            var user = getUser(d.ajoute_par)
            user = user ? user.login : d.ajoute_par;
            var comments = [];
            if (d.remarque_interne) {
                comments.push({
                    login: user,
                    date: toDate(d.t_stamp),
                    text: d.remarque_interne
                });
            }
            var rtn = {
                tva: d.tva_facture  || 10,
                aDemarcher: d.A_DEMARCHE,
                id: d.id,
                _id: d.id,
                fourniture: [],
                login: {
                    ajout: user,
                    envoiFacture: d.facture_editee_par ||  undefined
                },
                comments: comments,
                status: d.etat_intervention,
                date: date,
                client: client
            }

            if (d.cout_fourniture > 0)  {
                rtn.fourniture.push({
                    bl: "0",
                    title: "Inconnu",
                    fournisseur: d.fournisseur,
                    pu: d.cout_fourniture,
                    quantite: 1
                })
            }

            if (d.devis && d.id > 13740) {
                rtn.devisOrigine = d.id;
                var devis = JSON.parse(d.devis.split('<br>').join(""));
                rtn.produits = devis.devisTab;
                rtn.tva = parseInt(devis.tva) || 10;
                rtn.produits.map(function(p) {
                    p.desc = sanitizeHtml(entities.decode(p.desc))
                    p.ref = sanitizeHtml(entities.decode(p.ref))
                    p.pu = typeof p.pu === 'number' ? p.pu : (parseInt(p.pu.replace(/[^\d.-]/g, '')) || 0)
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
                        p.ref = "AUT001";
                        p.title = "Autre"
                    }
                    return p
                });
            }

            if (rtn.status === 'INT' || rtn.status === 'ENC') {
                rtn.date.envoi = rtn.date.ajout;
                rtn.login.envoi = rtn.login.ajout
            }

            if (rtn.status === "INT") {
                rtn.date.verification = rtn.date.intervention || rtn.date.ajout;
            }

            if (rtn.status === 'ENC') {

                rtn.status = 'ENC';

            }

            if (rtn.status === 'INT') {
                rtn.status = 'VRF'
            }

            /* FACTURE */
            rtn.reglementSurPlace = !d.fact;

            /* INFO */
            if (d.id_annulation) {
                var tmp = _.find(config.causeAnnulation, function(e) {
                    return e.oldId === d.id_annulation
                })
                rtn.causeAnnulation = tmp ? tmp.short_name : undefined
            }
            rtn.categorie = d.categorie;
            rtn.description = d.description || "PAS DE DESCRIPTION";
            rtn.remarque = d.remarque || "PAS DE REMARQUES";
            if (d.nom_societe) {
                rtn.artisan = {
                    id: d.id_sst_selectionne,
                    nomSociete: d.nom_societe
                }
                rtn.sst = d.id_sst_selectionne;
            }

            rtn.modeReglement = d.mode_reglement;
            rtn.prixAnnonce = d.prix_ht_annonce;
            rtn.prixFinal = d.comptaPrixFinal || d.prix_ht_final || d.prix_ht_annonce || 0;


            if (d.nom_facture) {
                rtn.facture = {
                    relance: d.relance_facture,
                    payeur: d.type_facture,
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
            //cout_fourniture_ht -> total fourniture
            //fourniture_avancee -> avance par le sst
            //return null;
            rtn.compta = {
                    paiement: {
                        dette: d.etat_reglement === "DETTE"
                    }
                }
                //paiement effectue
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

            var fournitureArtisan = parseFloat(d.comptaFournitureArtisan)
            var fournitureEdison = parseFloat(d.comptaTotalFourniture) - fournitureArtisan
            rtn.fourniture = [];
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

            return rtn;
        }


        var getUser = function(oldLogin) {
            return _.find(users, function(e) {
                return e.oldLogin === oldLogin;
            })
        }

        var __dump = function(data, i, cb) {
            if (i % 100 == 0)
                console.log(_.round(i / data.length * 100, 2), "%")
            if (i === data.length - 1)
                return cb()
            var z = translateModel(data[i]);

            db.model('intervention')(z).save(function(err, resp) {
                if (err) {
                    console.log('--->', data[i].id)
                    console.log(err);
                }
                return __dump(data, i + 1, cb)
            })
        }

        var execDump = function(limit) {
            return new Promise(function(resolve, reject) {

                db.model('intervention').remove({
                    /*id: {
                      $gt: limit
                    }*/
                }, function() {
                    console.log('yay')
                    request(key.alvin.url + "/dumpIntervention.php?limit=" + limit + "&key=" + key.alvin.pass, function(err, rest, body) {
                        var data = JSON.parse(body);
                        console.time('dump')
                        __dump(data, 0, function() {
                            console.timeEnd('dump')
                            console.time('cache')
                            db.model('intervention').fltrify(function() {
                                console.timeEnd('cache')
                                db.model('intervention').getCache().then(function() {
                                    data = null;
                                    cache = null;
                                    body = null;
                                    resolve('ok')
                                })
                            })
                        })
                    });
                });


            });
        }


        schema.statics.workerDump = function(limit) {
            return execDump(limit)
        }

        var dumpOne = function(id, login, convert) {
            console.log('dumpOne', id)
            return new Promise(function(resolve, reject) {
                var url = key.alvin.url + "/dumpIntervention.php?devis=false&id=" + id + "&key=" + key.alvin.pass;
                console.log(url)
                request.get(url, function(err, resp, body) {
                    if (err || resp.statusCode !== 200 || !body || body == 'null') {
                        new edison.event("DUMP_ONE", login, id, {
                            rejected: true,
                        })
                        console.log('rejected', id)
                        return reject('nope')
                    }
                    var v1 = JSON.parse(body)
                    var v2 = translateModel(v1)
                    if (!convert)
                        v2.date.dump = Date.now();
                    new edison.event("DUMP_ONE", login, parseInt(id), {
                        v1: v1,
                        v2: v2
                    })
                    db.model('intervention').update({
                        id: id
                    }, v2, {
                        upsert: true
                    }).exec(function(err, resp, c) {
                        if (err)
                            return reject(err);
                        db.model('intervention').findById(parseInt(id), function(err, doc) {
                            doc.cache = db.model('intervention').cachify(doc);
                            doc.save()
                        })
                        resolve(resp);
                    })
                });
            })
        }

        schema.statics.dump = function(req, res) {
            var limit = req.query.limit ||  0;
            if (req.query.id) {
                return dumpOne(req.query.id, req.query.login || req.session.login, req.query.convert)
            } else if (!isWorker) {
                console.log('dump worker')
                return edison.worker.createJob({
                    name: 'db',
                    model: 'intervention',
                    method: 'workerDump',
                    arg: limit
                })
            } else {
                return execDump(limit);
            }

        }
    }
