module.exports = function(schema) {
    var PDF = require('edsx-mail')
    var _ = require('lodash')
    schema.statics.contrat = {
        unique: true,
        findBefore: true,
        method: 'GET',
        fn: function(artisan, req, res) {
            artisan = JSON.parse(JSON.stringify(artisan));
            if (req.query.signe) {
                artisan.signe = true;
            }
            if (req.query.html) {
                res.send(PDF('contract', artisan).getHTML())
            } else {
                PDF('contract', artisan).buffer(function(err, resp) {
                    res.pdf(resp);
                })
            }
        }
    }
}
