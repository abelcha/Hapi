var db = require(process.cwd() + "/edisonFramework/db.js")()
var produits = require(process.cwd() + '/edisonFramework/produits.js')
var sanitizeHtml = require('sanitize-html');
var Entities = require('html-entities').XmlEntities;
var _ = require('lodash')
var all = {};
entities = new Entities();

function getRightTitle(p) {
    p.ref = p.ref.replace(' ', '');

    if (p.ref.startsWith("CAM"))
        p.ref = "CAM001";
    if (p.ref.startsWith("EDI003") ||  p.ref.startsWith("FRN"))
        p.ref = "FRN001";
    var origin = _.find(produits, function(e) {
        return e.ref === p.ref;
    });
    if (origin) {
        p.title = origin.title;
    } else {
        p.ref = "AUT001";
        p.title = "Autre"
    }
    return p
        //return (p.ref)
}

var count = 0;
var count2 = 0;

db.model("intervention").find({
    produits: {
        $ne: []
    }
}).then(function(doc) {
    doc.forEach(function(e) {
        e.produits.forEach(function(x) {
            x.desc = sanitizeHtml(x.desc, {
                allowedTags: []
            })
            x.desc = entities.decode(x.desc);
            x.ref = sanitizeHtml(x.ref, {
                allowedTags: []
            })
            x = getRightTitle(x);
        })
        e.save(function(err, data) {
            console.log(err, data.length)
        });
    })
   // process.exit();
})
