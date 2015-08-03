module.exports = function(schema) {
    var config = requireLocal('config/dataList')
    var _ = require('lodash')
    var async = require('async')
    var moment = require('moment')
    var getList = function(match) {
        return new Promise(function(resolve, reject) {
            db.model('intervention')
                .aggregate()
                .match(match ||  {})
                .unwind("compta.paiement.historique")
                .project({
                    'compta': true,
                    'artisan': true,
                    'id': true,
                    'categorie': true
                })
                .exec(function(err, docs) {
                    var x = _.groupBy(docs, 'compta.paiement.historique.dateFlush')
                    x = _(x).map(function(e, k) {
                            return {
                                date: k,
                                timestamp: (new Date(k)).getTime(),
                                list: _.groupBy(e, 'artisan.id')
                            }
                        }).value()
                        // console.log(x)
                    resolve(x)
                })
        })
    }

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
                var padIdSST = _.padLeft(e.artisan.id, 5, '0')
                var padIdOS = _.padLeft(e.id, 6, '0')
                var libelle = e.compta.paiement.historique.mode + (e.compta.paiement.historique.numeroCheque || '') + ' ' + e.artisan.nomSociete
                var montant = Math.abs(e.compta.paiement.historique.final);
                var numeroCompteAchat = '604' + _.padLeft(config.categories[e.categorie].id_compta, 5, '0')
                var libelleAC = ['TRAVAUX', _.deburr(config.categories[e.categorie].long_name.toUpperCase()), e.artisan.nomSociete].join(' ')
                    // console.log(libelleAC)
                BQ1 = [
                    'BQ1',
                    dateFormat,
                    '40100000',
                    '401' + padIdSST,
                    padIdSST,
                    libelle,
                    format(montantTotal),
                    ''
                ]
                BQ2 = [
                    'BQ2',
                    dateFormat,
                    '51210000',
                    '',
                    padIdSST,
                    libelle,
                    '',
                    format(montantTotal),
                ]
                var AC1 = [
                    'AC1',
                    dateFormat,
                    numeroCompteAchat,
                    '',
                    'ST' + padIdOS,
                    libelleAC,
                    format(montant),
                    '',
                ]
                if (e.compta.paiement.historique._type == 'AVOIR') {
                    AC1.swap(6, 7);
                }
                _this.dump(AC1)
                if (formeJuridique !== 'AUT') {
                    if (e.compta.paiement.historique.tva) {
                        var AC2a = [
                            'AC2a',
                            dateFormat,
                            '44566200',
                            '',
                            'ST' + padIdOS,
                            libelleAC,
                            format(montant * (e.compta.paiement.historique.tva / 100)),
                            ''
                        ]
                        if (e.compta.paiement.historique._type == 'AVOIR') {
                            AC2a.swap(6, 7);
                        }
                        _this.dump(AC2a)
                    } else {

                        var AC2b = [
                            'AC2b',
                            dateFormat,
                            '44566300',
                            '',
                            'ST' + padIdOS,
                            libelleAC,
                            format(montant * 20 / 100),
                            '',
                        ]
                        var AC2c = [
                            'AC2c',
                            dateFormat,
                            '44521000',
                            '',
                            'ST' + padIdOS,
                            libelleAC,
                            '',
                            format(montant * 20 / 100)

                        ]
                        if (e.compta.paiement.historique._type == 'AVOIR') {
                            AC2b.swap(6, 7);
                            AC2c.swap(6, 7);
                        }
                        _this.dump(AC2b)
                        _this.dump(AC2c)

                    }
                }
                var AC3 = [
                    'AC3',
                    dateFormat,
                    '40100000',
                    '401' + padIdSST,
                    'ST' + padIdOS,
                    libelleAC,
                    '',
                    format(montant + (montant * (e.compta.paiement.historique.tva / 100)))
                ]
                if (e.compta.paiement.historique._type == 'AVOIR') {
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
            getList({
                'compta.paiement.historique': {
                    $elemMatch: {
                        dateFlush: date
                    }
                }
            }).then(function(docs) {
                if (!docs.length) {
                    return reject('aucunes interventions')
                }
                async.each(docs[0].list, ecriture.bind({
                    dump: function(tab) {
                        var x = tab.join(';');
                        console.log(x)
                        res.write(x + '\n');
                    }
                }), function(err) {
                    if (err)
                        resolve(err);
                    res.end();
                });
            }, function(err) {
                console.log('-->', err)
            })

        })
    }

    schema.statics.archive = function(req, res) {
        var _this = this;
        return getList({
            'compta.paiement.effectue': true,
        });
    }

}
