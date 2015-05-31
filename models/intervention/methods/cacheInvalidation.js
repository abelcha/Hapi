'use strict';
var async = require("async");
var ms = require('milliseconds');
var _ = require("lodash")
module.exports = function(schema) {

    var selectedFields = [
        '-_id',
        'id',
        'login',
        'status',
        'client.civilite',
        'client.nom',
        'client.address',
        'categorie',
        'prixAnnonce',
        'artisan',
        'reglementSurPlace',
        'date.intervention',
        'date.ajout'
    ].join(' ');


    var getFltr = function(inter, dateInter) {
        var now = Date.now();
        var fltr = {};

        if (inter.status === 'AVR') {
            fltr.avr = 1;
            if (now > dateInter + ms.hours(1)) {
                fltr.avr = 1;
                if (now > dateInter + ms.weeks(1)) {
                    fltr.Uavr = 1;
                }
            }
        }
        if (inter.status.startsWith('ATT') && !inter.date.paiementCLI && now > dateInter + ms.weeks(1)) {
            if (inter.reglementSurPlace) {
                fltr.sarl = 1;
            } else {
                fltr.carl = 1;
            }
            if (now > dateInter + ms.months(1)) {
                if (inter.reglementSurPlace) {
                    fltr.Usarl = 1;
                } else {
                    fltr.Ucarl = 1
                }
            }
        }
        if (inter.status === 'APR') {
            fltr.apr = 1;
        }
        return fltr;
    }


    var translate = function(e) {
        //console.log(e.id);
        //console.log(e.status)
        var dateInter = (new Date(e.date.intervention)).getTime();
        if (e.status === "ENV" && Date.now() > dateInter) {
            e.status = 'AVR';
        }
        if (e.status === 'ATT')
            e.status += (e.reglementSurPlace ? 'S' : 'C');
        return {
            fltr: getFltr(e, dateInter),
            t: e.login.ajout,
            id: e.id,
            ai: e.artisan.id,
            s: edison.config.etatsKV[e.status].n,
            sx: edison.config.etatsKV[e.status].c,
            c: edison.config.categoriesKV[e.categorie].n,
            cx: edison.config.categoriesKV[e.categorie].c,
            n: e.client.civilite + ' ' + e.client.nom,
            a: e.artisan.nomSociete ||  "",
            pa: e.prixAnnonce,
            da: e.date.ajout,
            di: e.date.intervention,
            ad: e.client.address.cp + ', ' + e.client.address.v
        };
    }
    schema.statics.translate = translate;
    schema.statics.cacheActualise = function(doc) {
        redis.get("interventionList", function(err, reply) {
            if (!err && reply) {
                var data = JSON.parse(reply);
                var index = _.findIndex(data, function(e, i) {
                    return e.id === doc.id;
                })

                var result = translate(doc)
                if (index !== -1) {
                    data[index] = result;
                } else {
                    data.unshift(result);
                }
                redis.set("interventionList", JSON.stringify(data));
                io.sockets.emit('interventionListChange', result);
            }
        });

    }

    schema.statics.cacheReload = function() {
        return new Promise(function(resolve, reject) {
            db.model('intervention').find().sort('-id').select(selectedFields).then(function(docs) {
                var result = docs.map(translate)
                redis.set("interventionList", JSON.stringify(result), function() {
                    resolve(result);
                })
            }, function(err) {});
        });
    }
}
