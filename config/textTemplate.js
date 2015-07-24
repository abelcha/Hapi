module.exports = {
    sms: {
        intervention: {
            envoi: function(user) {
                var sms = this.id ? "OS " + this.id + ". \n" : "";
                sms += "Intervention chez " + this.client.civilite + " " +
                    this.client.prenom + " " + this.client.nom + " au " +
                    this.client.address.n + " " + this.client.address.r + " " +
                    this.client.address.cp + ", " + this.client.address.v + " le " +
                    moment(this.date.intervention).format("LLLL") + ". \n";
                sms += this.prixAnnonce ? this.prixAnnonce + "€ HT. " : "Pas de prix annoncé. ";
                sms += "\nMerci de prendre rdv avec le client au " + this.client.telephone.tel1;
                sms += this.client.telephone.tel2 ? " ou au " + this.client.telephone.tel2 : ""
                sms += '\nM.' + user.pseudo + " (0132123212)";
                return sms + ".\nEdison Services."
            },
            demande: function(user) {
                console.log(this.artisan)
                return "Bonjour M. " + this.artisan.representant.nom + ", nous cherchons a vous joindre pour une intervention de vitrerie à faire aujourd'hui.\n" +
                    "Pourriez-vous vous rendre disponible ?\n" +
                    "Merci de nous contacter au plus vite au 09.72.42.30.00.\n" +
                    "Merci d'avance pour votre réponse.\n" +
                    "\nM." + user.pseudo + " (0132123212)\n" +
                    "Edison Services"
            }
        }
    },
    mail: {
        devis: {
            envoi: function(user) {
                var config = require('./dataList.js')
                var categorieClean = config.categories[this.categorie].suffix + " " + config.categories[this.categorie].long_name.toLowerCase()
                var pseudo = _.startCase(user.pseudo)
                var intro;
                if (this.client.civilite === "Soc.") {
                    intro = _.template("À l'intention du responsable de la société {{_.startCase(client.nom.toLowerCase())}},\n\n")(this);
                } else {
                    intro = _.template("{{client.civilite}} {{client.nom}},\n\n")(this);
                }
                var start = intro + "Suite à notre conversation téléphonique de tout à l'heure, ";
                var end = "Avez-vous reçu le devis ?\n" +
                    "Je n'ai pas eu de retour de votre part, devons nous planifier une intervention ?\n\n" +
                    "Merci de revenir vers moi pour me tenir au courant de la suite que vous donnerez à ce devis.\n\n" +
                    "Je reste à votre disposition pour toutes les demandes de renseignement\n\n" +
                    "Cordialement, \n\n" +
                    pseudo +
                    "\n<strong>Ligne direct : 09.72.42.30.00</strong>\n";

                if (this.historique && this.historique.length === 1) {
                    var cont;
                    if (this.categorie == 'VT')
                        cont = "je vous ai envoyé le devis que vous m'avez demandé pour le remplacement de votre vitrage, vous deviez le transmettre directement à votre compagnie d'assurance.\n\n";
                    else if (this.categorie == 'AS')
                        cont = "je vous ai transmis comme convenue le devis de remplacement de votre ballon d'eau chaude sanitaire.\n\n";
                    else
                        cont = "je vous ai transmis comme convenue le devis " + categorieClean + " que vous avez souhaité.\n\n";
                    var text = start + cont + end;

                } else if (this.historique && this.historique.length > 1) {
                    var text = intro + "je vous ai transmis un devis " + categorieClean + " en date du " + moment(this.historique[0].date).format('L') + ".\n\n" + end;
                } else if (this.categorie == 'VT') {
                    var text = intro +
                        "Suite à notre échange téléphonique concernant le remplacement de votre vitrage.\n\n" +
                        "Veuillez trouver ci-joint la pièce commerciale Devis n°" + this.id + ".\n\n" +
                        "Merci de bien vouloir transmettre ce devis de remplacement de vitrage directement à votre compagnie d’assurance, afin d'obtenir leurs accords (si nécessaire).\n" +
                        "Merci de nous renvoyer le devis signé accompagné de la mention « BON POUR ACCORD » par mail.\n\n" +
                        "Nous interviendrons dans les plus brefs délais.\n\n" +
                        "Je reste à votre entière disposition pour toutes les demandes de renseignement et les remarques que vous pourriez avoir.\n\n" +
                        "Cordialement, \n\n" +
                        pseudo +
                        "\n<strong>Ligne direct : 09.72.42.30.00</strong>\n"
                } else if (_.find(this.produits, function(e) {
                        return _.startsWith(e.ref, "BAL");
                    })) {
                    var text = intro +
                        "Suite à notre échange téléphonique concernant le remplacement de votre ballon d'eau chaude sanitaire.\n\n" +
                        "Veuillez trouver ci-joint la pièce commerciale Devis n°" + this.id + ".\n\n" +
                        "Je reste à votre entière disposition pour tous renseignements complémentaires ou remarques que vous pourriez avoir (technique/prix).\n\n" +
                        "Sachez par ailleurs, que votre installation sera éligible aux règles de notre assurance RC PRO et notre assurance décennale.\n" +
                        "Dès votre accord, nous interviendrons rapidement.\n\n" +
                        "Meilleures salutations,\n\n" +
                        pseudo +
                        "\n<strong>Ligne direct : 09.72.42.30.00</strong>\n\n";
                } else {
                    var text = intro +
                        "Suite à notre dernier échange concernant la réalisation d'un devis " + categorieClean + ", \n" +
                        "vous trouverez ci-joint le devis n°" + this.id + " correspondant à ce que nous avons vu ensemble. \n\n" +
                        "Je reste à votre entière disposition pour tous renseignements complémentaires ou remarques que vous pourriez avoir (technique/prix). \n\n" +
                        "Merci de me tenir au courant de la suite que vous donnerez à ce devis. \n\n" +
                        "Cordialement, \n\n" +
                        pseudo + "\n<strong>Ligne direct : 09.72.42.30.00</strong>\n\n";
                }
                return text;
            }
        },
        artisan: {
            envoiContrat: function(user) {
                return "Bonjour M. " + this.representant.nom + ' ' + this.representant.prenom + '\n' +
                    'voici le contrat\n' + user.prenom;
            }
        }
    },

};
