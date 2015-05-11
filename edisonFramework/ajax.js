module.exports = {
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
    //return res.sendStatus(500);    
    if (req.session.tabContainer && req.session.tabContainer.length > 2) {
      res.json(JSON.parse(req.session.tabContainer))
    } else {
      res.status(410).send("Session has no tabContainer");
    }
  },
  ping: function(req, res) {
    res.send("ok");
  }
}
