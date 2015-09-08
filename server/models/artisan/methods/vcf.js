module.exports = function(schema) {

    schema.statics.vcf = function(req, res) {
        var vCard = require('cozy-vcard')
        var fs = require('fs')
        var config = requireLocal('config/dataList')
        var _ = require('lodash')
        return new Promise(function(resolve, reject) {
            db.model('artisan').find().sort('-id').select('id representant address telephone').limit(req.query.limit ||  3000).then(function(docs) {
                res.setHeader('Content-disposition', 'attachment; filename=' + "exportArtisanV2.vcf");
                res.setHeader('Content-type', "text/vcard");
                _.each(docs, function(e) {
                    var rtn = "";
                    rtn += "BEGIN:VCARD\n";
                    rtn += "VERSION:3.0\n" +
                        _.template("N: {{id}} {{representant.nom}} {{representant.prenom}} - {{address.cp}} {{address.v}}\n")(e) +
                        _.template("N: {{id}} {{representant.nom}} {{representant.prenom}} - {{address.cp}} {{address.v}}\n")(e) +
                        "TEL;WORK;VOICE: " + e.telephone.tel1 + "\n";

                    if (e.telephone.tel2) {
                        rtn += "TEL;WORK;VOICE: " + e.telephone.tel2 + "\n";
                    }
                    if (e.telephone.tel3) {
                        rtn += "TEL;WORK;VOICE: " + e.telephone.tel3 + "\n";
                    }
                    rtn += "END:VCARD\n";

                })
                res.end();
            })
        })
    }
}
