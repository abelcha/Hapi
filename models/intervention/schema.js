module.exports = function(db) {

  return new db.Schema({
    id: {
      type: Number,
      index: true
    },
    status: {
      type: String,
      index: true,
      default: 'APR'
    },
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
      /*set: function toCurrency(nbr) {
        console.log("swag", nbr)
        var rtn = parseFloat(nbr.replace(',', '.')) || 0;
        return 42;
      }*/
    },
    prixFinal: Number,
    reglementSurPlace: Boolean,
    aDemarcher: Boolean
  });
}
