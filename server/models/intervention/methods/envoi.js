module.exports = function(schema) {
    var _ = require('lodash')
    var PDF = require('edsx-mail');
    var mime = require('mime')
    var moment = require('moment');
    var template = requireLocal('config/textTemplate');
    schema.statics.os = {
        unique: true,
        findBefore: true,
        method: 'GET',
        populateArtisan: true,
        fn: function(inter, req, res) {
            return new Promise(function(resolve, reject) {
                var pdf = PDF('intervention', inter).getOS(function(err, buff) {
                    if (req && res) {
                        // res.contentType('application/pdf');
                        res.pdf(buff)
                    }
                    resolve({
                        data: buff,
                        extension: '.pdf',
                        name: 'OS n°' + inter.id
                    })
                })
            })
        }
    }

    var getFileOS = schema.statics.os.fn;

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
        return db.model('intervention').findOneAndUpdate({
            id: inter.id
        }, inter)
    }

    var getStaticFile = function(req, res) {
        var fs = require('fs');
        var file = this
        return new Promise(function(resolve, reject) {
            var path = [process.cwd(), 'front', 'assets', 'pdf', (file || 'manuelV1') + '.pdf'].join('/')
            fs.readFile(path, function(err, buffer) {
                if (err)
                    return reject(err);
                if (req && res) {
                    return res.pdf(buffer)
                }
                return resolve({
                    data: buffer,
                    name: String(file),
                    extension: '.pdf'
                });
            })
        })
    }

    schema.statics.manuel = getStaticFile.bind('manuelV1')
    schema.statics.notice = getStaticFile.bind('noticeV1')

    schema.statics.envoi = {
        unique: true,
        findBefore: true,
        populateArtisan: true,
        method: 'POST',
        fn: function(inter, req, res) {


            if ((envDev || envProd) && !isWorker) {
                return edison.worker.createJob({
                    name: 'db_id',
                    model: 'intervention',
                    method: 'envoi',
                    data: inter,
                    req: _.pick(req, 'body', 'session')
                })
            }


            var _this = this;

            return new Promise(function(resolve, reject) {

                console.time('envoi')
                if (!inter ||  !inter.sst)
                    return reject('pas de SST')
                if (!req.body.sms)
                    return reject("Impossible de trouver l'artisan");
                var filesPromises = [
                    getFileOS(inter)
                ]
                if (envProd) {
                    filesPromises.push(getStaticFile.bind('manuelV1')(),
                        getStaticFile.bind('noticeV1')())
                }
                if (inter.devisOrigine) {
                    filesPromises.push(db.model('intervention').getDevisFile({
                        data: inter,
                        html: false,
                        obj: true,
                    }))
                }
                if (req.body.file) {
                    filesPromises.push(document.download(req.body.file))
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

                    inter.fileSupp = req.body.fileSupp;
                    inter.datePlain = moment(new Date(inter.date.intervention)).format('DD/MM/YYYY à HH:mm:ss')
                    var text = _.template(template.mail.intervention.os())(inter).replaceAll('\n', '<br>')

                    var mailOptions = {
                        From: "intervention@edison-services.fr",
                        To: req.session.email || "abel@chalier.me",
                        Subject: "Ordre de service d'intervention N°" + inter.id,
                        HtmlBody: text,
                        Attachments: files
                    }

                    var validationPromises = [
                        mail.send(mailOptions), sendSMS(req.body.sms, inter, req.session),
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

            })
        }
    }
}
