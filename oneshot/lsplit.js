String.prototype.lsplit = function(len) {
	var rtn = [];
    var arr = this.split(' ');
    var tmp = "";
    arr.forEach(function(e) {
    	if (tmp.length + e.length > len) {
    		rtn.push(tmp);
    		tmp = "";
    	} else {
    		tmp += e + " "
    	}
    })
    return rtn
}

var lol = "Nos factures      sont payables au comptant, sauf dérogation, et sans escompte. Le taux des pénalités de retard exigibles le jour suivant la date limite de règlement est égal au taux d'intérêt appliqué par la BCE à son opération de refinancement la plus récente, majorité de 10 points de % ou de 8 points de % pour une commande publique. Tout professionnel ou acheteur public en retard de paiement est débiteur d'une indemnité forfaitaire pour frais de recouvrement de 40 euros. Clause de réserve de propriété."

var x = lol.lsplit(30)
console.log(x)