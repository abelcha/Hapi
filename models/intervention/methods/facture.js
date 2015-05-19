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

    var generatePDF = function(doc, title, html, res) {

        return new Promise(function(resolve, reject) {
            if (!doc.produits || !doc.produits.length)  {
                console.log("hehehe")
                doc.produits = [{
                    ref: 'BLS042',
                    desc: doc.description,
                    pu: doc.prixAnnonce,
                    quantite: 1
                }]
            }
            var file = fs.readFileSync(process.cwd() + '/pdf/facture.html', 'utf8');
            var template = ejs.render(file, {
                data: doc,
                logo: edison.logo,
                title: title,
                info: getInfo(doc),
                date: moment(doc.date.ajout ||  new Date).format('LL')
            });
            if (html === "true") {
                return resolve(template);
            }
            res.contentType("application/pdf");
            pdf.create(template).toStream(function(err, stream) {
                if (res)
                    stream.pipe(res);
                else {
                	//stream to a file
                	// the return the filename
                }
                resolve(stream);
            });
        })
    }

    var getPdf = function(id, params, res) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            if (params.data) 
                return generatePDF(params.data, params.title, params.html, res).then(resolve, reject);
            db.model('intervention').findOne({
                id: id
            }).then(function(doc)  {

                return generatePDF(doc, params.title, params.html, res).then(resolve, reject);
            });
        });
    }

    schema.statics.facture = function(id, req, res) {
        var data = req.query.data && JSON.parse(req.query.data);
        return getPdf(id, {
            title: "Facture",
            html: req.query.html,
            data: data
        }, res);
    }
    schema.statics.devis = function(id, req, res) {
        return getPdf(id, {
            title: "Devis",
            html: req.query.html,
        }, res);
    }

}
