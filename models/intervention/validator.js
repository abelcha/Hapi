module.exports = function(schema) {
    /* M.|Me|Soc. */
    schema.path('client.civilite').validate(function(value) {
        return /M\.|Mme|Soc\./i.test(value);
    }, 'Civilité inconnu.');


    /* CARTE BANCAIRE | CHEQUE | CASH */
    schema.path('modeReglement').validate(function(value) {
        return /CB|CH|CA/i.test(value);
    }, 'Mode de reglement inconnu.');



    /*CARRELAGE|MENUISERIE|MACONNERIE|PEINTURE|PLOMBERIE|SERRURERIE|CLIMATISATION|CHAUFFAGE|VITRERIE|ELECTRICITE */
    schema.path('categorie').validate(function(value) {
        return /CR|MN|MC|PT|PL|SR|CL|CH|VT|EL/i.test(value);
    }, 'Categorie inconnue.');

    schema.pre('save', function(next) {
        var _this = this;
        if (!_this.id) {
            db.model('intervention').findOne({}).sort("-id").exec(function(err, latestDoc) {
                _this.id = latestDoc.id + 1;
                next();
            });
        } else {
            next();
        }

        /*var err = new Error('something went wrong');
        next(err);
        */
    });

    schema.post('save', function(doc) {
        if (!isWorker)
            db.model('intervention').cacheActualise(doc.id);
    })
}
