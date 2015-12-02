    var _each = require('lodash/collection/each');
    var _includes = require('lodash/collection/includes');
    var _round = require('lodash/math/round')

    var FlushList = function(interArray, prevChecked) {
        var _this = this;
        var list = [];
        _each(interArray, function(e) {
            var rtn = {}
            rtn.montant = {
                base: e.compta.paiement.base,
                total: e.compta.paiement.montant,
                legacy: _this.getPreviousMontant(e),
                balance: _round(e.compta.paiement.montant - _this.getPreviousMontant(e), 2),
                final: _round(e.compta.paiement.montant - _this.getPreviousMontant(e), 2),
            }
            if (e.compta.paiement.tva) {
                var tva = (e.compta.paiement.tva + 100) / 100
                rtn.montant.balance = _round(rtn.montant.balance * tva, 2)
                rtn.montant.legacy = _round(rtn.montant.legacy * tva, 2)
            }
            rtn.id = e.id
            rtn.description = e.description;
            rtn.date = e.compta.paiement.date;
            rtn.login = e.compta.paiement.login
            rtn.checked = _includes(prevChecked, rtn.id)
            rtn.mode = e.compta.paiement.mode
            rtn.numeroCheque = e.compta.paiement.numeroCheque
            rtn.type = rtn.montant.legacy !== 0 ? (rtn.montant.balance > 0 ? 'COMPLEMENT' : 'AVOIR') : 'AUTO-FACT'
            list.push(rtn)
        })
        this.__list = list
    }
    FlushList.prototype.getPreviousMontant = function(inter) {
        if (!inter.compta.paiement.historique.length)
            return 0
        return inter.compta.paiement.historique[inter.compta.paiement.historique.length - 1].payed
    }


    FlushList.prototype.getList = function() {
        return this.__list
    }

    FlushList.prototype.getFullTotal = function() {
        this.getTotal()
        this.getTotal(true)
        return this.getTotal()
    }

    FlushList.prototype.getTotal = function(dirtyReload) {
        var total = {
            base: 0,
            montant: 0,
            balance: 0,
            legacy: 0,
            final: 0
        };
        var list = _(this.getList()).sortBy('montant.balance').reverse().value();
        _each(list, function(rtn) {
          //  console.log(rtn.checked, (!dirtyReload || (dirtyReload && rtn.montant.balance >= 0)))
            if (rtn.checked && (!dirtyReload || (dirtyReload && rtn.montant.balance >= 0))) {
                total.base = _round(total.base + rtn.montant.base);
                total.montant = _round(total.montant + rtn.montant.total, 2);
                total.legacy = _round(total.legacy + rtn.montant.legacy, 2);
                total.balance = _round(total.balance + rtn.montant.balance, 2);
                if (total.balance + rtn.montant.balance < 0) {
                    if (total.final == 0) {
                        rtn.montant.final = 0;
                    } else {
                        rtn.montant.final = _round(rtn.montant.balance - total.balance, 2);
                        if (rtn.montant.final < rtn.montant.balance) {
                            rtn.montant.final = rtn.montant.balance
                        }
                    }
                }
                total.final = _round(total.final + rtn.montant.final, 2);
            } else {
                rtn.montant.final = _round(rtn.montant.balance, 2)
            }
        })
        this.__list = _(list).sortBy('id').value();
        this.total = total;
        return total;
    }


    module.exports = FlushList;
