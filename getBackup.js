var fs = require('fs');
var _ = require('lodash');

var backup = fs.readFileSync("/Users/abelchalier/Dropbox/BACKUP/2015-10-21/intervention.json", 'utf-8');
var ids = [31864, 27667, 33598, 26258, 26548, 33000, 32937, 31798, 31749, 31592, 30286, 27187, 26743, 23404];
backup = JSON.parse(backup);
_.each(backup, function(e) {
	if (_.includes(ids, e.id)) {
		console.log('==>', e.id, e.produits, e.prixFinal)
		console.log()
		console.log()
		console.log()
		console.log()
		console.log()
		console.log()
	}

