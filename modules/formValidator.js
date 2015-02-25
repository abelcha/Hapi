var V = require('validator');
var $ = require('string');
var db = require("../modules/schemaDB.js");

V.extend('isTelephone', function (telephone) {
	return ($(telephone).startsWith('0') && telephone.length == 10 && $(telephone).isNumeric());
});


function checkRequired(form, tab) {
	for (var i = 0; i < tab.length; i++) {
		if (typeof form[tab[i]] == 'undefined')
			return (tab[i]);
	};
	return (null);
};



module.exports.signup = function(form, callback) {

db.userModel.findOne({login:form.login}, function (err, result) {
	if (result !== null)
		return callback({status:'ERR', flash:form.login + " : cet utilisateur existe deja"});

	var missingField = checkRequired(form, ['prenom', 'nom', 'email', 'telephone', 'service']);
	if (missingField)
		return callback({status:'ERR', flash:"le champs '" + missingField + "' est requis"});

	if (!V.isEmail(form.email))
		return callback({status:'ERR', flash:"L'addresse email est invalide"});

	if (form.ligne && !V.isTelephone(form.ligne))
		return callback({status:'ERR', flash:"La ligne telephonique est invalide"});

	if (!V.isIn(form.service, ['INTERVENTION', 'COMPTABILITE', 'PARTENARIAT', 'ADMIN']))
		return callback({status:'ERR', flash:"Le service '" + form.service + "' n'existe pas"});

	if (!V.isTelephone(form.telephone))
		return callback({status:'ERR', flash:"Le telephone est invalide"});
	return callback({status:'OK', flash:"L'utilisateur a été enregistré, un email a été envoyé"});
});
};