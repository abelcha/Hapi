module.exports = function(schema) {
    var moment = require('moment')
    var _ = require('lodash')
    schema.statics.statsBen = function(req, res) {
        return new Promise(function(resolve, reject) {
            var getMonthRange = function(m, y) {
                var date = new Date(y, m);
                return {
                    $gte: new Date(date.getFullYear(), date.getMonth(), 1, -1),
                    $lt: new Date(date.getFullYear(), date.getMonth() + 1, 0)
                }
            }
            var dateRange = getMonthRange('7', '2015')
            console.log('->', dateRange)
            db.model('intervention').aggregate()
                .match({
                    'date.ajout': dateRange,
                    'status': {
                        $in: ['ENC', 'VRF']
                    }
                })
                .project({
                    day: {
                        $dayOfMonth: "$date.ajout",
                    },
                    recu: '$compta.reglement.recu',
                    prixFinal: "$prixFinal",
                    prixAnnonce: "$prixAnnonce",
                }).exec(function(err, resp) {
                    if (err) {
                        reject(err);
                    }
                    console.log(resp);
                    resp = _.map(resp, function(e) {
                        return {
                            prix: e.prixFinal ||  e.prixAnnonce ||  0,
                            day: e.day,
                            recu: e.recu ? 'Encaissé' : 'En Attente'
                        }
                    })
                    _.times(31, function(i) {
                    //    console.log('-->', i)
                        resp.push({
                            day: i + 1,
                            prix: 0,
                            recu:'En Attente'
                        })
                    })
                  //  console.log(resp)
                    resolve(resp);
                    // console.log(err, resp);
                })
                /*  db.model(model ||  'intervention')
                      .aggregate()
                      .match({

                      })
                      .group({
                          _id: {
                              telepro: customGroup || '$login.ajout'
                          },
                          mnt: {
                              $sum: "$prixAnnonce"
                          },
                          total: {
                              $sum: 1
                          }
                      })
                      .project({
                          _id: 1,
                          name: '$_id.st',
                          login: '$_id.telepro',
                          total: 1,
                          montant: db.utils.round("$mnt")
                      }).exec(cb);*/
        })
    }
}
