module.exports = function(schema) {

    schema.statics.vcf = function(req, res) {
        var fs = require('fs')
        var config = requireLocal('config/dataList')
        var _ = require('lodash')
        if (!isWorker) {
            return edison.worker.createJob({
                name: 'db',
                model: 'intervention',
                method: 'vcf',
                req: _.pick(req, 'query', 'session')
            }).then(function(resp) {
                res.setHeader('Content-disposition', 'attachment; filename=' + "exportClientsV2.vcf");
                res.setHeader('Content-type', "text/vcard");
                res.write(resp);
                res.end();
            })
        }
        return new Promise(function(resolve, reject) {

            redis.get('vcfClients'.envify(), function(err, reply) {
                if (!err && reply && !req.query.cache) {
                    console.log('cache');
                    return resolve(reply)
                }
                db.model('intervention').find()
                    .select('id client categorie')
                    .limit(req.query.limit || 2500).sort('-id').then(function(docs) {
                        console.log('-->', docs.length)
                        var rtn = "";
                        _.each(docs, function(e) {
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
                        })
                        resolve(rtn)
                    redis.setex('vcfClients'.envify(), 600, rtn);

                    })
            });
        })
    }
}
