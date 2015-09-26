module.exports = function(schema) {
    schema.statics.getFact = function(req, res) {
        return new Promise(function(resolve, reject) {
            var _ = require('lodash');
            var async = require('async');
            var V1 = requireLocal('config/_convert_V1');

            if (!isWorker) {
                return edison.worker.createJob({
                    name: 'db',
                    model: 'intervention',
                    method: 'getFact',
                    req: _.pick(req, 'query', 'session')
                })
            }

            /*            edison.v1.get("SELECT devis FROM infointervention WHERE devis!='' LIMIT 100", function(err, resp) {
                        	console.log(resp[42])
                        });
            */
            console.time('get');
            db.model('intervention').find({
                id: {
                    $gt: 13000
                },
                $where: 'this.produits.length'
            }).then(function(resp) {
                console.timeEnd('get');
                var i = 0;
                async.eachLimit(resp, 20, function(e, callback) {
                    console.log(String(++i) + '/' + String(resp.length))
                    var v1 = new V1(e);
                    v1.send(function(resp) {
                        console.log(resp)
                        callback(null);
                    });
                })
            }, resolve)
            return 0;

            edison.v1.get("SELECT * FROM ligne_facture AS l JOIN objetfacture AS o ON o.id=l.id_objet_facture", function(err, x) {
                var lol = _(x.slice(0, 1)).map(function(e)  {
                        var w = {
                            devisTab: {
                                id_intervention: e.id_intervention,
                                quantite: e.quantite,
                                pu: parseFloat(e.puht),
                                ref: e.reference,
                                title: e.designation.toUpperCase().split(' ').slice(0, 3).join(' ').replaceAll("\r\n", " "),
                                desc: e.designation.replaceAll("\r\n", "<br>"),
                            },
                            dump: new Date
                        }
                        return w
                    }).groupBy('id_intervention').value()
                    /*_.each(lol, function(z, k) {
                        var query = "UPDATE infointervention SET devis='" + JSON.stringify(z) + "'";
                        console.log(query);
                        edison.v1.set(query, function(err, resp) {
                            console.log(err, resp);
                        })
                    })*/
            })
            resolve('ok')
        })
    }
}
