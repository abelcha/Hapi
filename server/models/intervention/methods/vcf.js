module.exports = function(schema) {

    schema.statics.vcf = function(req, res) {
        var vCard = require('cozy-vcard')
        var fs = require('fs')
        var config = requireLocal('config/dataList')
        var _ = require('lodash')
        return new Promise(function(resolve, reject) {
            db.model('intervention').find()
            .select('id client categorie')
            .limit(req.query.limit || 2000).sort('-id').then(function(docs) {
                console.log('-->', docs.length)
                res.setHeader('Content-disposition', 'attachment; filename=' + "exportClientsV2.vcf");
                res.setHeader('Content-type', "text/vcard");
                var i = 0;
                _.each(docs, function(e) {
                    //console.log(++i);
                    e.__cat = config.categories[e.categorie].long_name
                    var rtn = "BEGIN:VCARD\n";
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
                    res.write(rtn);
                })
                res.end();
            })
        })
    }
}
