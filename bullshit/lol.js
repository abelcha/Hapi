process.env.MONGOLAB_URI = 'mongodb://heroku_app33756489:hrkm1jfvok3i2hsopg9t99jvvd@ds041981-a0.mongolab.com:41981/heroku_app33756489'

require('./server/shared.js')();

var _ = require('lodash')
var async = require('async')
var request = require('request');


db.model('event').find({
    type: 'SEND_INTER',
    date: {
        $gt: new Date("2015-09-30T12:09:11.392Z")
    }
}).then(function(resp) {
    console.log(resp)
}, function(err) {
    console.log(err) 
})

return 0

edison.v1.get("SELECT ajoute_par,etat_intervention, id, devis FROM infointervention WHERE devis!='' AND devis NOT LIKE '%tva%'", function(err, resp) {
    async.eachLimit(resp, 3, function(e, cb) {
        console.log(e.id, e.ajoute_par, e.etat_intervention, JSON.parse(e.devis).tva);
        // var devis = JSON.parse(e.devis);
        // devis.tva = 20;
        //var k = JSON.stringify(devis);
        //   var query = ("UPDATE infointervention SET devis='" + json_encode(devis) + "' WHERE id='" + e.id + "'")
        //       console.log(query);
        /*        var q = "http://electricien13003.com/alvin/lol.php?devis=" + _.escapeRegExp(k) + "&id=" + e.id
                console.log(q);
                request.get(q, function(err, resp, body) {
                        console.log(err, body);
                    })*/
        /*edison.v1.set(query, function(err, resp) {
            console.log(err, resp);
            cb(null)
        })*/
        cb(null);
    }, process.exit.bind(process));
})
