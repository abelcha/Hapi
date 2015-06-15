module.exports = {
    devis: [{
        hidden: false,
        title: 'Ouvrir Devis',
        action: "ouvrirFiche"
    }, {
        hidden: false,
        title: "Annuler",
        action: 'annulation',
        hide: function(inter) {
            return inter.s !== 'ANN';
        }
    }, {
        hidden: false,
        title: "Envoyer",
        action: 'envoyer',
        hide: function(inter) {
            return inter.s !== "TRA" && inter.s !== 'ANN';
        }
    }, {
        hidden: false,
        title: "Transferer",
        action: 'transfert',
        hide: function(inter) {
            return inter.s !== 'TRA' && inter.s !== 'ANN';
        }
    }],
    intervention: [{
        hidden: false,
        title: 'Ouvrir Fiche',
        action: "ouvrirFiche"
    }, {
        hidden: false,
        title: "Appeler l'artisan",
        action: 'callArtisan',
        hide: function(inter) {
            return !inter.ai
        }
    }, {
        hidden: false,
        title: "SMS artisan",
        action: 'smsArtisan',
        hide: function(inter) {
            return !inter.ai
        }
    }, {
        hidden: false,
        title: "Envoyer",
        action: 'envoi',
        hide: function(inter) {
            return inter.s !== "APR" && inter.s !== 'ANN'
        }
    }, {
        hidden: false,
        title: "Vérifier",
        action: 'verification',
        hide: function(inter) {
            return inter.s !== "AVR" && inter.s !== 'ENV'
        }
    }, {
        hidden: false,
        title: "Annuler",
        action: 'annulation'

    }]
}
