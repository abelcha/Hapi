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
                sms += '\nM.' + (user.pseudo ||  " Arnaud") + " (0132123212)";
                return sms + ".\nEdison Services."
            },
            demande: function(user) {
                console.log(this.artisan)
                return "Bonjour M. " + this.artisan.representant.nom + ", nous cherchons a vous joindre pour une intervention de vitrerie à faire aujourd'hui.\n" +
                    "Pourriez-vous vous rendre disponible ?\n" +
                    "Merci de nous contacter au plus vite au 09.72.42.30.00.\n" +
                    "Merci d'avance pour votre réponse.\n" +
                    "\nM." + (user.pseudo ||  " Arnaud") + " (0132123212)\n" +
                    "Edison Services"
            }
        }
    },
    lettre: {
        intervention: {
            envoiFacture: function() {
                return "Madame, Monsieur,\n" +
                    "<p>Suite à notre intervention le {{datePlain}} dans vos locaux:\n" +
                    "<p strong center>{{client.civilite}} {{client.nom}} {{client.prenom}}\n" +
                    "{{client.address.n}} {{client.address.r}}, {{client.address.cp}} {{client.address.v}}\n" +
                    "Tél. : 0322916682</p>" +
                    "Pour les raisons suivantes: </p>" +
                    "<p strong center>{{description}}</p>" +
                    "<p>Nous vous confirmons que l'intervention à été réalisé par nos soins.\n" +
                    "Vous trouverez ci joint la facture à regler\n" +
                    "Nous vous prions de bien vouloir transmettre le règlement par chèque à l'ordre de:</p>" +
                    "<p strong center> S.A.R.L EDISON SERVICES</p>" +
                    "<p>A l'organisme qui gère notre comptabilité:</p>" +
                    "<p strong center> EDISON SERVICES FRANCE\n" +
                    "Service comptabilité\n" +
                    "75 rue des dames, 75017 Paris\n" +
                    "Tél. 09.72.51.08.01 (Ouvert de 09h00 à 12h30 / 14h00 à 16h30)</p>" +
                    "<p>" +
                    "Par ailleurs, si quelque raison s'opposait au règlement de la facture, nous vous remercions de nous le faire savoir dans les plus brefs délais.\n" +
                    "Restant à votre entière disposition, nous vous prions de croire, Madame, Monsieur l'expression de nos sincères salutations distinguées.</p>" +
                    "<ul>" +
                    "<li>Ci-joint la facture</li>" +
                    "</ul>" +
                    "Cordialement."
            }
        }
    },
    mail: {
        intervention: {
            os: function() {

                return "A l'attention de l’entreprise {{sst.nomSociete}}\n" +
                    "\n" +
                    "Monsieur <strong>{{sst.representant.nom}}</strong>,\n" +
                    "Suite à notre conversation téléphonique,\n" +
                    "Nous vous prions de bien vouloir intervenir pour une intervention de {{categoriePlain}} auprès de notre client :\n" +
                    "\n" +
                    "<strong>" +
                    "OS n°{{id}}\n" +
                    "{{client.nom}} {{client.prenom}}\n" +
                    "Tél. {{client.telephone.tel1}}\n" +
                    "{{client.address.n}} {{client.address.r}}\n" +
                    "{{client.address.cp}} {{client.address.v}}\n" +
                    "</strong>" +
                    '\n' +
                    "L' intervention a été prévu pour le : <strong>{{datePlain}}</strong> \n" +
                    '\n' +
                    "Vous devez dès réception de cet ordre de service, prendre contact <strong><u>immédiatement</u></strong> avec le client afin de confirmer la date et l'horaire de l’intervention.\n" +
                    "\n" +
                    "Les coordonnées et la description de l'intervention sont détaillées dans l'ordre de service que vous trouverez en pièce jointe. \n" +
                    "<center>" +
                    "<% if (typeof devisOrigine !== 'undefined' && !fileSupp) {%> <strong>Vous trouverez également le devis accepté et signé par notre client</strong> <%}%>" +
                    "<% if (typeof devisOrigine === 'undefined' && fileSupp) {%> <strong>Vous trouverez également {{textfileSupp}} à votre disposition</strong> <%}%>" +
                    "<% if (typeof devisOrigine !== 'undefined' && fileSupp) {%> <strong>Vous trouverez également le devis accepté et signé par notre client, et {{textfileSupp}}</strong> <%}%>" +
                    "</center>" +
                    "\n" +
                    "<strong>" +
                    "Vous trouverez ci-joint :\n" +
                    "</strong>" +
                    " • Ordre de service d’intervention n°{{id}}\n" +
                    " • Un devis et une facture vierge à remplir obligatoirement sur place\n" +
                    " • Manuel à suivre pour la réalisation des devis et factures\n" +
                    " • Une description étape par étape de notre mode de fonctionnement\n" +
                    "<strong>" +
                    "<% if (typeof devisOrigine !== 'undefined') {%> • Le devis n°{{devisOrigine}} accepté\n <%}%>" +
                    "<% if (fileSupp) {%> • {{textfileSupp}} <%}%>\n" +
                    "</strong>" +
                    "\n" +
                    "<strong>Pour tous renseignements supplémentaires, vous pouvez joindre {{__login}} au 09.72.42.30.00</strong>\n" +
                    "\n" +
                    "L’équipe <strong>Edison Services</strong>\n"
            },
            envoiFacture: function(datePlain) {
                return "Bonjour\n" +
                    "Suite à votre demande d'intervention le " + datePlain + " chez:\n" +
                    "<strong>\n" +
                    "{{client.nom}} {{client.prenom}}\n" +
                    "{{client.address.n}} {{client.address.r}}\n" +
                    "{{client.address.cp}} {{client.address.v}}\n" +
                    "</strong>" +
                    "\n" +
                    "Veuillez trouvez ci-joint notre facture d'intervention\n" +
                    "Merci de transmettre le règlement directement à notre organisme de facturation.\n" +
                    "\n" +
                    "D'avance merci pour votre rapidité\n" +
                    "Cordialement,\n" +
                    "\n" +
                    "Service Comptabilité - Edison Services\n" +
                    "Tél. 09.72.51.08.01 (Ouvert de 09h00 à 12h30 / 14h00 à 16h30)\n" +
                    "Fax. 09.72.39.33.46\n";
            }
        },
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
                var start = "Suite à notre conversation téléphonique de tout à l'heure, ";
                var end = "Avez-vous reçu le devis ?\n\n" +
                    "Je n'ai pas eu de retour de votre part, devons nous planifier une intervention ?\n\n" +
                    "Merci de revenir vers moi pour me tenir au courant de la suite que vous donnerez à ce devis.\n\n" +
                    "Je reste à votre disposition pour toutes les demandes de renseignement\n\n";

                if (this.historique && this.historique.length === 1) {
            console.log('yay histor')                    
                    var cont;
                    if (this.categorie == 'VT')
                        cont = "je vous ai envoyé le devis que vous m'avez demandé pour le remplacement de votre vitrage, vous deviez le transmettre directement à votre compagnie d'assurance.\n\n";
                    else if (this.categorie == 'AS')
                        cont = "je vous ai transmis comme convenue le devis de remplacement de votre ballon d'eau chaude sanitaire.\n\n";
                    else
                        cont = "je vous ai transmis comme convenue le devis " + categorieClean + " que vous avez souhaité.\n\n";
                    var text = start + cont + end;

                } else if (this.historique && this.historique.length > 1) {
                    var text =  "je vous ai transmis un devis " + categorieClean + " en date du " + moment(this.historique[0].date).format('L') + ".\n\n" + end;
                } else if (this.categorie == 'VT') {
                    var text = "Suite à notre échange téléphonique concernant le remplacement de votre vitrage," +
                        "vous trouverez ci-joint le devis n°" + this.id + " correspondant à ce que nous avons vu ensemble.\n\n" +
                        "Merci de bien vouloir transmettre ce devis de remplacement de vitrage directement à votre compagnie d’assurance, afin d'obtenir leurs accords (si nécessaire).\n" +
                        "Merci de nous renvoyer le devis signé accompagné de la mention « BON POUR ACCORD » par mail.\n\n" +
                        "Nous interviendrons dans les plus brefs délais.\n\n" +
                        "Je reste à votre entière disposition pour toutes les demandes de renseignement et les remarques que vous pourriez avoir.\n\n";
                } else if (_.find(this.produits, function(e) {
                        return _.startsWith(e.ref, "BAL");
                    })) {
                    var text = "Suite à notre échange téléphonique concernant le remplacement de votre ballon d'eau chaude sanitaire," +
                        "vous trouverez ci-joint le devis n°" + this.id + ".\n\n" +
                        "Je reste à votre entière disposition pour tous renseignements complémentaires ou remarques que vous pourriez avoir (technique/prix).\n\n" +
                        "Sachez également, que votre installation sera éligible à notre assurance RC PRO et notre assurance décennale.\n" +
                        "Dès votre accord, nous interviendrons rapidement.\n\n" +
                        "Meilleures salutations,\n\n";
                } else {
                    var text = "Suite à notre dernier échange concernant la réalisation d'un devis " + categorieClean + ", \n" +
                        "vous trouverez ci-joint le devis n°" + this.id + " correspondant à ce que nous avons vu ensemble. \n\n" +
                        "Sachez également, que votre installation sera éligible à notre assurance RC PRO et notre assurance décennale.\n" +
                        "Lors de l'acceptation, je vous prie de me renvoyer le devis signé, accompagné de la mention:\n" +
                        "<strong> « BON POUR ACCORD » </strong>\n" +
                        "Je reste à votre entière disposition pour tous les renseignements ou les remarques que vous pourriez avoir concernant ce devis (technique, délais, prix). \n\n" +
                        "Merci de me tenir au courant de la suite que vous donnerez à ce devis. \n\n";

                }
                var outro = "Cordialement, \n\n" +
                    (user.pseudo ||  " Arnaud,\n") +
                    "<strong>Ligne Direct : " + (user.ligne ||  "09.72.42.30.00") + "</strong>\n" +
                    "<strong>Ligne Atelier : " + "09.72.42.30.00" + "</strong>\n";

                return intro + text + outro;
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
