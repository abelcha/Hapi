module.exports = {

    mail: {
        devis: {
            envoi: "{{client.civilite}}{{client.prenom ? (' ' + _.startCase(client.prenom.toLowerCase())) : ''}} {{client.nom}}"
        }
    }

};
