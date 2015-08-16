module.exports = function(schema) {
    var ejs = require("ejs");
    var fs = require("fs")
    var pdf = require('html-pdf');
    var moment = require('moment');
    var PDF = require('edsx-mail')
    moment.locale('fr');
    var textTemplate = requireLocal('config/textTemplate');
    var _ = require('lodash')

    var getFacturePdfObj = function(doc, date, acquitte) {

        doc.datePlain = moment(date).format('LL');
        doc.acquitte = acquitte;
        var text = textTemplate.lettre.intervention.envoiFacture();
        var lettre = {
            address: doc.facture.address,
            dest: doc.facture,
            text: _.template(text)(doc),
            title: "OBJET : Facture en attente de rèlement"
        }
        return PDF([{
            model: 'letter',
            options: lettre
        }, {
            model: 'facture',
            options: doc
        }, {
            model: 'conditions',
            options: doc
        }])
    }

    schema.statics.facturePreview = function(req, res) {
        var _this = this;
        try {
            var doc = JSON.parse(req.body.data);
        } catch (e) {
            return res.status(400).send('bad data')
        }

        res.send(getFacturePdfObj(doc, doc.date.intervention).html())
    }

    schema.statics.factureAcquittePreview = function(req, res) {
        var _this = this;
        try {
            var doc = JSON.parse(req.body.data);
        } catch (e) {
            return res.status(400).send('bad data')
        }

        res.send(getFacturePdfObj(doc, req.body.date, true).html())
    }




    schema.statics.devisPreview = function(req, res) {
        var _this = this;
        try {
            var doc = JSON.parse(req.body.data);
        } catch (e) {
            return res.status(400).send('bad data')
        }
        var result = PDF([{
            model: 'facture',
            options: doc
        }, {
            model: 'conditions',
            options: {}
        }]).html()
        return res.send(result)
    }


    schema.statics.sendFacture = {
        unique: true,
        findBefore: true,
        method: 'POST',
        fn: function(inter, req, res) {
            var params = req.body;
            if (!params.text ||  !params.date) {
                Promise.reject("Invalid Request")
            }
            return new Promise(function(resolve, reject) {
                try {
                    var pdf = getFacturePdfObj(inter, inter.date.intervention);

                } catch (e) {
                    reject(e)
                }
                console.log(pdf.html())
                pdf.toBuffer(function(err, buffer) {
                        mail.send({
                            From: "intervention@edison-services.fr",
                            To: req.session.email || "abel@chalier.me",
                            Subject: "Facture de l'intervention " + inter.id,
                            HtmlBody: req.body.text.replace('\n', '<br>'),
                            Attachments: [{
                                Content: buffer.toString('base64'),
                                Name: 'Facture.pdf',
                                ContentType: 'application/pdf'
                            }]
                        }).then(function(resp) {
                            console.log(resp);
                            inter.date.envoiFacture = new Date();
                            inter.login.envoiFacture = req.session.login;
                            inter.save().then(resolve, reject)
                        }, reject).catch(__catch)
                    })
            })
        }
    }
}
