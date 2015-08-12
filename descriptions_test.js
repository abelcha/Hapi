global.requireLocal = function(pth) {
    return require(process.cwd() + '/' + pth)
}
var request = require('request');
global.db = require(process.cwd() + '/server/edison_components/db.js')()
var _ = require('lodash');

db.model('intervention')
    .aggregate()
    .group({
        _id: {
            desc: '$description'
        },
        total: {
            $sum: 1
        },
    })
    .sort({
        'desc': 1
    }).match({
        total: {
            $lt: 10,
            $gte:7
        }
    })
    .exec(function(err, docs) {
       docs =  _.map(docs, function(e) {
            return e._id.desc
        })
        console.log(err, docs)
        process.exit()
    })
