module.exports = {
    search: function(req, res) {
        var Produits = require('edsx-api-produits');
        Produits.getByName(req.query.q, {
            limit: 10
        }, function(err, resp) {
        	if (err) {
        		return res.status(500).send('product search failure', err)
        	}
        	return res.jsonStr(resp)

        })
    }
}
