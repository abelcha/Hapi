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
        req.query.call_origin = req.query.call_origin.replace('33', '0');
        console.log('==>', req.query.call_origin)
        db.model('intervention').findOne({
            $or: [{
                'client.telephone.tel1': req.query.call_origin
            }, {
                'client.telephone.tel2': req.query.call_origin
            }, {
                'client.telephone.tel3': req.query.call_origin
            }]
        }).populate('sst').then(function(resp) {
        console.log('==>', 'ok', sst && sst.id)

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
        console.log('QUERY =>', req.params, req.query);
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
            console.log('401');
            return res.sendStatus(401)
        }
        if (!req.params.id.match(/^\d+$/)) {
            console.log('NOPE ID');
            return res.json(resps[1]);
        }
        q.call_origin = q.call_origin && q.call_origin.replace('33', '0')


        db.model('artisan').findOne({
                $or: [{
                    'telephone.tel1': q.call_origin
                }, {
                    'telephone.tel2': q.call_origin
                }, {
                    'id': parseInt(q.sst_id || 0)
                }]
            }).then(function(doc) {
                if (!doc) {
                    console.log('==>', resps[2])
                    return res.json(resps[2]);
                }
                if (req.params.id == '0' ||  req.params.id == '29549') {
                    console.log('==>', resps[1])
                    return res.json(resps[1])
                }
                promise = db.model('intervention').findOne({
                    id: parseInt(req.params.id)
                }).then(function(intervention) {
                    if (!intervention ||  (intervention.sst !== doc.id)) {
                        console.log('==>', resps[4])
                        return res.json(resps[4])
                    } else {
                        console.log('==>', ok(intervention.client.telephone.tel1.replace('0', '33')))
                        return res.json(ok(intervention.client.telephone.tel1.replace('0', '33')))
                    }
                })
            })
    }
}
