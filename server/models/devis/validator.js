module.exports = function(schema) {
    var _ = require('lodash')
    var moment = require('moment')
    var V1 = requireLocal('config/_convert_V1');
    var upper = function(str) {
        return str ? str.toUpperCase() : str;
    }

    var upperCaseEverything = function(options) {
        var _this = this;
        var obj = options || this.options;
        _.each(obj, function(e, k) {
            if (typeof e === 'string') {
                obj[k] = e.toUpperCase();
            }
        })

    }

    var validatorPreSave = function(next) {
        var _this = this;
        try {
            upperCaseEverything(this.client.address)
            _this.prixAnnonce = _.sum(_this.produits, function(e) {
                return e.pu * e.quantite;
            });
            _this.cache = db.model('devis').Core.minify(_this);
            if (isWorker) {
                return next();
            }
        } catch (e) {
            __catch(e)
        }
        next();

    }

    var validatorPostSave = function(doc) {
        if (!doc.client.address.lt) {
            db.model('intervention').geolocateAddress(doc);
        }
        if (!isWorker) {
            db.model('devis').uniqueCacheReload(doc, function() {
                console.log(envProd, (!doc.date.dump || moment().subtract(5000).isAfter(doc.date.dump)))
                if (envProd && (!doc.date.dump || moment().subtract(5000).isAfter(doc.date.dump))) {
                    var v1 = new V1(doc);
                    v1.send(function(resp) {
                        console.log(resp)
                    });
                }
            });
        }

    }

    schema.pre('save', function(next) {
        validatorPreSave.bind(this)(next)
    });


    schema.post('save', validatorPostSave)

    schema.post('findOneAndUpdate', validatorPostSave)


    /*
        schema.pre('save', function(next) {
            this.prixAnnonce = _reduce(this.produits, function(result, n, key) {
                if (key === 1)
                    result = result.pu
                return result + n.pu;
            });
            this.cache = db.model('intervention').Core.minify(_this);
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
                console.log("DEVIS", envProd, (!doc.date.dump || moment().subtract(5000).isAfter(doc.date.dump)))
                if (envProd && (!doc.date.dump || moment().subtract(5000).isAfter(doc.date.dump))) {
                    console.log('v1 translate' + doc.id);
                    var v1 = new V1(doc, true);
                    v1.send(function(resp) {
                        console.log('=====-->', resp)
                    });
                }
            }
        })
    */
}
