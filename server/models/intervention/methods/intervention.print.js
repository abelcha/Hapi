module.exports = function(schema) {
    var _ = require('lodash')
    var PDF = require('edsx-mail')
    var Paiement = requireLocal('config/Paiement.js')
    var async = require('async')

    schema.statics.printAvoir = function(req, res) {
        return new Promise(function(resolve, reject) {
            var op = [];
            var data = JSON.parse(req.body.data);
            var rtn = [];
            async.eachLimit(data, 1, function(e, callback) {
                    db.model('intervention').findOne({
                        id: e.id
                    }).populate('sst').then(function(doc) {
                        doc = doc.toObject();
                        doc.paiement = new Paiement(doc);
                        doc.produits = [{
                            ref: 'REMISE COMMERCIALE',
                            pu: _.round(doc.compta.reglement.avoir.montant / (doc.tva / 100 + 1), 2),
                            quantite: 1,
                            desc: ""
                        }]
                        doc.type = 'avoir';
                        doc.facture = doc.client;
                        rtn.push({
                            model: 'recap',
                            options: {
                                representant: doc.client,
                                nomSociete: doc.client.civilite + " " + doc.client.prenom + " " + doc.client.nom,
                                address: doc.client.address,
                                total: doc.compta.reglement.avoir.montant,
                                mode: 'CHQ',
                                id: 4112,
                                interventions: [{
                                    id: doc.id,
                                    type: '-AVOIR',
                                    description: doc.description,
                                    montant: doc.compta.reglement.avoir.montant
                                }],
                                date: new Date(),
                            }
                        })
                        rtn.push({
                            model: 'facture',
                            options: doc
                        })
                        console.log('oko')
                        callback()
                    })
                },
                function(err, result) {
                    PDF(rtn).toBuffer(function(err, buffer) {
                        res.contentType('application/pdf')
                        res.send(buffer);
                    });
                })
        })
    };



    var getDocs = function(req, res, data) {
        var textTemplate = requireLocal('config/textTemplate');
        return new Promise(function(resolve, reject) {
            var op = [];
            var blank = {
                model: 'blank',
                options: {}
            }
            var ids = _(data).filter(function(e) {
                return _.find(e.list.__list, 'checked', true)
            }).pluck('id').value()
            console.log('--->', ids)
            if (!ids.length) {
                return res.send('Pas de documents')
            }
            db.model('artisan').find({
                id: {
                    $in: ids
                }
            }).then(function(docs) {

                async.eachLimit(docs, 1, function(e, big_callback) {
                        var paiementsst = _.find(data, 'id', e.id);
                        if (paiementsst.list.__list[0].mode === 'VIR') {
                            return big_callback(null)
                        }
                        op.push({
                            model: 'letter',
                            options: {
                                address: e.address,
                                dest: e.representant,
                                text: textTemplate.lettre.artisan.rappelDocuments.bind(e)(),
                                title: ""
                            }
                        })
                        if (!e.document.contrat.ok) {
                            op.push({
                                model: 'contract',
                                options: e
                            })
                        }

                        clean(paiementsst, "CHQ");
                        async.eachLimit(paiementsst.interventions, 1, function(inter, small_callback) {
                            db.model('intervention').findOne({
                                id: inter.id
                            }).populate('sst').then(function(doc) {
                                doc = doc.toObject();
                                doc.compta.paiement.base = inter.montant;
                                doc.paiement = new Paiement(doc);
                                op.push({
                                    model: 'auto-facture',
                                    options: doc
                                });
                                small_callback(null)
                            }, small_callback)
                        }, big_callback)
                    },
                    function() {
                        if (!op.length) {
                            return res.send('Pas de Documents')
                        }
                        PDF(op).toBuffer(function(err, buffer) {
                            res.contentType('application/pdf')
                            res.send(buffer);
                        })
                    });
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
            if (_.find(sst.list.__list, 'mode', 'CHQ'))
                return 0;
            tmp.push(sst.nomSociete + ' ' + sst.id);
            var ids = _.pluck(sst.list.__list, 'id')
            tmp.push(ids.join(', '))
            clean(sst);
            var total = _.reduce(sst.interventions, function(total, x) {
                return total + x.montant;
            }, 0)
            tmp.push(_.round(total, 2))
            rtn.push(tmp);
        })
        return rtn;
    }


    var getLettreCheques = function(res, req, data) {
        return new Promise(function(resolve, reject) {
            var resend = function() {
                if (req.query.pdf || true) {
                    if (!op.length) {
                        return resolve('Pas de documents')
                    }
                    PDF(op).toBuffer(function(err, buffer) {
                        res.contentType('application/pdf')
                        res.send(buffer);
                    })
                } else {
                    res.send(PDF(op).html());
                }
            }

            var op = [];
            _.each(data, function(e, k) {
                if (!e.total.final)
                    return 0;
                var mode = _.find(e.list.__list, {
                    checked: true,
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
            resend(op, req.query.pdf)
        })

    }

    schema.statics.print = function(req, res) {
        var _this = this;
        var data = JSON.parse(req.body.data);

        if (req.body.type === 'documents') {
            return getDocs(req, res, data)
        } else if (req.body.type === 'virement') {
            return res.table(getVirements(data))
        } else {
            return getLettreCheques(res, req, data)
        }
    }
}
