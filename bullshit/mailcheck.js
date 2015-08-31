global.requireLocal = function(pth) {
    return require(process.cwd() + '/' + pth)
}
var co = require('co');
var validate = require('validate-email-dns');

var request = require('request');
global.db = require(process.cwd() + '/server/edison_components/db.js')()
var _ = require('lodash');
var async = require('async');
var moment = require('moment')

var i = 0;
db.model('devis').find({
/*        id: {
            $gt: 27085
        },*/
        'login.ajout': 'gregoire_e',
    }).limit(99).sort([['id', 'descending']])
    .exec(function(err, resp) {
     var x = resp.map(function(e) {
        return e.client.email;
     })
     console.log(x.join('\n'))
     /*   console.log(resp.length)
        async.each(resp, function(e, cb) {

            co.wrap(validate)(e.client.email).then(function(correct) {
                if (!correct) {
                    ++i;
                    console.log(i)
                    console.log('-->',e.login.ajout, e.id, e.client.email)
                } else {
                }
                cb(null)
            }, function() {
                console.log('errr');
                cb(null)
            });
        }, function() {
            console.log(i, resp.length)
            process.exit()
        })*/
    })
