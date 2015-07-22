angular.module('edison').factory('Compta', function() {
    "use strict";

    var Compta = function(inter) {
        var _this = this
        if (!(this instanceof Compta))
            return new Compta(inter)
        if (inter) {
            _this.inter = function() {
                return inter;
            }
            var reglement = inter.compta.reglement
            var paiement = inter.compta.paiement
            if (!_.get(inter, 'compta.paiement.pourcentage.deplacement')) {
                paiement.pourcentage = _.clone(inter.artisan.pourcentage)
            }

            reglement.montant = _.get(inter, 'compta.reglement.montant', 0);
            reglement.avoir = _.get(inter, 'compta.reglement.avoir', 0);
            _this.pourcentage = inter.compta.paiement.pourcentage;
            _this.fourniture = this.getFourniture(inter);
            _this.prixHT = inter.compta.paiement.base
            _this.montantHT = _this.prixHT - _this.fourniture.total
            _this.baseDeplacement = _this.prixDeplacement()
            _this.remunerationDeplacement = _this.applyCoeff(_this.baseDeplacement, _this.pourcentage.deplacement);
            _this.baseMaindOeuvre = _this.prixMaindOeuvre();
            _this.remunerationMaindOeuvre = _this.applyCoeff(_this.baseMaindOeuvre, _this.pourcentage.maindOeuvre);
            _this.venteFourniture = _this.prixHT - (_this.baseDeplacement + _this.baseMaindOeuvre);
            _this.coutFourniture = _this.fourniture.total;
            _this.baseMargeFourniture = _this.venteFourniture - _this.coutFourniture;
            _this.remunerationMargeFourniture = _this.applyCoeff(_this.baseMargeFourniture, _this.pourcentage.fourniture);
            _this.remboursementFourniture = _this.fourniture.artisan;
            _this.montantTotal = _this.remunerationDeplacement + _this.remunerationMargeFourniture + _this.remunerationMaindOeuvre + _this.remboursementFourniture;
        }
    }


    Compta.prototype = {
        inter: {},
        applyCoeff: function(number, Coeff) {
            return _.round(number * (Coeff / 100), 2);
        },
        prixDeplacement: function() {
            if (this.montantHT <= 65) {
                return this.montantHT;
            } else {
                return 65;
            }
        },
        prixMaindOeuvre: function() {
            if (this.montantHT <= 65) {
                return 0;
            } else if (this.montant <= 65) {
                return this.montantHT - 65;
            } else {
                return 65;
            }
        },
        getFourniture: function(inter) {
            var _this = this;
            var fourniture = {
                artisan: 0,
                edison: 0,
                total: 0
            };
            _.each(inter.fourniture, function(e) {
                fourniture[e.fournisseur === 'ARTISAN' ? 'artisan' : 'edison'] += _.round(e.pu * e.quantite, 2);
                fourniture.total += _.round(e.pu * e.quantite, 2);
            })
            return fourniture;
        },
        getMontantTTC: function() {
            return this.applyCoeff(this.inter().compta.reglement.montant, 100 + this.inter().tva)
        }
    }
    return Compta
});
