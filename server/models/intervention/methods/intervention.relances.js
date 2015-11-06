module.exports = function(schema) {
    var moment = require('moment')
    var async = require('async')
    var PDF = require('edsx-mail')
    var _ = require('lodash')
    var textTemplate = requireLocal('config/textTemplate');
    var RelanceClient = requireLocal('config/_relances-client');
    require('nodeify').extend();


    var execRelance = function(now, relanceModel, callback) {
        now = now ||  moment().toDate()
        var from = moment(now).add(-relanceModel.days, 'days').startOf('day').toDate();
        var to = moment(now).add(-relanceModel.days, 'days').endOf('day').toDate();

        db.model('intervention').find({
            status: 'VRF',
            'date.envoiFacture': {
                $exists: true
            },
            'reglementSurPlace': false,
            'compta.reglement.recu': false,
            'date.intervention': db.utils.between(from, to)
        }).populate('sst').lean().exec(function(err, resp) {
            sms.send({
                silent: true,
                to: '0633138868',
                text: 'Facture relances ' + relanceModel.target + _.pluck(resp, 'id')
            })
            async.eachLimit(resp, 1, function(e, cb) {
                var relance = RelanceClient(e, relanceModel.target, 'noreply.edison@gmail.com')
                relance.send(cb)
            }, callback)
        })

    }

    schema.statics.relanceOne = function(req, res) {
        db.model('intervention').findOne({
            id: req.query.id
        }).lean().populate('sst').exec(function(err, resp) {
            if (!resp) {
                return res.send('nope')
            }
            console.log(resp && resp.length)
            var relance = RelanceClient(resp, req.query.model, 'noreply.edison@gmail.com')
            relance.send(function() {
                res.send('ok')
            })
        })
    }

    schema.statics.relanceAuto = function(req, res) {

        return new Promise(function(resolve, reject) {
            var relances = [{
                //Rappel automatique : 10 jours après - pdf en pj
                target: 'relance-client-1',
                days: 10
            }, {
                // Rappel automatique : 20 jours après + Impression automatique au courrier
                target: 'relance-client-2',
                days: 20
            }, {
                //35 jours après + impression courrier automatique
                target: 'relance-client-3',
                days: 35
            }, {
                //50 jours apres: fausse lettre huissier (injonction a payer)
                target: 'relance-client-4',
                days: 45
            }, {
                //60 jours apres + AvisAvantPoursuites
                target: 'relance-client-5',
                days: 60
            }]
            async.eachLimit(relances, 1, _.partial(execRelance, req.query.now, _, _), function(err) {
                if (err) return reject(err);
                resolve('ok')
            });
        }).catch(__catch)

    }

    schema.statics.relanceAll = function(req, res) {
        var momentIterator = require('moment-iterator');

        var start = moment().add(-1, 'days')
        var end = new Date();


        var range = momentIterator(start, end).range('1 day', {
            toDate: true
        })
        async.eachLimit(range, 1, function(d, cb) {
            db.model('intervention').relanceAuto({
                query: {
                    now: d
                }
            }).then(_.partial(cb, null))
        }, function(err, resp) {
            res.send([err])
        })

    }
}
