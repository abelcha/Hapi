var Facture = function(intervention) {

	if (!(this instanceof Facture)) {
		return new Facture(intervention);
	}
	this.facture = intervention.facture
	this.produits = intervention.produits

}

Facture.prototype.isInvalid = function() {
	if (!this.facture.email) {
		return "Veuillez renseigner un email de facturation"
	}
	if (!this.facture.civilite) {
		return "Veuillez renseigner une civilite de facturation"
	}
	if (!this.facture.nom) {
		return "Veuillez renseigner un nom de facturation"
	}
	if (!this.facture.address.r || !this.facture.address.n ||  !this.facture.address.cp || !this.facture.address.c) {
		return "Veuillez renseigner une addresse de facturation"
	}
	if (!this.facture.email) {
		return "Veuillez renseigner un email de facturation"
	}
	if (!this.produits ||  !this.produits.length) {
		return 'Veuillez renseigner au moins 1 produits'
	}
	return false
}

module.exports = Facture
