module.exports = function(schema) {

    schema.statics.vcf2 = function(req, res) {
        var fs = require('fs')
        var config = requireLocal('config/dataList')
        var moment = require('moment')
        var _ = require('lodash')
        if (!isWorker) {
            return edison.worker.createJob({
                name: 'db',
                model: 'artisan',
                method: 'vcf2',
                req: _.pick(req, 'query', 'session')
            })
        }


        var format = function(e) {
            var rtn = ""
            rtn += "BEGIN:VCARD\n";
            rtn += "VERSION:3.0\n" +
                _.template("N: {{id}} - {{nomSociete}} - {{representant.nom}} {{representant.prenom}} - {{address.cp}} {{address.v}}}\n")(e) +
                _.template("FN: {{id}} - {{nomSociete}} - {{representant.nom}} {{representant.prenom}} - {{address.cp}} {{address.v}}\n")(e) +
                _.template("EMAIL: {{email}}\n")(e) +
                "TEL;WORK;VOICE: " + e.telephone.tel1 + "\n";

            if (e.telephone.tel2) {
                rtn += "TEL;WORK;VOICE: " + e.telephone.tel2 + "\n";
            }
            if (e.telephone.tel3) {
                rtn += "TEL;WORK;VOICE: " + e.telephone.tel3 + "\n";
            }
            rtn += "END:VCARD\n";
            return rtn
        }

        return new Promise(function(resolve, reject) {

            var emails = _(edison.users.data)
                .filter(function(e) {
                    return e.login == 'yohann_r' || e.service === 'INTERVENTION'
                })
                .map('email')
                .compact()
                .value()
            emails.push('abel.chalier@gmail.com')
            var all = []
            var attachment = []
            var CHUNK_SIZE = 2;
            var completed = 0;
            var LIMIT = _.get(req, 'query.limit') && parseInt(req.query.limit);
            var MODEL = "artisan"
            var stream = db.model(MODEL).find()
                .select('id nomSociete address telephone')
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
                    Subject: "Nouveaux VCF " + MODEL.toLowerCase() + " du " + moment().format("DD/MM/YYYY"),
                    HtmlBody: "Voici les VCF " + MODEL.toLowerCase(),
                    Bcc: true,
                    Attachments: attachment.slice(-1)
                }
                mail.send(mailOptions).then(function(resp) {
                    resolve('ok')
                })
            })
        })
    }
}
