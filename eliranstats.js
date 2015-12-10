require('./server/shared')()
var _ = require('lodash')
try {
    db.model('intervention').find({
        status: 'ANN',
        'date.ajout': {
            $gt: new Date(2015, 0, 0)
        }
    }).then(function(resp) {
        // console.log('-->', )
        resp = _.groupBy(resp, function(e) {
            return e.client.address.v + '-' + e.categorie;
        });
        _.each(resp, function(e, k) {
            var sum = _.reduce(e, function(total, x) {
                //console.log(total, x)
                return total + x.prixAnnonce;
            }, 0);
            console.log([k, e.length,sum, e[0].client.address.cp].join(';'))
        })
        process.exit()
    }, function(err) {
        console.log(err);
    })

} catch (e) {
    console.log('->', e)
}
/*

var sumCount = function(query) {
    query['artisan.id'] = artisan.id;
    var q = db.model('intervention').aggregate([{
        $match: query
    }, {
        $group: {
            _id: {
                // week: '$date.intervention'
            },
            mnt: {
                $sum: "$prixAnnonce"
            },
            fnl: {
                $sum: "$prixAnnonce"
            },
            px: {
                $sum: "$compta.paiement.montant"
            },
            total: {
                $sum: 1
            }
        }
    }, {
        $project: {
            _id: 0,
            total: 1,
            paye: db.utils.round("$px"),
            'final': db.utils.round("$fnl"),
            montant: db.utils.round("$mnt")
        }
    }])
    return q.exec.bind(q);
}
*/
