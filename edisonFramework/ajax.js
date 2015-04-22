module.exports = {
  setSessionData: function(req, res) {
    req.session.tabContainer = req.query.tabContainer;
    res.sendStatus(200);
  },
  getSessionData: function(req, res) {
  	res.json(JSON.parse(req.session.tabContainer))
  }
}
