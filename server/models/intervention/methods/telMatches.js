module.exports = function(schema) {

    var _ = require('lodash')
    var async = require('async');

    var getIn = function(field, telList) {
        var x = {}
        x[field] = {
            $in: telList
        }
        return x;
    }

    var reduce = function(rtn, fltr) {
        var total = 0;
        var x = _.filter(rtn, fltr);
        _.each(x, function(e) {
            total += e.prix;
        })
        return total
    }

    schema.statics.telMatches = function(req, res) {

        if (!isWorker) {
            return edison.worker.createJob({
                name: 'db',
                model: 'intervention',
                method: 'telMatches',
                req: _.pick(req, 'body', 'session')
            }).then(function(resp) {
                io.sockets.emit('telephoneMatch', resp);
                res.send('ok')
            })
        }
        return new Promise(function(resolve, reject) {

            var q = req.body.q.split('\n');
            q = _.map(q, function(e) {
                return {
                    origin: e.split('\t')[0].replace('33', '0'),
                    client: e.split('\t')[1].replace('33', '0')
                }
            })
            q = _.filter(q, function(e) {
                return e.client.length == 10;
            })
            q = _.groupBy(q, 'origin');
            //console.log(q)
            var artn = [];
            var i = 0;
            async.each(q, function(e, cb) {
                var query = {
                    $or: []
                };
                _.each(_.pluck(e, 'client'), function(tel) {
                    if (!tel) {
                        return 0
                    }
                    query.$or.push(
                        getIn('client.telephone.origine', tel)
                        /* $or: [
                             getIn('client.telephone.tel1', tel),
                             getIn('client.telephone.tel2', tel),
                             getIn('client.telephone.tel3', tel),
                             getIn('client.telephone.origine', tel),
                             getIn('client.telephone.appel', tel),
                         ]*/
                    )
                });
                db.model('intervention').find(query, {
                    id: true,
                    status: true,
                    prixAnnonce: true,
                    prixFinal: true,
                    'compta.reglement.recu': true
                }, function(err, resp) {
                    var rtn = _.map(resp, function(e) {
                        return {
                            id: e.id,
                            prix: (e.prixFinal ||  e.prixAnnonce ||  0),
                            status: e.status,
                            paiementRecu: e.compta.reglement.recu
                        }
                    })
                    console.log('-->', e[0].origin, ++i, q.length)
                    var st = {
                        ligne: e[0].origin,
                        ANN: reduce(rtn, {
                            'status': 'ANN'
                        }),
                        ENC: reduce(rtn, {
                            'status': 'ENC'
                        }),
                        VRF: reduce(rtn, {
                            'status': 'VRF'
                        }),
                        PAY: reduce(rtn, {
                            paiementRecu: true
                        }),
                        list: _.pluck(rtn, 'id').join(','),
                        calls: e.length
                    }
                    artn.push(st)
                        // nbr appel
                        // nbr interventions
                        // sum en cours / annule / vrf // paye
                        // 
                        /*  console.log(st)
                          artn.push({
                              origin: e[0].origin,
                              calls: rtn,
                              st: st
                          })*/
                    cb(null);
                })

                //            cb('null, e')
            }, function(err, resp) {

                return resolve(artn)
                    //console.log(err, resp)
            })
        })


        return 0




        //var q = req.body.q.split('\n')
        console.log(q);


        var query = {
            $or: []
        };

        _.each(q, function(tel) {
            if (!tel) {
                return 0
            }
            query.$or.push({
                $or: [
                    getIn('client.telephone.tel1', tel),
                    getIn('client.telephone.tel2', tel),
                    getIn('client.telephone.tel3', tel),
                    getIn('client.telephone.origine', tel),
                    getIn('client.telephone.appel', tel),
                ]
            })
        });
        db.model('intervention').find(query, {
            id: true
        }).exec(function(err, resp) {
            console.log(err, resp)
            if (err) {
                return res.status.send("nope")
            }
            var rtn = _.pluck(resp, 'id');
            res.json(rtn)
        })
    }
}
