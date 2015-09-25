module.exports = function(schema) {
    var moment = require('moment')
    var async = require('async')
    var PDF = require('edsx-mail')
    var _ = require('lodash')
    var textTemplate = requireLocal('config/textTemplate');
    require('nodeify').extend();


    var relance1 = function(e, callback) {

        e.os = _.padLeft(e.id, 6, '0')
        e.datePlain = moment(e.date.intervention).format('DD/MM/YYYY');
        e.type = 'facture'

        var mailBody = _.template(textTemplate.mail.intervention.relance1())(e);
        var letterBody = _.template(textTemplate.lettre.intervention.relance1())(e);

        e.produits.unshift({
            desc: _.template("Suite à notre intervention chez {{client.civilite}} {{client.nom}} " +
                "{{client.prenom}},\n {{client.address.n}} {{client.address.r}}, {{client.address.cp}} " +
                "{{client.address.v}}\n le ")(e) + moment(e.date.intervention).format('DD[/]MM/YYYY[ à ]HH[h]mm'),
            pu: 0,
            quantite: 1
        })

        async.waterfall([
            function(callback) {
                console.time('getFiles')
                PDF([{
                    model: 'letter',
                    options: {
                        address: e.facture.address,
                        dest: e.facture,
                        text: letterBody,
                        title: ""
                    }
                }, {
                    model: 'facture',
                    options: e
                }, {
                    model: 'conditions',
                    options: e
                }]).toBuffer(callback)
            },
            function(buffer, callback) {
                console.timeEnd('getFiles')
                console.time('sendMail')
                mail.send({
                    From: "comptabilite@edison-services.fr",
                    ReplyTo: "comptabilite@edison-services.fr",
                    To: "mzavot@gmail.com",
                    // Bcc: "comptabilite@edison-services.fr",
                    Subject: "Première relance pour facture n°" + e.id + " impayée",
                    HtmlBody: mailBody,
                    Attachments: [{
                        Content: buffer.toString('base64'),
                        Name: "Facture n°" + e.id + ".pdf",
                        ContentType: 'application/pdf'
                    }]
                }, callback);
            }
        ], function(err, result) {
            console.timeEnd('sendMail')

            callback(null, result);
        })
    }









    var relance2 = function(e, callback) {

        e.os = _.padLeft(e.id, 6, '0')
        e.datePlain = moment(e.date.intervention).format('DD/MM/YYYY');
        e.type = 'facture'
        e.prixFinalTTC = _.round(e.prixFinal * (1 + (e.tva / 100)), 2);

        var mailBody = _.template(textTemplate.mail.intervention.relance2())(e);
        var letterBody = _.template(textTemplate.lettre.intervention.relance2())(e);

        e.produits.unshift({
            desc: _.template("Suite à notre intervention chez {{client.civilite}} {{client.nom}} " +
                "{{client.prenom}},\n {{client.address.n}} {{client.address.r}}, {{client.address.cp}} " +
                "{{client.address.v}}\n le ")(e) + moment(e.date.intervention).format('DD[/]MM/YYYY[ à ]HH[h]mm'),
            pu: 0,
            quantite: 1
        })

        async.waterfall([
            function(callback) {
                console.time('getFiles')
                PDF([{
                    model: 'letter',
                    options: {
                        address: e.facture.address,
                        dest: e.facture,
                        text: letterBody,
                        title: ""
                    }
                }, {
                    model: 'facture',
                    options: e
                }, {
                    model: 'conditions',
                    options: e
                }]).toBuffer(callback)
            },

            function(buffer, callback) {
                mail.send({
                    From: "comptabilite@edison-services.fr",
                    ReplyTo: "comptabilite@edison-services.fr",
                    To: "mzavot@gmail.com",
                    // Bcc: "comptabilite@edison-services.fr",
                    Subject: "Deuxième relance pour facture n°" + e.id + " impayée",
                    HtmlBody: mailBody,
                    Attachments: [{
                        Content: buffer.toString('base64'),
                        Name: "Facture n°" + e.id + ".pdf",
                        ContentType: 'application/pdf'
                    }]
                }, function(resp) {
                    callback(null, buffer)
                });
            },
            function(buffer, callback) {
                var fs = require('fs')
                var uuid = require('uuid')
                var filename = '/tmp/' + uuid.v4() + '.pdf';
                fs.writeFile(filename, buffer, function(err) {
                    callback(err, buffer, filename);
                })
            },
            function(buffer, filename, callback) {
                var fs = require('fs')
                var scissors = require('scissors');
                var pageNumber = PDF('facture', e).getHTML().split('</page>').length
                var p1 = scissors(filename).pages(1) // select or reorder individual pages 
                var p2 = scissors(filename).range(2, pageNumber + 1);
                var blank = scissors(process.cwd() + '/front/assets/pdf/blank.pdf').pages(1);
                var stream = scissors.join(p1, blank, p2).pdfStream()
                var finalBuffer = [];
                stream.on('data', function(data) {
                    finalBuffer.push(data);
                }).on('end', function() {
                    callback(null, Buffer.concat(finalBuffer))

                })

            },
            function(buffer, callback) {
                document.stack(buffer, 'RELANCE2 - ' + e.id, "AUTO")
                    .then(function(resp) {
                        callback(null, callback)
                    })
            }
        ], function(err, result) {
            callback(result);
        })
    }












    schema.statics.relances = function(req, res) {
        return new Promise(function(resolve, reject)  {
            db.model('intervention').find({
                'compta.reglement.recu': false,
                'date.intervention': {
                    $gt: moment().subtract(14, 'days').toDate()
                },
                'date.envoiFacture': {
                    $exists: true
                },
                'status': 'VRF'
            }).then(function(resp, cb) {
                async.each(resp.slice(0, 1), relance2, function(err, resp) {
                    if (req.query.preview) {
                        res.pdf(err)
                    }
                    resolve('ok')
                });
            }, resolve)
        }).catch(__catch)
    }

}
