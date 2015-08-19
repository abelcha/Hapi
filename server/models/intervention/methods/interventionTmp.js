module.exports = function(schema) {
    var getKey = function(id) {
        return ['interventionTmp', id].join('').envify()
    }

    schema.statics.saveTmp = function(req, res) {
        var key = getKey(req.body.tmpID)
        redis.setex(key, 10, JSON.stringify(req.body), function() {
            res.send('ok')
        });
    }

    schema.statics.getTmp = function(req, res) {
        var key = getKey(req.query.id)
        redis.get(key, function(err, resp) {
            if (!err && resp) {
                res.json(JSON.parse(resp))
            } else {
                res.json({
                    prixAnnonce: 0,
                    prixFinal: 0,
                    coutFourniture: 0,
                    comments: [],
                    produits: [],
                    tva: 10,
                    remarque: 'PAS DE REMARQUES',
                    modeReglement: 'CH',
                    client: {
                        civilite: 'M.'
                    },
                    facture: {

                    },
                    reglementSurPlace: true,
                    date: {
                        ajout: new Date(parseInt(req.query.id)) ||  Date.now(),
                        intervention: new Date(parseInt(req.query.id)) ||  Date.now(),
                    }
                })
            }
        });
        //redis.set()
    }
}
