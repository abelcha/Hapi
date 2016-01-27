module.exports = function(schema) {

    schema.statics.vcf2 = function(req, res) {
        var fs = require('fs')
        var config = requireLocal('config/dataList')
        var moment = require('moment')
        var _ = require('lodash')
        if (!isWorker) {
            return edison.worker.createJob({
                name: 'db',
                model: 'intervention',
                method: 'vcf2',
                req: _.pick(req, 'query', 'session')
            })
        }


        var format = function(e) {
            var rtn = ""
            e.__cat = config.categories[e.categorie].long_name
            rtn += "BEGIN:VCARD\n";
            rtn += "VERSION:3.0\n" +
                _.template("N: {{id}} {{client.nom}} {{client.prenom}} - {{client.address.cp}} {{client.address.v}} - {{__cat}}\n")(e) +
                _.template("FN: {{id}} {{client.nom}} {{client.prenom}} - {{client.address.cp}} {{client.address.v}} - {{__cat}}\n")(e) +
                "TEL;WORK;VOICE: " + e.client.telephone.tel1 + "\n";

            if (e.client.telephone.tel2) {
                rtn += "TEL;WORK;VOICE: " + e.client.telephone.tel2 + "\n";
            }
            if (e.client.telephone.tel3) {
                rtn += "TEL;WORK;VOICE: " + e.client.telephone.tel3 + "\n";
            }
            rtn += "END:VCARD\n";
            return rtn
        }

        return new Promise(function(resolve, reject) {

            var emails = _(edison.users.data)
                .filter('service', 'INTERVENTION')
                .map('email')
                .compact()
                .value()
            emails.push('abel.chalier@gmail.com')

            var all = []
            var attachment = []
            var CHUNK_SIZE = 15;
            var completed = 0;
            var LIMIT = _.get(req, 'query.limit') && parseInt(req.query.limit);
            var MODEL = "intervention"
            var stream = db.model('intervention').find()
                .select('id client categorie')
                .limit(LIMIT).sort('-id').stream()
            stream.on('error', function(err) {
                console.error(err)
            })
            stream.on('data', function(doc) {
                console.log('[' + doc.id + ']', ++completed)
                all.push(format(doc))
            })
            stream.on('end', function(doc) {
                console.log("END")
                var allChunked = _.chunk(all, parseInt(all.length / CHUNK_SIZE) + 2)
                _.each(allChunked, function(e, k) {
                    var fileName = 'vcf-' + MODEL + '-' + moment().format("DD-MM-YYYY") + '-part-' + (k + 1) + '.vcf'
                    var fileDir = process.cwd() + '/cache/vcf/';
                    var fileDest = fileDir + fileName;
                    fs.writeFileSync(fileDest, e.join(''))
                    attachment.push({
                        Content: fs.readFileSync(fileDest).toString('base64'),
                        Name: fileName,
                        ContentType: 'text/vcard',
                    })
                })
                var mailOptions = {
                    From: "intervention@edison-services.fr",
                    To: emails.join(';'),
                    Subject: "Nouveaux VCF " + MODEL.toLowerCase() + " du " + moment().format("DD-MM-YYYY"),
                    HtmlBody: "Voici les VCF " + MODEL.toLowerCase(),
                    Bcc: true,
                    Attachments: attachment.slice(0, 1)
                }
                mail.send(mailOptions).then(function(resp) {
                    resolve('ok')
                })
            })
        })
    }
}
