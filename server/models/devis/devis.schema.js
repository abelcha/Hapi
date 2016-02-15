module.exports = function(db) {

  return new db.Schema({
    _id: Number,
    id: {
      type: Number,
      index: true
    },
    isDevis: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      index: true,
      default: 'AEV' // ANN ATT AEV TRA
    },
    causeAnnulation: String,
    login: {
      annulation: String,
      ajout: String,
      transfert: String
    },
    date: {
      dump: Date,
      annulation: String,
      ajout: {
        type: Date,
        default: Date.now
      },
      transfert: Date
    },
    prixAnnonce: Number,
    historique: [{
      date: {
        type: Date,
        default: Date.now,
      },
      login: String,
      auto: Boolean,
      mail: {}
        }],
    client: { //
      civilite: {
        type: String,
        required: true
      },
      prenom: {
        type: String,
        default: ''
      },
      nom: {
        index: true,
        type: String,
        required: true
      },
      email: String,
      telephone: {
        tel1: {
          index: true,
          type: String,
          required: true
        },
        tel2: {
          type: String,
          index: true
        },
        tel3: {
          type: String,
          index: true
        },
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
          index: true,
          type: String,
          required: true
        },
        cp: {
          index: true,
          type: String,
          required: true
        },
        etage: String,
        code: String,
        lt: Number,
        lg: Number,
      },
      location: [],
    },
    transfertId: {
      type: Number,
      ref: 'intervention'
    },
    conversations: [{
      io: String,
      status: String,
      withoperator: String,
      from: String,
      poste: String,
      to: String,
      dest: String,
      duration: Number,
      _id: Date
        }],
    combo: String,
    comboText: String,
    categorie: String,
    produits: [{
      pu: Number,
      quantite: Number,
      title: String,
      ref: String,
      desc: String
        }],
    tva: {
      type: Number,
      default: 20
    },
    cache: {}
  }, {
    versionKey: false
  });
}
