module.exports = function(schema) {
	schema.statics.add = function(req, res) {
		return new Promise(function(resolve, reject)  {
			var params = db.model('signalement')(req.body);
			params.login.ajout = req.session.login;
			params.date.ajout = new Date;
			params.save().then(function() {
				db.model('artisan').findOne({
					id: params.sst_id
				}).then(function(resp) {
					return resp && resp.save().then(resolve, reject)
				})
			})
		})
	}
	schema.statics.lol = function(req, res) {
		var x = [{
			"nom": "LE SOUS-TRAITANT N’A PAS REÇU LE CONTRAT DE SOUS-TRAITANCE",
			"subType": "ADMINISTRATIF",
			"service": "PARTENARIAT",
			"level": "1",
			"_type": "LE_SOUS_TRAITANT_N_A_PAS_RECU_LE_CONTRAT_DE_SOUS_TRAITANCE"
		}, {
			"nom": "LE SOUS-TRAITANT N’A PAS SIGNÉ LES CONTRATS",
			"subType": "ADMINISTRATIF",
			"service": "PARTENARIAT",
			"level": "1",
			"_type": "LE_SOUS_TRAITANT_N_A_PAS_SIGNE_LES_CONTRATS"
		}, {
			"nom": "DEMANDE DE L’ATTESTATION D’URSAFF",
			"subType": "ADMINISTRATIF",
			"service": "COMPTABILITE",
			"level": "1",
			"_type": "DEMANDE_DE_L_ATTESTATION_D_URSAFF"
		}, {
			"nom": "CHANGEMENT D’ADRESSE",
			"subType": "ADMINISTRATIF",
			"service": "COMPTABILITE",
			"level": "1",
			"_type": "CHANGEMENT_D_ADRESSE"
		}, {
			"subType": "CLIENT",
			"nom": "LE CLIENT N'AVAIT PAS COMPRIS LE PRIX DE L'INTERVENTION",
			"service": "INTERVENTION",
			"level": "0",
			"_type": "LE_CLIENT_N_AVAIT_PAS_COMPRIS_LE_PRIX_DE_L_INTERVENTION"
		}, {
			"subType": "CLIENT",
			"nom": "LE CLIENT PENSAIT QU'IL S'AGISSAIT D'UN DEVIS GRATUIT",
			"service": "INTERVENTION",
			"level": "0",
			"_type": "LE_CLIENT_PENSAIT_QU_IL_S_AGISSAIT_D_UN_DEVIS_GRATUIT"
		}, {
			"nom": "LE CLIENT N'EST PAS SATISFAIT DU TRAVAIL DU PARTENAIRE",
			"subType": "CLIENT",
			"level": "1",
			"service": "PARTENARIAT",
			"_type": "LE_CLIENT_N_EST_PAS_SATISFAIT_DU_TRAVAIL_DU_PARTENAIRE"
		}, {
			"nom": "LE PARTENAIRE S'EST DÉPLAÇÉ POUR RIEN",
			"subType": "CLIENT",
			"service": "PARTENARIAT",
			"level": "0",
			"_type": "LE_PARTENAIRE_S_EST_DEPLACE_POUR_RIEN"
		}, {
			"subType": "INTERVENTION",
			"nom": "LE SOUS-TRAITANT N’A PAS RÉCUPÉRER LE RÈGLEMENT SUR PLACE",
			"service": "PARTENARIAT",
			"level": "2",
			"_type": "LE_SOUS_TRAITANT_N_A_PAS_RECUPERER_LE_REGLEMENT_SUR_PLACE"
		}, {
			"nom": "LE SOUS-TRAITANT ACHÈTE LE MATÉRIEL AVANT L’INTERVENTION",
			"level": "1",
			"service": "PARTENARIAT",
			"subType": "INTERVENTION",
			"_type": "LE_SOUS_TRAITANT_ACHETE_LE_MATERIEL_AVANT_L_INTERVENTION"
		}, {
			"nom": "LE SOUS-TRAITANT N’A PAS FAIT SIGNÉ DE DEVIS AU CLIENT",
			"level": "1",
			"service": "COMPTABILITE",
			"subType": "INTERVENTION",
			"_type": "LE_SOUS_TRAITANT_N_A_PAS_FAIT_SIGNE_DE_DEVIS_AU_CLIENT"
		}, {
			"nom": "LE SOUS-TRAITANT N’A PAS VENDU LE MATÉRIEL AU PRIX CATALOGUE",
			"subType": "INTERVENTION",
			"service": "PARTENARIAT",
			"level": "1",
			"_type": "LE_SOUS_TRAITANT_N_A_PAS_VENDU_LE_MATERIEL_AU_PRIX_CATALOGUE"
		}, {
			"nom": "VENTE DE MATÉRIEL POUR SON COMPTE",
			"subType": "VOL",
			"service": "PARTENARIAT",
			"level": "2",
			"_type": "VENTE_DE_MATERIEL_POUR_SON_COMPTE"
		}, {
			"nom": "LE SOUS-TRAITANT NE SOUHAITE PLUS TRAVAILLER AVEC NOUS",
			"subType": "PARTENARIAT",
			"service": "PARTENARIAT",
			"level": "2",
			"_type": "LE_SOUS_TRAITANT_NE_SOUHAITE_PLUS_TRAVAILLER_AVEC_NOUS"
		}, {
			"nom": "LE SOUS-TRAITANT VEUT UNE AUGMENTATION",
			"subType": "PARTENARIAT",
			"service": "PARTENARIAT",
			"level": "1",
			"_type": "LE_SOUS_TRAITANT_VEUT_UNE_AUGMENTATION"
		}, {
			"nom": "LE SOUS-TRAITANT A TROP D’ANNULATION",
			"subType": "PARTENARIAT",
			"service": "PARTENARIAT",
			"level": "2",
			"_type": "LE_SOUS_TRAITANT_A_TROP_D_ANNULATION"
		}, {
			"nom": "LE SOUS-TRAITANT N’A PAS COMPRIS LES %",
			"subType": "PARTENARIAT",
			"service": "PARTENARIAT",
			"level": "1",
			"_type": "LE_SOUS_TRAITANT_N_A_PAS_COMPRIS_LES"
		}, {
			"nom": "LE SOUS-TRAITANT MANQUE DE MOTIVATION",
			"subType": "PARTENARIAT",
			"service": "PARTENARIAT",
			"level": "1",
			"_type": "LE_SOUS_TRAITANT_MANQUE_DE_MOTIVATION"
		}, {
			"nom": "LE SOUS-TRAITANT A RÉALISÉ L’INTERVENTION MAIS N’EST PAS PAYÉ",
			"subType": "COMPTABILITE_RECOUVREMENT",
			"service": "COMPTABILITE",
			"level": "1",
			"_type": "LE_SOUS_TRAITANT_A_REALISE_L_INTERVENTION_MAIS_N_EST_PAS_PAYE"
		}, {
			"nom": "LE SOUS-TRAITANT N’APPEL PAS LES CLIENTS",
			"subType": "PARTENARIAT",
			"service": "PARTENARIAT",
			"level": "2",
			"_type": "LE_SOUS_TRAITANT_N_APPEL_PAS_LES_CLIENTS"
		}, {
			"nom": "LE SOUS-TRAITANT N’EST PAS JOIGNABLE",
			"subType": "DISPONIBILITE",
			"service": "PARTENARIAT",
			"level": "1",
			"_type": "LE_SOUS_TRAITANT_N_EST_PAS_JOIGNABLE"
		}, {
			"nom": "LE SOUS-TRAITANT N’EST PLUS ACTIF DEPUIS UN MOMENT",
			"subType": "DISPONIBILITE",
			"service": "PARTENARIAT",
			"level": "2",
			"_type": "LE_SOUS_TRAITANT_N_EST_PLUS_ACTIF_DEPUIS_UN_MOMENT"
		}, {
			"nom": "LE SOUS-TRAITANT EST DE MOINS EN MOINS DISPONIBLE",
			"subType": "DISPONIBILITE",
			"service": "PARTENARIAT",
			"level": "1",
			"_type": "LE_SOUS_TRAITANT_EST_DE_MOINS_EN_MOINS_DISPONIBLE"
		}, {
			"nom": "VENTE DE MATÉRIEL POUR SON COMPTE",
			"subType": "VOL",
			"service": "INTERVENTION",
			"level": "2",
			"_type": "VENTE_DE_MATERIEL_POUR_SON_COMPTE"
		}, {
			"nom": "SOUPÇONS DE VOL",
			"subType": "VOL",
			"service": "COMPTABILITE",
			"level": "2",
			"_type": "SOUPCONS_DE_VOL"
		}, {
			"nom": "LE SOUS-TRAITANT NE DONNE PAS LES BONS COÛTS DE FOURNITURE",
			"subType": "COMPTABILITE_RECOUVREMENT",
			"service": "PARTENARIAT",
			"level": "1",
			"_type": "LE_SOUS_TRAITANT_NE_DONNE_PAS_LES_BONS_COUTS_DE_FOURNITURE"
		}, {
			"subType": "ADMINISTRATIF",
			"nom": "DEMANDE D’UN FACTURIER / DEVISEUR",
			"service": "PARTENARIAT",
			"level": "0",
			"_type": "DEMANDE_D_UN_FACTURIER_DEVISEUR"
		}, {
			"nom": "LE SOUS-TRAITANT N’A PAS RÉUSSI L’INTERVENTION, IL EST PARTI SANS FACTURATION",
			"subType": "INTERVENTION",
			"service": "PARTENARIAT",
			"level": "1",
			"_type": "LE_SOUS_TRAITANT_N_A_PAS_REUSSI_L_INTERVENTION_IL_EST_PARTI_SANS_FACTURATION"
		}, {
			"nom": "LE CLIENT DIT QUE C'EST AU PROPRIETAIRE DE RÉGLER ET NE VEUT PAS PAYER",
			"subType": "CLIENT",
			"service": "INTERVENTION",
			"level": "0",
			"_type": "LE_CLIENT_DIT_QUE_C_EST_AU_PROPRIETAIRE_DE_REGLER_ET_NE_VEUT_PAS_PAYER"
		}, {
			"_type": "RISQUE_D_IMPAYE_DE_LA_PART_DU_CLIENT_OPPOSITION_MANQUE_DE_PROVISION",
			"subType": "CLIENT",
			"nom": "RISQUE D'IMPAYÉ DE LA PART DU CLIENT (OPPOSITION, MANQUE DE PROVISION)",
			"service": "COMPTABILITE",
			"level": "2"
		}, {
			"nom": "LE SOUS-TRAITANT PRÉVIENT PLUSIEURS JOURS PLUS TARD DE L’ANNULATION",
			"subType": "PARTENARIAT",
			"service": "PARTENARIAT",
			"level": "2",
			"_type": "LE_SOUS_TRAITANT_PREVIENT_PLUSIEURS_JOURS_PLUS_TARD_DE_L_ANNULATION"
		}]
		var _ = require('lodash');
		_.each(x, function(e) {
			var n = db.model('signal')(e);
			n.save();
		})
	}

}
