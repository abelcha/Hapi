module.exports = function(schema) {

    schema.pre('save', function(next) {
        var _this = this;
        console.log("reload save")
        if (_this.status == 'POT') {
            db.model('intervention').findOne({
                'artisan.id': _this.id
            }).then(function(doc) {
                if (doc) {
                    _this.status = "ACT";
                }
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
