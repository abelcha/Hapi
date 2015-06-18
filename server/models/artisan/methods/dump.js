var request = require('request');
var key = requireLocal('config/_keys');
var _ = require('lodash')
var config = requireLocal('config/dataList');

module.exports = function(schema) {

    var translateModel = function(d) {

        var rtn = {
            _id: d.id,
            id: d.id,
            nomSociete: d.nom_societe,
            categories: [],
            email: d.email,
            login: {
                ajout: d.ajoute_par || "yohann_r"
            },
            date: {
                ajout: d.date_ajout ? (d.date_ajout * 1000) : Date.now()
            },
            telephone: {
                tel1: d.tel1,
                tel2: d.tel2,
            },
            representant: {
                nom: d.nom_representant,
                prenom: d.prenom_representant,
                civilite: d.civilite ||  "M."
            },
            pourcentage: {
                deplacement: d.pourcentage_deplacement,
                maindOeuvre: d.pourcentage_main_d_oeuvre,
                fourniture: d.pourcentage_fourniture
            },
            zoneChalandise: d.zone_chalandise ? d.zone_chalandise.slice(0, -2) : 30,
            address: {
                n: d.numero,
                r: d.adresse,
                v: d.ville,
                cp: d.code_postal,
                lt: d.lat,
                lg: d.lng,
            },
            loc: [parseFloat(d.lat), parseFloat(d.lng)],
        };
        var fj = _.find(config.formeJuridiqueHash(), function(e) {
            return e.long_name.toUpperCase() === d.forme_juridique;
            //       console.log(e.long_name.toUpperCase(), d.forme_juridique)
        })
        rtn.formeJuridique = fj ? fj.short_name : 'AUT'
        if (d.archive === '1') {
            rtn.status = "ARC"
        }
        _.each(config.categories, function(e, k) {
            var cat = _.deburr(e.long_name).toLowerCase();
            if (d[cat] && d[cat] == 1) {
                rtn.categories.push(e.short_name);
            }
        })
        return rtn;
    }

    var addInDB = function(data, i, cb) {
        if (i >= data.length - 1)
            return cb(null)
        if (i % 100 === 0)
            console.log(((i / data.length) * 100).toFixed(2), '%')
        var artisan = db.model('artisan')(translateModel(data[i]));
        artisan.save(function(err) {
            if (err) {
                return cb({
                    id: artisan.id,
                    err: err
                });
            } else {
                addInDB(data, i + 1, cb);
            }
        });

    }

    schema.statics.dump = function(req, res) {
        var _this = this;
        var exit = false;
        var t = Date.now();

        return new Promise(function(resolve, reject) {
            var inters = [];
            db.model('artisan').remove({}, function() {
                request(key.alvin.url + "/dumpArtisan.php?key=" + key.alvin.pass, function(err, rest, body) {
                    var data = JSON.parse(body);
                    addInDB(data, 0, function(err) {
                        if (err)
                            return reject(err);
                        redis.expire("artisanList", 0)
                        return resolve({
                            status: 'OK',
                            time: (Date.now() - t) / 1000
                        });
                    });
                });
            });
        });
    }
}
