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
                            ref: 'EDI142AV',
                            pu: _.round(doc.compta.reglement.avoir.montant / (doc.tva / 100 + 1), 2),
                            quantite: 1,
                            desc: 'REMISE COMMERCIALE'
                        }]
                        doc.type = 'avoir';
                        doc.facture = doc.client;
                        rtn.push({
                            model: 'facture',
                            options: doc
                        })
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


    schema.statics.printAvoirChq = function(req, res) {
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
                                id: doc.id,
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
}
