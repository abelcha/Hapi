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
                    return res.json(resps[2]);
                }
                if (req.params.id == '0') {
                    return res.json(resps[1])
                }
                promise = db.model('intervention').findOne({
                    id: parseInt(req.params.id)
                }).then(function(intervention) {
                    if (!intervention ||  (intervention.sst !== doc.id)) {
                        return res.json(resps[4])
                    } else {
                        return res.json(ok(intervention.client.telephone.tel1.replace('0', '33')))
                    }
                })
            })
            /*
                    promise = db.model('intervention').findOne({
                        id: parseInt(req.params.id)
                    }).populate('sst');
                    console.log('create promise')
                    promise.then(function(doc) {
                        console.log('Get Intervention')
                        if (!doc || !doc.sst.id)
                            return res.json(resps[1])
                        var artisan = doc.sst.id
                        console.log(q.call_origin, doc.sst.telephone.tel1, q.call_origin === doc.sst.telephone.tel1);
                        if (q.call_origin !== doc.sst.telephone.tel1 && q.call_origin !== doc.sst.telephone.tel2) {
                            console.log('one')
                            if (!req.query.sst_id) {
                                console.log('two')
                                return res.json(resps[2])
                            } else if (parseInt(req.query.sst_id) === doc.sst.id) {
                                console.log('OKOK', doc.client.telephone.tel1)
                                return res.json(ok(doc.client.telephone.tel1));
                            } else {
                                console.log('four')
                                return res.json(resps[4])
                            }
                        } else {
                            console.log("OK ==>", ok(doc.client.telephone.tel1.replace('0', '33')))
                            return res.json(ok(doc.client.telephone.tel1.replace('0', '33')))
                        }
                    }, function() {
                        console.log('NOOOP')
                        res.sendStatus(500)
                    })*/
    }
}
