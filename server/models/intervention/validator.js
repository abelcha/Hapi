module.exports = function(schema) {
    var creditcard = require('creditcard');
    var key = requireLocal('config/_keys');
    var V1 = requireLocal('config/_convert_V1');
    var encryptor = require('simple-encryptor')(key.salt);
    var _ = require('lodash')
    var moment = require('moment');
    /* M.|Me|Soc. */
    /*    schema.path('client.civilite').validate(function(value) {
            return /M\.|Mme|Soc\./i.test(value);
        }, 'Civilité inconnu.');*/


    /* CARTE BANCAIRE | CHEQUE | CASH */
    /*    schema.path('modeReglement').validate(function(value) {
            return /CB|CH|CA/i.test(value);
        }, 'Mode de reglement inconnu.');
    */


    /*CARRELAGE|MENUISERIE|MACONNERIE|PEINTURE|PLOMBERIE|SERRURERIE|CLIMATISATION|CHAUFFAGE|VITRERIE|ELECTRICITE|ASSAINISSEMENT*/
    /*  schema.path('categorie').validate(function(value) {
          return /CR|MN|MC|PT|PL|SR|CL|CH|VT|EL|AS/i.test(value);
      }, 'Categorie inconnue.');*/

    var UP = function(obj) {
        if (obj) {
            _.each(obj, function(e, k) {
                if (typeof e === 'string')
                    obj[k] = obj[k].toUpperCase();
            })
        }
    }



    var validatorPreSave = function(next) {
        var _this = this;

        try {
            UP(this.facture.address)
            UP(this.facture)
            UP(this.client.address)
            _this.sst = _this.artisan.id
            _this.enDemarchage = _this.login.demarchage;
            _this.litigesEnCours = _.find(_this.litiges, 'regle', false);
            _this.savEnCours = _.find(_this.sav, 'status', 'ENC');
            _this.cache = db.model('intervention').Core.minify(_this);
            if (isWorker) {
                return next();
            }
            if (_this.cb.number) {
                if (!creditcard.validate(_this.cb.number))
                    return next(new Error('Numero de carte invalide'))
                _this.cb = {
                    hash: encryptor.encrypt(JSON.stringify(_this.cb)),
                    preview: "**** ".repeat(3) + _this.cb.number.slice(-4)
                }
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
            if (doc.artisan.id) {
                db.model('artisan').findOne({
                    id: doc.artisan.id
                }).then(function(sst) {
                    if (sst) {
                        sst.date.dump = Date.now();
                        sst.save().then();
                    }
                })
            }
            db.model('intervention').uniqueCacheReload(doc)
            console.log(envProd, (!doc.date.dump || moment().subtract(5000).isAfter(doc.date.dump)))
            if (envProd && (!doc.date.dump || moment().subtract(5000).isAfter(doc.date.dump))) {
                var v1 = new V1(doc);
                v1.send(function(resp) {
                    console.log(resp)
                });
            }
        }

    }

    schema.pre('save', function(next) {
        validatorPreSave.bind(this)(next)
    });


    schema.post('save', validatorPostSave)

    schema.post('findOneAndUpdate', validatorPostSave)
}
