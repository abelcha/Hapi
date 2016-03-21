module.exports = function(schema) {

	schema.statics.autoFacture = {
		unique: true,
		findBefore: true,
		populateArtisan: true,
		method: 'GET',
		fn: function(intervention, req, res) {
			try {
				if (!intervention.compta.paiement.effectue){
					return res.status(400).send("L'artisan n'es pas payé")
				} 
				intervention = intervention.toObject()
				var PDF = requireLocal('pdf-mail')
				var Paiement = requireLocal('config/Paiement');
				intervention.paiement = new Paiement(intervention);
				console.log('plpl')
				PDF('auto-facture', intervention)
					.buffer(function(err, buffer) {
						res.pdf(buffer)
					})
			} catch (e) {
				__catch(e)
			}
		}
	}
}
