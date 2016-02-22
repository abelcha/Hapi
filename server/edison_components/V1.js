module.exports = {
    set: function(query, cb) {
        cb = cb || function() {}
        var key = requireLocal('config/_keys');
        var request = require('request');
        request.get({
            url: 'http://electricien13003.com/alvin/query.php',
            qs: {
                q: query,
                key: key.alvin.pass
            }
        }, function(err, resp, body) {
            if (resp && resp.statusCode === 200) {
                cb(null, parseInt(body));
            } else {
                cb(body || 'ERR')
            }
        })
    },
    get: function(query, cb) {
        cb = cb || function() {}
        var key = requireLocal('config/_keys');
        var request = require('request');
        console.log(url, query, key.alvin.pass)
        request.get({
            url: 'http://electricien13003.com/alvin/query.php',
            qs: {
                q: query,
                key: key.alvin.pass
            }
        }, function(err, resp, body) {
            if (resp && resp.statusCode === 200) {
                try {
                    resp.parsedResponse = JSON.parse(body)
                    cb(null, resp.parsedResponse);
                } catch (e) {
                    __catch(e);
                }
            } else {
                cb(body || 'ERR')
            }
        })
    }
}
