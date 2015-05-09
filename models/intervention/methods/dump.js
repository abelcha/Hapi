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
    addProp(date, toDate(d.t_stamp_intervention), 'intervention');

    if (d.date_paiement_client)
      addProp(date, toDate(d.date_paiement_client), 'paiementCLI');

    if (d.date_paiement_sst)
      addProp(date, toDate(d.date_paiement_sst), 'paiementSST');

    if (d.date_edition_facture)
      addProp(date, toDate(d.date_edition_facture), 'confirmation')


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
    var comments = [];
    if (d.remarque_interne) {
      comments.push({
        a: '',
        d: 0,
        c: d.remarque_interne
      });
    }
    var rtn = {
      id: d.id,
      telepro: d.ajoute_par,
      comments: comments,
      status: d.etat_intervention,
      date: date,
      client: client
    }

    /* FACTURE */
    rtn.reglementSurPlace = !d.fact;

    /* INFO */
    rtn.categorie = d.categorie;
    rtn.description = d.description || "PAS DE DESCRIPTION";
    rtn.remarque = d.remarque || "PAS DE REMARQUES";
    if (d.nom_societe) {
      rtn.artisan = {
        id: d.id_sst_selectionne,
        nomSociete: d.nom_societe
      }
    }

    rtn.modeReglement = d.mode_reglement;
    rtn.prixAnnonce = d.prix_ht_annonce;
    rtn.prixFinal = d.prix_ht_final;


    if (d.fact === true) {
      rtn.facture = {
        type: d.type_facture,
        email: d.mail_facture,
        nom: d.nom_facture,
        prenom: d.prenom_facture,
        telephone: d.tel_facture,
        address: {
          n: d.numero_facture,
          r: d.adresse_facture,
          v: d.ville_facture,
          cp: d.code_postal_facture
        },
      }
    }
    return rtn;
  }


  var addInDB = function(data, i, cb) {
    if (i >= data.length - 1)
      return cb(null)
    var inter = npm.mongoose.model('intervention')(translateModel(data[i]));
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

  schema.statics.dump = function(req, res) {
    var self = this;
    var exit = false;
    var t = Date.now();

    return new Promise(function(resolve, reject) {
      var inters = [];
      self.remove({}, function() {
        npm.request(edison.config.alvinURL + "/dumpIntervention.php?key=" + ed.config.alvinKEY, function(err, rest, body) {
         // console.log("===>", err, rest, body);
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
}
