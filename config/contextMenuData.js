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
            return (inter.status === "TRA" && inter.status === 'ANN') || (inter.historique && inter.historique.length != 0);
        }
    }, {
        title: "Relance 1",
        action: 'sendDevis',
        hide: function(inter) {
            return (inter.status === "TRA" && inter.status === 'ANN') || (!inter.historique || inter.historique.length != 1);
        }
    }, {
        title: "Relance 2",
        action: 'sendDevis',
        hide: function(inter) {
            return (inter.status === "TRA" && inter.status === 'ANN') || (!inter.historique || inter.historique.length < 2);
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
        title: 'Appels',
        style: {
            fontWeight: 'bold'
        },
        subs: [{
            title: 'Client tel1',
            action: 'callTel1'

        }, {
            title: 'Client tel2',
            action: 'callTel2',
            hide: function(inter) {
                console.log('=-:', inter)
                return !inter.client.telephone.tel2
            }
        }, {
            title: 'Client tel3',
            action: 'callTel3',
            hide: function(inter) {
                return !inter.client.telephone.tel3
            }
        }, {
            title: 'Sous-traitant tel1',
            action: 'callSst1',
            hide: function(inter) {
                return !inter.sst || !inter.sst.telephone.tel1
            }
        }, {
            title: 'Sous-traitant tel1',
            action: 'callSst2',
            hide: function(inter) {
                return !inter.sst || !inter.sst.telephone.tel2
            }
        }, {
            title: 'Payeur tel1',
            action: 'callPayeur1',
            hide: function(inter) {
                return !inter.facture || !inter.facture.tel
            }
        }, {
            title: 'Payeur tel2',
            action: 'callPayeur2',
            hide: function(inter) {
                return !inter.facture || !inter.facture.tel2
            }
        }]
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
            return inter.status == "VRF" || (!inter.artisan || !inter.artisan.id)
        }
    }, {
        title: "Vérifier",
        action: 'verification',
        hide: function(inter) {
            return inter.status !== "AVR" && inter.status !== 'ENC'
        }
    }, {
        title: "Reactiver",
        action: 'reactivation',
        hide: function(inter) {
            return inter.status !== 'ANN'
        }
    }, {
        title: "Annuler",
        action: 'annulation',
        hide: function(inter) {
            return inter.status === 'ANN' || inter.status === 'VRF'
        }
    }, {
        title: "Je prend !",
        action: 'demarcher',
        hide: function(inter) {
            return !inter.aDemarcher || inter.login.demarchage;
        }
    }]
}
