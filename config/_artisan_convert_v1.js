var moment = require('moment')
var config = requireLocal('config/dataList.js');
var users = requireLocal('config/_users.js');
var _ = require('lodash')
var htmlencode = require('htmlencode');
var unicode = require('unicode-escape');
var ms = require('milliseconds')
var request = require('request');



var V1 = function(d) {
    //try {

    this.data = _.clone(this.___data);
    var x = this.data;

    x.id = d.id;
    x.date_ajout = moment(d.date.ajout).format('L')
    x.nom_societe = d.nomSociete;
    x.forme_juridique = config.formeJuridique[d.formeJuridique].long_name

    x.plomberie = _.includes(d.categories, "PL");
    x.chauffage = _.includes(d.categories, "CH");
    x.electricite = _.includes(d.categories, "EL");
    x.serrurerie = _.includes(d.categories, "SR");
    x.vitrerie = _.includes(d.categories, "VT");
    x.climatisation = _.includes(d.categories, "CL");
    x.peinture = _.includes(d.categories, "PT");

    x.categorie = []
    _.each(d.categories, function(e) {
        x.categorie.push(config.categories[e].long_name)
    })
    x.categorie = x.categorie.join(', ').toUpperCase()

    x.nom_representant = d.representant.nom;
    x.prenom_representant = d.representant.prenom;
    x.civilite = d.representant.civilite;


    x.numero = d.address.n
    x.adresse = d.address.r
    x.code_postal = d.address.cp
    x.ville = d.address.v
    x.lat = d.address.lt
    x.lng = d.address.lg
    x.tel1 = d.telephone.tel1;
    x.tel2 = d.telephone.tel2;

    x.email = d.email;

    x.archive = (d.status === 'ARC')

    var login = _.find(users, 'login', d.login.ajout)
    x.ajoute_par = login && login.oldLogin ? login.oldLogin : d.login.ajout;


    x.pourcentage_main_d_oeuvre = d.pourcentage.maindOeuvre;
    x.pourcentage_fourniture = d.pourcentage.fourniture;
    x.pourcentage_deplacement = d.pourcentage.deplacement;
    x.zone_chalandise = d.zoneChalandise + 'km';

    // ==>FILES;
    _.each(d.document, function(e, k) {
        if (typeof e === 'object' && e.file) {
            x[k] = e.file;
            //console.log('-->', k,  e.file);
        }
    })

    x.num_facturier = d.historique.pack.length && d.historique.pack[0].facturier

    if (x.num_facturier) {
        x.num_facturier = d.historique.pack[0].text ||  moment(x.num_facturier.date).format('L')
    }

    x.num_deviseur = d.historique.pack.length && d.historique.pack[0].deviseur
    if (x.num_deviseur) {
        x.num_deviseur = d.historique.pack[0].text ||  moment(x.num_deviseur.date).format('L')
    }
    x.date_envoi_contrat = d.historique.contrat.length
    if (x.date_envoi_contrat)
        x.num_contrat = moment(d.historique.contrat[0].date).format('L');

    x.siret = d.siret;
    /*    } catch (e) {
            console.log('ERR', e)
            throw e
        }*/

}

V1.prototype.compare = function(legacy) {
    var noComp = [
      /*  "contrat_2014",
        "contrat",
        "kbis",
        "autofacturation",
        "cni",
        "assurance",
        "rib",
        "ursaff",
        "autres",*/
        "coms"
    ]
    var _this = this;
    _.each(this.data, function(e, k) {
        if (!_.includes(noComp, k) && e != legacy[k]) {
            if (!(!e && !legacy[k]))
                console.log(_.padRight(k, 20, " "), "---------> ", _.padRight("'" + e + "'", 30, ' '), "'" + legacy[k] + "'")
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
    "id": "7",
    "travail_samedi": "1",
    "archive": "0",
    "date_ajout": "21/08/2013",
    "nom_societe": "COSTANTINO",
    "civilite": "M.",
    "nom_representant": "COSTANTINO",
    "prenom_representant": "ANTHONY",
    "forme_juridique": "AUTO-ENTREPRENEUR",
    "email": "PRE.PLOMBERIE@HOTMAIL.FR",
    "numero": "10",
    "adresse": "IMPASSE DES ALVERGNES",
    "code_postal": "13013",
    "ville": "MARSEILLE",
    "lat": "43.3375",
    "lng": "5.42737",
    "pourcentage_deplacement": "50",
    "pourcentage_main_d_oeuvre": "50",
    "pourcentage_fourniture": "50",
    "zone_chalandise": "50km",
    "jours_intervention": "1-2-3-4-5-6",
    "heures_intervention": "",
    "disponibilite": "",
    "mode_vac": "0",
    "contrat_2014": "",
    "contrat": "contrat/contrat_ancien_000007.pdf",
    "kbis": "kbis/kbis_000007.txt",
    "autofacturation": "autofacturation/autofacturation_000007.png",
    "cni": "cni/cni_000007.txt",
    "assurance": "",
    "rib": "rib/rib_000007.txt",
    "ursaff": "",
    "autres": "",
    "siret": "753985985",
    "rappel": "",
    "num_facturier": "28/08",
    "num_deviseur": "28/08",
    "catalogue_electricite": "0",
    "catalogue_plomberie": "0",
    "catalogue_serrure": "0",
    "stock_cylindre": "0",
    "tel2": "",
    "tel1": "0640925713",
    "electricite": "0",
    "plomberie": "1",
    "chauffage": "1",
    "climatisation": "1",
    "serrurerie": "1",
    "vitrerie": "0",
    "menuiserie": "0",
    "peinture": "0",
    "carrelage": "0",
    "maconnerie": "0",
    "couverture": "0",
    "renovation": "0",
    "categorie": "PLOMBERIE, CHAUFFAGE, CLIMATISATION, SERRURERIE",
    "cout_fourniture": "0",
    "distance": "0",
    "facturier_num_manuel": "15533",
    "date_envoi_contrat": "",
    "tarif_prix_h": "0",
    "tarif_deplacement": "0",
    "tarif_deplacement_hors_zone": "0",
    "tarif_prix_h_zone": "0",
    "tarif_deplacement_zone": "0",
    "login": "",
    "password": "",
    "new_account": "",
    "img_pro": "default.png",
    "json_pro": "",
    "json_notif": "0",
    "non_contrat": "0",
    "ajoute_par": "yohann",
    "IBAN": "aucun IBAN",
    "BIC": "aucun BIC",
    "pas_fiable": "1",
    "rappel_inter": "0"
}


module.exports = V1;
