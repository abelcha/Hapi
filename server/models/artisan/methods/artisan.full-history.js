module.exports = function(schema) {
    var _ = require('lodash')
    var normalize = function(type, dateKey) {
        return function(e) {
            e.type = type;
            e._date = new Date(_.get(e, dateKey ||  'date'));
        }
    }

    schema.statics.fullHistory = {
        unique: true,
        findBefore: true,
        method: 'GET',
        fn: function(artisan, req, res) {
            return new Promise(function(resolve, reject) {
                db.model('signalement').find({
                    sst_id: artisan.id
                }).lean().then(function(signalements) {
                    var comments = _.each(artisan.toObject().comments, normalize('comment'))
                    var pack = _.each(artisan.toObject().historique.pack, normalize('pack'))
                    var contrat = _.each(artisan.toObject().historique.contrat, normalize('contrat'))
                    var signs = _.each(signalements, normalize('signalement', 'date.ajout'));
                    var rtn = [];
                    rtn = rtn.concat(comments).concat(pack).concat(contrat).concat(signs);
                    rtn = _.sortBy(rtn, '_date').reverse()
                    resolve(rtn)
                })
            })
        }
    }
}
