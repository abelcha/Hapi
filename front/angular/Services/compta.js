angular.module('edison').factory('Compta', function() {
    "use strict";

    var Compta = function(inter) {
        var _this = this


        _this.tva = inter.tva;
        _this.pourcentage = inter.artisan.pourcentage;
        _this.fourniture = this.getFourniture(inter);
        _this.prixHT = inter.prixFinal || 0
        _this.montantHT = _this.prixHT - _this.fourniture.total
        //_this.prixTTC = _this.round(_this.applyCoeff(_this.montantHT, _this.tva));
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


    Compta.prototype = {
        inter: {},
        round: function(number) {
            return Math.floor(number * 100) / 100
        },
        applyCoeff: function(number, Coeff) {
            return this.round(number * (Coeff / 100));
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
            } else if (this.montant <= 65){
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
                fourniture[e.fournisseur === 'ARTISAN' ? 'artisan' : 'edison'] += _this.round(e.pu * e.quantite);
                fourniture.total += _this.round(e.pu * e.quantite);
            })
            return fourniture;
        }
    }
    return Compta
});
