var schema = new npm.mongoose.Schema({
  id:  {type:Number, index:true},
  status:  {type:String, index:true},
  telepro: String,
  comments: [
    /*
    {login, text, date},
    */
  ],
  date: {
    ajout: Date,
    intervention: Date,
    confirmation: Date,
    paiementCLI: Date,
    paiementSST: Date,
  },
  client: { //
    civilite: {
      type: String,
      required: true
    },
    prenom: String,
    nom: {
      type: String,
      required: true
    },
    email: String,
    telephone: {
      /*
      t1: String,
      t2: String,
      */
    },
    address: {
      n: {
        type: String,
        required: true
      },
      r: {
        type: String,
        required: true
      },
      v: {
        type: String,
        required: true
      },
      cp: {
        type: String,
        required: true
      },
      lt: String,
      lg: String,
    },
    location: [],
  },
  facture: {
    /*    type: String,
        nom: String,
        prenom: String,
        tel: String,
        email: String,
        address: {
          n: String,
          r: String,
          v: String,
          cp: String,
        },
    */
  },
  categorie: {
    type: String,
    required: true
  },
  artisan: {
    id: Number,
    nomSociete: String
  },
  description: {
    type: String,
    required: true
  },
  remarque: String,
  produits: [],
  modeReglement: {
    type: String,
    required: true
  },
  prixAnnonce: {
    type: Number,
    set: toCurrency
  },
  prixFinal: Number,
  reglementSurPlace: Boolean,
  aDemarcher: Boolean
});

function toCurrency(nbr) {
  try {
    var rtn = parseFloat(nbr.replace(',', '.'));
    return Math.round(rtn * 100) / 100;
  } catch (e) {
    return 0;
  }
}

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
    console.log(d.nom_societe)
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
  var inter = new model(translateModel(data[i]));
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



schema.statics.save = function(req, res) {
  var data = JSON.parse(req.query.data);
  return new Promise(function(resolve, reject) {
    var intervention = new model(data);
    if (data.id) {
      model.findOne({
        id: data.id
      }).exec(function(err, doc) {
        if (err)
          return reject(String(err));
        for (k in data) {
          doc[k] = data[k];
        }
        doc.save(function(err, result) {
          if (err)
            reject(String(err));
          resolve(result.id);
        });
      })
    } else {
      var inter = new model(data);
      inter.save(function(err, doc) {
        if (err)
          reject(String(err));
        else
          resolve(doc.id);
      })
    }
  });
}

var model = npm.mongoose.model('intervention', schema);

/* M.|Me|Soc. */
model.schema.path('client.civilite').validate(function(value) {
  return /M\.|Mme|Soc\./i.test(value);
}, 'Civilité inconnu.');


/* CARTE BANCAIRE | CHEQUE | CASH */
model.schema.path('modeReglement').validate(function(value) {
  return /CB|CH|CA/i.test(value);
}, 'Mode de reglement inconnu.');



/*CARRELAGE|MENUISERIE|MACONNERIE|PEINTURE|PLOMBERIE|SERRURERIE|CLIMATISATION|CHAUFFAGE|VITRERIE|ELECTRICITE */
model.schema.path('categorie').validate(function(value) {
  return /CR|MN|MC|PT|PL|SR|CL|CH|VT|EL/i.test(value);
}, 'Categorie inconnue.');

model.schema.pre('save', function(next) {
  var self = this;
  if (!self.id) {
    model.findOne({}, {
      id: 1
    }).sort("-id").exec(function(err, latestDoc) {
      self.id = latestDoc.id + 1;
      self.date.ajout = Date.now();
      next();
    });
  } else {
    next();
  }
  /*var err = new Error('something went wrong');
  next(err);
  */
});
module.exports = model;
