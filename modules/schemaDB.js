module.exports = {};
   var mongoose = require("mongoose");
    mongoURI = 'mongodb://localhost/EDISON';
    mongoose.connect(process.env.MONGOLAB_URI || mongoURI);
    console.log("uri => ", process.env.MONGOLAB_URI);

module.exports.mongoose = mongoose;


module.exports.interventionSchema = new mongoose.Schema({
	//	InfoAuto 
			id : 		Number,
			telepro: 	String,
			dateAjout: 	Date,
	//	InfoIntervention
			dateInter:  Date,
			cat: 		String,
			sst: 		Number,
			etat:  		String,
			desc: 		String,
			prixAnn: 	Number,
			prixFin: 	Number,
			modeRegl: 	String,
			reglSP: 	Boolean,
			facture: 	{},
			remarque: 	String, 
			comments:   [],
			produits:   {},

	//	InfoClient
			civ: 		String,
			prenom: 	String,
			nom: 		String,
			email: 		String,
			tel1: 		String,
	//		adresse
			add: {
				n: 		Number,
				r: 		String,
				v: 		String,
				cp: 	String,
				lt: 	Number,
				lg: 	Number,
			},
			pmntCli: 		Date,
			pmntSst: 		Date
});


module.exports.artisanSchema = new mongoose.Schema({
	id: 			Number,
	civ: 			String,
	nomSociete: 	String,
	nomRep: 		String,
	prenomRep: 		String,
	categories:		[],
	formeJuridique: String,
	email: 			String,
	tel1: 			String,
	tel2: 			String,
	archive: 		Boolean,
	dateAjout: 		Date,
	ajoutePar: 		String,
	add: {
		n: 		Number,
		r: 		String,
		v: 		String,
		cp: 	String,
		lt: 	Number,
		lg: 	Number,
	},


});


module.exports.artisanModel = mongoose.model('artisan', module.exports.artisanSchema);
module.exports.interventionModel = mongoose.model('intervention', module.exports.interventionSchema);
