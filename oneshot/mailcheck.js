
global.requireLocal = function(pth) {
    return require(process.cwd() + '/' + pth)
}

var request = require('request');

global.db = require(process.cwd() + '/server/edison_components/db.js')()

var _ = require('lodash');
var moment = require('moment')

db.model('devis').find({}, {
        email: true
    })
    .exec(function(err, resp) {
        _.each(resp, function(e) {
            console.log(e.client.mail)
        })
    })
