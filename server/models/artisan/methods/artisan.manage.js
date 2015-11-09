module.exports = function(schema) {
    var _ = require('lodash')

    schema.statics.manage = {
        unique: true,
        findBefore: true,
        method: 'POST',
        fn: function(artisan, req, res) {
            return new Promise(function(resolve, reject) {
                var opt = _.pick(req.body, 'facturier', 'deviseur');
                opt.login = req.session.login;
                opt.date = Date.now();
                artisan.historique.pack.push(opt)
                artisan.save().then(resolve, reject)
            })
        }
    }

}
