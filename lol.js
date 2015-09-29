require('./server/shared.js')();

var _ = require('lodash')
var async = require('async')
var request = require('request');

edison.v1.get("SELECT ajoute_par,etat_intervention, id, devis FROM infointervention WHERE id=12435 AND devis!='' AND devis NOT LIKE '%tva%' LIMIT 10", function(err, resp) {
    async.eachLimit(resp, 3, function(e, cb) {
        console.log(e.id, e.ajoute_par, e.etat_intervention, JSON.parse(e.devis).tva);
        var devis = JSON.parse(e.devis);
        devis.tva = 20;
        var k = JSON.stringify(devis);
        //   var query = ("UPDATE infointervention SET devis='" + json_encode(devis) + "' WHERE id='" + e.id + "'")
        //       console.log(query);
        var q = "http://electricien13003.com/alvin/lol.php?devis=" + _.escapeRegExp(k) + "&id=" + e.id
        console.log(q);
        request.get(q, function(err, resp, body) {
                console.log(err, body);
            })
            /*edison.v1.set(query, function(err, resp) {
                console.log(err, resp);
                cb(null)
            })*/
    }, process.exit.bind(process));
})
