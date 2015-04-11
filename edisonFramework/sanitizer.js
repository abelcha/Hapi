var V = require('validator');
var $ = require('string');


function sanitizePhone(telephone) {
	return telephone.replace("+33", "0").replace("0033", "0");
}
function sanitizeCheckbox(cb) {
	return (cb == "1");
}
function createLogin(_prenom, _nom) {
	var nom = $(_nom).collapseWhitespace().latinise().left(6)
	var prenom = $(_prenom).collapseWhitespace().latinise().left(1)
	return $(nom + '_' + prenom).toLowerCase().s;
}

function capitalizeSelected(form, tab) {
	for (var i = 0; i < tab.length; i++) {
		if (typeof form[tab[i]] == 'undefined')
			return (tab[i]);
	};
	return (null);
};



module.exports.password = function(form, callback) {
	var salt = npm.bcryptjs.genSaltSync(10);
	form.hash = npm.bcryptjs.hashSync(form.password, salt);
	callback();
};

module.exports.signup = function(form, callback) {
	form.telephone = sanitizePhone(form.telephone);
	form.ligne = sanitizePhone(form.ligne);
	form.email = V.normalizeEmail(form.email);
	form.root = sanitizeCheckbox(form.root);
	form.login = createLogin(form.prenom, form.nom);
	form.activated = false;
	callback();
};

