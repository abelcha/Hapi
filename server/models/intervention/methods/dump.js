    var key = requireLocal('config/_keys');
    var users = requireLocal('config/_users');
    var request = require("request");
    var sanitizeHtml = require('sanitize-html');
    var Entities = require('html-entities').XmlEntities;
    var _ = require('lodash');
    var entities = new Entities();

    module.exports = function(schema) {

        var addProp = function(obj, prop, name) {
            if (prop) {
                obj[name] = prop;
            }
        }

        var toDate = function(str) {
            return new Date(parseInt(str) * 1000);
        }

        var translateModel = function(d) {

            /* DATES */
            var date = {};

            addProp(date, toDate(d.t_stamp), 'ajout');
            addProp(date, toDate(d.t_stamp_intervention), 'intervention');


            if (d.date_edition_facture)
                addProp(date, toDate(d.date_edition_facture), 'verification')

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
            if (d.tel2)
                client.telephone.tel2 = d.tel2.replace(/[^0-9]/g, '');

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
                tva: d.tva_facture  || 20,
                aDemarcher: d.A_DEMARCHE,
                id: d.id,
                _id: d.id,
                fourniture: [],
                login: {
                    ajout: user
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
                rtn.tva = devis.tva;
                rtn.produits.map(function(p) {
                    p.desc = sanitizeHtml(entities.decode(p.desc))
                    p.ref = sanitizeHtml(entities.decode(p.ref))
                    p.pu = sanitizeHtml(entities.decode(p.pu))
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
            rtn.categorie = d.categorie;
            rtn.description = d.description || "PAS DE DESCRIPTION";
            rtn.remarque = d.remarque || "PAS DE REMARQUES";
            if (d.nom_societe) {
                rtn.artisan = {
                    id: d.id_sst_selectionne,
                    nomSociete: d.nom_societe
                }
            }

            rtn.modeReglement = d.mode_reglement;
            rtn.prixAnnonce = d.prix_ht_annonce;
            rtn.prixFinal = d.prix_ht_final;


            if (d.fact === true) {
                rtn.facture = {
                    payeur: d.type_facture,
                    email: d.mail_facture,
                    nom: d.nom_facture,
                    prenom: d.prenom_facture,
                    telephone: d.tel_facture,
                    address: {
                        n: d.numero_facture || "0",
                        r: d.adresse_facture,
                        v: d.ville_facture,
                        cp: d.code_postal_facture
                    },
                }
            }
            //cout_fourniture_ht -> total fourniture
            //fourniture_avancee -> avance par le sst
            //return null;
            rtn.compta = {}
                //paiement effectue
            if (d.comptaPrixFinal) {
                rtn.tva = d.comptaTVA;
                rtn.prixFinal = d.comptaPrixFinal;
                rtn.compta = {
                    paiement: {
                        mode: d.pVirement == "0" ? "CHQ" : "VIR",
                        base: d.comptaPrixFinal,
                        montant: d.comptaMontantFinal,
                        dette: d.etat_reglement === "DETTE",
                        ready: Boolean(d.numeroCheque == ""),
                        effectue: Boolean(d.numeroCheque != ""),
                        pourcentage: {
                            deplacement: d.pDeplacement,
                            maindOeuvre: d.pMaindOeuvre,
                            fourniture: d.pFourniture
                        }
                    },
                }
                if (rtn.compta.paiement.effectue) {
                    rtn.compta.historique = [{
                        date: toDate(d.date_paiement_sst),
                        base: d.comptaPrixFinal,
                        montant: d.comptaMontantFinal,
                        pourcentage: {
                            deplacement: d.pDeplacement,
                            maindOeuvre: d.pMaindOeuvre,
                            fourniture: d.pFourniture
                        },
                        numeroCheque: d.numeroCheque,
                    }]
                }
            }

            if (d.date_paiement_client) {
                rtn.compta.reglement = {
                    date: toDate(d.date_paiement_client),
                    recu: true,
                    montant: rtn.prixFinal,

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
                console.log('-->', d.fournisseur)
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



        var addInDB = function(data, i, cb) {
            if (i >= data.length - 1)
                return cb(null)
            var inter = db.model('intervention')(translateModel(data[i]));
            if (i % 100 == 0)
                console.log(((i / data.length) * 100).toFixed(2) + '%', inter.id);
            inter.save(function(err) {
                if (err) {
                    return cb({
                        id: inter.id,
                        err: err
                    });
                } else {
                    addInDB(data, i + 1, cb);
                }
            });
        }
        var getUser = function(oldLogin) {
            return _.find(users, function(e) {
                return e.oldLogin === oldLogin;
            })
        }

        var execDump = function(limit) {
            return new Promise(function(resolve, reject) {
                var inters = [];
                var t = Date.now();
                db.model('intervention').remove({
                    id: {
                        $gt: limit
                    }
                }, function() {
                    request(key.alvin.url + "/dumpIntervention.php?limit=" + limit + "&key=" + key.alvin.pass, function(err, rest, body) {
                        var data = JSON.parse(body);
                        addInDB(data, 0, function(err) {
                            if (err)
                                return reject(err);
                            // db.model('intervention').cacheReload();
                            return resolve({
                                status: 'OK',
                                time: (Date.now() - t) / 1000
                            });
                        });
                    });
                });
            });
        }

        schema.statics.workerDump = function(limit) {
            return execDump(limit)
        }

        schema.statics.dump = function(req, res) {
            var limit = req.query.limit ||  0;
            if ((envDev || envProd) && !isWorker) {
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
