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
        title: 'Fiche Client',
        action: "ouvrirFiche",
        style: {
            fontWeight: 'bold'
        }
    }, {
        title: "Appel Client",
        action: 'callClient',
        style: {
            fontWeight: 'bold'
        },
        hide: function(inter) {
            return false
        }
    }, {
        title: 'Recap Artisan',
        action: "ouvrirRecapSST",
        hide: function(inter) {
            return !inter.artisan && !inter.artisan.id
        }
    }, {
        title: "Appel l'artisan",
        action: 'callArtisan',
        style: {
            fontWeight: 'bold'
        },
        hide: function(inter) {
            return !inter.artisan && !inter.artisan.id
        }
    }, {
        title: "SMS artisan",
        action: 'smsArtisan',
        hide: function(inter) {
            return !inter.artisan && !inter.artisan.id
        }
    }, {
        title: "Envoyer",
        action: 'envoi',
        hide: function(inter) {
            console.log(inter)
            return inter.status == "VRF"  || (!inter.artisan && !inter.artisan.id)
        }
    }, /*{
        title: "Vérifier",
        action: 'verification',
        hide: function(inter) {
            return inter.status !== "AVR" && inter.status !== 'ENC'
        }
    }, {
        title: "Annuler",
        action: 'annulation'

    }, */{
        title: "Je prend !",
        action: 'demarcher',
        hide: function(inter) {
            return !inter.aDemarcher || inter.login.demarchage;
        }
    }]
}
