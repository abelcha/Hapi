module.exports = function(schema) {

    schema.statics.lastInters = {
        unique: true,
        findBefore: false,
        method: 'GET',
        fn: function(id, req, res) {
            return new Promise(function(resolve, reject) {
                db.model('intervention')
                    .find({
                        'artisan.id': id
                    })
                    .select('id -_id _v login date client prixAnnonce categorie status')
                    .sort('-id')
                    .limit(100)
                    .then(function(doc) {
                        var rtn = [];
                        doc.forEach(function(e) {
                            rtn.push(db.model('intervention').translate(e));
                        })
                        res.json(rtn)
                    })
            });
        }
    }
}
