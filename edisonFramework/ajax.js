module.exports = {
  setSessionData: function(req, res) {
  	//return res.send(400, "ope")
    try {
      JSON.parse(req.query.tabContainer);
      req.session.tabContainer = req.query.tabContainer;
      res.sendStatus(200);
    } catch (e) {
      res.send(400, "Invalid JSON tabcontainer");
    }
  },
  getSessionData: function(req, res) {
    if (req.session.tabContainer && req.session.tabContainer.length > 2) {
      res.json(JSON.parse(req.session.tabContainer))
    } else {
      res.send(410, "Session has no tabContainer");
    }
  }
}
