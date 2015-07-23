 var _each = require('lodash/collection/each');
 var _get = require('lodash/object/get')
 var _clone = require('lodash/lang/clone')
 var _round = require('lodash/math/round')

 var Paiement = function(inter) {
     var _this = this
     if (!(this instanceof Paiement))
         return new Paiement(inter)
     if (inter) {
         _this.inter = function() {
             return inter;
         }
         if (!inter.tva) {
             inter.tva = 20
         }
         var reglement = inter.compta.reglement
         var paiement = inter.compta.paiement
         if (!_get(inter, 'compta.paiement.pourcentage.deplacement')) {
             paiement.pourcentage = _clone(inter.artisan.pourcentage)
         }
         reglement.montant = _get(inter, 'compta.reglement.montant', 0);
         reglement.avoir = _get(inter, 'compta.reglement.avoir', 0)
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
         _this.montantTotal = _round(_this.remunerationDeplacement + _this.remunerationMargeFourniture + _this.remunerationMaindOeuvre + _this.remboursementFourniture, 2);
     }
 }




 Paiement.prototype = {
     inter: {},
     applyCoeff: function(number, Coeff) {
         return _round(number * (Coeff / 100), 2);
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
             return this.montantHT - 85;
         } else {
             return 85;
         }
     },
     getFourniture: function(inter) {
         var _this = this;
         var fourniture = {
             artisan: 0,
             edison: 0,
             total: 0
         };
         _each(inter.fourniture, function(e) {
             fourniture[e.fournisseur === 'ARTISAN' ? 'artisan' : 'edison'] += (e.pu * e.quantite);
             fourniture.total += e.pu * e.quantite, 2;
         })
         return fourniture;
     },
     getMontantTTC: function() {
         return this.applyCoeff(this.inter().compta.reglement.montant, 100 + this.inter().tva)
     }
 }
 module.exports = Paiement
