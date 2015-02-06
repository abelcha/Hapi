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
					numOs : d.id,
					ajoutePar: d.ajoute_par,
					dateAjout: new Date(d.t_stamp * 1000),
					modifiePar: d.modifie_par,

			//	},
			//	InfoIntervention : {
					categorie: d.categorie,
					artisan: d.id_sst_selectionne,
					etatInter: d.etat_intervention,
					dateInter:  new Date(d.t_stamp_intervention * 1000),
					description: d.description,
					remarque: d.remarque,
					commentaires: [{c: d.remarque_interne, a:null, d:null}],
					produits : d.devis,
					prixAnnonce:d.prix_ht_annonce,
					prixFinal: d.prix_ht_final,
			//	},

			//	InfoClient : {
					civilite: d.civilite,
					prenom: d.prenom,
					nom: d.nom,
					email: d.email,
					telephone: d.tel1,
			//		adresse: {
						numero: d.numero,
						rue: d.adresse,
						ville: d.ville,
						cp: d.code_postal,
						lat: d.lat,
						lng: d.lng,
			//		}
			//	}
			//infocompta : {
				paiementArtisan: d.date_paiement_client == null ? null : new Date(d.date_paiement_client * 1000),
				paiementClient: d.date_paiement_sst == null ? null : new Date(d.date_paiement_sst * 1000)

			// }
		};
		stock.push(tmp);
	}
	
	//console.log(stock);
	callback(stock);
};

exports.pushDatatoDB = function(DB, data, callback) {
callback(data);
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