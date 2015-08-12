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

    schema.statics.getFacture = function(options) {
        return edison.pdf({
            html: options.html,
            template: 'facture',
            args: {
                data: options.data,
                logo: edison.logo,
                acquitte: options.acquitte,
                title: 'Facture',
                info: getInfo(options.data),
                date: moment(options.date || options.data.date.ajout ||  new Date).format('LL')
            },
            buffer: true
        })
    }


    schema.statics.getDevis = function(options) {
        return edison.pdf({
            html: options.html,
            template: 'facture',
            args: {
                data: options.data,
                logo: edison.logo,
                acquitte: options.acquitte,
                title: 'Devis',
                info: getInfo(options.data),
                date: moment(options.date || options.data.date.ajout ||  new Date).format('LL')
            },
            buffer: true
        })
    }
    schema.statics.getDevisFile = function(options) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this.getDevis(options).then(function(buffer) {
                resolve({
                    data: buffer,
                    name: 'devis.pdf',
                    mimeType: "application/pdf"
                })
            }, reject)
        })
    }

    schema.statics.facturePreview = function(req, res) {
        var _this = this;
        req.body.html = false
        return new Promise(function(resolve, reject) {
            var doc = JSON.parse(req.body.data);
            _this.getDevis({
                    data: doc,
                    html: true,
                    date: req.body.date,
                    acquitte: false
                })
                .then(function(result) {
                    if (!true)
                        res.contentType("application/pdf");
                    resolve(result);
                }, reject)

        })
    }

}
