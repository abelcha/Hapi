module.exports = {
    whoAmI: function(req, res) {
        var rtn = req.session.d;
        rtn.tabContainer = undefined;
        res.json(rtn);
    },
    setSessionData: function(req, res) {
        try {
            JSON.parse(req.query.tabContainer);
            req.session.tabContainer = req.query.tabContainer;
            res.sendStatus(200);
        } catch (e) {
            res.send(400, "Invalid JSON tabcontainer");
        }
    },
    getSessionData: function(req, res) {
        return res.sendStatus(500);
        if (req.session.tabContainer && req.session.tabContainer.length > 2) {
            res.json(JSON.parse(req.session.tabContainer))
        } else {
            res.status(410).send("Session has no tabContainer");
        }
    },
    ping: function(req, res) {
        res.send("ok");
    },
    mapGetDistance: function(req, res) {
        return edison.map.getDistance(req, res);
    },
    mapGetStatic: function(req, res) {
        return edison.map.getStaticDirections(req, res);
    },
    memory: function(req, res) {
        var prettyBytes = require('pretty-bytes');
        var _ = require('lodash')
        var u = process.memoryUsage();
        u = _.map(u, prettyBytes);
        console.log(u)
        res.send('ok')
    }

}
