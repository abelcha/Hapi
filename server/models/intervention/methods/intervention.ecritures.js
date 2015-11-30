module.exports = function(schema) {
    var config = requireLocal('config/dataList')
    var _ = require('lodash')
    var async = require('async')
    var moment = require('moment')
    var csv = require('express-csv')


    format = function(nbr) {
        return String(_.round(nbr, 2)).replaceAll('.', ',');
    }

    var ecriture = function(sst, callback) {
        var _this = this;
        var montantTotal = _.sum(sst, 'compta.paiement.historique.final');
        var dateFormat = moment(new Date(sst[0].compta.paiement.historique.dateFlush)).format('L');
        var BQ1, BQ2
        db.model('artisan').findOne({
            id: sst[0].artisan.id
        }, {
            'formeJuridique': true
        }).exec(function(err, artisan) {
            var formeJuridique = _.get(artisan, 'formeJuridique', 'SARL');
            _.each(sst, function(e, k) {
                var paiement = e.compta.paiement.historique
                var padIdSST = _.padLeft(e.artisan.id, 5, '0')
                var padIdOS = _.padLeft(e.id, 6, '0')
                var libelle = paiement.mode + (paiement.numeroCheque || '') + ' ' + e.artisan.nomSociete
                var montant = Math.abs(paiement.final);
                var numeroCompteAchat = '604' + _.padLeft(config.categories[e.categorie].id_compta, 5, '0')
                var libelleAC = ['TRAVAUX', _.deburr(config.categories[e.categorie].long_name.toUpperCase()), e.artisan.nomSociete].join(' ')
                var libelleNumeroFacture = config.libellePaiement[paiement._type].short_name;
                BQ1 = ['BQ', dateFormat, '40100000', '401' + padIdSST, padIdSST, libelle, format(montantTotal), '']
                BQ2 = ['BQ', dateFormat, '51210000', 'numeroCheque', padIdSST, libelle, '', format(montantTotal)]
                var AC1 = ['AC', dateFormat, numeroCompteAchat, '', libelleNumeroFacture + padIdOS, libelleAC, format(montant), '']
                if (paiement._type == 'AVOIR') {
                    AC1.swap(6, 7);
                }
                _this.dump(AC1)
                if (formeJuridique !== 'AUT') {
                    if (paiement.tva) {
                        var AC2a = ['AC', dateFormat, '44566200', '', libelleNumeroFacture + padIdOS, libelleAC, format(montant * (paiement.tva / 100)), '']
                        if (paiement._type == 'AVOIR') {
                            AC2a.swap(6, 7);
                        }
                        _this.dump(AC2a)
                    } else {

                        var AC2b = ['AC', dateFormat, '44566300', '', libelleNumeroFacture + padIdOS, libelleAC, format(montant * 20 / 100), '']
                        var AC2c = ['AC', dateFormat, '44521000', '', libelleNumeroFacture + padIdOS, libelleAC, '', format(montant * 20 / 100)]
                        if (paiement._type == 'AVOIR') {
                            AC2b.swap(6, 7);
                            AC2c.swap(6, 7);
                        }
                        _this.dump(AC2b)
                        _this.dump(AC2c)
                    }
                }
                var AC3 = [
                    'AC',
                    dateFormat,
                    '40100000',
                    '401' + padIdSST,
                    libelleNumeroFacture + padIdOS,
                    libelleAC,
                    '',
                    format(montant + (montant * (paiement.tva / 100)))
                ]
                if (paiement._type == 'AVOIR') {
                    AC3.swap(6, 7);
                }
                _this.dump(AC3);
            })
            _this.dump(BQ1);
            _this.dump(BQ2)
            callback(null)
        })

    }

    schema.statics.ecritureSST = function(req, res) {
        return new Promise(function(resolve, reject) {
            if (!req.query.d)
                return reject('pas de date')
            var date = new Date(parseInt(req.query.d));
            db.model('intervention').getList({
                'compta.paiement.historique': {
                    $elemMatch: {
                        dateFlush: date
                    }
                }
            }).then(function(docs) {
                if (!docs.length) {
                    return reject('aucunes interventions')
                }
                var rtn = []
                async.each(docs[0].list, ecriture.bind({
                    dump: function(tab) {
                        rtn.push(tab);
                    }
                }), function(err) {
                    if (err)
                        resolve(err);
                    if (req.query.download) {
                        res.sage(rtn)
                    } else if (req.query.json) {
                        resolve(rtn)
                    } else {
                        res.table(rtn)
                    }
                });
            }, function(err) {
                console.log('-->', err)
            })

        })
    }


    schema.statics.ecritureReglements = function(req, res) {

        if (!isWorker) {
            return edison.worker.createJob({
                name: 'db',
                model: 'intervention',
                method: 'ecritureReglements',
                req: _.pick(req, 'query', 'session')
            }).then(function(rtn) {
                if (req.query.download) {
                    res.sage(rtn)
                } else if (req.query.json) {
                    res.json(rtn)
                } else {
                    res.table(rtn)
                }
            }, function() {
                res.send("UNE ERREUR EST SURVENU")
            })
        }

        var getMonthRange = function(m, y) {
            var date = new Date(y, m);
            return {
                $gte: new Date(date.getFullYear(), date.getMonth(), 1, -1),
                $lt: new Date(date.getFullYear(), date.getMonth() + 1, 1)
            }
        }
        return new Promise(function(resolve, reject) {
            var dateRange = getMonthRange(req.query.m - 1, req.query.y)
            console.time('query')
            db.model('intervention').find({
                'compta.reglement.recu': true,
                $or: [{
                    'compta.reglement.date': dateRange
                }, {
                    'compta.reglement.avoir.date': dateRange,
                    'compta.reglement.avoir.effectue': true,
                }, ],
            }).then(function(docs) {
                var rtn = [];
                async.eachLimit(docs, 20, function(e, cb) {
                    _.delay(function() {

                        var R = e.compta.reglement;
                        var P = e.compta.paiement;
                        var montant = {
                            HT: format(e.compta.reglement.montant),
                            TTC: format(R.montant * (1 + (e.tva / 100))),
                            TVA: format(R.montant * (e.tva / 100))
                        }
                        var compte = {
                            VT1: _.padRight('4110' + e.tva, 8, '0'),
                            VT2: ['7040', e.tva, '0', config.categories[e.categorie].id_compta].join(''),
                            VT3: ['445870', _.padLeft(e.tva, 2, '0')].join(''),
                            BQA2: '51210000'
                        }

                        var OS = _.padLeft(e.id, 6, '0');
                        var FOS = 'F' + OS;
                        var AOS = 'A' + OS;
                        var CLTOS = 'CLT' + OS;
                        var dateFormat = moment(new Date(e.date.intervention)).format('L');
                        if (moment(R.date).isBetween(dateRange.$gte, dateRange.$lt)) {
                            var libelleVT = ['VENTE', e.client.civilite.replaceAll('.', ''), e.client.nom].join(' ');
                            var libelleAV = ['AVOIR', e.client.civilite.replaceAll('.', ''), e.client.nom].join(' ');
                            var VT1 = ['VT', dateFormat, compte.VT1, CLTOS, FOS, libelleVT, montant.TTC]
                            var VT2 = ['VT', dateFormat, compte.VT2, '', FOS, libelleVT, '', montant.HT]
                            var VT3 = ['VT', dateFormat, compte.VT3, '', FOS, libelleVT, '', montant.TVA]
                            rtn.push(VT1, VT2, VT3)
                        }
                        if (R.avoir.effectue && moment(R.avoir.date).isBetween(dateRange.$gte, dateRange.$lt)) {
                            var montantAvoir = {
                                HT: format(R.avoir.montant),
                                TTC: format(R.avoir.montant * (1 + (e.tva / 100))),
                                TVA: format(R.avoir.montant * (e.tva / 100))
                            };
                            var dateAvoir = moment(new Date(R.avoir.date)).format('L');
                            if (R.avoir._type === 'REM_COM') {
                                var compteVTA2 = '70900000'
                            } else if (R.avoir._type === 'ERR_FACT') {
                                var comptaVTA2 = compte.VT2;
                            }
                            var VTA1 = ['VT', dateAvoir, compte.VT1, CLTOS, AOS, libelleAV, '', montantAvoir.TTC]
                            var VTA2 = ['VT', dateAvoir, compte.VT2, '', AOS, libelleAV, montantAvoir.HT, '']
                            var VTA3 = ['VT', dateAvoir, compte.VT3, '', AOS, libelleAV, montantAvoir.TVA, '']
                            rtn.push(VTA1, VTA2, VTA3)

                            var BQA1 = ['BQ', dateAvoir, compte.VT1, CLTOS, P.numeroCheque, libelleAV, montantAvoir.TTC, '']
                            var BQA2 = ['BQ', dateAvoir, compte.BQA2, '', P.numeroCheque, libelleAV, '', montantAvoir.TTC]
                            rtn.push(BQA1, BQA2)
                        }
                        cb(null)
                    }, 1);
                }, function() {
                    resolve(rtn)
                })
            });
        });
    };
}
