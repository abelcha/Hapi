module.exports = function(schema) {
    var Paiement = requireLocal('config/Paiement.js')

    schema.statics.autofacture = function(req, res) {
        var PDF = requireLocal('pdf-mail');
        var _this = this;
        try {
            var doc = JSON.parse(req.body.data);
            doc.paiement = new Paiement(doc);
        } catch (e) {
            return res.status(400).send('bad data')
        }
        return res.send(PDF('auto-facture', doc).getHTML())
            //    res.send(getFacturePdfObj(doc, req.body.date, true).html())
    }
}
