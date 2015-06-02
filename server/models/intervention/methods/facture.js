module.exports = function(schema) {
    var ejs = require("ejs");
    var fs = require("fs")
    var pdf = require('html-pdf');
    var moment = require('moment');
    moment.locale('fr');

    var getInfo = function(doc) {
        var info = {
            lineNbr: 0,
            montantTotal: 0
        }
        doc.produits.forEach(function(e) {
            var s = e.desc.split('\n');
            info.lineNbr += s.length;
            s.forEach(function(x) {
                if (x.length > 54)
                    info.lineNbr += (x.length - (x.length % 54)) / 54
            })
            info.montantTotal += (e.pu * e.quantite);
        })

        return info;

    }

    var getFacture = function(doc, html, date) {
        return edison.pdf({
            html: html,
            template: 'facture',
            args: {
                data: doc,
                logo: edison.logo,
                title: 'Facture',
                info: getInfo(doc),
                date: moment(date || doc.date.ajout ||  new Date).format('LL')
            },
            buffer: true
        })
    }

    schema.statics.facturePreview = function(req, res) {
        return new Promise(function(resolve, reject) {
            var doc = JSON.parse(req.query.data);
            getFacture(doc, req.query.html, req.query.date)
                .then(function(result) {
                    if (!req.query.html)
                        res.contentType("application/pdf");
                    resolve(result);
                }, reject)

        })
    }

    schema.statics.facture = function(id, req, res) {
        return new Promise(function(resolve, reject) {
            db.model('intervention').findOne({
                id: id
            }).then(function(doc)  {
                getFacture(doc, req.query.html, req.query.date)
                    .then(function(result) {
                        if (!req.query.html)
                            res.contentType("application/pdf");
                        resolve(result);
                    }, reject)
            }, reject)
        })
    }
}
