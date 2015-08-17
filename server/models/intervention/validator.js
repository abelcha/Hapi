module.exports = function(schema) {
    var creditcard = require('creditcard');
    var key = requireLocal('config/_keys');
    var V1 = requireLocal('config/_convert_V1');
    var encryptor = require('simple-encryptor')(key.salt);
    var _ = require('lodash')

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

    var upperCaseEverything = function(options) {
        var _this = this;
        var obj = options || this.options;
        _.each(obj, function(e, k) {
            if (typeof e === 'string') {
                obj[k] = e.toUpperCase();
            }
        })

    }


    var preSave = function(next) {
        var _this = this;
        try {
            upperCaseEverything(this.client.address)
            upperCaseEverything(this.facture)
            upperCaseEverything([this.facture])
            _this.sst = _this.artisan.id
            _this.enDemarchage = _this.login.demarchage;
            _this.litigesEnCours = _.find(_this.litiges, 'regle', false);
            _this.savEnCours = _.find(_this.sav, 'status', 'ENC');
            _this.cache = db.model('intervention').cachify(_this);
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

    var postSave = function(doc) {
        if (!isWorker) {
            if (doc.artisan.id) {
                db.model('artisan').findOne({
                    id: doc.artisan.id
                }).then(function(sst) {
                    sst.save().then();
                })
            }
            //redis.del('interventionStats');
            db.model('intervention').cacheActualise(doc);
            if (envProd) {
                var v1 = new V1(doc);
                v1.send(function(resp) {
                    console.log(resp)
                });
            }
        }

    }

    schema.pre('save', function(next) {
        preSave.bind(this)(next)
    });


    schema.post('save', postSave)

    schema.post('findOneAndUpdate', postSave)
}
