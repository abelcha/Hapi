module.exports = Compta;

var Compta = function(inter) {
    this.inter = inter
}


Compta.prototype = {
    inter: {},
    round: function(number) {
        return number
    },
    applyCoeff: function(number, Coeff) {
        return this.round(number * ((100 + Coeff) / 100));
    },

    prixDeplacement: function() {
        if (this.prixFinalHT <= 65) {
            return this.prixFinalHT;
        } else {
            return 65;
        }
    },
    prixMaindOeuvre: function() {
        if (this.prixFinalHT <= 65) {
            return 0;
        } else if (this.prixFinal <= 150) {
            return this.prixFinal - 65;
        } else {
            return this.prixFinal - 65 - this.coutFourniture;
        }
    },
    reload: function() {
        this.coutFourniture = 0;
        this.coutFournitureSST = 0;
        /*    	_(this.inter.fourniture).each(function(e) {
            		if (e.fournisseur === 'ARTISAN')
            			this.coutFournitureSST += this.round(e.pu * e.quantite);
            		this.coutFourniture += this.round(e.pu * e.quantite);
            	})*/
        this.tva = this.inter.tva;
        this.pourcentage = this.inter.artisan.pourcentage;
        this.prixHT = this.inter.prixFinal;
        this.prixTTC = this.applyCoeff(this.prixFinalHT, this.tva);
        this.montantDeplacement = this.applyCoeff(this.prixDeplacement, this.pourcentage.deplacement);
        this.montantMaindOeuvre = this.applyCoeff(this.prixMaindOeuvre, this.pourcentage.maindOeuvre);
        this.montantFourniture = this.applyCoeff(this.prixFourniture, this.pourcentage.fourniture);
        this.montantTTC = this.round(this.montantDeplacement + this.montantMaindOeuvre + this.montantFourniture)
    }
}
