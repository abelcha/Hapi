module.exports = function(schema) {

    schema.statics.vcf = function(req, res) {
        var fs = require('fs')
        var config = requireLocal('config/dataList')
        var _ = require('lodash')
        if (!isWorker) {
            return edison.worker.createJob({
                name: 'db',
                model: 'artisan',
                method: 'vcf',
                req: _.pick(req, 'query', 'session')
            }).then(function(resp) {
                res.setHeader('Content-disposition', 'attachment; filename=' + "exportArtisansV2.vcf");
                res.setHeader('Content-type', "text/vcard");
                res.write(resp);
                res.end();
            })
        }
        return new Promise(function(resolve, reject) {

            redis.get('vcfArtisans'.envify(), function(err, reply) {
                if (!err && reply && !req.query.cache) {
                    console.log('cache');
                    return resolve(reply)
                }
                db.model('artisan').find({
                    status: {
                        $ne: 'ARC'
                    }
                }).sort('-id').select('id nomSociete address telephone').limit(req.query.limit ||  3000).then(function(docs) {
                    console.log('->', docs.length)
                    var rtn = "";
                    _.each(docs, function(e) {
                        rtn += "BEGIN:VCARD\n";
                        rtn += "VERSION:3.0\n" +
                            _.template("N: {{id}} {{nomSociete}} - {{address.cp}} {{address.v}}\n")(e) +
                            _.template("N: {{id}} {{nomSociete}} - {{address.cp}} {{address.v}}\n")(e) +
                            "TEL;WORK;VOICE: " + e.telephone.tel1 + "\n";

                        if (e.telephone.tel2) {
                            rtn += "TEL;WORK;VOICE: " + e.telephone.tel2 + "\n";
                        }
                        if (e.telephone.tel3) {
                            rtn += "TEL;WORK;VOICE: " + e.telephone.tel3 + "\n";
                        }
                        rtn += "END:VCARD\n";

                    })
                    resolve(rtn);
                    redis.setex('vcfArtisans'.envify(), 600, rtn);
                })
            })

        })
    }
}
