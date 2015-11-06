module.exports = function(schema) {
    var V1 = requireLocal('config/_convert_artisan_V1.js');
    var moment = require('moment');

    var getSubStatus = function(sst) {
        var _ = require('lodash');
        var d = sst.document;
        if (sst.quarantained) {
            return 'QUA';
        }
        if (sst.status === "POT" && _.get(d.contrat, 'ok') && _.get(d.cni, 'ok') && _.get(d.kbis, 'ok')) {
            return 'HOT';
        }
        if ((sst.nbrIntervention < 5 && sst.nbrIntervention > 0) && moment().add(-30, "days").isBefore(sst.date.ajout)) {
            return "NEW";
        }
        if (sst.nbrIntervention > 15) {
            return "REG";
        }
    }


    schema.pre('save', function(next) {
        console.log('SAVE')
        var _this = this;
        _this.loc = [_this.address.lt, _this.address.lg]
        if (_this.status !== 'ARC') {

            var async = require('async');
            async.parallel({
                nbrIntervention: function(cb) {
                    db.model("intervention").count({
                        'artisan.id': _this.id,
                        'status': {
                            $in: ['ENC', 'VRF']
                        }
                    }).count(cb)
                },
                quarantained: function(cb) {
                    db.model('signalement').count({
                        sst_id: _this.id,
                        level: '2',
                        ok: false
                    }).count(cb)
                }
            }, function(err, result) {
                _this.quarantained = result.quarantained;
                _this.nbrIntervention = result.nbrIntervention;
                _this.status = result.nbrIntervention ? "ACT" : "POT";
                _this.subStatus = getSubStatus(_this);
                _this.cache = db.model('artisan').Core.minify(_this);
                next();
            })

        } else {
            _this.subStatus = null;
            _this.cache = db.model('artisan').Core.minify(_this);
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
