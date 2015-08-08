module.exports = function(schema) {
    var creditcard = require('creditcard');
    var key = requireLocal('config/_keys');
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

    var upper = function(str) {
        return str ? str.toUpperCase() : str;
    }


    schema.pre('save', function(next, b, c) {
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

    });

    schema.post('save', function(doc) {
        if (!isWorker) {
            if (doc.artisan.id) {
                console.log('artisan reload')
                db.model('artisan').findOne({
                    id: doc.artisan.id
                }).then(function(sst) {
                    sst.save().then();
                })
                db.model('intervention').cacheActualise(doc);
                redis.del('interventionStats');
            }
        }
    })
}
