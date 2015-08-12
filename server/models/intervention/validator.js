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

    var preSave = function(next) {
        this.sst = this.artisan.id
        if (isWorker) {
            return next();
        }

        if (this.cb.number) {
            if (!creditcard.validate(this.cb.number))
                return next(new Error('Numero de carte invalide'))
            this.cb = {
                hash: encryptor.encrypt(JSON.stringify(this.cb)),
                preview: "**** ".repeat(3) + this.cb.number.slice(-4)
            }
        }
        next();

    }

    var postSave = function(doc) {
        console.log('save')
        if (!isWorker) {
            if (doc.artisan.id) {
                db.model('artisan').findOne({
                    id: doc.artisan.id
                }).then(function(sst) {
                    sst.save().then();
                })
            }
            redis.del('interventionStats');
            db.model('intervention').cacheActualise(doc);
            if (envProd) {
                var v1 = new V1(doc);
                v1.send(function(resp) {
                    console.log('=====-->', resp)
                });
            }
        }
    }

    schema.pre('save', function(next) {
        preSave.bind(this)(next)
    });


    schema.post('save', postSave)

    schema.pre('findOneAndUpdate', function(next) {
        preSave.bind(this)(next)
    });


    schema.post('findOneAndUpdate', postSave)
}
