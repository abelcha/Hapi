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
        title: 'Modifier le devis',
        action: "ouvrirFiche"
    }, {
        title: "Prévisualiser",
        action: 'devisPreview',
    }, {
        title: "Envoyer",
        action: 'sendDevis',
        hide: function(inter) {
            return inter.status !== "TRA" && inter.status !== 'ANN';
        }
    }, {
        title: "Transferer",
        action: 'transfert',
        hide: function(inter) {
            return inter.status !== 'TRA' && inter.status !== 'ANN';
        }
    }, {
        title: "Annuler",
        action: 'annulation',
        hide: function(inter) {
            return inter.status !== 'ANN';
        }
    }],
    intervention: [{
        title: "Modifier l'intervention",
        action: "ouvrirFiche",
        style: {
            fontWeight: 'bold'
        }
    }, {
/*        title: 'Fiche Client V1',
        action: "ouvrirFicheV1"
    }, {*/
        title: "Appel Client",
        action: 'callClient',
        style: {
            fontWeight: 'bold'
        },
        hide: function(inter) {
            return false
        }
    }, {
        title: 'Recap sous-traitant',
        action: "ouvrirRecapSST",
        hide: function(inter) {
            return !inter.artisan || !inter.artisan.id
        }
    }, {
        title: "Appel sous-traitant",
        action: 'callArtisan',
        style: {
            fontWeight: 'bold'
        },
        hide: function(inter) {
            return !inter.artisan || !inter.artisan.id
        }
    }, {
        title: "SMS sous-traitant",
        action: 'smsArtisan',
        hide: function(inter) {
            return !inter.artisan || !inter.artisan.id
        }
    }, {
        title: "Envoyer",
        action: 'envoi',
        hide: function(inter) {
            console.log(inter)
            return inter.status == "VRF" || (!inter.artisan || !inter.artisan.id)
        }
    }, {
        title: "Vérifier",
        action: 'verification',
        hide: function(inter) {
            return inter.status !== "AVR" && inter.status !== 'ENC'
        }
    }, {
        title: "Annuler",
        action: 'annulation',
        hide:function(inter) {
            return false;//inter.status === 'ANN' || inter.status === 'VRF'
        }

    }, {
        title: "Je prend !",
        action: 'demarcher',
        hide: function(inter) {
            return !inter.aDemarcher || inter.login.demarchage;
        }
    }]
}
