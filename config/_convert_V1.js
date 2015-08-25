var moment = require('moment')
var config = requireLocal('config/dataList.js');
var users = requireLocal('config/_users.js');
var _ = require('lodash')
var htmlencode = require('htmlencode');
var unicode = require('unicode-escape');
var ms = require('milliseconds')
var request = require('request');

var V1 = function(d, devis, legacy) {
    try {
        this.data = _.clone(this.___data)
        var x = this.data
        if (devis) {
            d = db.model('intervention')(d)
            d.status = 'DEVIS'
        }
        this.legacy = legacy
        x.id = d.id;
        var dateAjout = moment(new Date(d.date.ajout))
        x.t_stamp = dateAjout.unix()
        dateAjout.add(2, 'h');
        x.date_ajout = dateAjout.format('YYYY-MM-DD')
        x.heure_ajout = dateAjout.format('HH:mm:ss')
        x.date_ajout_en = dateAjout.format('YYYYMMDD')
        if (d.date.intervention) {
            var dateIntervention = moment(new Date(d.date.intervention))
            x.t_stamp_intervention = dateIntervention.unix()
            dateIntervention.add(2, 'h');
            x.date_intervention = dateIntervention.format('DD/MM/YYYY')
            x.date_intervention_en = dateIntervention.format('YYYYMMDD')
            x.heure_intervention = dateIntervention.format('HH:mm:ss')
        }
        if (d.compta.reglement.date) {
            x.date_paiement_client = moment(new Date(d.compta.reglement.date)).format('DD/MM/YYYY');
        }
        if (d.date.envoiFacture) {
            x.date_edition_facture = moment(new Date(d.date.envoiFacture)).format('DD/MM/YYYY');
        }
        if (d.login.envoiFacture) {
            var loginEnvoiFacture = _.find(users, 'login', d.login.envoiFacture)
            x.facture_editee_par = _.get(_.find(users, 'login', d.login.envoiFacture), 'oldLogin', d.login.envoiFacture);
        }
        x.sms = d.sms ||  undefined;
        x.sms_status = d.sms_status;
        x.civilite = d.client.civilite;
        x.nom = d.client.nom;
        x.prenom = d.client.prenom;
        x.tel1 = d.client.telephone.tel1
        x.tel2 = d.client.telephone.tel2 || ""
        x.numero_origine = d.client.telephone.origine || ""
        x.email = d.client.email
        x.societe = Number(d.client.civilite === 'Soc.')
        x.numero = d.client.address.n
        x.adresse = d.client.address.r
        x.code_postal = d.client.address.cp
        x.ville = d.client.address.v
        x.lat = d.client.address.lt
        x.lng = d.client.address.lg
        var categorie = config.categories[d.categorie];
        x[_.deburr(categorie.long_name).toLowerCase()] = '1';
        x.categorie = _.deburr(categorie.long_name).toUpperCase();
        x.description = d.description;
        x.remarque_interne = _.pluck(d.comments, 'text').join('\n') ||  ""
        x.prix_ht_annonce = d.prixAnnonce;
        x.prix_ht_final = d.prixFinal;
        x.id_sst_selectionne = _.get(d, 'artisan.id', 0);
        var login = _.find(users, 'login', d.login.ajout)
        x.ajoute_par = login && login.oldLogin ? login.oldLogin : d.login.ajout;
        //0 => pas de facture, 1 => facture a faire, 2 => facture effectué, 3 => facture payé (reglement recu)
        if (!d.reglementSurPlace) {
            x.reglement_sur_place = 0
            if (d.date.envoiFacture) {
                x.reglement_sur_place = 2;
            }
        } else {
            x.reglement_sur_place = 1;
        }
        if (d.compta.reglement.recu) {
            x.reglement_sur_place = 3;
        }
        x.mode_reglement = (!d.reglementSurPlace ? 'facture' : _.find(config.modeDeReglements, 'short_name', d.modeReglement).old_name);
        x.remarque = d.remarque
        if (d.facture) {
            x.nom_facture = d.facture.nom
            x.prenom_facture = d.facture.prenom
            x.tel_facture = d.facture.telephone
            x.mail_facture = d.facture.email
            x.numero_facture = d.facture.address.n
            x.adresse_facture = d.facture.address.r
            x.code_postal_facture = d.facture.address.cp
            x.ville_facture = d.facture.address.v
            x.type_client = _.findIndex(config.typePayeur, 'short_name', d.facture.payeur)
            x.relance_facture = d.facture.relance
        }
        if (d.fourniture.length) {
            x.cout_fourniture = d.fourniture[0].pu;
            x.fournisseur = d.fourniture[0].fournisseur
            x.fourniture_sst = Number(d.fourniture[0].fournisseur == "")
            x.fourniture_edison = Number(d.fourniture[0].fournisseur != "")
            x.tva_facture = d.tva;
        }
        x.taux_tva = d.tva ||  10
        x.etat_intervention = devis ? 'DEVIS' : config.etats[d.status].old_name;
        if (d.compta.paiement.dette) {
            x.etat_reglement = 'DETTE'
        } else if (d.compta.paiement.effectue) {
            x.etat_reglement = 'PAIEMENT EFFECTUE'
        } else if (d.status === 'VRF') {
            x.etat_reglement = 'CHEQUE RECUPERE'
        }
        if (d.produits.length) {
            var devisTab = [];
            _.each(d.produits, function(e) {
                devisTab.push({
                    pu: e.pu,
                    quantite: e.quantite,
                    ref: e.ref,
                    desc: e.desc.split('\n').join('<br>')
                });
            });
            var sous_total = _.sum(devisTab, function(e) {
                return e.quantite * e.pu
            })
            x.devis = JSON.stringify({
                devisTab: devisTab,
                sous_total: _.round(sous_total, 2),
                total: _.round(sous_total * 0.01 * x.tva, 2),
                envoyer: d.historique.length
            });
        } else {
            x.devis = "";
        }

        x.A_DEMARCHE = Number(d.aDemarcher);
    } catch (e) {
        __catch(e)
    }

    //  console.log(x)
}

V1.prototype.compare = function() {
    var noComp = ["proprietaire",
        "modifie_par",
        "departement",
        "notation_bud",
        "notation_symp",
        "notation_flex",
        "yrs_old",
        "annul",
        "comformite",
    ]
    var _this = this;
    _.each(this.data, function(e, k) {
        if (!_.includes(noComp, k) && e != _this.legacy[k]) {
            if (!(!e && !_this.legacy[k]))
                console.log(_.padRight(k, 20, " "), "---------> ", _.padRight("'" + e + "'", 30, ' '), "'" + _this.legacy[k] + "'")
        }
    })
}

V1.prototype.send = function(cb) {
    var _this = this;
    try {
        request.get({
            url: 'http://electricien13003.com/alvin/postData.php',
            qs: this.data
        }, function(err, resp, body) {
            if (!err && resp.statusCode === 200) {
                console.log('send', _this.data.id);
                //console.log(body)
                cb(null, body)
            } else {
                console.log("ERR", body)
                cb("err")
            }
            new edison.event("SEND_INTER", _this.data.id, {
                sended: this.data,
                resp: body
            });

        })
    } catch (e) {
        __catch(e);
    }
}

V1.prototype.___data = {
    "id": "",
    "t_stamp": "1439198596",
    "date_ajout": "10\/08\/2015",
    "date_paiement_client": null,
    "date_ajout_en": "20150810",
    "civilite": "M.",
    "nom": "BOUSQUIER",
    "prenom": "PHILIPPE",
    "societe": "0",
    "proprietaire": "1",
    "tel1": "0687703760",
    "tel2": "",
    "email": "",
    "numero": "171",
    "adresse": "AVENUE HENRI CHAPAYS",
    "code_postal": "38340",
    "ville": "VOREPPE",
    "zone": "", //
    "departement": null, //
    "lat": "45.2982",
    "lng": "5.63752",
    "origine": null, //
    "devis": "", //
    "intervention": "1",
    "electricite": "0",
    "plomberie": "0",
    "chauffage": "0",
    "climatisation": "0",
    "serrurerie": "0",
    "vitrerie": "0",
    "menuiserie": "0",
    "peinture": "0",
    "carrelage": "0",
    "maconnerie": "0",
    "couverture": "0",
    "renovation": "0",
    "sous_cat": "", //
    "categorie": "PLOMBERIE",
    "description": "M\u00c9CANISME DE CHASSE D\u00c9FECTUEUX",
    "remarque": "PRIX HORS FOURNITURE, WC ENCASTRES",
    "date_intervention": "",
    "date_intervention_en": "",
    "heure_intervention": "",
    "t_stamp_intervention": "",
    "prix_ht_annonce": "",
    "etat_intervention": "A PROGRAMMER", //---
    "etat_reglement": "", //---
    "rappel_paiement": "",
    "id_sst_selectionne": "0",
    "ajoute_par": "",
    "modifie_par": "",
    "reglement_sur_place": "1", //
    "cout_fourniture": "0",
    "fourniture_sst": "0",
    "fournisseur": "",
    "paiement_sst_direct": "0",
    "mode_reglement": "cheque",
    "remarque_interne": "",
    "cause_annulation": "",
    "id_annulation": null,
    "warned_operator": null,
    "confirm_intervention": "0",
    "mark_annulation": "0",
    "nom_facture": "",
    "prenom_facture": "",
    "tel_facture": "",
    "mail_facture": "",
    "numero_facture": "",
    "adresse_facture": "",
    "code_postal_facture": "",
    "ville_facture": "",
    "relance_facture": "",
    "relance_sst": "",
    "montant_ht_facture": null,
    "id_pro": null,
    "id_sms": null,
    "sms_status": "0",
    "bon_intervention": "0",
    "date_edition_facture": null,
    "facture_editee_par": null,
    "type_client": "2",
    "heure_ajout": "11:23:00",
    "tva_facture": null,
    "notation_bud": "3",
    "notation_symp": "3",
    "notation_flex": "3",
    "yrs_old": "2",
    "annul": "Non",
    "montant_cheque1": null,
    "montant_cheque2": null,
    "montant_cheque3": null,
    "montant_cheque4": null,
    "emetteur_cheque1": null,
    "emetteur_cheque2": null,
    "emetteur_cheque3": null,
    "emetteur_cheque4": null,
    "taux_tva": null,
    "prix_ht_final": null,
    "deplacement_ht": "65",
    "main_oeuvre_ht": "85",
    "vente_fourni_ht": "0",
    "cout_fourni_ht": "0",
    "numero_appel": "",
    "numero_origine": "",
    "A_DEMARCHE": "1",
    "sst_avance": "0",
    "comformite": "",
    "relance_48": "0",
    "verifier": "0"
}


module.exports = V1;
