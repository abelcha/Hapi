var moment = require('moment')
var config = requireLocal('config/dataList.js');
var users = requireLocal('config/_users.js');
var _ = require('lodash')
var V1 = function(d) {

    var x = this.data

    x.id = d.id;
    var dateAjout = moment(new Date(d.date.ajout));
    if (d.date.intervention) {
        var dateIntervention = moment(new Date(d.date.intervention))
        x.date_intervention = dateIntervention.format('DD/MM/YYYY')
        x.date_intervention_en = dateIntervention.format('YYYYMMDD')
        x.heure_intervention = dateIntervention.format('HH:mm:ss')
        x.t_stamp_interventsion = dateIntervention.unix()
    }
    /*x.t_stamp = dateAjout.unix()
    x.date_ajout = dateAjout.format('DD/MM/YYYY')
    x.heure_ajout = dateAjout.format('HH:mm:ss')
    x.date_ajout_en = dateAjout.format('YYYYMMDD')
    x.date_paiement_client = d.date.paiementCLI || null
    x.civilite = d.client.civilite;
    x.nom = d.client.nom;
    x.prenom = d.client.prenom;
    x.tel1 = d.client.telephone.tel1
    x.tel2 = d.client.telephone.tel2 || ""
    x.email = d.client.email
    x.societe = Number(d.client.civilite === 'Soc.')
    x.numero = d.client.address.n 
    x.adresse = d.client.address.r
    x.code_postal = d.client.address.cp
    x.ville = d.client.address.v
    x.lat = d.client.address.lt
    x.lng = d.client.address.lg*/
    var categorie = config.categories[d.categorie];
    x[_.deburr(categorie.long_name).toLowerCase()] = '1';
    x.categorie = _.deburr(categorie.long_name).toUpperCase();
    x.description = d.description;
    x.remarque = _.pluck(d.comments, 'text').join('\n')
    x.prix_ht_annonce = d.prixAnnonce;
    x.prix_ht_final = d.prixFinal;
    x.id_sst_selectionne = _.get(d, 'artisan.id', 0);
    var login = _.find(users, 'login', d.login.ajout)
    x.ajoute_par = _.get(login, 'oldLogin', d.login.ajout)
    x.reglement_sur_place = Number(d.reglementSurPlace)
    x.mode_reglement = (!d.reglementSurPlace ? 'facture' : _.find(config.modeDeReglements, 'short_name', d.modeReglement).old_name);
    x.remarque_interne = d.remarque
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
    	x.cout_fourniture =  d.fourniture[0].pu;
    	x.fournisseur = d.fourniture[0].fournisseur
    	x.fourniture_sst = Number(d.fourniture[0].fournisseur == "")
    	x.fourniture_edison = Number(d.fourniture[0].fournisseur != "")
    	x.tva_facture = d.tva;
    }
    x.etat_intervention = config.etats[d.status].old_name;
    console.log(x)
}

V1.prototype.data = {
    /*    "id": "",
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
        "origine": null,//
        "devis": "",//
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
    "date_intervention": "10\/08\/2015",
    "date_intervention_en": "20150810",
    "heure_intervention": "16:30:00",
    "t_stamp_intervention": "1439217000",
    "prix_ht_annonce": "180.00",*/
    "etat_intervention": "A PROGRAMMER", //---
    "etat_reglement": "", //---
    "rappel_paiement": "",
    "id_sst_selectionne": "0",
    "ajoute_par": "harald",
    "modifie_par": "",
    "reglement_sur_place": "1", //
    "cout_fourniture": "0",
    "fourniture_sst": "0",
    "fournisseur": "",
    "paiement_sst_direct": "0",
    "mode_reglement": "cheque",
    "remarque_interne": "",
    "cause_annulation": "",
    /*      "id_annulation": null,
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
          "numero_origine": "0687703760",
          "A_DEMARCHE": "1",
          "sst_avance": "0",
          "comformite": "",
          "relance_48": "0",
          "verifier": "0"*/
}


module.exports = V1;
