module.exports = {
    sms: {
        intervention: {
            demande: function(user) {
                var config = require('./dataList.js')
                var categorieClean = config.categories[this.categorie].suffix + " " + config.categories[this.categorie].long_name.toLowerCase()
                return "Bonjour M. BOUKRIS, nous cherchons a vous joindre pour une intervention de " + categorieClean +
                    " à faire le " + moment(this.date.intervention).format("LLLL") +
                    "Pourriez - vous vous rendre disponible ?\n" +
                    "Merci de nous contacter au plus vite au 09.72.42.30.00.\n" +
                    "Merci d 'avance pour votre réponse.\n" +
                    (user.pseudo ||  "Arnaud") +
                    "Ligne Directe " + (user.ligne ? (user.ligne.match(/.{2}|.{1,2}/g).join('.')) :  "09.72.44.16.63") + "\n" +
                    "Edison Services\n"

            },
            envoi: function(user) {
                var sms = _.template("OS {{id}}\n" +
                    "Intervention chez {{client.civilite}} {{client.prenom}} {{client.nom}} au " +
                    "{{client.address.n}} {{client.address.r}} {{client.address.cp}}, {{client.address.v}} " +
                    "le " + moment(this.date.intervention).format("LLLL") + ".\n")(this)
                sms += this.prixAnnonce ? this.prixAnnonce + "€ HT. " : "Pas de prix annoncé. ";
                sms += "\nMerci de prendre rdv avec le client au " + this.client.telephone.tel1;
                sms += this.client.telephone.tel2 ? " ou au " + this.client.telephone.tel2 : "";
                sms += '\n' + (user.pseudo ||  "Arnaud") + ',\n';
                sms += "Ligne directe: " + (user.ligne ? (user.ligne.match(/.{2}|.{1,2}/g).join('.')) :  "09.72.42.30.00") + "\n";
                return sms + "Edison Services."
            },
            annulation: "L'intervention {{id}} chez {{client.civilite}} {{client.nom}} à {{client.address.v}} le {{datePlain}} a été annulé. \nMerci de ne pas intervenir. \nEdison Services",
/*            demande: function(user) {
                return "Bonjour M. " + _.get(this, 'sst.representant.nom', '') + ", nous cherchons a vous joindre pour une intervention de vitrerie à faire aujourd'hui.\n" +
                    "Pourriez-vous vous rendre disponible ?\n" +
                    "Merci de nous contacter au plus vite au 09.72.42.30.00.\n" +
                    "Merci d'avance pour votre réponse.\n" +
                    "\n" + (user.pseudo ||  "Arnaud") + "\n" +
                    "Ligne Directe " + (user.ligne ? (user.ligne.match(/.{2}|.{1,2}/g).join('.')) :  "09.72.42.30.00") + "\n" +
                    "Edison Services"
            }*/
        }
    },

    lettre: {
        intervention: {
            envoiFacture: function() {
                return "<p>Madame, Monsieur,</p>" +
                    "<p>Suite à notre intervention le {{datePlain}} dans vos locaux:\n" +
                    "<p strong center>{{client.civilite}} {{client.nom}} {{client.prenom}}\n" +
                    "{{client.address.n}} {{client.address.r}}, {{client.address.cp}} {{client.address.v}}\n" +
                    "Tél. : {{client.telephone.tel1}}</p>" +
                    "Pour les raisons suivantes: </p>" +
                    "<p strong center>{{description}}</p>" +
                    "<p>Nous vous confirmons que l'intervention à été réalisée par nos soins.\n" +
                    "Vous trouverez ci joint la facture à regler.\n" +
                    "Nous vous prions de bien vouloir transmettre le règlement par chèque à l'ordre de:</p>" +
                    "<p strong center> S.A.R.L EDISON SERVICES</p>" +
                    "<p>A l'organisme qui gère notre comptabilité:</p>" +
                    "<p strong center> EDISON SERVICES FRANCE\n" +
                    "Service comptabilité\n" +
                    "75 rue des dames, 75017 Paris\n" +
                    "Tél. 09.72.51.08.01 (Ouvert de 09h00 à 12h30 / 14h00 à 16h30)</p>" +
                    "<p>" +
                    "Pour un reglement par virement :</p>" +
                    "<p>RIB: 30004 01557 00010041423 30\n" +
                    "IBAN: FR76 3000 4015 5700 0100 4142 330\n" +
                    "BIC: BNPAFRPPPRG" +
                    "</p>" +
                    "<p>" +
                    "Par ailleurs, si quelque raison s'opposait au règlement de la facture, nous vous remercions de nous le \nfaire savoir dans les plus brefs délais.</p>" +
                    "<p>Restant à votre entière disposition, nous vous prions de croire, Madame, Monsieur l'expression de nos sincères salutations distinguées.</p>" +
                    "<p>Merci d'indiquer la réference de la facture (<strong>{{id}}</strong>) dans le réglement. </p>" +
                    "<ul>" +
                    "<li>Ci-joint la facture</li>" +
                    "</ul>" +
                    "<p>Cordialement.</p>"
            }
        },
        artisan: {
            envoiFacturier: function() {
                return "<p>Cher Monsieur {{representant.nom}},</p>" +
                    "<p>Bienvenue au sein du réseau partenaire Edison Services.</p>" +
                    "<p>Nous mettons à votre disposition un facturier et un deviseur qui vous permettra d’intervenir chez nos clients</p>" +
                    "<p>Vous trouverez également ci-joint un manuel d’utilisation qui vous aideras à compléter les factures, devis, et attestation de T.V.A. simplifié</p>" +
                    "<p>Merci de prendre le temps de lire cette brochure attentivement.</p>" +
                    "<p>Ces documents resterons à votre disposition durant la durée de notre partenariat, mais restent la propriété intellectuelle de la société EDISON Services et devront nous être renvoyé en cas de fin de partenariat.</p>" +
                    "<p>Vous en souhaitant bonne réception.</p>" +
                    "<p><i>Bienvenue dans l’équipe EDISON Services.</i></p>" +
                    "<p class='align-right'><b>Yohann RHOUM</b></p>" +
                    "<p class='align-right'>Service Partenariat</p>"
            }
        }
    },
    mail: {
        intervention: {
            factureAcquitte: function() {
                return "Bonjour,\n" +
                    "Vous trouverez ci-joint la facture acquitté de l'intervention n°{{id}}\n" +
                    "Cordialement\n" +
                    "\n" +
                    "Service Comptabilité - Edison Services\n" +
                    "Tél. 09.72.51.08.01 (Ouvert de 09h00 à 12h30 / 14h00 à 16h30)\n" +
                    "Fax. 09.72.39.33.46\n";
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
            },
            os: function(user) {
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
                    "<% if (typeof devisOrigine !== 'undefined' && !fileSupp) {%> \n<strong>Vous trouverez également le devis accepté et signé par notre client</strong> <%}%>" +
                    "<% if (typeof devisOrigine === 'undefined' && fileSupp) {%> \n<strong>Vous trouverez également {{textfileSupp}} à votre disposition</strong> <%}%>" +
                    "<% if (typeof devisOrigine !== 'undefined' && fileSupp) {%> \n<strong>Vous trouverez également le devis accepté et signé par notre client, et {{textfileSupp}}</strong> <%}%>" +
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
                    "<strong>Pour tous renseignements supplémentaires, vous pouvez joindre " + (user.pseudo ||  "Arnaud") +
                    " au " +
                    (user.ligne ? (user.ligne.match(/.{2}|.{1,2}/g).join('.')) :  "09.72.42.30.00") + "</strong>\n" +
                    "\n" +
                    "L’équipe <strong>Edison Services</strong>\n"
            }
        },
        devis: {
            envoi: function(user) {
                var config = require('./dataList.js')
                var categorieClean = config.categories[this.categorie].suffix + " " + config.categories[this.categorie].long_name.toLowerCase()
                var pseudo = user.pseudo
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
                if (this.combo && this.comboText) {
                    var text = "Suite à notre dernier échange téléphonique concernant la réalisation d'un " + this.comboText + ".\n" +
                        "\n" +
                        "Vous trouverez ci-joint <strong>le devis n°" + this.id + " </strong>qui correspond à ce que nous avons vu ensemble.\n" +
                        "\n" +
                        "Je vous rappel que les délais d'interventions dépendent également de votre rapidement de réponse.\n" +
                        "Sachez également que votre installation sera éligible à notre assurance RC PRO et notre assurance décennale.\n" +
                        "Lors de l'acceptation, je vous prie de me renvoyer signé, accompagné de la mention : \n" +
                        "\n" +
                        "<strong> « BON POUR ACCORD » </strong>\n" +
                        "\n" +
                        "Je reste à votre entière disposition pour tous les renseignements ou les remarques que vous pourriez avoir concernant ce devis (technique, délais, prix).\n"

                } else if (this.historique && this.historique.length === 1) {
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
                    var text = "je vous ai transmis un devis " + categorieClean + " en date du " + moment(this.historique[0].date).format('L') + ".\n\n" + end;
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
                        "Sachez également, que votre installation sera éligible à notre assurance RC PRO et notre assurance décennale.\n\n" +
                        "Lors de l'acceptation, je vous prie de me renvoyer le devis signé, accompagné de la mention:\n\n" +
                        "<strong> « BON POUR ACCORD » </strong>\n\n" +
                        "Je reste à votre entière disposition pour tous les renseignements ou les remarques que vous pourriez avoir concernant ce devis (technique, délais, prix). \n\n" +
                        "Merci de me tenir au courant de la suite que vous donnerez à ce devis. \n\n";

                }
                var outro = "Cordialement, \n\n" +
                    (user.pseudo ||  "Arnaud,") + '\n' +
                    "<strong>Ligne Directe : " + (user.ligne ? (user.ligne.match(/.{2}|.{1,2}/g).join('.')) :  "09.72.42.30.00") + "</strong>\n" +
                    "<strong>Ligne Atelier : " + "09.72.42.30.00" + "</strong>\n";

                return intro + text + outro;
            }
        },
        artisan: {
            envoiContrat: function(user) {
                return "Monsieur {{representant.nom}},\n" +
                    "\n" +
                    "Comme expliqué lors de notre conversation téléphonique, nous sommes une entreprise générale du bâtiment situé dans la région d'île de France.\n" +
                    "\n" +
                    "Notre entreprise intervient de manière régulière dans plusieurs villes en France pour des interventions de dépannage spécialisé dans le second œuvre (plomberie sanitaire, génie climatique, serrurerie, vitrerie et l'électricité générale).\n" +
                    "\n" +
                    "Nos clients sont des particuliers, des réseaux d'entreprises, des commerces, des administrateurs de bien et des agences immobilières.\n" +
                    "\n" +
                    "Je suis actuellement à la <u><b>recherche d'un partenaire</b></u> pouvant intervenir auprès de nos clients dans votre région pour des prestations de dépannage.\n" +
                    "Vous trouverez ci-joint une brochure expliquant notre fonctionnement pour une éventuelle collaboration.\n" +
                    "Je vous transmets également un contrat de partenariat permettant d'établir les conditions de travail entre nos deux entreprises.\n" +
                    "\n" +
                    "Pour chaque intervention, vous recevez au préalable un ordre de service par mail et par téléphone,<u><b> l'ordre de service n'est validé que sous votre accord.</b></u>\n" +
                    "\n" +
                    "Une fois chez notre client, vous restez totalement autonome sur le montant à facturer et si nécessaire vous pouvez ajuster le montant de la prestation tout en ayant préalablement prévenu notre client.\n" +
                    "\n" +
                    "Lors des interventions, vous représentez notre entreprise c'est pourquoi vous disposez des documents fournis à tous nos partenaires en France.\n" +
                    "\n" +
                    "<u><b>Vous avez à votre disposition :</u></b>\n" +
                    "\n" +
                    "• Un bloc facturier au nom de Edison Services\n" +
                    "• Un bloc devis au nom de Edison Services\n" +
                    "• Un catalogue de prix de vente du matériel\n" +
                    "• Un accès à tous nos fournisseurs\n" +
                    "\n" +
                    "Si vous souhaitez rejoindre notre réseau, vous trouverez les documents à nous transmettre :\n" +
                    "\n" +
                    "• Le contrat de partenariat signé\n" +
                    "• Immatriculation ou KBIS\n" +
                    "• Pièce d'identité du responsable de l'entreprise\n" +
                    "• Attestation d'assurance (si disponible)\n" +
                    "\n" +
                    "Je tiens à vous rappelez que cette future collaboration ne vous oblige jamais à intervenir pour nous. Il s'agit simplement de rajouter à votre quotidien des interventions en plus.\n" +
                    "\n" +
                    "Cependant, j'attire votre attention sur le fait que nous recherchons des personnes de confiances, maîtrisant parfaitement l'aspect technique du travail à effectuer tout en sachant être à l'aise avec la clientèle.\n" +
                    "\n" +
                    "Je reste à votre entière disposition pour toutes les questions ou les remarques que vous pourriez avoir.\n" +
                    "\n" +
                    "En vous remerciant d'avance pour l'attention que vous porterez à ma demande et aux documents transmis.\n" +
                    "\n" +
                    "Dans l'attente d'un retour de votre part.\n" +
                    "\n" +
                    "PS : Si vous souhaitez faire un test avant de travailler régulièrement avec notre entreprise et dans le but de comprendre le fonctionnement global de notre structure, n'hésitez pas à nous le faire savoir.\n" +
                    "\n" +
                    "Cordialement\n" +
                    "\n" +
                    "<b>Yohann RHOUM</b>\n" +
                    "Service partenariat\n" +
                    "Port : 06.37.37.59.45 Fax : 09.72.39.33.46\n" +
                    "yohann.rhoum@edison-services.fr\n" +
                    "\n" +
                    "<b>Edison Services</b>\n" +
                    "Dépannage - Entretien - Installation - Rénovation\n" +
                    "Siège social : 75, rue des dames - 75017 Paris\n" +
                    "contact@edison-services.fr - www.edison-services.fr"
            },
            rappelContrat: function(user) {
                return "Bonjour Monsieur {{representant.nom}}\n" +
                    "\n" +
                    "Suite à notre conversation téléphonique du {{datePlain}} concernant la signature d'un contrat de partenariat entre nos deux entreprises.\n" +
                    "\n" +
                    "Vous trouverez donc ci-joint la déclaration de sous-traitance à remplir.\n" +
                    "\n" +
                    "Merci de joindre également à cette déclaration les éléments suivants :\n" +
                    "\n" +
                    "• Extrait KBIS ou INSEE\n" +
                    "• Photocopie R/V de la pièce d'identité du gérant\n" +
                    "\n" +
                    "Vous pouvez nous transmettre ces pièces administratives par mail à :\n" +
                    "\n" +
                    "yohann.rhoum@edison-services.fr\n" +
                    "\n" +
                    "\n" +
                    "Ou par voie postal :\n" +
                    "\n" +
                    "<u><b>" +
                    "Edison Services\n" +
                    "Service Partenariat\n" +
                    "75 rue des dames - 75017 PARIS\n" +
                    "</b></u>" +
                    "\n" +
                    "\n" +
                    "Dès réception de ces documents et validation par nos services, vous recevrez par voie postal:\n" +
                    "\n" +
                    "• Un bloc facture Edison Services\n" +
                    "• Un bloc devis Edison Services\n" +
                    "• Un catalogue de prix de vente du matériel\n" +
                    "• Un accès à tous nos fournisseurs\n" +
                    "Je reste à votre entière disposition pour toutes les questions ou les remarques que vous pourriez avoir.\n" +
                    "\n" +
                    "Dans l'attente d'une réponse favorable de votre part,\n" +
                    "\n" +
                    "Cordialement\n" +
                    "\n" +
                    "<b>Yohann RHOUM</b>\n" +
                    "Service Partenariat\n" +
                    "Port : 06.37.37.59.45 Fax : 09.72.39.33.46\n" +
                    "yohann.rhoum@edison-services.fr\n" +
                    "\n" +
                    "<b>Edison Services</b>\n" +
                    "Dépannage - Entretien - Installation - Rénovation\n" +
                    "Siège social : 75 rue des Dames, 75017, Paris\n" +
                    "contact@edison-services.fr - www.edison-services.fr\n"
            },
            dossierComplet: function() {
                return "Monsieur <b>{{representant.nom}}</b>,\n" +
                    "\n" +
                    "Nous avons le plaisir de vous annoncer que vous êtes dès à présent <b>membre du réseau partenaire Edison Services.</b>\n" +
                    "\n" +
                    "Le service partenariat a validé votre dossier.\n" +
                    "\n" +
                    "Vous allez recevoir très prochainement les pièces administratives vous permettant d'intervenir directement auprès de nos clients.\n" +
                    "\n" +
                    "Ces documents seront transmis par voie postale à cette adresse :\n" +
                    "<p strong center>" +
                    "Monsieur {{representant.nom}},\n" +
                    "{{address.n}} {{address.r}}\n" +
                    "{{address.cp}} {{address.v}}</b>\n" +
                    "</p>" +
                    "Nous pouvons désormais vous proposez d'intervenir auprès de nos clients dans les domaines suivants :\n" +
                    "<p strong center>électricité - plomberie - chauffage - climatisation - serrurerie</p>" +
                    "Vous trouverez ci-joint, votre fiche d'identification récapitulative.\n" +
                    "\n" +
                    "Le service intervention de notre société devrait faire appel à vous dans les plus brefs délais.\n" +
                    "Cordialement,\n" +
                    "\n" +
                    "Yohann RHOUM\n" +
                    "Service partenariat\n" +
                    "Port : 06.45.57.87.66 Fax : 09.72.39.33.46\n" +
                    "yohann.rhoum@edison-services.fr\n" +
                    "\n" +
                    "Edison Services\n" +
                    "Dépannage - Entretien - Installation - Rénovation\n" +
                    "Siège social : 75, rue des dames - 75010 Paris\n" +
                    "contact@edison-services.fr - www.edison-services.fr\n"
            }
        }
    },

};
