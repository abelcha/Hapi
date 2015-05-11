module.exports = function(schema) {

  schema.statics.stats = function(id, req, res) {
    return new Promise(function(resolve, reject) {
      var sumCount = function(query) {
        query['artisan.id'] = parseInt(id);
        var q = npm.mongoose.model('intervention').aggregate([{
          $match: query
        }, {
          $group: {
            _id: {
              // week: '$date.intervention'
            },
            mnt: {
              $sum: "$prixAnnonce"
            },
            total: {
              $sum: 1
            }
          }
        }, {
          $project: {
            _id: 0,
            total: 1,
            montant: {
              $divide: [{
                  $subtract: [{
                    $multiply: ['$mnt', 100]
                  }, {
                    $mod: [{
                      $multiply: ['$mnt', 100]
                    }, 1]
                  }]
                },
                100
              ]
            }
          }
        }])
        return q.exec.bind(q);
      }

      var lastMonth = new Date(Date.now() - (28 * 24 * 60 * 60 * 1000));
      npm.async.parallel({
          total: sumCount({}),
          annule: sumCount({
            status: 'ANN'
          }),
          intervenu: sumCount({
            status: 'INT'
          }),
          enCours: sumCount({
            status: 'ENC'
          }),
          impayeUrgent: sumCount({
            status: 'INT',
            'date.intervention': {
              $lte: lastMonth
            },
            'date.paiementCLI': {
              $exists: false
            }
          }),
          aVerifier: sumCount({
            status: 'ENC',
            'date.intervention': {
              $lte: new Date()
            },
          }),
          impaye: sumCount({
            status: 'INT',
            'date.paiementCLI': {
              $exists: false
            }
          }),
          paye: sumCount({
            'date.paiementCLI': {
              $exists: true
            }
          })
        },
        function(err, results) {
          if (err)
            return reject(err);
          resolve(_.mapValues(results, function(e) {
            return e.length ? e[0] : {
              total: 0,
              montant: 0
            };
          }));
        });

    })
  };
}
