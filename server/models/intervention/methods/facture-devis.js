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
        /*        doc.produits.unshift({
                    pu: 0,
                    quantite: 1,
                    title: "",
                    ref: "",
                    desc: String
                })*/
        var text = textTemplate.lettre.intervention.envoiFacture();
        var lettre = {
            address: doc.facture.address,
            dest: doc.facture,
            text: _.template(text)(doc),
            title: "OBJET : Facture n°" + doc.id + " en attente de reglement"
        }
        if (doc.produits[0].ref !== 'ME001') {
            doc.produits.unshift({
                desc: _.template("Suite à notre intervention chez {{client.civilite}} {{client.nom}} " +
                    "{{client.prenom}},\n {{client.address.n}} {{client.address.r}}, {{client.address.cp}} " +
                    "{{client.address.v}}\n le ")(doc) + moment(doc.date.intervention).format('DD[/]MM/YYYY[ à ]HH[h]mm'),
                pu: 0,
                quantite: 1
            })
        }
        doc.type = 'facture'
        if (!acquitte) {
            var l = [{
                model: 'letter',
                options: lettre
            }]
        } else {
            var l = [];
        }

        l.push({
            model: 'conditions',
            options: doc
        }, {
            model: 'facture',
            options: doc
        })
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
        doc.facture = doc.client;
        doc.facture.tel = doc.client.telephone.tel1;
        doc.acquitte = false;
        doc.user = req.session;
        doc.type = "devis"
        var result = PDF([{
            model: 'facture',
            options: doc
        }, {
            model: 'conditions',
            options: {}
        }]).html()
        return res.send(result)
    }


    schema.statics.sendFactureAcquitte = {
        unique: true,
        findBefore: true,
        method: 'POST',
        fn: function(dd, req, res) {
            return new Promise(function(resolve, reject) {

                var inter = req.body.data
                if (inter.reglementSurPlace) {
                    inter.facture = inter.client;
                }
                var f = inter.facture;
                if (!f.email ||  !f.nom || !f.address.r || !f.address.v ||  !f.address.cp || !f.address.n) {
                    return reject('Les coordonées de facturations sont incompletes')
                }
                f.prenom = f.prenom ||  "";
                if (!inter.produits || !inter.produits.length) {
                    return reject('Veuillez renseigner au moins 1 produits')
                }
                if (!isWorker) {
                    edison.event('INTER_SENDFACT_ACQ').login(req.session.login).id(inter.id).save();
                    return edison.worker.createJob({
                        name: 'db_id',
                        model: 'intervention',
                        method: 'sendFactureAcquitte',
                        data: inter,
                        req: _.pick(req, 'body', 'session')
                    }).then(resolve, reject)
                }

                var params = req.body;
                if (!params.text ||  !params.date) {
                    Promise.reject("Invalid Request")
                }
                if (inter.reglementSurPlace) {
                    inter.facture = inter.client;
                }
                inter.acompte = inter.prixFinal;

                var pdf = getFacturePdfObj(inter, inter.date.intervention, true, req.body.date);

                pdf.toBuffer(function(err, buffer) {
                    var communication = {
                        mailDest: envProd ? inter.facture.email : (req.session.email ||  'contact@edison-services.fr'),
                        mailBcc: envProd ? (req.session.email ||  'contact@edison-services.fr') : undefined,
                        mailReply: (req.session.email ||  'comptabilite@edison-services.fr')
                    }
                    mail.send({
                        From: "comptabilite@edison-services.fr",
                        ReplyTo: communication.mailReply,
                        To: communication.mailDest,
                        Bcc: communication.mailBcc,
                        Subject: "Facture n°" + inter.id + " acquitté",
                        HtmlBody: req.body.text.replaceAll('\n', '<br>'),
                        Attachments: [{
                            Content: buffer.toString('base64'),
                            Name: "Facture n°" + inter.id + ".pdf",
                            ContentType: 'application/pdf'
                        }]
                    }).then(function(resp) {
                        if (req.body.acquitte) {
                            return resolve("OK");
                        }
                        db.model('intervention').findOne({
                            id: inter.id
                        }).then(function(doc) {
                            doc.date.envoiFacture = new Date();
                            doc.login.envoiFacture = req.session.login;
                            doc.save().then(resolve, reject)
                            getFacturePdfObj(doc, doc.date.intervention, false, true).toBuffer(function(err, buff) {
                                document.stack(buff, 'FACTURE ' + doc.id, req.session.login)
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

    schema.statics.sendFacture = {
        unique: true,
        findBefore: true,
        method: 'POST',
        fn: function(inter, req, res) {
            return new Promise(function(resolve, reject) {

                var f = inter.facture;
                if (!f.email ||  !f.nom || !f.address.r || !f.address.v ||  !f.address.cp || !f.address.n) {
                    return reject('Les coordonées de facturations sont incompletes')
                }
                f.prenom = f.prenom ||  "";
                if (!inter.produits || !inter.produits.length) {
                    return reject('Veuillez renseigner au moins 1 produits')
                }
                /*                if (envDev) {
                                    inter.date.envoiFacture = new Date();
                                    inter.login.envoiFacture = req.session.login;
                                    return inter.save().then(resolve, reject)
                                }*/
                if (!isWorker) {
                    return edison.worker.createJob({
                        name: 'db_id',
                        model: 'intervention',
                        method: 'sendFacture',
                        data: inter,
                        req: _.pick(req, 'body', 'session')
                    }).then(function() {
                        edison.event('INTER_SENDFACT').login(req.session.login).id(inter.id).save();
                        inter.save().then(resolve, reject)
                    }, reject)
                }


                var params = req.body;
                if (!params.text ||  !params.date) {
                    Promise.reject("Invalid Request")
                }
                try {
                    var pdf = getFacturePdfObj(inter, inter.date.intervention, req.body.acquitte, req.body.date);

                } catch (e) {
                    reject(e)
                }
                pdf.toBuffer(function(err, buffer) {
                    var communication = {
                        mailDest: envProd ? inter.facture.email : (req.session.email ||  'contact@edison-services.fr'),
                        mailBcc: envProd ? (req.session.email ||  'contact@edison-services.fr') : undefined,
                        mailReply: (req.session.email ||  'comptabilite@edison-services.fr')
                    }
                    console.log(communication);
                    console.log(req.body.text.replaceAll("\n", '<br>'));
                    mail.send({
                        From: "comptabilite@edison-services.fr",
                        ReplyTo: communication.mailReply,
                        To: communication.mailDest,
                        Bcc: communication.mailBcc,
                        Subject: "Facture n°" + inter.id + " en attente de reglement",
                        HtmlBody: req.body.text.replaceAll("\n", '<br>'),
                        Attachments: [{
                            Content: buffer.toString('base64'),
                            Name: "Facture n°" + inter.id + ".pdf",
                            ContentType: 'application/pdf'
                        }]
                    }).then(function(resp) {
                        if (req.body.acquitte) {
                            return resolve("OK");
                        }
                        db.model('intervention').findOne({
                            id: inter.id
                        }).then(function(doc) {
                            doc.date.envoiFacture = new Date();
                            doc.login.envoiFacture = req.session.login;
                            doc.save().then(resolve, reject)
                            getFacturePdfObj(doc, doc.date.intervention, false, true).toBuffer(function(err, buff) {
                                document.stack(buff, 'FACTURE ' + doc.id, req.session.login)
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
