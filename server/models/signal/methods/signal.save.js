module.exports = function(schema) {
    schema.statics.__save = function(req, res) {
        var _ = require('lodash')
        var async = require('async')
        var signalementList = req.body;
        return new Promise(function(resolve, reject) {
            _.each(signalementList, function(e, k) {
                e._type = _(e.nom).chain().snakeCase().deburr().value().toUpperCase();
                e.subType = _(e.subType).chain().snakeCase().deburr().value().toUpperCase();
            })
            db.model('signal').remove({}, function() {
                db.model('signal').create(signalementList).then(resolve, reject)
            })
        })
    }


    schema.statics.dump = function(req, res) {


        var data = [{
            nom: "N'est pas assez payé",
            subType: 'FINANCIER',
            service: "COMPTABILITE",
            level: 1
        }, {
            nom: "N'a pas compris le fonctionnement des pourcentages",
            subType: 'FONCTIONNEMENT',
            service: "PARTENARIAT",
            level: 1
        }, {
            nom: "N'est pas souvent dispo",
            subType: 'DISPO',
            service: "PARTENARIAT",
            level: 1
        }, {
            nom: "Soupsons de vol",
            subType: 'FONCTIONNEMENT',
            service: "INTERVENTION",
            level: 2
        }]

        return db.model('signal').__save({
            body: data
        })
    }


}
