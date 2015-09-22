module.exports = function(schema) {
    var V1 = requireLocal('config/_convert_artisan_V1.js');
    var moment = require('moment');

    var getSubStatus = function(sst) {
        var _ = require('lodash');
        var d = sst.document;
        if (sst.status === "POT" && _.get(d.contrat.file) && _.get(d.cni.file) && _.get(d.kbis.file)) {
            return 'HOT';
        }
        if (sst.nbrIntervention < 5 && sst.nbrIntervention > 0) {
            return "NEW";
        }
        if (sst.nbrIntervention > 15) {
            return "REG";
        }
    }


    schema.pre('save', function(next) {
        var _this = this;
        _this.loc = [_this.address.lt, _this.address.lg]
        _this.cache = db.model('artisan').Core.minify(_this);
        if (_this.status !== 'ARC') {
            db.model("intervention").find({
                'artisan.id': _this.id
            }).then(function(docs) {
                _this.nbrIntervention = docs.length;
                _this.status = docs.length ? "ACT" : "POT";
                _this.subStatus = getSubStatus(_this);
                next();
            }, next)
        } else {
            next();
        }
    });
    schema.post('save', function(doc) {
        if (!isWorker) {
            db.model('artisan').uniqueCacheReload(doc)
        //    console.log(envProd, doc.date.dump, Date.now(), moment().subtract(5000).isAfter(doc.date.dump))
            if (envProd && (!doc.date.dump || moment().subtract(5000).isAfter(doc.date.dump))) {
                var v1 = new V1(doc);
                v1.send(function(resp) {
                    console.log(resp)
                });
            }
        }
    })
}
