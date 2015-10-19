var _ = require('lodash');

var request = function(query) {
    var response = _.pick(query, 'status_code', 'description', 'redirect_to');
    this.json(response);
    console.log(response)
    db.model('axialis')(query).save();
    if (response.status_code === 200 && query.id_intervention) {
        var q = {
            id: query.id_intervention,
            appels: {
                $not: {
                    $elemMatch: {
                        call_id: query.call_id
                    }
                }
            }
        }
        
        console.log('==>', JSON.stringify(q))

        db.model('intervention').find(q).then(function(resp) {
            if (resp) {
                resp.appels  = resp.appels || [];
                resp.appels.push(query);
                resp.save();
            }
        })
    }
}

module.exports = {
    info: function(req, res) {
        if (req.query.api_key !== 'F8v0x13ftadh89rm0e9x18b62ZqgEl47') {
            return res.sendStatus(401)
        }
        db.model('intervention').update({
            "appels.call_id": req.query.call_id
        }, {
            $set: {
                "appels.$.duration": req.query.duree_about,
                "appels.$.status": req.query.status,
            }
        }, function(err, resp) {
            console.log("===>INFO RESP", err, resp)
        })
        res.send('ok')
        console.log('dataaxialis', req.body, req.query, req.params);
    },
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

        req.query.call_origin = req.query.call_origin.replace('0033', '0');
        console.log('==>', req.query.call_origin)
        db.model('intervention').findOne({
            $or: [{
                'client.telephone.tel1': req.query.call_origin
            }, {
                'client.telephone.tel2': req.query.call_origin
            }, {
                'client.telephone.tel3': req.query.call_origin
            }],
            status: 'ENC'
        }).populate('sst').then(function(resp) {
            console.log('==>', resp.id)
            if (!resp) {
                return request.bind(res)({
                    id_call: req.query.call_id,
                    origin: req.query.call_origin,
                    _type: 'CALLBACK',
                    status_code: 402,
                    description: 'partenaire inconnu'
                });
            }
            request.bind(res)({
                id_call: req.query.call_id,
                origin: req.query.call_origin,
                _type: 'CALLBACK',
                status_code: 200,
                description: 'OK',
                id_sst: resp.sst.id,
                id_intervention: resp.id,
                redirect_to: resp.sst.telephone.tel1
            });
        })
    },
    contact: function(req, res) {
        console.log('QUERY =>', req.params, req.query);
        var _ = require('lodash');
        var q = req.query;


        if (req.query.api_key !== 'F8v0x13ftadh89rm0e9x18b62ZqgEl47') {
            return res.sendStatus(401)
        }
        if (!req.params.id.match(/^\d+$/)) {
            return request.bind(res)({
                id_call: req.query.call_id,
                origin: q.call_origin,
                _type: 'CONTACT',
                status_code: 401,
                description: "Client inconnu"
            });
        }
        q.call_origin = q.call_origin && q.call_origin.replace('330', '0')


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
                console.log('pas artisan', q.call_origin, q.sst_id)
                return request.bind(res)({
                    id_call: req.query.call_id,
                    origin: q.call_origin,
                    _type: 'CONTACT',
                    status_code: 401,
                    description: "telephone d'origine inconnu + pas de sst_id"
                });
            }
            if (req.params.id == '0' ||  req.params.id == '29549') {
                return request.bind(res)({
                    id_call: req.query.call_id,
                    origin: q.call_origin,
                    _type: 'CONTACT',
                    id_sst: doc.id,
                    status_code: 401,
                    description: "client inconnu"
                });
            }
            promise = db.model('intervention').findOne({
                id: parseInt(req.params.id),
                status: 'ENC',
            }).then(function(intervention) {
                console.log(intervention.sst, doc.id);
                if (!intervention || !intervention.artisan  || intervention.artisan.id !== doc.id) {
                    return request.bind(res)({
                        id_call: req.query.call_id,
                        origin: q.call_origin,
                        id_sst: doc.id,
                        _type: 'CONTACT',
                        status_code: 403,
                        description: "le intervenant n'a pas les droits"
                    });
                } else {
                    return request.bind(res)({
                        id_call: req.query.call_id,
                        origin: q.call_origin,
                        id_sst: doc.id,
                        _type: 'CONTACT',
                        status_code: 200,
                        description: "OK",
                        id_intervention: intervention.id,
                        redirect_to: intervention.client.telephone.tel1.replace('0', '33')
                    });
                }
            })
        })
    }
}
