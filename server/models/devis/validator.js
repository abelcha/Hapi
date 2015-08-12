module.exports = function(schema) {
    var _reduce = require('lodash/collection/reduce')
    var V1 = requireLocal('config/_convert_V1');
    var upper = function(str) {
        return str ? str.toUpperCase() : str;
    }


    schema.pre('save', function(next) {
        this.prixAnnonce = _reduce(this.produits, function(result, n, key) {
            if (key === 1)
                result = result.pu
            return result + n.pu;
        });
        this.client.nom = upper(this.client.nom)
        this.client.prenom = upper(this.client.prenom)
        this.client.email = upper(this.client.email)
        this.client.address.n = upper(this.client.address.n)
        this.client.address.r = upper(this.client.address.r)
        this.client.address.v = upper(this.client.address.v)
        next();
    });


    schema.post('save', function(doc) {
        if (!isWorker) {
            redis.del('interventionStats');
            db.model('devis').cacheActualise(doc);
            if (envProd ||  envDev) {
                console.log('v1 translate' + doc.id);
                var v1 = new V1(doc, true);
                v1.send(function(resp) {
                    console.log('=====-->', resp)
                });
            }
        }
    })

}
