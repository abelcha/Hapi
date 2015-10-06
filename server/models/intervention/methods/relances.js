module.exports = function(schema) {
    var moment = require('moment')
    var async = require('async')
    var PDF = require('edsx-mail')
    var _ = require('lodash')
    var textTemplate = requireLocal('config/textTemplate');
    require('nodeify').extend();

    schema.statics.relance = function(req, res) {
        return new Promise(function(resolve, reject)  {
            db.model('intervention').find({
/*                'compta.reglement.recu': false,
                'date.intervention': {
                    $lt: moment().subtract(21, 'days').toDate()
                },*/
                'date.envoiFacture': {
                    $exists: true
                },
                'status': 'VRF'
            }).then(function(resp, cb) {
                console.log(resp.length)
                var rnd = resp[_.random(0, resp.length - 1)];
                var Relance = requireLocal('config/_Relance');
                var rl = Relance(rnd, req.query.model || 'relance1')
                rl.send(function(err, resp) {
                        console.log(err, resp);
                        /*                        if (req.query.preview) {
                                                    res.pdf(err)
                                                }*/
                        resolve('ok')
                    })
                    /* async.each(resp.slice(0, 1), relance2, function(err, resp) {
                         if (req.query.preview) {
                             res.pdf(err)
                         }
                         resolve('ok')
                     });*/
            }, resolve)
        }).catch(__catch)
    }

}
