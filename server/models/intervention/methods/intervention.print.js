module.exports = function(schema) {
    var _ = require('lodash')
    var moment = require('moment')
    var PDF = require('edsx-mail')
    var Paiement = requireLocal('config/Paiement.js')
    var async = require('async')


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
            }).map('id').value()
            if (!ids.length) {
                return res.send('Pas de documents')
            }
            db.model('artisan').find({
                id: {
                    $in: ids
                }
            }).then(function(docs) {

                async.eachLimit(docs, 10, function(e, big_callback) {
                        e = JSON.parse(JSON.stringify(e))
                        var paiementsst = _.find(data, 'id', e.id);
                        if (paiementsst.list.__list[0].mode === 'VIR') {
                            return big_callback(null)
                        }
                        op.push({
                            model: 'letter',
                            options: {
                                qrcodeText1:'ASWR-XX-' + moment().format('DD-MM-YYYY'),
                                qrcodeText2: e.id + ' - ' + e.nomSociete.slice(0, 10),
                                address: e.address,
                                dest: e.representant,
                                text: textTemplate.lettre.artisan.rappelDocuments.bind(e)(),
                                title: ""
                            }
                        })
                        if (!e.document.contrat.ok) {
                            e.signe = true
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
                                console.log(inter)
                                doc.compta.paiement.base = inter.base;
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
                base: x.montant.base,
                id: x.id,
                montant: x.montant.final,
                description: x.description
            }
        });
        e.list = undefined;
    }


    var getExcel = function(data) {
        var rtn = [];
        rtn.push(['Ajouté par', 'Date', 'id', 'Artisan ID', 'Artisan Nom Societé', 'Type', 'Mode', 'Numero Cheque', 'Base', 'Final'])
        _.each(data, function(sst) {
            var ids = _.map(sst.list.__list, 'id')
            _.each(sst.list.__list, function(e) {
                rtn.push([e.login, moment(e.date).format('l hh:mm'), e.id, sst.id, sst.nomSociete, e.type, e.mode, e.numeroCheque, e.montant.base, e.montant.final])
            })
        })
        return rtn;
    }



    var getVirements = function(data) {
        var rtn = [];
        _.each(data, function(sst) {
            var tmp = [];
            if (_.find(sst.list.__list, 'mode', 'CHQ'))
                return 0;
            tmp.push(sst.nomSociete + ' ' + sst.id);
            var ids = _.map(sst.list.__list, 'id')
            tmp.push(ids.join(', '))
            clean(sst);
            var total = _.reduce(sst.interventions, function(total, x) {
                return total + x.montant;
            }, 0)
            tmp.push(_.round(total, 2))
            rtn.push(tmp);
        })
        console.log(rtn);
        return rtn;
    }


    var getLettreCheques = function(res, req, data, offsetX, offsetY) {
        return new Promise(function(resolve, reject) {
            var resend = function() {
                var xpdf = PDF(op)
                xpdf._html = xpdf._html.replace("</style>", " div#cheque { right:" + -offsetX + "mm; bottom:" + offsetY + "mm; }</style>");

                if (req.query.pdf || true) {
                    if (!op.length) {
                        return resolve('Pas de documents')
                    }

                    xpdf.toBuffer(function(err, buffer) {
                        res.contentType('application/pdf')
                        res.send(buffer);
                    })
                } else {
                    res.send(xpdf.html());
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
        if (!req.body.data) {
            return res.send('nope')
        }
        var data = JSON.parse(req.body.data);
        if (req.body.type === 'excel') {
            return res.xls({
                data: getExcel(data),
                name: 'Paiements du ' + moment().format('LL')
            })
        } else if (req.body.type === 'documents') {
            return getDocs(req, res, data)
        } else if (req.body.type === 'virement') {
            return res.table(getVirements(data))
        } else {
            return getLettreCheques(res, req, data, req.body.offsetX, req.body.offsetY)
        }
    }
}
