module.exports = {
    artisan: [{
        title: 'Ouvrir Fiche',
        action: "ouvrirFiche"
    }, {
        title: 'Ouvrir Recap',
        action: "ouvrirRecap",
        hide: function(artisan) {
            return artisan.status !== 'POT';
        }
    }, {
        title: "Archiver",
        action: 'archiver',
        hide: function(artisan) {
            return artisan.status !== 'ARC';
        }
    }, {
        title: "Envoyer Contrat",
        action: 'envoiContrat',
        hide: function(artisan) {
            return artisan.document && artisan.document.cni && artisan.document.kbis && artisan.document.contrat;
        }
    }, {
        title: "Facturier/deviseur",
        action: 'facturierDeviseur',
    }, {
        title: "Appeler",
        action: 'call',
    }],
    devis: [{
        title: 'Ouvrir Devis',
        action: "ouvrirFiche"
    }, {
        title: "Annuler",
        action: 'annulation',
        hide: function(inter) {
            return inter.status !== 'ANN';
        }
    }, {
        title: "Envoyer",
        action: 'envoi',
        hide: function(inter) {
            return inter.status !== "TRA" && inter.status !== 'ANN';
        }
    }, {
        title: "Transferer",
        action: 'transfert',
        hide: function(inter) {
            return inter.status !== 'TRA' && inter.status !== 'ANN';
        }
    }],
    intervention: [{
        title: 'Ouvrir Fiche',
        action: "ouvrirFiche"
    },{
        title: 'Ouvrir Recap SST',
        action: "ouvrirRecapSST",
        hide:function(inter) {
            return !inter.artisan || !inter.artisan.id
        }
    }, {
        title: "Appeler l'artisan",
        action: 'callArtisan',
        hide: function(inter) {
            return !inter.artisan || !inter.artisan.id
        }
    }, {
        title: "Appeler le client",
        action: 'callClient',
        hide: function(inter) {
            return false
        }
    }, {
        title: "SMS artisan",
        action: 'smsArtisan',
        hide: function(inter) {
            return !inter.artisan || !inter.artisan.id
        }
    }, {
        title: "Envoyer",
        action: 'envoi',
        hide: function(inter) {
            return (inter.status != "APR" &&  inter.status !== "ANN") || !inter.artisan
        }
    }, {
        title: "Vérifier",
        action: 'verification',
        hide: function(inter) {
            return inter.status !== "AVR" && inter.status !== 'ENC'
        }
    }, {
        title: "Annuler",
        action: 'annulation'

    }, {
        title: "Je prend !",
        action: 'demarcher',
        hide:function(inter) {
            return !inter.aDemarcher || inter.login.demarchage;
        }
    }]
}
