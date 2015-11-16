module.exports = function(schema) {
    var V1 = requireLocal('config/_convert_artisan_V1.js');
    var moment = require('moment');

    var getSubStatus = function(sst) {
        var _ = require('lodash');
        var d = sst.document;
        if (sst.quarantained) {
            return 'QUA';
        }
        if (sst.tutelle) {
            return 'TUT';
        }
        if (sst.status === "POT" && _.get(d.contrat, 'ok') && _.get(d.cni, 'ok') && _.get(d.kbis, 'ok')) {
            return 'HOT';
        }
        console.log(sst.nbrIntervention)
        if (_.inRange(sst.nbrIntervention, 1, 3)) {
            return "NEW";
        }
        if (_.inRange(sst.nbrIntervention, 3, 6)) {
            return "FORM";
        }
        if (_.inRange(sst.nbrIntervention, 6, 16)) {
            return "CONF";
        }
        if (sst.nbrIntervention > 15) {
            return "REG"
        }
    }


    schema.pre('save', function(next) {
        var _this = this;
        _this.loc = [_this.address.lt, _this.address.lg]
        if (_this.status !== 'ARC') {

            var async = require('async');
            async.parallel({
                nbrIntervention: function(cb) {
                    db.model("intervention").count({
                        'artisan.id': _this.id,
                        'reglementSurPlace': true,
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
                },
                checkDoublons: function(cb) {
                    db.model('artisan').count({
                        $or: [{
                            'telephone.tel1': _this.telephone.tel1
                        }, {
                            'email': _this.email
                        }]
                    }).count(cb)
                }
            }, function(err, result) {
                /*console.log('CHECK-->', result.checkDoublons)
                if (result.checkDoublons) {
                    console.log('yaay here')
                    return next({lol:"Le sous-traitant est deja dans la base"})
                }*/
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
