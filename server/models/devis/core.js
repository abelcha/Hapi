    var _ = require('lodash');
    module.exports = {
        name: 'devis',
        Name: 'Devis',
        NAME: 'DEVIS',
        redisCacheListName: 'DEVIS_CACHE_LIST',
        listChange: 'DEVIS_CACHE_LIST_CHANGE'
    }

    module.exports.redisTemporarySaving = function(id) {
        return 'DEVIS_TMP_SAVING___' + id;
    }
    module.exports.model = function() {
        return db.model('devis');
    }

    module.exports.singleDumpUrl = function(id) {
        var key = requireLocal('config/_keys');
        return key.alvin.url + "/dumpIntervention.php?devis=true&id=" + id + "&key=" + key.alvin.pass;
    }

    module.exports.multiDumpUrl = function(limit) {
        var key = requireLocal('config/_keys');
        return key.alvin.url + "/dumpDevis.php?devis=true&limit=" + limit + "&key=" + key.alvin.pass
    }


    module.exports.defaultDoc = function(timestamp) {
        var ms = require('milliseconds')
        return {
            isDevis: true,
            produits: [],
            tva: 10,
            client: {
                civilite: 'M.'
            },
            date: {
                ajout: Date.now(),
            },
            historique: []
        }
    }


    module.exports.minify = function(e) {
        var config = requireLocal('config/dataList')
        var d = requireLocal('config/dates.js')
        var ms = require('milliseconds')

        return {
            da: d(e.date.ajout),
            t: e.login.ajout,
            c: e.categorie,
            cx: config.categories[e.categorie].long_name,
            id: e._id,
            n: e.client.civilite + " " + e.client.nom + ' ' + e.client.prenom,
            s: e.status,
            sx: config.etatsDevis[e.status].long_name,
            cp: e.client.address.cp,
            ad: e.client.address.v,
            ev: e.historique.length,
            pa: e.prixAnnonce,
        };
    }



    module.exports.preUpdate = function(prev, curr, session) {
        prev.historique = [];
        curr.historique = [];
    }

















    module.exports.toV2 = function(d) {

        var config = requireLocal('config/dataList');
        var sanitizeHtml = require('sanitize-html');
        var Entities = require('html-entities').XmlEntities;
        var entities = new Entities();

        var users = requireLocal('config/_users');
        var ms = require('milliseconds')

        var addProp = function(obj, prop, name) {
            if (prop) {
                obj[name] = prop;
            }
        }

        var toDate = function(str) {
            return new Date(parseInt(str) * 1000);
        }

        try {

            /* DATES */
            var date = {};

            addProp(date, toDate(d.t_stamp), 'ajout');

            /* CLIENT */
            var client = {
                civilite: d.civilite,
                prenom: d.prenom,
                nom: d.nom,
                email: d.email,
                address:  {
                    n: d.numero || "0",
                    r: d.adresse,
                    v: d.ville,
                    cp: d.code_postal,
                    lt: d.lat,
                    lg: d.lng
                },
                location: [parseFloat(d.lat), parseFloat(d.lng)],
            };

            client.telephone = {};
            if (d.tel1 && d.tel1.length)
                client.telephone.tel1 = d.tel1.replace(/[^0-9]/g, '');
            else
                client.telephone.tel1 = '0101010101'
            if (d.tel2)
                client.telephone.tel2 = d.tel2.replace(/[^0-9]/g, '');
            client.telephone.appel = d.numero_appel ||  undefined
                /* COMMENTS */
            var user = _.find(users, function(e) {
                return e.oldLogin === d.ajoute_par;
            })

            user = user ? user.login : d.ajoute_par;
            var rtn = {
                tva: 20,
                id: d.id,
                _id: d.id,
                login: {
                    ajout: user
                },
                date: date,
                client: client
            }

            var devis = JSON.parse(d.devis.split('<br>').join(""));
            rtn.historique = [];
            _.times(parseInt(devis.envoyer), function() {
                    rtn.historique.push({
                        login: user,
                        date: rtn.date.ajout,
                    })
                })
                //db.model('event').collection.insert(historique)
            if (d.etat_intervention === "ANN" ||
                (d.etat_intervention === "DEV" && date.ajout.getTime() < Date.now() - ms.weeks(1))) {
                rtn.status = "ANN";
            } else if (d.etat_intervention === "DEV") {
                rtn.status = "ATT"
            } else {
                rtn.status = 'TRA'
                rtn.transfertId = rtn.id;
            }
            rtn.produits = devis.devisTab;
            rtn.tva = devis.tva || 20;
            rtn.produits.map(function(p) {
                p.desc = sanitizeHtml(entities.decode(p.desc))
                p.ref = sanitizeHtml(entities.decode(p.ref))
                p.pu = typeof p.pu === 'number' ? p.pu : (parseFloat(p.pu.replace(/[^\d.-]/g, '')) || 0)
                p.ref = p.ref.replace(' ', '');
                if (p.ref.startsWith("CAM"))
                    p.ref = "CAM001";
                if (p.ref.startsWith("EDI003") ||  p.ref.startsWith("FRN"))
                    p.ref = "FRN001";
                var origin = _.find(edison.produits, function(e) {
                    return e.ref === p.ref;
                });
                if (origin) {
                    p.title = origin.title;
                } else {
                    p.title = p.desc.toUpperCase().split(' ').slice(0, 3).join(' ')
                }
                return p
            });

            /* FACTURE */
            rtn.reglementSurPlace = !d.fact;

            /* INFO */
            rtn.categorie = d.categorie;
            rtn.sms = d.id_sms;
        } catch (e) {
            __catch(e)
        }
        return rtn;
    }
