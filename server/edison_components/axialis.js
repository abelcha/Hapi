var ok = function(telephone) {
    return ({
        status_code: 200,
        description: 'OK',
        redirect_to: telephone
    });
}

module.exports = {
    callback: function(req, res) {
        console.log('callback')

        var _ = require('lodash');
        var q = req.query;
        if (req.query.api_key !== 'F8v0x13ftadh89rm0e9x18b62ZqgEl47') {
            return res.sendStatus(401)
        }

        if (!req.query.call_origin) {
            return res.json({
                status_code: 401,
                description: 'Invalid Request'
            });
        }
        db.model('intervention').findOne({
            $or: [{
                'client.telephone.tel1': req.query.call_origin
            }, {
                'client.telephone.tel2': req.query.call_origin
            }, {
                'client.telephone.tel3': req.query.call_origin
            }]
        }).populate('sst').then(function(resp) {
            if (!resp) {
                return res.json({
                    status_code: 402,
                    description: 'partenaire inconnu'
                })
            }
            res.json(ok(resp.sst.telephone.tel1))
        })
    },
    contact: function(req, res) {
        console.log('contact')
        var _ = require('lodash');
        var q = req.query;
        var resps = [{
            status_code: 200,
            description: "OK",
            telephone_redirect: "0633138868"
        }, {
            status_code: 401,
            description: "Client inconnu"
        }, {
            status_code: 402,
            description: "telephone d'origine inconnu + pas de sst_id"
        }, {
            status_code: 404,
            description: "intervenant inconnu"
        }, {
            status_code: 403,
            description: "le intervenant n'a pas les droits"
        }]


        if (req.query.api_key !== 'F8v0x13ftadh89rm0e9x18b62ZqgEl47') {
            return res.sendStatus(401)
        }
        if (!req.params.id.match(/^\d+$/)) {
            return res.json(resps[1]);
        }
        promise = db.model('intervention').findOne({
            id: parseInt(req.params.id)
        }).populate('artisan.id');

        promise.then(function(doc) {
            if (!doc || !doc.artisan.id)
                return res.json(resps[1])
            var artisan = doc.artisan.id
            if (q.call_origin !== artisan.telephone.tel1 && q.call_origin !== artisan.telephone.tel2) {
                if (!req.query.sst_id) {
                    return res.json(resps[2])
                } else if (parseInt(req.query.sst_id) === artisan.id) {
                    return res.json(ok(doc.client.telephone.tel1));
                } else {
                    return res.json(resps[4])
                }
            } else {
                return res.json(ok(doc.client.telephone.tel1))
            }
        }, function() {
            res.sendStatus(500)
        })
    }
}
