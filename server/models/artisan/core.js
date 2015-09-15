    var _ = require('lodash');
    module.exports = {
        name: 'artisan',
        Name: 'Artisan',
        NAME: 'ARTISAN',
        redisCacheListName: 'ARTISAN_CACHE_LIST',
        listChange: 'ARTISAN_CACHE_LIST_CHANGE'
    }

    module.exports.redisTemporarySaving = function(id) {
        return 'ARTISAN_TMP_SAVING___' + id;
    }
    module.exports.model = function() {
        return db.model('artisan');
    }

    module.exports.singleDumpUrl = function(id) {
        var key = requireLocal('config/_keys');
        // TODO
        return key.alvin.url + "/dumpArtisan.php?key=" + key.alvin.pass + '&id=' + id
    }

    module.exports.multiDumpUrl = function(limit) {
        var key = requireLocal('config/_keys');
        return key.alvin.url + "/dumpArtisan.php?key=" + key.alvin.pass + "&limit=" + (limit || 0)
    }


    module.exports.defaultDoc = function(timestamp) {
        return {
            origin: 'DEM',
            telephone: {},
            pourcentage: {
                deplacement: 50,
                maindOeuvre: 30,
                fourniture: 30
            },
            zoneChalandise: 30,
            address: {},
            categories: [],
            representant: {
                civilite: 'M.'
            },
        }
    }


    module.exports.minify = function(e) {
        var config = requireLocal('config/dataList')
        var d = requireLocal('config/dates.js')
        var ms = require('milliseconds')

        return {
            da: d(e.date.ajout),
            t: e.login.ajout,
            c: e.categories,
            id: e._id,
            n: e.nomSociete,
            r: e.representant.nom + " " + e.representant.prenom,
            s: e.status,
            cp: e.address.cp,
            v: e.address.v,
            x: e.telephone.tel1,
            cnd: e.origin === 'CAND' ? 1 : undefined,
        };
    }



    module.exports.preUpdate = function(prev, curr, session) {
        //    prev.historique = [];
        //  curr.historique = [];
    }

















    module.exports.toV2 = function(d) {

        var config = requireLocal('config/dataList');
        var users = requireLocal('config/_users');


        var getUser = function(oldLogin) {
            return _.find(users, function(e) {
                return e.oldLogin === oldLogin;
            })
        }




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
                deplacement: d.pourcentage_deplacement || 30,
                maindOeuvre: d.pourcentage_main_d_oeuvre || 30,
                fourniture: d.pourcentage_fourniture || 30
            },
            zoneChalandise: d.zone_chalandise ? d.zone_chalandise.slice(0, -2) : 30,
            address: {
                n: d.numero || "1",
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

        if (d.num_facturier || d.num_deviseur) {
            rtn.historique.pack = [{
                text: d.num_facturier,
                login: 'yohann_r',
                deviseur: d.num_deviseur,
                facturier: d.num_facturier,
            }]
        }
        if (d.date_envoi_contrat && d.date_envoi_contrat.length >= 8) {
            var months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "aout", "septembre", "octobre", "novembre", "décembre"]
            var x = d.date_envoi_contrat.split(' ');
            rtn.historique.contrat = [{
                date: new Date(parseInt(x[5]), months.indexOf(x[4]), parseInt(x[3]), 12),
                text: d.date_envoi_contrat,
                login: 'yohann_r',
                signe: x[8] !== 'NON'
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
