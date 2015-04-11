exports.getOriginalData = function(callbackFunction) {

var request = require("request")
var url = "http://electricien13003.com/alvin/test4.php"

request({
	url: url,
    json: true
	}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
    	console.log("gotit");
    	callbackFunction(body);
    }
  })
};


exports.translateData = function(data, callback) {

	var stock = [];
	for (key in data) {
		d = data[key];
		var tmp = {

			//	InfoAuto
					id: 		d.id,
					telepro: 	d.ajoute_par == "" ? "boukris_b" : d.ajoute_par,
					dateAjout: 	new Date(d.t_stamp * 1000),
			//	},
			//	InfoIntervention : {
					cat: 		d.categorie,
					sst: 		d.id_sst_selectionne,
					etat: 		d.etat_intervention,
					dateInter:  new Date(d.t_stamp_intervention * 1000),
					desc: 		d.description,
					remarque: 	d.remarque,
					comments: 	(d.remarque_interne ? [{c: d.remarque_interne, a:null, d:null}] : []),
					produits : 	d.devis,
					prixAnn: 	d.prix_ht_annonce,
					prixFin: 	d.prix_ht_final,
					modeRegl: 	d.mode_reglement,
					reglSP: 	!d.fact,
 			//	},

			//	InfoClient : {
					civ: 		d.civilite,
					prenom: 	d.prenom,
					nom: 		d.nom,
					email: 		d.email,
					tel1: 		d.tel1,
					tel2: 		d.tel2,
			//		adresse: {
					add: {
						n: 		d.numero,
						r: 		d.adresse,
						v: 		d.ville,
						cp: 	d.code_postal,
						lt: 	d.lat,
						lg: 	d.lng,
					},
			//	}
			//infocompta : {
					pmntCli: d.date_paiement_client == null ? null : new Date(d.date_paiement_client * 1000),
					pmntSst: d.date_paiement_sst == null ? null : new Date(d.date_paiement_sst * 1000)

			// }
		};
		if (d.fact === true) {
			tmp.facture = {
					dateEnvoie:new Date(d.date_edition_facture * 1000),
					envoyePar:d.facture_edite_par,
					add: {
						n: 		d.numero_facture,
						r: 		d.adresse_facture,
						v: 		d.ville_facture,
						cp: 	d.code_postal_facture
					},
			}
		}
		console.log(d);
		stock.push(tmp);
	}
	
	//console.log(stock);
	callback(stock);
};


exports.dumpData = function(callback) {
	var that = this;
	that.getOriginalData(function(data){
		that.translateData(data, function(trData){
			//console.log(trData);
			callback(trData);
		});
	});
};