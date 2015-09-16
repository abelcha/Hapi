global.requireLocal = function(pth) {
    return require(process.cwd() + '/' + pth)
}

var request = require('request');

global.db = require(process.cwd() + '/server/edison_components/db.js')()

var _ = require('lodash');
var moment = require('moment')

var V1 = requireLocal('config/_artisan_convert_v1');
var id = _.random(0, 1000);
db.model('artisan').findOne({
        id: id
    })
    .exec(function(err, resp) {
        if (!err && resp) {
            var lol = new V1(resp);
            console.log('OK')
            request.get('http://electricien13003.com/alvin/dumpOneArtisan.php?id=' + id, function(err, resp, body) {
                if (!err) {
                    lol.compare(JSON.parse(body));
                }
                process.exit();
            })
        } else {
            console.log('nope')
            process.exit(' noper')
        }

    })
