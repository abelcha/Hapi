module.exports = function(db) {

  return new db.Schema({
    _id: Number,
    id: {
      type: Number,
      index: true

    },
    origin: String,
    status: {
      type: String,
      default: 'POT'
    },
    subStatus: String,
    date: {
      dump: Date,
      ajout: {
        type: Date,
        default: Date.now
      }
    },
    blocked: Boolean,
    newOs: Boolean,
    login: {
      management: String,
      ajout: String,
    },
    origine: String, //CND/PRP
    nomSociete: {
      type: String,
      required: true,
    },
    star: Boolean,
    formeJuridique: {
      type: String,
      required: true
    },
    representant: {
      civilite: String,
      nom: {
        type: String,
        required: true
      },
      prenom: String,
    },
    interLimit: {
      type: Number,
      default: 30
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
      etage: String,
      code: String,
      lt: Number,
      lg: Number,
    },
    pourcentage: {
      deplacement: {
        type: Number,
        required: true
      },
      maindOeuvre: {
        type: Number,
        required: true
      },
      fourniture: {
        type: Number,
        required: true
      },
    },
    zoneChalandise: {
      type: Number,
      required: true
    },
    loc: {
      type: [Number],
      index: '2dsphere'
    },
    managed: Boolean,
    quarantained: Boolean,
    absence: [{
      start: Date,
      end: Date,
      login: String,
      date: Date
        }],
    categories: [],
    email: {
      type: String,
      required: true
    },
    telephone: {
      tel1: {
        type: String,
        required: true
      },
      tel2: String
    },
    document: {
      contrat: {
        file: String,
        ok: {
          type: Boolean,
          default: false
        },
        extension: String,
        date: Date,
        login: String
      },
      kbis: {
        file: String,
        ok: {
          type: Boolean,
          default: false
        },
        extension: String,
        date: Date,
        login: String
      },
      cni: {
        file: String,
        ok: {
          type: Boolean,
          default: false
        },
        extension: String,
        date: Date,
        login: String
      },
      autre: {
        file: String,
        ok: {
          type: Boolean,
          default: false
        },
        extension: String,
        date: Date,
        login: String
      },
      assurance: {
        file: String,
        ok: {
          type: Boolean,
          default: false
        },
        extension: String,
        date: Date,
        login: String
      },
      rib: {
        file: String,
        ok: {
          type: Boolean,
          default: false
        },
        extension: String,
        date: Date,
        login: String
      },
      ursaff: {
        file: String,
        ok: {
          type: Boolean,
          default: false
        },
        extension: String,
        date: Date,
        login: String
      },
    },
    comments: [{
      login: String,
      text: String,
      date: Date
        }],
    historique: {
      pack: [{
        date: {
          type: Date,
          default: Date.now
        },
        facturier: Boolean,
        deviseur: Boolean,
        text: String,
        login: String,
            }],
      contrat: [{
        date: {
          type: Date,
          default: Date.now
        },
        text: String,
        login: String,
        messageID: String,
        signe: Boolean
            }],
    },
    signalements: [{
      date: Date,
      login: String,
      type: String,
        }],
    info: {
      travailSamedi: Boolean,
      pasFiable: Boolean
    },
    tutelle: Boolean,
    oneShot: Boolean,
    demandeFacturier: {
      status: String, //PENDING/OK/NO,
      login: String,
      date: Date,
    },
    BIC: String,
    IBAN: String,
    nbrIntervention: {
      type: Number,
      default: 0
    },
    nbrComissionPaye: {
      type: Number,
      default: 0
    },
    nbrComissionImpaye: {
      type: Number,
      default: 0
    },
    nbrStep: Number,
    siret: String,
    cache: {}
  });
}
