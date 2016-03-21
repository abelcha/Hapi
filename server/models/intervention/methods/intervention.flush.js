module.exports = function(schema) {
    var _ = require('lodash')
    var async = require('async');
    var moment = require('moment');
    var Paiement = requireLocal('config/Paiement');
    var PDF = requireLocal('pdf-mail')



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
            console.log('FLUSH_MAIL')
            var total = _.reduce(req.body, function(total, e) {
                return total + e.list.__list.length
            }, 0)
            var data = _.groupBy(req.body, 'id');
            console.log('GOT', _.size(data), "Artisans")
            async.eachLimit(data, 1, function(sst, cb) {
                var k = Object.keys(data)[i++]
                console.log('-=====->', i + '/' + _.size(data))
                    // global.currenWorkerJob.progress(i, req.body.length);
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
                                mode: e.mode,
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
                        async.each(_.filter(artisan.interventions, 'mode', 'VIR'), function(inter, small_cb) {
                          console.log('SEARCH FOR OS ' + inter.id)
                            db.model('intervention')
                                .findOne({
                                    id: inter.id
                                })
                                .then(function(resp) {
                                    if (!resp) return cb("nipe")
                                    resp = resp.toObject();
                                    //resp.compta.paiement.base = inter.montant;
                                    resp.paiement = new Paiement(resp);
                                    resp.sst = artisan;
                                    autofactures.push({
                                        model: 'auto-facture',
                                        options: resp
                                    })
                                    console.log('GOT OS ' + resp.id)
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
                        var textTemplate = requireLocal('config/textTemplate.js');
                        var virement = artisan.interventions[0].mode === 'VIR';
                        console.log('SENDINGMAIL-->', artisan.id)
                        mail.send({
                            From: "comptabilite@edison-services.fr",
                            ReplyTo: "comptabilite@edison-services.fr",
                            To: artisan.email,
                            Subject: "Paiement du " + moment().format('LL'),
                            HtmlBody: textTemplate.mail.intervention.paiement(virement),
                            Attachments: [{
                                Content: buffer.toString('base64'),
                                Name: "Recap " + moment().format('LL') + ".pdf",
                                ContentType: 'application/pdf'
                            }]
                        }, callback);
                    }
                ], cb);
            }, function(err, resp) {
                edison.event('FLUSH_MAIL').data(data).login(req.session.login).save();
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




        if (!isWorker) {
            return edison.worker.createJob({
                name: 'db',
                model: 'intervention',
                method: 'flush',
                req: _.pick(req, 'body', 'session')
            })
        }

        return new Promise(function(resolve, reject) {

            var date = (new Date()).setMilliseconds(0)
            console.log('FLUSH')
            var data = _(req.body).map('list.__list').flatten().value()
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
                        console.log('FLUSH', doc.id)

                        var hist = {
                            dateAjout: doc.compta.paiement.date,
                            loginAjout: doc.compta.paiement.login,
                            dateFlush: date,
                            loginFlush: req.session.login,
                            pourcentage: doc.compta.paiement.pourcentage,
                            tva: doc.compta.paiement.tva,
                            _type: inter.type,
                            fourniture: fourniture,
                            mode: doc.compta.paiement.mode,
                            numeroCheque: _.find(numCheques, 'id', doc.sst).numeroCheque,
                            montant: inter.montant.total,
                            final: inter.montant.final,
                            base: inter.montant.base,
                            payed: _.round(inter.montant.total - (inter.montant.balance - inter.montant.final), 2)
                        }
                        doc.status = 'VRF'
                        doc.compta.paiement.ready = (hist.payed != hist.montant);
                        doc.compta.paiement.effectue = true
                        doc.compta.paiement.historique.push(hist)
                            //return small_cb(null);
                        doc.save(function(err, resp) {
                            console.log(err, !!resp);
                            small_cb(null);
                        });
                    })
            }, function(err, resp) {
                if (err) {
                    reject(err);
                }
                edison.event('FLUSH').data(data).login(req.session.login).save();
                resolve('ok');
            });
        }).catch(__catch)
    }


}
