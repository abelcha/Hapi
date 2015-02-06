module.exports = {};
   var mongoose = require("mongoose");
    mongoURI = 'mongodb://localhost/EDISON';
    mongoose.connect(process.env.MONGOLAB_URI || mongoURI);


module.exports.mongoose = mongoose;


module.exports.interventionSchema = new mongoose.Schema({
	//	InfoAuto 
			numOs : Number,
			ajoutePar: String,
			dateAjout: Date,
			modifiePar: String,

	//	InfoIntervention
			dateInter: Date,
			categorie: String,
			artisan: Number,
			etatInter: String,
			description: String,
			prixAnnonce: Number,
			prixFinal: Number,
			modeReglement:String,
			remarque: String, 
			commentaires:[],
			produits: {},

	//	InfoClient
			civilite: String,
			prenom: String,
			nom: String,
			email: String,
			telephone: String,
	//		adresse
				numero: Number,
				rue: String,
				ville: String,
				cp: String,
				lat: Number,
				lng: Number,
		paiementArtisan: Date,
		paiementClient: Date
	});

module.exports.interventionModel = mongoose.model('intervention', module.exports.interventionSchema);
