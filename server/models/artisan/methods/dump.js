var request = require('request');
var key = requireLocal('config/_keys');
var _ = require('lodash')
var config = requireLocal('config/dataList');
var users = requireLocal('config/_users');


module.exports = function(schema) {

    var translateModel = function(d) {

        var rtn = {
            _id: d.id,
            id: d.id,
            nomSociete: d.nom_societe,
            categories: [],
            email: d.email || "test@test.me",
            login: {
                ajout: _.get(getUser(d.ajoute_par), 'login') || "yohann_r"
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
            origin: d.candidat_sst === void(0) || d.candidat_sst === "0" ? "DEM" : "CAND",
            historique: {},
            siret: d.siret || undefined,
            loc: [parseFloat(d.lat), parseFloat(d.lng)],
        };


        if (d.num_facturier) {
            rtn.historique.facturier = [{
                text: d.num_facturier,
                login: 'yohann_r'
            }]
        }
        if (d.num_deviseur) {
            rtn.historique.deviseur = [{
                text: d.num_deviseur,
                login: 'yohann_r'
            }]
        }
        if (d.date_envoi_contrat) {
            var months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "aout", "septembre", "octobre", "novembre", "décembre"]
            var x = d.date_envoi_contrat.split(' ');
            rtn.historique.contrat = [{
                date: new Date(parseInt(x[5]), months.indexOf(x[4]), parseInt(x[3])),
                text: d.date_envoi_contrat,
                login: 'yohann_r',
                signe: true
            }]
        }



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
        var path = require("path")
        rtn.document = {};
        _.each(config.artisanFiles, function(file) {
            if (d[file]) {
                rtn.document[file] = {
                    extension: path.extname(d[file]),
                    file: d[file],
                    date: rtn.date.ajout,
                    login: 'yohann_r'
                }
            }
        })
        rtn.comments = [];
        _.each(d.coms, function(e) {
            rtn.comments.push({
                login: e.ajoute_par,
                date: new Date(parseInt(e.t_stamp * 1000)),
                text: e.comment
            })
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

    var getUser = function(oldLogin) {
        return _.find(users, function(e) {
            return e.oldLogin === oldLogin;
        })
    }

    var execDump = function(limit) {
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

    schema.statics.workerDump = function(limit) {
        return execDump(limit)
    }

    schema.statics.dump = function(req, res) {
        var limit = req.query.limit ||  0;
        if ((envDev || envProd) && !isWorker) {
            return edison.worker.createJob({
                name: 'db',
                model: 'artisan',
                method: 'workerDump',
                arg: limit
            })
        } else {
            return execDump(limit);
        }
    }
}
