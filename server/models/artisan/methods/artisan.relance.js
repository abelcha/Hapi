module.exports = function(schema) {
    var moment = require('moment')
    var async = require('async')
    var PDF = require('edsx-mail')
    var _ = require('lodash')
    var textTemplate = requireLocal('config/textTemplate');
    var RelanceClient = requireLocal('config/_relances-client');
    require('nodeify').extend();


    schema.statics.relanceAuto = function(req, res) {

        return new Promise(function(resolve, reject) {
            var from = moment().startOf('week').toDate();
            var to = moment().endOf('week').toDate();

            db.model('intervention').find({
                status: 'VRF',
                'reglementSurPlace': true,
                'compta.reglement.recu': false,
                'date.intervention': db.utils.between(from, to)
            }).populate('sst').exec(function(err, resp) {
                console.log(err, resp && resp.length)
            })
        }).catch(__catch)

    }

}
