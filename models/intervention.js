module.exports = require("./intervention/index")();
return 0;
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
