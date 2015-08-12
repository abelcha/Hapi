    var key = requireLocal('config/_keys');
    var users = requireLocal('config/_users');
    var request = require("request");
    var sanitizeHtml = require('sanitize-html');
    var Entities = require('html-entities').XmlEntities;
    var _ = require('lodash');
    var entities = new Entities();
    var ms = require('milliseconds');

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
            console.log(d.id, d.tel1)
            if (d.tel1 && d.tel1.length)
                client.telephone.tel1 = d.tel1.replace(/[^0-9]/g, '');
            else
                client.telephone.tel1 = '0101010101'
            if (d.tel2)
                client.telephone.tel2 = d.tel2.replace(/[^0-9]/g, '');
            client.telephone.appel = d.numero_appel ||  undefined
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

            var devis = JSON.parse(d.devis.split('<br>').join(""));
            rtn.historique = [];
            _.each(new Array(devis.envoyer), function() {
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
            rtn.tva = devis.tva;
            rtn.produits.map(function(p) {
                p.desc = sanitizeHtml(entities.decode(p.desc))
                p.ref = sanitizeHtml(entities.decode(p.ref))
                p.pu = parseInt(sanitizeHtml(entities.decode(p.pu))) || 0
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

            /* FACTURE */
            rtn.reglementSurPlace = !d.fact;

            /* INFO */
            rtn.categorie = d.categorie;
            rtn.sms = d.id_sms;
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
                db.model('event').remove({
                    type: 'ENV_DEV'
                })
                db.model('devis').remove({
                    /*          id: {
                                  $gt: limit
                              }*/
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

        var dumpOne = function(id) {
            return new Promise(function(resolve, reject) {
                request.get(key.alvin.url + "/dumpIntervention.php?id=" + id + "&key=" + key.alvin.pass, function(err, resp, body) {
                    if (err || resp.statusCode !== 200 || !body || body == 'null') {
                        return reject('nope')
                    }
                    db.model('devis').update({
                        id: id
                    }, translateModel(JSON.parse(body)), {
                        upsert: true
                    }).exec(function(err, resp, c) {
                        if (err)
                            return reject(err);
                        resolve(resp);
                        db.model('devis').findOne({
                            id: id
                        }).then(function(doc) {
                            db.model('devis').cacheActualise(doc);
                        })
                    })
                });
            })
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
