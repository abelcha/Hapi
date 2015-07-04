module.exports = function(req, res) {
    var rtn = [];
    var async = require('async');
    var _ = require('lodash');
    var query = req.params.text;

    var search = function(cb) {
        console.log(query)
        if (_(query).startsWith('0')) {

            db.model('intervention').find({
                $or: [{
                    'client.telephone.tel1': {
                        $regex: new RegExp('^' + query, 'i')
                    }
                }, {
                    'client.telephone.tel2': {
                        $regex: new RegExp('^' + query, 'i')
                    }
                }]
            }).then(function(resp) {
                cb(null, resp.map(function(e) {
                    var tel = e.client.telephone;
                    var matchedTel = _(tel.tel1).startsWith(query) ? tel.tel1 : tel.tel2
                    return {
                        description: matchedTel + ' - ' + e.client.civilite + ' ' + e.client.nom + ' - ' + e.client.address.cp + ' ' + e.client.address.v,
                    }
                }))
            }, function(err) {
                console.log(err)
            })
        } else if (query.match(/^\d+$/)) {
            db.model('intervention').find({
                $where: "/^" + query + ".*/.test(this.id)"
            }).limit(5).then(function(resp) {
                cb(null, resp.map(function(e) {
                    return {
                        description: e.id + ' - ' + e.client.civilite + ' ' + e.client.nom + ' - ' + e.client.address.cp + ' ' + e.client.address.v
                    }

                }))
            })
        } else if (query.startsWith('_')) {
            db.model('intervention').findOne({id:parseInt(query.slice(1))}).then(function(e) {
                if (!e)
                    cb(null, []);
                cb(null, [{
                    description: e.id + ' - ' + e.client.civilite + ' ' + e.client.nom + ' - ' + e.client.address.cp + ' ' + e.client.address.v
                }])
            })
        }
    }
    console.time('here')
    async.parallel({
        intervention: search.bind({
            model: 'intervention'
        }),
    }, function(err, result) {
        console.log(result)
        res.json(result.intervention)
        console.timeEnd('here')
    })
}
