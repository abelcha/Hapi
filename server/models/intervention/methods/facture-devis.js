module.exports = function(schema) {
    var ejs = require("ejs");
    var fs = require("fs")
    var moment = require('moment');
    var PDF = require('edsx-mail')
    moment.locale('fr');
    var textTemplate = requireLocal('config/textTemplate');
    var _ = require('lodash')

    var getFacturePdfObj = function(doc, date, acquitte, reverse) {

        doc.datePlain = moment(date).format('LL');
        doc.acquitte = acquitte;
        var text = textTemplate.lettre.intervention.envoiFacture();
        var lettre = {
            address: _.get(doc, 'facture.address', doc.client.address),
            dest: _.get(doc, 'facture', doc.client),
            text: _.template(text)(doc),
            title: "OBJET : Facture n°" + doc.id + " en attente de reglement"
        }
        doc.type = 'facture'

        var l = [{
            model: 'letter',
            options: lettre
        }, {
            model: 'facture',
            options: doc
        }, {
            model: 'conditions',
            options: doc
        }]
        if (reverse) {
            var last = l.shift()
            l.push(last);
        }
        return PDF(l)
    }

    schema.statics.facturePreview = function(req, res) {
        var _this = this;
        try {
            var doc = JSON.parse(req.body.data);
            var pdf = getFacturePdfObj(doc, doc.date.intervention);
            return res.send(pdf.html())
            pdf.toBuffer(function(err, buff) {
                return res.pdf(buff)
            })
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
        doc.id = doc.id ||  "00000"
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

            return new Promise(function(resolve, reject) {

                if (envDev) {
                    inter.date.envoiFacture = new Date();
                    inter.login.envoiFacture = req.session.login;
                    return inter.save().then(resolve, reject)
                }

                if (!isWorker) {
                    return edison.worker.createJob({
                        name: 'db_id',
                        model: 'intervention',
                        method: 'sendFacture',
                        data: inter,
                        req: _.pick(req, 'body', 'session')
                    }).then(function() {
                        inter.save().then(resolve, reject)
                    }, reject)
                }



                var params = req.body;
                if (!params.text ||  !params.date) {
                    Promise.reject("Invalid Request")
                }
                try {
                    var pdf = getFacturePdfObj(inter, inter.date.intervention);

                } catch (e) {
                    reject(e)
                }
                pdf.toBuffer(function(err, buffer) {
                    mail.send({
                        From: "intervention@edison-services.fr",
                        ReplyTo: req.session.email || "abel@chalier.me",
                        To: req.session.email || "abel@chalier.me",
                        Subject: "Facture n°" + inter.id + " en attente de reglement",
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
                            getFacturePdfObj(doc, doc.date.intervention, false, true).toBuffer(function(err, buff) {
                                document.stack(buff, 'FACTURE' + doc.id, req.session.login)
                                    .then(function(resp) {
                                        console.log('file added', resp)
                                    })
                            })
                        })
                    }, reject).catch(__catch)
                })
            })
        }
    }
}
