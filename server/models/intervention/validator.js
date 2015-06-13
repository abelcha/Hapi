module.exports = function(schema) {
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


    schema.pre('save', function(next) {
        this.client.nom = this.client.nom.toUpperCase()
        this.client.prenom = this.client.prenom.toUpperCase()
        this.client.email = this.client.email.toUpperCase()
        this.client.address.n = this.client.address.n.toUpperCase()
        this.client.address.r = this.client.address.r.toUpperCase()
        this.client.address.v = this.client.address.v.toUpperCase()
        next();
    });

    schema.post('save', function(doc) {
        if (!isWorker) {
            setTimeout(function() {
                db.model('intervention').cacheActualise(doc);
            }, 100)
        }
    })
}
