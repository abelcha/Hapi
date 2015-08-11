global.requireLocal = function(pth) {
    return require(process.cwd() + '/' + pth)
}
var request = require('request');
var V1 = require('config/_convert_V1.js')
global.db = require(process.cwd() + '/server/edison_components/db.js')()
var _ = require('lodash');

var id = parseInt(process.argv[2] || _.random(400, 25000))

request.get('http://electricien13003.com/alvin/tt.php?id=' + id, function(err, resp, body) {
    if (err || resp.statusCode !== 200 || !body || body == 'null') {
        console.log(err, resp.statusCode, body)
        process.exit()
    }
    d = JSON.parse(body);
    db.model(d.etat_intervention === 'DEVIS' ? 'devis' : 'intervention').findOne({
        id: d.id
    }).then(function(doc) {
        try {
            var v1 = new V1(doc, d.etat_intervention === 'DEVIS', d);
        } catch (e) {
            console.log('--->', e.stack)
        }
        //v1.compare()
        try {

        v1.send(function(resp) {
            process.exit()
        });

       // process.exit()
    })
})
