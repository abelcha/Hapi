module.exports = function(schema) {
    var _ = require('lodash')
    var PDF = require('edsx-mail')
    var Paiement = requireLocal('config/Paiement.js')
    var async = require('async')

    schema.statics.printAvoir = function(req, res) {
        return new Promise(function(resolve, reject) {
            var op = [];
            var data = JSON.parse(req.body.data);
            async.each(data, function(e, callback) {
                db.model('intervention').findOne({
                    id: e.id
                }).populate('sst').then(function(doc) {
                    doc = doc.toObject();
                    doc.paiement = new Paiement(doc);
                    callback()
                })
            }, function(err, result) {
                //  resend(op, req.query.pdf)
                console.log(op)
                resolve('ok')
            })
        })
    };

    schema.statics.print = function(req, res) {
        var _this = this;

        return new Promise(function(resolve, reject) {
            var resend = function() {
                if (req.query.pdf || true) {
                    console.log('yaypdf')
                    if (!op.length) {
                        return resolve('Pas de documents')
                    }
                    PDF(op).toBuffer(function(err, buffer) {
                        res.contentType('application/pdf')
                        res.send(buffer);
                    })
                } else {
                    console.log('yay')
                    res.send(PDF(op).html());
                }
            }


            var data = JSON.parse(req.body.data);
            var op = [];
            _.each(data, function(e, k) {
                var mode = _.find(e.list.__list, {
                    mode: 'CHQ'
                }) ? 'CHQ' : 'VIR';

                if (!e.total.final)
                    return 0;
                e.total = e.total.final
                e.mode = mode;
                e.interventions = _.map(_.filter(e.list.__list, {
                    checked: true
                }), function(x) {
                    return {
                        type:x.type,
                        id: x.id,
                        montant: x.montant.final,
                        description: x.description
                    }
                });
                e.list = undefined;

                if ((req.body.type === 'documents' && mode !== 'CHQ') ||
                    (req.body.type === 'lettreCheques' && mode == 'CHQ')) {
                    op.push({
                        model: 'recap',
                        options: e
                    })
                }
            })
            if (req.body.type === 'documents') {
                var it = 0;
                async.each(data, function(e, callback) {
                    async.each(e.interventions, function(x, cb2) {
                        if (e.mode === 'CHQ') {
                            return cb2();
                        }
                        db.model('intervention').findOne({
                            id: x.id
                        }).populate('sst').then(function(doc) {
                            doc = doc.toObject();
                            doc.paiement = new Paiement(doc);
                            var __pos = _(op).findIndex('options.id', doc.artisan.id, 'model', 'recap')
                            if (__pos >= 0) {
                                op.splice(__pos + 1, 0, {
                                    model: 'auto-facture',
                                    options: doc
                                });
                            }
                            cb2()
                        }, callback)

                    }, callback)

                }, function(err, result) {
                    resend(op, req.query.pdf)
                })
            } else {
                resend(op, req.query.pdf)
            }
        })

    }


}
