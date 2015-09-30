module.exports = function(schema) {
    var _ = require('lodash')
    var async = require('async');
    var moment = require('moment');
    var Paiement = requireLocal('config/Paiement');
    var PDF = require('edsx-mail')



    schema.statics.flushMail = function(req, res) {

        if (!isWorker) {
            console.log('dump worker')
            return edison.worker.createJob({
                name: 'db',
                model: 'intervention',
                method: 'flushMail',
                req: _.pick(req, 'body', 'session')
            })
        }

        return new Promise(function(resolve, reject) {
            var i = 0;
            var total = _.reduce(req.body, function(total, e) {
                return total + e.list.__list.length
            }, 0)
            var data = _.groupBy(req.body, 'id');
            async.eachLimit(data, 3, function(sst, cb) {
                console.log('-->', k)
                var k = Object.keys(data)[i++]
                global.currenWorkerJob.progress(i, req.body.length);
                async.waterfall([
                    function(callback) {
                        db.model('artisan').findOne({
                            id: k
                        }, callback)
                    },
                    function(artisan, callback) {
                        if (!artisan) return callback("nope");
                        artisan = artisan.toObject()
                        artisan.mode = 'VIR';
                        artisan.total = sst[0].total.final;
                        artisan.interventions = _.map(sst[0].list.__list, function(e) {
                            return {
                                montant: e.montant.final,
                                description: e.description,
                                id: e.id,
                                type: e.type
                            }
                        })
                        callback(null, artisan);
                    },
                    function(artisan, callback) {
                        var autofactures = [];
                        async.each(artisan.interventions, function(inter, small_cb) {
                            db.model('intervention')
                                .findOne({
                                    id: inter.id
                                })
                                .then(function(resp) {
                                    if (!resp) return cb("nipe")
                                    resp = resp.toObject();
                                    resp.paiement = new Paiement(resp);
                                    resp.sst = artisan;
                                    autofactures.push({
                                        model: 'auto-facture',
                                        options: resp
                                    })
                                    small_cb(null);
                                })
                        }, function() {
                            callback(null, artisan, autofactures)
                        });
                    },
                    function(artisan, autofactures, callback) {
                        autofactures.unshift({
                            model: 'recap',
                            options: artisan
                        })
                        var pdf = PDF(autofactures);
                        pdf.toBuffer(_.partial(callback, _, artisan));
                    },
                    function(artisan, buffer, callback) {
                        /* if (envDev) {
                             return callback(null, 'ok')
                         }*/
                        mail.send({
                            From: "comptabilite@edison-services.fr",
                            ReplyTo: "comptabilite@edison-services.fr",
                            To: "mzavot@gmail.com",
                            Bcc: "comptabilite@edison-services.fr",
                            Subject: "Paiement du " + moment().format('LL'),
                            HtmlBody: "Bonjour,<br> Vous trouverez en piece jointe les reglement de la semaine<br>Cordialement",
                            Attachments: [{
                                Content: buffer.toString('base64'),
                                Name: "Recap " + moment().format('LL') + ".pdf",
                                ContentType: 'application/pdf'
                            }]
                        }, callback);
                    }
                ], cb);
            }, function(err, resp) {
                console.log(err, resp);
                if (err) {
                    reject(err);
                }
                resolve('okook');
            })
        });
    }


    schema.statics.flush = function(req, res) {
        var _this = this;

        return new Promise(function(resolve, reject) {

            var date = (new Date()).setMilliseconds(0)

            var data = _(req.body).pluck('list.__list').flatten().value()
            var numCheques = _(req.body).map(
                _.partial(_.pick, _, 'numeroCheque', 'id')
            ).value()
            async.eachLimit(data, 1, function(inter, small_cb) {
                db.model('intervention')
                    .findOne({
                        id: inter.id
                    })
                    .then(function(doc) {
                        var fourniture = _.reduce(doc.fourniture, function(res, x) {
                            res[x.fournisseur === 'ARTISAN' ? 'artisan' : 'edison'] += (x.pu * x.quantite);
                            return res;
                        }, {
                            artisan: 0,
                            edison: 0
                        })
                        var hist = {
                            dateAjout: doc.compta.paiement.date,
                            loginAjout: doc.compta.paiement.login,
                            dateFlush: date,
                            loginFlush: req.session.login,
                            pourcentage: doc.compta.paiement.pourcentage,
                            _type: inter.type,
                            fourniture: fourniture,
                            mode: doc.compta.paiement.mode,
                            numeroCheque: _.find(numCheques, 'id', doc.sst).numeroCheque,
                            montant: inter.montant.total,
                            final: inter.montant.final,
                            base: inter.montant.base,
                            payed: _.round(inter.montant.total - (inter.montant.balance - inter.montant.final), 2)
                        }
                        doc.compta.paiement.ready = (hist.payed != hist.montant);
                        doc.compta.paiement.effectue = true
                        doc.compta.paiement.historique.push(hist)
                        doc.save(small_cb);
                    })
            }, function(err, resp) {
                if (err) {
                    reject(err);
                }
                resolve('ok');
            });
        }).catch(__catch)
    }


}
