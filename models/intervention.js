var schema = new npm.mongoose.Schema({
  id: Number,
  status: String,
  telepro: String,
  comments: [
    /*
    {login, text, date},
    */
  ],
  date: { //
    /*
    ajout: Date,
    intervention: Date,
    Confirmation: Date,
    PaiementCli: Date,
    PaiementSST: Date,
    */
  },
  client: { //
    civilite: String,
    prenom: String,
    nom: String,
    email: String,
    telephone: {
      /*
      t1: String,
      t2: String,
      */
    },
    address: {
      n: String,
      r: String,
      v: String,
      cp: String,
      lt: String,
      lg: String,
    },
    location: [],
  },
  facture: {
    /*
       nom,
       prenom,
       etc...
    */
  },
  info: {
    categorie: String,
    artisan: {
      id: Number,
      nom: String
    },
    description: String,
    remarque: String,
    produits: [],
    modeReglement: String,
    prixAnnonce: Number,
    prixFinal: Number,
  }
});

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
      n: d.numero,
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

  /* INFO */
  var info = {};
  info.categorie = d.categorie;
  info.description = d.description;
  info.remarque = d.remarque;

  info.artisan = {
    id: d.id_sst_selectionne,
    nom: d.nom_societe
  }

  info.modeReglement = d.mode_reglement;
  info.prixAnnonce = d.prix_ht_annonce;
  info.prixFinal = d.prix_ht_final;


  var comments = [];
  if (d.remarque_interne) {
    comments.push({
      a: '',
      d: 0,
      c: d.remarque_interne
    });
  }

  /* FACTURE */
  if (d.fact === true) {
    var facture = {
      address: {
        n: d.numero_facture,
        r: d.adresse_facture,
        v: d.ville_facture,
        cp: d.code_postal_facture
      },
    }
  }

  return {
    id: d.id,
    telepro: d.ajoute_par,
    comments: comments,
    status: d.etat_intervention,
    date: date,
    info: info,
    client: client
  }
}


var addInDB = function(data, i, cb) {
  if (i >= data.length - 1)
    return cb(null);
  if (i % 100 === 0)
    console.log(((i / data.length) * 100).toFixed(2), '%')
  var inter = new model(translateModel(data[i]));
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
      npm.request("http://electricien13003.com/alvin/test4.php", function(err, rest, body) {
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



var model = npm.mongoose.model('intervention', schema);

/* M.|Me|Soc. */
model.schema.path('client.civilite').validate(function(value) {
  return /M\.|Mme|Soc\./i.test(value);
}, 'Civilité inconnu.');


/* CARTE BANCAIRE | CHEQUE | CASH */
model.schema.path('info.modeReglement').validate(function(value) {
  return /CB|CH|CA/i.test(value);
}, 'Mode de reglement inconnu.');



/*CARRELAGE|MENUISERIE|MACONNERIE|PEINTURE|PLOMBERIE|SERRURERIE|CLIMATISATION|CHAUFFAGE|VITRERIE|ELECTRICITE */
model.schema.path('info.categorie').validate(function(value) {
  return /CR|MN|MC|PT|PL|SR|CL|CH|VT|EL/i.test(value);
}, 'Categorie inconnue.');


module.exports = model;
