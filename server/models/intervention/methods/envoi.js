module.exports = function(schema) {
    var _ = require('lodash')
    var PDF = require('edsx-mail');
    var mime = require('mime')
    var moment = require('moment');
    var template = requireLocal('config/textTemplate');
    var config = requireLocal('config/dataList')
    var fs = require('fs')
    var PDFMerge = require('pdf-merge');
    var async = require('async');
    var sendSMS = function(text, inter, user) {
        return db.model('sms').send({
            to: user.portable ||  '0633138868',
            text: "Message destiné à " + inter.sst.nomSociete + "(" + inter.sst.telephone.tel1 + ')\n' + text,
            login: user.login,
            origin: inter.id,
            link: inter.sst.id,
            type: 'OS'
        })

    }

    var envoi = function(inter, login) {
        inter.status = "ENC";
        inter.date.envoi = new Date();
        inter.login.envoi = login;
        return new Promise(function(resolve, reject) {
            db.model('intervention').findOneAndUpdate({
                id: inter.id
            }, inter).then(resolve, reject)
        }).catch(__catch);
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


    var getDevis = function(doc) {
        return new Promise(function(resolve, reject) {
            doc.type = 'DEVIS'
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
            doc.type = "deviseur"
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

    var getFacturier = function(doc) {
        return new Promise(function(resolve, reject) {
            doc.type = "facturier"
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
            } else if (req.query.q === 'deviseur') {
                var prm = getDeviseur(inter);
            } else if (req.query.q === 'devis') {
                var prm = getDevis(inter)
            } else {
                return res.status(400).send("unknown file")
            }
            prm.then(function(resp) {
                res.pdf(resp.data);
            }, function(err) {
                res.send(err);
            }).catch(__catch)
        }
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
                            data: inter,
                            req: _.pick(req, 'body', 'session')
                        }).then(function() {
                            inter.save().then(resolve, reject)
                        })
                    }

                    if (!inter ||  !inter.sst)
                        return reject('pas de SST')
                    if (!req.body.sms)
                        return reject("Impossible de trouver l'artisan");

                    var filesPromises = [
                        getOS(inter),
                        getFacturier(inter),
                        getDeviseur(inter)
                    ]

                    if (inter.sst.subStatus === 'NEW' || inter.sst.status === 'POT') {
                        filesPromises.push(getStaticFile.bind("Manuel d'utilisation.pdf")(),
                            getStaticFile.bind("Notice d'intervention.pdf")())
                    }
                    if (inter.devisOrigine) {
                        filesPromises.push(getDevis(inter));
                    }
                    if (req.body.file) {
                        filesPromises.push(document.download(req.body.file))
                    }
                    var fileSupp = req.body.file;
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

                        if (fileSupp) {
                            inter.textfileSupp = (files[files.length - 1].ContentType === 'application/pdf' ? 'un document supplementaine' : 'une photo transmises par le client');
                        }
                        var c = config.categories[inter.categorie]
                        inter.categoriePlain = c.suffix + ' ' + c.long_name.toLowerCase();
                        inter.fileSupp = req.body.file;
                        inter.__login = req.session.pseudo || 'Arnaud';
                        inter.datePlain = moment(new Date(inter.date.intervention)).format('DD/MM/YYYY à HH\\hmm')
                        var text = _.template(template.mail.intervention.os())(inter).replaceAll('\n', '<br>')

                        var mailOptions = {
                            From: "intervention@edison-services.fr",
                            ReplyTo:req.session.email || "abel@chalier.me",
                            To: req.session.email || "abel@chalier.me",
                            Subject: "Ordre de service d'intervention N°" + inter.id,
                            HtmlBody: text,
                            Attachments: files
                        }

                        var validationPromises = [
                            mail.send(mailOptions),
                            //sendSMS(req.body.sms, inter, req.session),
                            envoi(inter, req.session.login)
                        ]
                        console.time('validation')

                        Promise.all(validationPromises).then(function(e) {
                            console.timeEnd('validation')
                            console.timeEnd('envoi')
                            resolve('ok')
                        }, function(err) {
                            console.log(err);
                            reject("erreur, l'envoi a échoué")
                        }).catch(__catch)

                    }, reject).catch(__catch)
                } catch (e) {
                    console.log('--->', e)
                    console.log(e.stack);
                }

            })
        }
    }

}
