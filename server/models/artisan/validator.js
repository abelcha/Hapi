module.exports = function(schema) {

    schema.pre('save', function(next) {
        var _this = this;
        if (_this.status !== 'ARC') {
            db.model("intervention").where({
                'artisan.id': _this.id
            }).count().then(function(nbr) {
                _this.nbrIntervention = nbr;
                _this.status = nbr ? "ACT" : "POT";
                next();
            }, next)
        } else {
            next();
        }
    });

    schema.post('save', function(doc) {
        if (!isWorker) {
            db.model('artisan').cacheActualise(doc);
            db.model('intervention').stats().then();
        }
    })
}
