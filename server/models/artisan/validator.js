module.exports = function(schema) {

    var getSubStatus = function() {
        var _ = require('lodash');
        var d = this.document;
        if (this.status === "POT" && _.get(d.contrat.file) && _.get(d.cni.file) && _.get(d.kbis.file)) {
            this.subStatus = 'HOT';
        }
        if (this.nbrIntervention < 5 && this.nbrIntervention > 0) {
            this.subStatus = "NEW";
        }
        if (this.nbrIntervention > 15) {
            this.subStatus = "REG";
        }
    }


    schema.pre('save', function(next) {
        var _this = this;
        if (_this.status !== 'ARC') {
            db.model("intervention").find({
                'artisan.id': _this.id
            }).then(function(docs) {
                _this.nbrIntervention = docs.length;
                _this.status = docs.length ? "ACT" : "POT";
                getSubStatus.bind(_this)();
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
