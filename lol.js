require('./server/shared.js')();

var _ = require('lodash')

edison.v1.get("SELECT ajoute_par,etat_intervention, id, devis FROM infointervention WHERE devis!='' AND devis NOT LIKE '%tva%'", function(err, resp) {
    _.each(resp, function(e) {
        console.log(e.id, e.ajoute_par, e.etat_intervention, JSON.parse(e.devis).tva);
    })
    process.exit();
})
