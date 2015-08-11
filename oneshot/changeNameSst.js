global.requireLocal = function(pth) {
    return require(process.cwd() + '/' + pth)
}
var db = require(process.cwd() + '/server/edison_components/db.js')()
var _ = require('lodash');

db.model('artisan').find().exec(function(err, docs) {
    console.log('id;prenom;nom;nom societe;\n')
    _.each(docs, function(doc) {
        console.log([doc.id, doc.nomSociete, doc.representant.prenom, doc.representant.nom, doc.status === 'ARC' ? 'archivé' : ''].join(';') + '');
    })
})
