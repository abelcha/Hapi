module.exports = function(schema) {
    var creditcard = require('creditcard');
    var key = requireLocal('config/_keys');
    var encryptor = require('simple-encryptor')(key.salt);


    /* M.|Me|Soc. */
    schema.path('client.civilite').validate(function(value) {
        return /M\.|Mme|Soc\./i.test(value);
    }, 'Civilité inconnu.');


    /* CARTE BANCAIRE | CHEQUE | CASH */
    schema.path('modeReglement').validate(function(value) {
        return /CB|CH|CA/i.test(value);
    }, 'Mode de reglement inconnu.');



    /*CARRELAGE|MENUISERIE|MACONNERIE|PEINTURE|PLOMBERIE|SERRURERIE|CLIMATISATION|CHAUFFAGE|VITRERIE|ELECTRICITE|ASSAINISSEMENT*/
    schema.path('categorie').validate(function(value) {
        return /CR|MN|MC|PT|PL|SR|CL|CH|VT|EL|AS/i.test(value);
    }, 'Categorie inconnue.');

    var upper = function(str) {
        return str ? str.toUpperCase() : str;
    }


    schema.pre('save', function(next) {
        this.client.nom = upper(this.client.nom)
        this.client.prenom = upper(this.client.prenom)
        this.client.email = upper(this.client.email)
        this.client.address.n = upper(this.client.address.n)
        this.client.address.r = upper(this.client.address.r)
        this.client.address.v = upper(this.client.address.v)
        redis.del('interventionStats');
        if (this.cb.number) {
            if (!creditcard.validate(this.cb.number))
                return next(new Error('Numero de carte invalide'))
            this.cb = {
                hash: encryptor.encrypt(JSON.stringify(this.cb)),
                preview: "**** ".repeat(3) + this.cb.number.slice(-4)
            }
        }
        return next();
    });

    schema.post('save', function(doc) {
        if (!isWorker) {
            console.log("cacheactualise")
            db.model('intervention').cacheActualise(doc);
        }
    })
}
