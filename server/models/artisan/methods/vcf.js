module.exports = function(schema) {

    schema.statics.vcf = function(req, res) {
        var vCard = require('cozy-vcard')
        var fs = require('fs')
        var config = requireLocal('config/dataList')
        var _ = require('lodash')
        return new Promise(function(resolve, reject) {
            db.model('artisan').find().limit(req.query.limit || 10000).then(function(docs) {
                var rtn = "";
                console.log('-->', docs.length)
                _.each(docs, function(e) {

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
                res.setHeader('Content-disposition', 'attachment; filename=' + "export_clientsV2.vcf");
                res.setHeader('Content-type', "text/vcard");
                res.send(rtn)
            })
        })
    }
}
