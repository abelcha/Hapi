global.requireLocal = function(pth) {
    return require(process.cwd() + '/' + pth)
}
var V1 = require('./config/convert_V1.js')
var db = require(process.cwd() + '/server/edison_components/db.js')()
var _ = require('lodash');

new V1({
    "_id": 25888,
    "id": 25888,
    "categorie": "PL",
    "description": "MÉCANISME DE CHASSE DÉFECTUEUX",
    "remarque": "PRIX HORS FOURNITURE, WC ENCASTRES",
    "modeReglement": "CH",
    "__v": 1,
    "files": [],
    "compta": {
        "paiement": {
            "historique": [],
            "login": "vincent_q",
            "ready": false,
            "effectue": false,
            "dette": false,
            "pourcentage": {
                "fourniture": 30,
                "maindOeuvre": 30,
                "deplacement": 50
            },
            "tva": 0
        },
        "reglement": {
            "historique": [],
            "avoir": {
                "effectue": false
            },
            "montant": 0,
            "recu": false,
            "login": "vincent_q"
        }
    },
    "tva": 10,
    "coutFourniture": 0,
    "aDemarcher": true,
    "reglementSurPlace": true,
    "prixFinal": 180,
    "prixAnnonce": 180,
    "fourniture": [],
    "produits": [],
    "litiges": [],
    "sav": [],
    "client": {
        "civilite": "M.",
        "prenom": "PHILIPPE",
        "nom": "BOUSQUIER",
        "email": "",
        "location": [45.2982, 5.63752],
        "address": {
            "n": "171",
            "r": "AVENUE HENRI CHAPAYS",
            "cp": "38340",
            "v": "VOREPPE",
            "lt": 45.2982,
            "lg": 5.63752
        },
        "telephone": {
            "tel1": "0687703760"
        }
    },
    "historique": [],
    "comments": [{
        "login": "abel_c",
        "text": "test123",
        "date": "2015-08-10T09:53:51.722Z",
        "_id": "55c874b028c30bf38293a2e2"
    }, {
        "login": "abel_c",
        "text": "qsddqs",
        "date": "2015-08-10T09:53:51.722Z",
        "_id": "55c874b028c30bf38293a2e2"
    }, {
        "login": "abel_c",
        "text": "loltest",
        "date": "2015-08-10T09:53:51.722Z",
        "_id": "55c874b028c30bf38293a2e2"
    }],
    "date": {
        "intervention": "2015-08-10T14:30:00.000Z",
        "ajout": "2015-08-10T09:23:16.000Z"
    },
    "login": {
        "ajout": "harald_x"
    },
    "status": "APR"
})
process.exit()
