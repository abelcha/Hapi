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
            address: _.get(doc, 'facture.address', doc.client.address),
            dest: _.get(doc, 'facture', doc.client),
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
            var pdf = getFacturePdfObj(doc, doc.date.intervention);
            res.send(pdf.html())
        } catch (e) {
            __catch(e)
            return res.status(400).send('bad data')
        }

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
        doc.type = 'devis'
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


            if (!isWorker) {
                return edison.worker.createJob({
                    name: 'db_id',
                    model: 'intervention',
                    method: 'sendFacture',
                    data: inter,
                    req: _.pick(req, 'body', 'session')
                })
            }





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
                pdf.toBuffer(function(err, buffer) {
                    mail.send({
                        From: "intervention@edison-services.fr",
                        To: req.session.email || "abel@chalier.me",
                        Subject: "Facture de l'intervention " + inter.id,
                        HtmlBody: req.body.text.replaceAll('\n', '<br>'),
                        Attachments: [{
                            Content: buffer.toString('base64'),
                            Name: 'Facture.pdf',
                            ContentType: 'application/pdf'
                        }]
                    }).then(function(resp) {
                        db.model('intervention').findOne({
                            id: inter.id
                        }).then(function(doc) {
                            doc.date.envoiFacture = new Date();
                            doc.login.envoiFacture = req.session.login;
                            doc.save().then(resolve, reject)
                            document.stack(buffer, 'FACTURE' + doc.id, req.session.login)
                                .then(function(resp) {
                                    console.log('file added', resp)
                                })
                        })
                    }, reject).catch(__catch)
                })
            })
        }
    }
}
