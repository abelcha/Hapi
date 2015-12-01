module.exports = function(schema) {
    var moment = require('moment')
    var async = require('async')
    var PDF = require('edsx-mail')
    var _ = require('lodash')
    var textTemplate = requireLocal('config/textTemplate');
    var RelanceClient = requireLocal('config/_relances-client');
    require('nodeify').extend();
    var relanceRapport;
    var mail_excludes = ["AGNES.GEORGIN@FRANCE-LOISIRS.COM", "BOUKRISBENJAMIN@GMAIL.COM", "ABEL@CHALIER.ME", "FOURNISSEURS@BABILOU.COM", "KEVIN.NGUERRET@BABILOU.COM", "CONTACT@BONAPART.FR", "CLAUDE.GUERARD@BABILOU.COM", "JULIE.LINZE@BABILOU.COM", "SARAH.MOULY@LADRESSE.COM", "SVC-HABITAT@MONDIAL-ASSISTANCE.FR", "RELANCE-PRESTATAIRE@MONDIAL-ASSISTANCE.FRR", "NCOHEN@MGC.FR", "NATHALIE_COUTANT@PICARD.FR"]
    var specials_ids = [13846, 14472, 14514, 18654, 15510, 17085, 28086, 28187, 29675, 18860, 18958, 28938, 29751, 29841, 30059, 30151, 30203, 30343, 27070, 27867, 26850, 23085, 26222, 26218, 26122, 20428, 25690, 25745, 18817, 18482, 18995, 18075, 18047, 17387, 17291, 17280, 17265, 17174, 16977, 16969, 16724, 16197, 16196, 15857, 15554, 14047, 14233, 14279, 14560, 14567, 14575, 14690, 15076, 15092, 15436, 13842, 13733, 13731, 14579, 30113, 22951, 29803, 29147, 26234, 29783, 20093, 22931, 25696, 26194, 19272, 24907, 20002, 29152, 16357, 23888, 19057, 19052, 28806, 18130, 17541, 26915, 26949, 27328, 27386, 27413, 27500, 27573, 27799, 27879, 28218, 26705, 26671, 28423, 28551, 28716, 28807, 26482, 26214, 26178, 26137, 25986, 25807, 25688, 25647, 25610, 25564, 25359, 25043, 24863, 24668, 24458, 24443, 19578, 28852, 28876, 23568, 23543, 23479, 23446, 23318, 23237, 23148, 23056, 22955, 22918, 22906, 22857, 22788, 22272, 22002, 21998, 21941, 21866, 21842, 21618, 21517, 21359, 21304, 20455, 20462, 20488, 20517, 20866, 20969, 29175, 29183, 24349, 24257, 24152, 23943, 23913, 23785, 23620, 29211, 29282, 29297, 29308, 29466, 29576, 29603, 29805, 29857, 30115, 30387, 30445, 30609, 18052, 19605, 19466, 19426, 19354, 19349, 19725, 19955]
    /*
        Retarder les relances /\ si recouvrement -> bleu 
    */
    var execRelance = function(now, relanceModel, callback) {
        now = now ||  moment().toDate()
        var from = moment(now).add(-relanceModel.days, 'days').startOf('day').toDate();
        var to = moment(now).add(-relanceModel.days, 'days').endOf('day').toDate();

        db.model('intervention').find({
            status: 'VRF',
            'date.envoiFacture': {
                $exists: true,
                $gt: new Date(2015, 10, 1)
            },
            'reglementSurPlace': false,
            'compta.reglement.recu': false,
            'facture.payeur': {
                $ne: 'GRN'
            },
            'facture.email': {
                $nin: mail_excludes
            },
            id: {
                $nin: specials_ids
            },
            'date.envoiFacture': db.utils.between(from, to)
        }).populate('sst').lean().exec(function(err, resp) {
            /*sms.send({
                silent: true,
                to: '0633138868',
                text: 'Facture relances ' + relanceModel.target + _.pluck(resp, 'id')
            })*/
            async.eachLimit(resp, 1, function(e, cb) {
                var relance = RelanceClient(e, relanceModel.target, e.facture.email)
                relance.send(cb)
            }, function() {
                relanceRapport.push([relanceModel.target, _.pluck(resp, 'id').join(' - ')].join(' -> '))
                callback(null)
            })
        })

    }


    schema.statics.relanceOne = function(req, res) {
        var ids = req.query.ids;
        ids = ids.split(',').map(function(e) {
            return parseInt(e);
        })
        db.model('intervention').find({
            id: {
                $in: ids
            } //DONT FORGOT TO REMOVE FRANCE LOISIR
        }).lean().populate('sst').exec(function(err, resp) {
            if (!resp) {
                return res.send('nope')
            }
            async.eachLimit(resp, 10, function(e, cb) {
                var relance = RelanceClient(e, req.query.model || 'relance-client-2', e.facture.email)
                relance.send(function() {
                    console.log('ok', e.id)
                    cb(null)
                })
            }, function() {
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
            relanceRapport = [];
            async.eachLimit(relances, 1, _.partial(execRelance, Date.now(), _, _), function(err) {
                mail.send({
                    From: "comptabilite@edison-services.fr",
                    To: "abel.chalier@gmail.com",
                    Subject: "Rapport d'envoi des relances client",
                    HtmlBody: relanceRapport.join("<br>")
                })
                console.log(relanceRapport);
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
