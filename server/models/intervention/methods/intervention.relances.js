module.exports = function(schema) {
    var moment = require('moment')
    var async = require('async')
    var PDF = require('edsx-mail')
    var _ = require('lodash')
    var textTemplate = requireLocal('config/textTemplate');
    require('nodeify').extend();

    schema.statics.relance = function(req, res) {
        console.log('==>', req.query.id)
        return new Promise(function(resolve, reject)  {

            var query = {
                /*                'compta.reglement.recu': false,
                                'date.intervention': {
                                    $lt: moment().subtract(21, 'days').toDate()
                                },*/
                'date.envoiFacture': {
                    $exists: true
                },
               
                'status': 'VRF'
            }
            if (req.query.id) {
                query.id = parseInt(req.query.id);
            }

            db.model('intervention').find().limit(10).sort('-id').then(function(resp, cb) {
                console.log(resp.length)
                var rnd = resp[_.random(0, resp.length - 1)];
                var RelanceClient = requireLocal('config/_relances-client');
                var rl = RelanceClient(rnd, req.query.model || 'relance-client-1', req.query.email || 'mzavot@gmail.com')
                    /*var RelanceArtisan = requireLocal('config/relances-artisan');
                    var rl = RelanceArtisan(rnd, req.query.model || 'relance-artisan-1')*/
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
