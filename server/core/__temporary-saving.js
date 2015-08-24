module.exports = function(core) {

    return function(req, res) {
        if (req.body.tmpID) {
            var key = core.redisTemporarySaving(req.body.tmpID).envify();
            redis.setex(key, 600, JSON.stringify(req.body), function() {
                console.log("set", key);
                res.send('ok')
            });
        } else if (req.query.id) {
            var key = core.redisTemporarySaving(req.query.id).envify()
            redis.get(key, function(err, resp) {
                if (!err && resp) {
                    console.log('ok saved', key)
                    res.json(JSON.parse(resp))
                } else {
                    console.log('default doc', key)

                    res.json(core.defaultDoc(parseInt(req.query.id) || Date.now()))
                }
            });
        } else {
            console.log('bad request', key)
            res.status(400).send('bad request')
        }
    }
}
