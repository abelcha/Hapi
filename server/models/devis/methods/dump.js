    var key = requireLocal('config/_keys');
    var users = requireLocal('config/_users');
    var request = require("request");
    var sanitizeHtml = require('sanitize-html');
    var Entities = require('html-entities').XmlEntities;
    var _ = require('lodash');
    var entities = new Entities();

    module.exports = function(schema) {

        var addProp = function(obj, prop, name) {
            if (prop) {
                obj[name] = prop;
            }
        }

        var toDate = function(str) {
            return new Date(parseInt(str) * 1000);
        }

        var translateModel = function(d) {


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
            addProp(client.telephone, d.tel1, 'tel1');
            addProp(client.telephone, d.tel2, 'tel2');

            /* COMMENTS */
            var user = getUser(d.ajoute_par)
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

            if (d.devis && d.id > 13740) {
                var devis = JSON.parse(d.devis.split('<br>').join(""));
                rtn.produits = devis.devisTab;
                rtn.tva = devis.tva;
                rtn.produits.map(function(p) {
                    p.desc = sanitizeHtml(entities.decode(p.desc))
                    p.ref = sanitizeHtml(entities.decode(p.ref))
                    p.pu = sanitizeHtml(entities.decode(p.pu))
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
                        p.ref = "AUT001";
                        p.title = "Autre"
                    }
                    return p
                });
            }

            /* FACTURE */
            rtn.reglementSurPlace = !d.fact;

            /* INFO */
            rtn.categorie = d.categorie;

            return rtn;
        }



        var addInDB = function(data, i, cb) {
            if (i >= data.length - 1)
                return cb(null)
            var inter = db.model('devis')(translateModel(data[i]));
            if (i % 100 == 0)
                console.log(((i / data.length) * 100).toFixed(2) + '%', inter.id);
            inter.save(function(err) {
                if (err) {
                    return cb({
                        id: inter.id,
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
            return new Promise(function(resolve, reject) {
                var inters = [];
                var t = Date.now();
                db.model('intervention').remove({
                    id: {
                        $gt: limit
                    }
                }, function() {
                    request(key.alvin.url + "/dumpDevis.php?limit=" + limit + "&key=" + key.alvin.pass, function(err, rest, body) {
                        var data = JSON.parse(body);
                        addInDB(data, 0, function(err) {
                            if (err)
                                return reject(err);
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
                    model: 'devis',
                    method: 'workerDump',
                    arg: limit
                })
            } else {
                return execDump(limit);
            }

        }
    }
