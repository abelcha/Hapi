module.exports = {
    get: function(req, res) {
        var _ = require('lodash');
        var q = req.query;
        var resps = [{
            status_code: 200,
            description: "OK",
            telephone_client: "0633138868"
        }, {
            status_code: 401,
            description: "Client inconnu"
        }, {
            status_code: 402,
            description: "telephone d'origine inconnu + pas de sst_id"
        }, {
            status_code: 404,
            description: "partenaire inconnu"
        }, {
            status_code: 403,
            description: "le partenaire n'a pas les droits"
        }]


        var ok = function(telephone) {
            var rtn = resps[0];
            rtn.telephone_client = telephone
            res.json(rtn);
        }
        if (req.query.key !== '79dl5hSkApZF9p407307T0AVmPV4W7sD') {
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
            	}
                else if (parseInt(req.query.sst_id) === artisan.id) {
                    return ok(doc.client.telephone.tel1);
                } else {
                    return res.json(resps[4])
                }
            } else {
                return ok(doc.client.telephone.tel1);
            }
        }, function() {
            res.sendStatus(500)
        })
    }
}
