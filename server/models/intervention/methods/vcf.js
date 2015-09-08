module.exports = function(schema) {

    schema.statics.vcf = function(req, res) {
        var vCard = require('cozy-vcard')
        var fs = require('fs')
        var config = requireLocal('config/dataList')
        var _ = require('lodash')
        return new Promise(function(resolve, reject) {

            db.model('intervention').find().limit(req.query.limit || 1000).then(function(docs) {
                var rtn = "";
                _.each(docs, function(e) {

                    e.__cat = config.categories[e.categorie].long_name
                    rtn += "BEGIN:VCARD\n";
                    rtn += "VERSION:3.0\n" +
                        _.template("N: {{id}} {{client.nom}} {{client.prenom}} - {{client.address.cp}} {{client.address.v}} - {{__cat}}\n")(e) +
                        //"N: 27285 CEYLAN IBRAHIM - 60160 MONTATAIRE - VITRERIE\n" + 
                        //"FN: 27285 - CEYLAN IBRAHIM - 60160 MONTATAIRE - VITRERIE\n" + 
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
                res.setHeader('Content-disposition', 'attachment; filename=' + "export_clientsV2.vcf");
                res.setHeader('Content-type', "text/vcard");
                res.send(rtn)
            })
        })
    }
}
