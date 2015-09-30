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


    var getDocs = function(data) {
        return new Promise(function(resolve, reject) {
            var op = [];
            var blank = {
                model: 'blank',
                options: {}
            }
            console.log('==>', data.length)
            db.model('artisan').find({
                id: {
                    $in: _.pluck(data, 'id')
                }
            }).then(function(docs) {
                _.each(docs, function(e) {
                    if (!e.document.rib.file) {
                        op.push({
                            model: 'letter',
                            options: {
                                address: e.address,
                                dest: e.representant,
                                text: 'Bonjour, veuillez nous communiquer votre rib stp',
                                title: "Demande de transmission de rib"
                            }
                        }, blank)
                    }
                    console.log('==>', e.document.contrat.file)
                    if (!e.document.contrat.file) {
                        op.push({
                            model: 'letter',
                            options: {
                                address: e.address,
                                dest: e.representant,
                                text: 'Bonjour, veuillez nous communiquer votre contrat stp',
                                title: "Demande de transmission de contrat"
                            }
                        }, blank, {
                            model: 'contract',
                            options: e
                        }, blank)
                    }

                });
                resolve(PDF(op).html())
                    // resolve('ok')
            }, reject)
        })
    }


    var clean = function(e, mode) {

        e.total = e.total.final
        e.mode = mode;
        e.interventions = _.map(_.filter(e.list.__list, {
            checked: true
        }), function(x) {
            return {
                type: x.type,
                id: x.id,
                montant: x.montant.final,
                description: x.description
            }
        });
        e.list = undefined;
    }

    var getVirements = function(data) {
        var rtn = [];
        _.each(data, function(sst) {
            var tmp = [];
            tmp.push(sst.nomSociete + ' ' + sst.id);
            tmp.push("30002 00550 0000157845Z 02");
            clean(sst);
            var total = _.reduce(sst.interventions, function(total, x) {
                return total + x.montant;
            }, 0)
            tmp.push(_.round(total, 2))
            rtn.push(tmp);
        })
        return rtn;
    }



    schema.statics.print = function(req, res) {
        var _this = this;
        var data = JSON.parse(req.body.data);

        if (req.body.type === 'documents') {
            return getDocs(data).then(res.send.bind(res), res.json.bind(res));
        } else if (req.body.type === 'virement') {
            console.log('jdqsjdsqj')
            return res.table(getVirements(data))
        }

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


            var op = [];
            _.each(data, function(e, k) {

                if (!e.total.final)
                    return 0;
                var mode = _.find(e.list.__list, {
                    mode: 'CHQ'
                }) ? 'CHQ' : 'VIR';
                clean(e, mode);

                if ((req.body.type === 'recap' && mode !== 'CHQ') ||
                    (req.body.type === 'lettreCheques' && mode == 'CHQ')) {
                    op.push({
                        model: 'recap',
                        options: e
                    })
                }
            })
            if (req.body.type === 'recap') {
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
