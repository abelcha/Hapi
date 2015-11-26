module.exports = function(schema) {
    var _ = require('lodash')
    var PDF = require('edsx-mail');
    var mime = require('mime')
    var moment = require('moment-timezone');
    var template = requireLocal('config/textTemplate');
    var config = requireLocal('config/dataList')
    var fs = require('fs')
    var PDFMerge = require('pdf-merge');
    var async = require('async');
    var sendSMS = function(text, to, dest) {
        //console.log(to, text);
        return sms.send({
            type: "OS",
            dest: dest,
            to: to,
            text: text,
        })

    }

    var getStaticFile = function(req, res) {
        var fs = require('fs');
        var file = this
        return new Promise(function(resolve, reject) {
            var path = [process.cwd(), 'front', 'assets', 'pdf', file].join('/')
            fs.readFile(path, function(err, buffer) {
                if (err)
                    return reject(err);
                return resolve({
                    data: buffer,
                    name: String(file),
                    extension: '.pdf'
                });
            })
        })
    }

    var getNotice = function(doc) {
        return new Promise(function(resolve, reject) {
            PDF('notice', doc, 400).buffer(function(err, buff) {
                //console.log(err, buff)
                if (err)
                    return reject(err);
                resolve({
                    data: buff,
                    extension: '.pdf',
                    name: 'OS n°' + doc.id + '.pdf'
                })
            })
        })
    }


    var getOS = function(doc) {
        return new Promise(function(resolve, reject) {
            PDF('intervention', doc, 400).buffer(function(err, buff) {
                if (err)
                    return reject(err);
                resolve({
                    data: buff,
                    extension: '.pdf',
                    name: 'OS n°' + doc.id + '.pdf'
                })
            })
        })
    }




    var getDevis = function(doc, user) {
        return new Promise(function(resolve, reject) {
            doc.facture = doc.client;
            doc.facture.tel = doc.client.telephone.tel1;
            doc.datePlain = moment.tz('Europe/Paris').format('LL');
            doc.user = user;
            doc.acquitte = false;
            doc.type = "devis"
            PDF('facture', doc).buffer(function(err, buff) {
                if (err)
                    return reject(err);
                resolve({
                    data: buff,
                    extension: '.pdf',
                    name: 'Devis n°' + doc.id + '.pdf'
                })
            }, 1200)
        })
    }





    var getDeviseur = function(doc) {
        return new Promise(function(resolve, reject) {
            doc.type = "DEVIS"
            PDF([{
                model: 'facturier',
                options: doc
            }, {
                model: 'conditions',
                options: {}
            }], 700).toBuffer(function(err, buff) {
                if (err)
                    return reject(err);
                resolve({
                    data: buff,
                    extension: '.pdf',
                    name: 'Deviseur n°' + doc.id + ".pdf"
                })
            })
        })
    }


    var getLocalFile = function(filePath) {
        return new Promise(function(resolve, reject) {
            var path = require('path')
            document.get(filePath,
                function(err, buffer) {
                    resolve({
                        data: buffer,
                        name: "Pièce Jointe." + path.extname(filePath),
                        extension: '.' + path.extname(filePath)
                    })
                })
        })
    }

    var getFacturier = function(doc) {
        return new Promise(function(resolve, reject) {
            doc.type = "FACTURE"
            var p1 = PDF([{
                model: 'facturier',
                options: doc
            }]);
            var p2 = PDF([{
                model: 'conditions',
                options: {}
            }, {
                model: 'attestation',
                options: doc
            }])

            async.parallel([
                p1.toBuffer.bind(p1),
                p2.toBuffer.bind(p2),
            ], function(err, resp) {
                var now = Date.now();
                var f1 = '/tmp/f1-' + now + '.pdf';
                var f2 = '/tmp/f2-' + now + '.pdf';
                fs.writeFileSync(f1, resp[0])
                fs.writeFileSync(f2, resp[1])
                var pdfMerge = new PDFMerge([f1, f2]);
                pdfMerge.asBuffer().merge(function(err, buffer) {
                    resolve({
                        data: buffer,
                        extension: '.pdf',
                        name: 'Facturier n°' + doc.id + ".pdf"
                    })
                });
            })
        });
    }



    schema.statics.file = {
        unique: true,
        findBefore: true,
        method: 'GET',
        populateArtisan: true,
        fn: function(inter, req, res) {
            inter = inter.toObject()
            if (req.query.q === 'os') {
                var prm = getOS(inter);
            } else if (req.query.q === 'facturier') {
                var prm = getFacturier(inter)
            } else if (req.query.q === 'manuel') {
                var prm = getStaticFile.bind("Manuel d'utilisation.pdf")()
                    /* } else if (req.query.q === 'notice') {
                         var prm = getStaticFile.bind("Notice d'intervention.pdf")()*/
            } else if (req.query.q === 'deviseur') {
                var prm = getDeviseur(inter, req.session);
            } else if (req.query.q === 'notice') {
                //console.log('notice')
                var prm = getNotice(inter);
            } else if (req.query.q === 'devis') {
                var prm = getDevis(inter, req.session)
            } else {
                return res.status(400).send("unknown file")
            }
            prm.then(function(resp) {
                res.pdf(resp.data);
            }, function(err) {
                res.send(String(err));
            }).catch(__catch)
        }
    }


    schema.statics.send = function(req, res) {
        //console.log('-->', req.query.id)

        db.model('intervention').findById(req.query.id)
            .populate('sst').then(function(resp) {
                console.log('okok')
                if (!resp)  {
                    return console.log('noono')
                }
                var session = {
                    login: resp.login.envoi,
                    ligne: '0972403794',
                    pseudo: 'Sylvain'
                }
                console.log('okok333')
                try {
                    var text = requireLocal('config/textTemplate').sms.intervention.envoi.bind(resp)(session, config)
                    console.log(text);
                } catch (e) {
                    console.log('==-->', e)
                }
                console.log('here')
                return schema.statics.envoi.fn(resp, {
                    session: session,
                    body: {
                        id: req.query.id,
                        sms: text
                    }
                })
            })

    }

    schema.statics.envoi = {
        unique: true,
        findBefore: true,
        populateArtisan: true,
        method: 'POST',
        fn: function(inter, req, res) {
            console.time('envoi')

            var _this = this;

            return new Promise(function(resolve, reject) {
                try {

                    if (!isWorker) {
                        return edison.worker.createJob({
                            name: 'db_id',
                            model: 'intervention',
                            method: 'envoi',
                            data: JSON.parse(JSON.stringify(inter)),
                            req: _.pick(req, 'body', 'session'),
                            priority: 'high'
                        }).then(function() {
                            inter.status = "ENC";
                            inter.date.envoi = new Date();
                            inter.login.envoi = req.session.login;
                            if (req.session.service === 'PARTENARIAT') {
                                inter.date.demarchage = new Date();
                                inter.login.demarchage = req.session.login;
                            }
                            edison.event('INTER_ENVOI').login(req.session.login).id(inter.id)
                                .broadcast(inter.login.ajout)
                                .color('orange')
                                .message(_.template("L'intervention {{id}} chez {{client.civilite}} {{client.nom}} ({{client.address.cp}}) à été envoyé par {{login.envoi}}")(inter))
                                .send()
                                .save()
                            if (inter.newOs) {
                                setTimeout(function() {
                                    db.model('intervention').findById(inter.id)
                                        .populate('sst')
                                        .then(function(resp) {
                                            if (resp && resp.status === 'ENC' && !resp.appels.length) {
                                                sms.send({
                                                    to: resp.sst.telephone.tel1,
                                                    text: template.sms.intervention.rappelNoCalls(inter.id)
                                                })
                                                edison.event('INTER_NO_CALLS').login(req.session.login).id(inter.id)
                                                    .service('INTERVENTION')
                                                    .color('red')
                                                    .message(_.template("OS {{id}}: ({{client.civilite}} {{client.nom}}) attend l'appel de {{sst.nomSociete}}")(resp))
                                                    .send()
                                                    .save()
                                            } else {
                                                console.log('call passed')
                                            }
                                        })
                                }, 60 * 60 * 1000)
                            }


                            inter.save().then(resolve, reject)
                        })
                    }

                    if (!inter ||  !inter.sst)
                        return reject('pas de SST')
                    if (!req.body.sms)
                        return reject("Impossible de trouver l'artisan");

                    var filesPromises = [
                        getOS(inter)
                    ]
                    if (!envDev) {
                        if (inter.devisOrigine) {
                            filesPromises.push(getDevis(inter, req.session));
                        }

                        filesPromises.push(getFacturier(inter));
                        filesPromises.push(getDeviseur(inter));

                        if (inter.sst.subStatus === 'NEW' || inter.sst.status === 'POT') {
                            filesPromises.push(getStaticFile.bind("Manuel d'utilisation.pdf")(),
                                getStaticFile.bind("Notice d'intervention.pdf")())
                        }
                        if (req.body.file) {
                            filesPromises.push(getLocalFile('/V2_PRODUCTION/intervention/' + inter.id + '/' + req.body.file))
                        }
                    }
                    console.time('getFiles')
                    Promise.all(filesPromises).then(function(result) {
                        console.timeEnd('getFiles')

                        var files = _(result).compact().map(function(file) {
                            return {
                                ContentType: file.mimeType ||  mime.lookup(file.extension),
                                Name: file.name ||  ['fichier', file.extension].join('.'),
                                Content: file.data.toString('base64')
                            }
                        }).value();

                        if (req.body.file) {
                            inter.textfileSupp = (_.endsWith(files[files.length - 1], 'pdf') ? 'un document supplementaine' : 'une photo transmises par le client');
                        }
                        var c = config.categories[inter.categorie]
                        inter.categoriePlain = c.suffix + ' ' + c.long_name.toLowerCase();
                        inter.fileSupp = req.body.file;
                        inter.__login = req.session.pseudo || 'Arnaud';
                        inter.datePlain = moment.tz(new Date(inter.date.intervention), "Europe/Paris").format('DD/MM/YYYY à HH\\hmm')
                        var text = template.mail.intervention.os(req.session)
                        text = _.template(text)(inter).replaceAll('\n', '<br>')

                        var communication = {
                            telephone: inter.sst.telephone.tel1,
                            dest: inter.sst.nomSociete,
                            mailDest: envProd ? inter.sst.email : (req.session.email ||  'contact@edison-services.fr'),
                            mailReply: (req.session.email ||  'contact@edison-services.fr')
                        }

                        var mailOptions = {
                                From: "intervention@edison-services.fr",
                                ReplyTo: communication.mailReply,
                                To: communication.mailDest,
                                Subject: "Ordre de service d'intervention N°" + inter.id,
                                HtmlBody: text,
                                Attachments: files
                            }
                            //                        console.log(communication);
                        var validationPromises = [
                            mail.send(mailOptions),
                            sendSMS(req.body.sms, communication.telephone, communication.dest),
                        ]
                        Promise.all(validationPromises, function()  {}).catch(__catch)
                        resolve('ok')
                    }, reject).catch(__catch)
                } catch (e) {
                    console.log('--->', e)
                    console.log(e.stack);
                }

            })
        }
    }

}
