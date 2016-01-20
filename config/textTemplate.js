var getPrecision = function(address) {
    var precision = [];

    address.batiment && precision.push('bat. ' + address.batiment)
    address.etage && precision.push('étage ' + address.etage)
    address.code && precision.push('code ' + address.code)

    if (precision.length) {
        return '(' + precision.join(' - ') + ')';
    }
    return '';
}

module.exports = {
    sms: {
        intervention: {
            rappelNoCalls: function(id) {
                return "OS " + id + "\nAttention ! Le client attend votre appel pour confirmer le rendez-vous. Merci prendre contact avec lui immédiatement.\n Edison Services"

            },
            rappelArtisan: function() {
                return "OS {{e.id}}\n" +
                    "N'oubliez pas votre RDV aujourd'hui à 13h00 chez {e.client.civilite}} {{e.client.nom}} ({{e.client.address.cp}})\n" +
                    "Edison Services";
            },
            demande: function(user, config, _moment) {
                var _capitalize = require('lodash/string/capitalize')
                _moment = (_moment || moment);
                this.mmt = _moment(this.date.intervention);
                this.format = this.mmt.isSame(_moment(), 'day') ? "[aujourd'hui à ]HH[h]mm" : "[le ]DD[/]MM[ à ]HH[h]mm"
                this.datePlain = this.mmt.format(this.format)
                console.log(this.mmt.toDate(), this.datePlain)

                this.user = user;
                this.user.pseudo = _capitalize(this.user.pseudo ||  "arnaud");
                this.ligneDirect = user.ligne ? (user.ligne.match(/.{2}|.{1,2}/g).join('.')) :  "09.72.44.16.63";
                this.categorieClean = config.categories[this.categorie].suffix + " " + config.categories[this.categorie].long_name.toLowerCase()
                return "M. {{sst.representant.nom}},\n" +
                    "Etes vous disponible pour une intervention {{categorieClean}} {{datePlain}} à  {{client.address.v}} {{client.address.cp}} ?\n" +
                    "{{user.pseudo}} : {{ligneDirect}}\n";
                /*  return "Bonjour M. {{sst.representant.nom}},\n" +
                      "nous avons une intervention {{categorieClean}} {{datePlain}} à {{client.address.v}} ({{client.address.cp}}).\n" +
                      "Etes-vous disponible ?\n" +
                      "Merci de prendre contact avec Edison Services.\n" +
                      */
            },
            envoi: function(user) {
                //var mmt = require('moment')
                //var lodash = require('lodash')
                var tels = this.client.telephone.tel1.match(/.{2}/g).join('.');
                if (this.client.telephone.tel2) {
                    tels += (' - ' + this.client.telephone.tel2.match(/.{2}/g).join('.'));
                }
                if (this.client.telephone.tel3) {
                    tels += (' - ' + this.client.telephone.tel3.match(/.{2}/g).join('.'));
                }
                var options = {
                    sstid: typeof this.sst == 'number' ? this.sst : this.sst.id,
                    precision: getPrecision(this.client.address),
                    datePlain: moment(this.date.intervention).format("[le] DD[/]MM[ à ]HH[h]mm"),
                    login: user.pseudo || "Arnaud",
                    ligne: (user.ligne ||  "0972423000").match(/.{2}/g).join('.'),
                    remarques: this.remarqueSms ? (' (' + this.remarque + ')') : '',
                    prix: this.prixAnnonce ? ("Prix: " + this.prixAnnonce + "€ HT. ") : "Faire devis sur place. ",
                    telClient: tels
                }
                if (this.newOs) {
                    var sms = "OS {{inter.id}}\n" +
                        "RDV le {{options.datePlain}}.\n" +
                        "{{inter.client.civilite}} {{inter.client.prenom}} {{inter.client.nom}}\n" +
                        "{{inter.client.address.n}} {{inter.client.address.r}} {{inter.client.address.cp}}, {{inter.client.address.v}} {{options.precision}}\n" +
                        "{{inter.description}}{{options.remarques}}.\n" +
                        "{{options.prix}}\n" +
                        "Tel: 09.701.702.01 (OS {{inter.id}})\n" +
                        "{{options.login}}: 09.72.54.52.82\n" +
                        "Merci de contacter le client pour confirmer le RDV\n" +
                        "mon-depannage.com"
                } else {
                    var sms = "OS {{inter.id}}\n" +
                        "RDV le {{options.datePlain}}.\n" +
                        "{{inter.client.civilite}} {{inter.client.prenom}} {{inter.client.nom}}\n" +
                        "{{inter.client.address.n}} {{inter.client.address.r}} {{inter.client.address.cp}}, {{inter.client.address.v}} {{options.precision}}\n" +
                        "{{inter.description}}{{options.remarques}}.\n" +
                        "{{options.prix}}\n" +
                        "Tel: {{options.telClient}}\n" +
                        "{{options.login}}: 09.72.54.52.82\n" +
                        "Merci de contacter le client pour confirmer le RDV\n" +
                        "mon-depannage.com"
                }
                return _.template(sms)({
                    inter: this,
                    options: options
                })
            },
            annulation: "L'intervention {{id}} chez {{client.civilite}} {{client.nom}} à {{client.address.v}} le {{datePlain}} a été annulé. \nMerci de ne pas intervenir. \nEdison Services",
        }
    },

    lettre: {
        intervention: {
            relance4: function() { /* LETTRE */
                return "<p style='margin-top: 0px;'> Affaire de recouvrement suivie par: Mr DELVAUX<br>" +
                    "Réf dossier: {{os}}<br>" +
                    "Pièce - jointe: Injonction de payer au tribunal de commerce de Paris<br>" +
                    "En copie: Monsieur le Greffier du tribunal de commerce de Paris </p>" +

                    "<div class='spacer'></div>" +
                    "<strong> LETTRE RECOMMANDEE AVEC AR </strong>" +
                    "<div class='spacer'></div>" +
                    "<strong> OBJET: Mise en demeure - Dossier d'injonction du tribunal de commerce de Paris </strong>" +
                    "<div class='spacer'></div>" +

                    "<p>A l'attention de <strong> {{facture.nom}} {{facture.prenom}} </strong>, </p>" +
                    "<p>Nous constatons avec regret qu'en dépit des trois derniers courriers de relances, vous n'avez toujours pas procédé au solde de votre facture n° {{os}}. <p>" +
                    "<p>!En conséquence, nous vous informons que nous engageons une action judiciaire à votre encontre.</p>" +
                    "<p>Ainsi, nous vous mettons en demeure par le présente lettre recommandée de nous régler la somme de {{prixFinalTTC}} euros dans un délais de huit jours à compté de la réception de ce recommandé.</p>" +
                    "<p> Nous vous rappelons que le présent courrier fait courir les intérêts légaux et conventionnels. </p>" +
                    "<p> A défaut de réception dans les délais, votre dossier sera automatiquement transmis à notre service juridique.</p>" +
                    "<p> Cordialement, </p>" +
                    "<p style='text-align:right'>" +
                    "<b> <u> Service recouvrement </u> </b><br>" +
                    "Tél: 09.72.50.20.22" +
                    "</p>"
            },
            relance3: function() { /* LETTRE */
                return "<p> Affaire de recouvrement suivie par: Mr BARRIERE <br> Ligne direct: 09.72.50.20.22 <br> Réf dossier: {{os}} </p>" +
                    "<strong> LETTRE RECOMMANDEE AVEC AR </strong>" +
                    "<div class='spacer'></div>" +
                    "<strong> OBJET: Troisième relance pour facture impayée avant mise en demeure </strong>" +
                    "<p> A l'attention de <b> {{facture.nom}} {{facture.prenom}} </b>, <br>" +

                    "<p> Nous constatons que malgré nos précédentes lettres de rappel, vous n'avez toujours pas procédé au règlement de la facture <b> n° {{os}} </b>. <br> Votre compte reste débiteur à ce jour des sommes suivantes: <p>" +
                    "<table style='border-collapse: collapse;' cellspacing='0' cellpadding='8'>" +
                    "    <tr style='background: rgb(106, 168, 79); !important;'>" +
                    "        <th style='border: 1px solid black;font-size:13px;width: 70px;'> Date </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;text-align:left'> Numéro </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;text-align:right'> Montant </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;text-align:left'> Lieu de l'intervention </th>" +
                    "    </tr>" +
                    "    <tr>" +
                    "        <th style='border: 1px solid black;font-size:13px;'> {{datePlain}} </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;'> {{os}} </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;text-align:right'> {{prixFinalTTC}} € </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;'> {{client.address.cp}} {{client.address.v}} </th>" +
                    "    </tr>" +
                    "    <tr>" +
                    "        <th style='border: 1px solid black;font-size:13px;' colspan='2'> <b> TOTAL T.T.C</b> </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;text-align:right'> {{prixFinalTTC}} € </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;'></th>" +
                    "    </tr>" +
                    "</table>" +


                    "<p> Nous considérons aujourd'hui que vous faites opposition au règlement de la somme due. </p>" +
                    "<p> A défaut de réception de la totalité des <strong>{{prixFinalTTC}} €</strong>, sous huitaine, votre dossier sera transmis à notre service contentieux. </p>" +
                    "<p> Celui-ci entamera les démarches judiciaires pour en obtenir le règlement majoré des frais de recouvrement et de ceux relatifs à l'article 700 du NCPC. </p>" +


                    "<p>A l'organisme qui gère notre recouvrement:</p>" +
                    "<p strong center> EDISON SERVICES FRANCE<br>" +
                    "Service recouvrement<br>" +
                    "32 rue Fernand Pelloutier, 92110 Clichy<br>" +
                    "Tél. 09.72.50.20.22 (Ouvert de 09h00 à 12h30 / 14h00 à 16h30)</p>" +

                    "<p> Nous vous prions d'agréer, Madame, Monsieur, nos salutations distinguées. </p>" +
                    "<p>Cordialement.</p>" +
                    "<p style='text-align:right'>" +
                    "<b> <u> Service recouvrement </u> </b><br>" +
                    "Tél: 09.72.50.20.22 </p>"
            },
            relance2: function() { /* LETTRE */
                return "<p> Réf: {{os}} <br> Pièce jointe: Facture n°{{os}} </p>" +
                    "<div class='spacer'></div>" +
                    "<strong> OBJET: Deuxième relance pour facture impayée </strong>" +
                    "<p>Madame, Monsieur, </p>" +

                    "<p> Sauf erreur ou omission de notre part, nous constatons que votre compte client présente à ce jour un solde débiteur. <br> Ce montant correspond à nos factures suivantes restées impayées: <p>" +

                    "<table style='border-collapse: collapse;' cellspacing='0' cellpadding='8'>" +
                    "    <tr style='background: rgb(106, 168, 79); !important;'>" +
                    "        <th style='border: 1px solid black;font-size:13px;width: 70px;'> Date </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;text-align:left'> Numéro </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;text-align:right'> Montant </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;text-align:left'> Lieu de l'intervention </th>" +
                    "    </tr>" +
                    "    <tr>" +
                    "        <th style='border: 1px solid black;font-size:13px;'> {{datePlain}} </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;'> {{os}} </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;text-align:right'> {{prixFinalTTC}} € </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;'> {{client.address.cp}} {{client.address.v}} </th>" +
                    "    </tr>" +
                    "    <tr>" +
                    "        <th style='border: 1px solid black;font-size:13px;' colspan='2'> <b> TOTAL T.T.C</b> </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;text-align:right'> {{prixFinalTTC}} € </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;'></th>" +
                    "    </tr>" +
                    "</table>" +


                    "<p> L'échéance étant dépassée, nous vous demandons de bien vouloir régulariser cette situation par retour de courrier. </p>" +

                    "<p>A l'organisme qui gère notre comptabilité:</p>" +
                    "<p strong center> EDISON SERVICES FRANCE<br>" +
                    "Service comptabilité<br>" +
                    "32 rue Fernand Pelloutier, 92110 Clichy<br>" +
                    "Tél. 09.72.51.08.01 (Ouvert de 09h00 à 12h30 / 14h00 à 16h30)</p>" +
                    "<p>" +
                    "Pour un règlement par virement :<br>" +
                    "RIB: 30004 01557 00010041423 30<br>" +
                    "IBAN: FR76 3000 4015 5700 0100 4142 330<br>" +
                    "BIC: BNPAFRPPPRG" +
                    "</p>" +
                    "<p> Merci d'indiquer la référence de la facture ({{os}}) dans le règlement. </p>" +
                    "<p> Nous vous prions d'agréer, Madame, Monsieur, nos salutations distinguées. </p>" +
                    "<p>Cordialement.</p>" +
                    "<p style='text-align:right'>" +
                    "<b> <u> Service comptabilité </u> </b><br>" +
                    "Tél: 09.72.51.08.01" +
                    "</p>"
            },
            relance1: function() { /* LETTRE */
                return "<strong> OBJET: Première relance pour facture n°{{os}} impayée </strong>" +
                    "<p>Madame, Monsieur, <br>" +
                    "Suite a l'intervention que nous avons réalisée en date du {{datePlain}}, <p>" +
                    "<p>A ce jour, nous <b> <u> sommes toujours dans l'attente d'un règlement de cette facture </u> </b>. <br>" +
                    "Nous vous prions de bien vouloir transmettre le règlement par chèque à l'ordre de:</p>" +
                    "<p strong center> EDISON SERVICES FRANCE</p>" +
                    "<p>A l'organisme qui gère notre comptabilité:</p>" +
                    "<p strong center> EDISON SERVICES<br>" +
                    "Service comptabilité<br>" +
                    "32 rue Fernand Pelloutier, 92110 Clichy<br>" +
                    "Tél. 09.72.51.08.01 (Ouvert de 09h00 à 12h30 / 14h00 à 16h30)</p>" +
                    "<p>" +
                    "<p>Pour un règlement par virement :</p>" +
                    "RIB: 30004 01557 00010041423 30<br>" +
                    "IBAN: FR76 3000 4015 5700 0100 4142 330<br>" +
                    "BIC: BNPAFRPPPRG" +
                    "</p>" +
                    "<p>Merci d'indiquer la réference de la facture (<strong>{{id}}</strong>) dans le réglement. </p>" +
                    "<ul>" +
                    "<li>Ci-joint la facture</li>" +
                    "</ul>" +
                    "<p style='text-align:right'>" +
                    "<b> <u> Service comptabilité </u> </b><br>" +
                    "Tél: 09.72.51.08.01" +
                    "</p>"
            },
            envoiFacture: function() { /* LETTRE */
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
                    "32 rue Fernand Pelloutier, 92110 Clichy\n" +
                    "Tél. 09.72.51.08.01 (Ouvert de 09h00 à 12h30 / 14h00 à 16h30)</p>" +
                    "<p>" +
                    "Pour un règlement par virement :</p>" +
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
            rappelDocuments: function() {
                return "<strong> OBJET: En attente de vos documents administratifs </strong>" +
                    "<p> Monsieur, </p>" +
                    "<p> Depuis plusieurs mois <b><u>vous intervenez régulièrement</u></b> auprès de nos clients." +
                    "<p> A chaque attestation de paiement reçu, nous vous avons transmis un <b><u>contrat de déclaration de sous-traitance</u></b> à remplir et à nous faire parvenir accompagné des documents administratifs obligatoires. </p>" +
                    "<p> Cependant, à ce jour nous sommes toujours dans l'attente de ces documents obligatoires. </p>" +
                    "<p> En effet, depuis la loi de fincance de 1er janvier 2014 concernant la sous-traitance dans le secteur du bâtiment, nous avons l'obligation de déclarer l'ensemble de nos sous-traitants intervenants chez nos clients. </p>" +
                    "<p> Merci de nous transmettre vos documents administratifs suivants: </p>" +
                    "<p>" +
                    (!this.document.kbis.ok ? "&emsp;&emsp; ☐ &emsp;&emsp; KBIS ou immatriculation <br>" : '') +
                    (!this.document.contrat.ok ? "&emsp;&emsp; ☐ &emsp;&emsp; Contrat de partenariat reçu par mail <br>" : '') +
                    (!this.document.cni.ok ? "&emsp;&emsp; ☐ &emsp;&emsp; Photocopie Recto/Verso de la pièce d'identité du gérant <br>" : '') +
                    (!this.document.assurance.ok ? "&emsp;&emsp; ☐ &emsp;&emsp; Attestation d'assurance <br>" : '') +
                    (!this.document.rib.ok ? "&emsp;&emsp; ☐ &emsp;&emsp; RIB <br>" : '') +
                    (!this.document.ursaff.ok ? "&emsp;&emsp; ☐ &emsp;&emsp; Attestation URSAFF" : '') +
                    "</p>" +
                    "<p> Veuillez envoyer vos documents à cette adresse: </p>" +
                    "<p strong center> EDISON SERVICES FRANCE<br>" +
                    "Service partenariat - Yohann Rhoum <br>" +
                    "32 rue Fernand Pelloutier, 92110 Clichy<br>" +
                    "Tél. 09.72.51.08.01 (Ouvert de 09h00 à 12h30 / 14h00 à 16h30)</p>" +

                    "<p> Nous vous prions d'agréer, monsieur, nos salutations distinguées. </p>" +
                    "<header style='margin-top: 85px;'>" +
                    "<b> Monsieur QUEUDRAY </b>" +
                    "<b> Responsable Comptable</b>" +
                    "</header>"
            },
            envoiFacturier: function() {
                return "<style> .logo { width: 7cm; margin-top: 50px; } header { margin-top: -90px; } header p { margin-bottom: 5px!important} p { line-height: 19px; margin-bottom: 20px;}</style>" +

                    "<p style='font-size: 10px; position: absolute; width: 6cm; text-align: center; top: 95px; left: 13.3cm;'>{{nomSociete}} - {{id}}</p>" +
                    "<p> Cher Monsieur {{representant.nom}} </p>" +

                    "<p> Bienvenue au sein du réseau partenaire EDISON SERVICES. </p>" +
                    "<p> Nous mettons à votre disposition un facturier et un deviseur qui vous permettra d'intervenir chez nos clients. </p>" +
                    "<p> Vous trouverez également ci-joint un manuel d'utilisation qui vous aideras à compléter les factures, devis, et attestation de T.V.A simplifié. </p>" +
                    "<p> Merci de prendre le temps de lire cette brochure attentivement. </p>" +
                    "<p> Ces documents resterons à votre disposition durant la durée de notre partenariat, mais restent la propriété intellectuelle de la société EDISON SERVICES et devront nous être renvoyé en cas de fin de partenariat. </p>" +
                    "<p> Vous en souhaitant bonne réception. </p>" +
                    "<p> <i>Bienvenue dans l'équipe EDISON SERVICES.</i> </p>" +

                    "<header style='margin-top: 35px; width: 40%; margin-left: 11cm;'>" +
                    "<b> Service Partenariat </b> <br>" +
                    "<p style='font-size: 13px; line-height: 20px;'> Monsieur RHOUM </p>" +
                    "</header>"



            }
        }
    },
    mail: {
        bug: {
            declare: function() {
                return "<h1>BUG SIGNALED by {{login.toLowerCase()}}</h1><br>" +
                    "<strong>Sur quel page je me trouve:</strong><br>" +
                    "{{location}}<br>" +
                    "<strong>Qu’est se que j’essaie de faire ?</strong><br>" +
                    "{{what}}<br>" +
                    "<strong>Sur quoi ? </strong><br>" +
                    "{{on}}<br>" +
                    "<strong>Qu’est se qu’il se passe ?</strong><br>" +
                    "{{event}}<br>" +
                    "<strong>Commentaires ?</strong><br>" +
                    "{{comment}}<br>";

            }
        },
        intervention: {
            paiement: function(virement) {
                return "Monsieur, <br>" +
                    "Suite à vos interventions auprès de nos client, vous trouverez ci-joint l'autofacturation correspondant.<br>" +
                    (virement ?
                        "Celle-ci s'accompagne automatiquement d'un virement sur votre compte bancaire.<br>Si votre paiement n'apparaît pas sur votre compte dans les 4 jours ouvrés, merci de contacter notre service comptabilité.<br>" :
                        "Vous receverez un chèque par voie postale, contenant le total des interventions que vous avez effectué.<br>") +
                    "En cas d'erreur sur l'auto-facture, répondez à ce mail en expliquant les raisons de votre désaccord, la modification sera immédiatement effectuée par nos services.<br>" +
                    "<br><i>Attention<br> depuis le 1er Janvier 2014, compte tenu de la Loi de Finances 2014, les sous-traitants n'auront ni à déclarer ni à payer la TVA due au titre de ces opérations.<br>" +
                    "C'est le donneur d'ordre (SARL Edison Services) assujetti qui devra declarer la TVA sur ses déclarations de chiffre d'affaires.</i>" +
                    "<br><br>Service Comptabilité Fournisseur<br>" +
                    "09.72.45.27.09"
            },
            relance3: function() { /* MAIL */
                return "<style> table { border-collapse: collapse;}\n table, td, th {border: 1px solid black;font-size:13px;}</style>" +
                    "<p> A l'attention de <b> {{facture.nom}} {{facture.prenom}} </b>, </p>" +

                    "<p> Nous constatons que malgré nos précédentes lettres de rappel, vous n'avez toujours pas procédé au règlement de la facture <b> n° {{os}} </b>. <br> Votre compte reste débiteur à ce jour des sommes suivantes: <p>" +

                    "<table style='border-collapse: collapse;' cellspacing='0' cellpadding='8'>" +
                    "    <tr style='background: rgb(106, 168, 79); !important;'>" +
                    "        <th style='border: 1px solid black;font-size:13px;width: 70px;'> Date </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;text-align:left'> Numéro </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;text-align:right'> Montant </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;text-align:left'> Lieu de l'intervention </th>" +
                    "    </tr>" +
                    "    <tr>" +
                    "        <th style='border: 1px solid black;font-size:13px;'> {{datePlain}} </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;'> {{os}} </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;text-align:right'> {{prixFinalTTC}} € </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;'> {{client.address.cp}} {{client.address.v}} </th>" +
                    "    </tr>" +
                    "    <tr>" +
                    "        <th style='border: 1px solid black;font-size:13px;' colspan='2'> <b> TOTAL T.T.C</b> </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;text-align:right'> {{prixFinalTTC}} € </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;'></th>" +
                    "    </tr>" +
                    "</table>" +

                    "<p> Nous considérons aujourd'hui que vous faites opposition au règlement de la somme due. </p>" +
                    "<p> A défaut de réception de la totalité des <strong>{{prixFinalTTC}} €</strong>, sous huitaine, votre dossier sera transmis à notre service contentieux. </p>" +
                    "<p> Celui-ci entamera les démarches judiciaires pour en obtenir le règlement majoré des frais de recouvrement et de ceux relatifs à l'article 700 du NCPC. </p>" +

                    "<p>A l'organisme qui gère notre recouvrement:</p>" +
                    "<p><strong>" +
                    "   EDISON SERVICES FRANCE<br>" +
                    "   Service recouvrement<br>" +
                    "   32 rue Fernand Pelloutier, 92110 Clichy<br>" +
                    "   Tél. 09.72.50.20.22 (Ouvert de 09h00 à 12h30 / 14h00 à 16h30)" +
                    "</strong></p>" +
                    "<p>Cordialement.</p>"
            },
            relance2: function() { /* MAIL */
                return "<style> table { border-collapse: collapse;}\n table, td, th {border: 1px solid black;font-size:13px;}</style>" +
                    "<p>Madame, Monsieur, <br>" +
                    "<p> Sauf erreur ou omission de notre part, nous constatons que votre compte client présente à ce jour un solde débiteur. <br> Ce montant correspond à nos factures suivantes restées impayées: <p>" +
                    "<table style='border-collapse: collapse;' cellspacing='0' cellpadding='8'>" +
                    "    <tr style='background: rgb(106, 168, 79); !important;'>" +
                    "        <th style='border: 1px solid black;font-size:13px;width: 70px;'> Date </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;text-align:left'> Numéro </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;text-align:right'> Montant </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;text-align:left'> Lieu de l'intervention </th>" +
                    "    </tr>" +
                    "    <tr>" +
                    "        <th style='border: 1px solid black;font-size:13px;'> {{datePlain}} </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;'> {{os}} </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;text-align:right'> {{prixFinalTTC}} € </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;'> {{client.address.cp}} {{client.address.v}} </th>" +
                    "    </tr>" +
                    "    <tr>" +
                    "        <th style='border: 1px solid black;font-size:13px;' colspan='2'> <b> TOTAL T.T.C</b> </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;text-align:right'> {{prixFinalTTC}} € </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;'></th>" +
                    "    </tr>" +
                    "</table>" +

                    "<p> L'échéance étant dépassée, nous vous demandons de bien vouloir régulariser cette situation par retour de courrier. </p>" +
                    "<p>A l'organisme qui gère notre comptabilité:</p>" +
                    "<p><strong>" +
                    "   EDISON SERVICES FRANCE<br>" +
                    "   Service comptabilité<br>" +
                    "   32 rue Fernand Pelloutier, 92110 Clichy<br>" +
                    "   Tél. 09.72.51.08.01 (Ouvert de 09h00 à 12h30 / 14h00 à 16h30)" +
                    "</strong></p>" +
                    "<p>" +
                    "<p>Pour un règlement par virement :</p>" +
                    "RIB: 30004 01557 00010041423 30<br>" +
                    "IBAN: FR76 3000 4015 5700 0100 4142 330<br>" +
                    "BIC: BNPAFRPPPRG" +
                    "</p>" +
                    "<p> Merci d'indiquer la référence de la facture ({{os}}) dans le règlement. </p>" +
                    "<p>Cordialement.</p>"
            },
            relance1: function() { /* MAIL */
                return "<p>Madame, Monsieur,<br>" +
                    "Suite à l'intervention que nous avons réalisé en date du {{datePlain}}</p>" +
                    "<p>A ce jour, <u><b>nous sommes toujours dans l'attente du règlement de cette facture</b></u><br>" +
                    "Nous vous prions de bien vouloir transmettre le règlement par chèque à l'ordre de:</p>" +
                    "<p><strong> EDISON SERVICES FRANCE</strong></p>" +
                    "<p>A l'organisme qui gère notre comptabilité:</p>" +
                    "<p><strong> EDISON SERVICES<br>" +
                    "Service comptabilité<br>" +
                    "32 rue Fernand Pelloutier, 92110 Clichy<br>" +
                    "Tél. 09.72.51.08.01 (Ouvert de 09h00 à 12h30 / 14h00 à 16h30)</strong></p>" +
                    "<p>" +
                    "<p>Pour un règlement par virement :</p>" +
                    "<br>" +
                    "RIB: 30004 01557 00010041423 30<br>" +
                    "IBAN: FR76 3000 4015 5700 0100 4142 330<br>" +
                    "BIC: BNPAFRPPPRG" +
                    "</p>" +
                    "<p>Merci d'indiquer la réference de la facture (<strong>{{os}}</strong>) dans le réglement. </p>" +
                    "<ul>" +
                    "<li>Ci-joint la facture</li>" +
                    "</ul>" +
                    "<p>Cordialement.</p>"
            },
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
                return "Bonjour,\n" +
                    "\n" +
                    "Vous avez accepté l’intervention mon-depannage.com n°{{id}}:\n" +
                    "{{description}}\n" +
                    "{{client.nom}} {{client.prenom}}\n" +
                    "{{client.address.n}} {{client.address.r}}\n" +
                    "{{client.address.cp}} {{client.address.v}}\n" +
                    "{{datePlain}}\n" +
                    "{{prixAnnonce ? (prixAnnonce + ' € TTC') : 'Pas de prix annoncé'}}\n" +
                    "\n" +
                    "Pour tout coût supplémentaire, faire une devis en respectant les tarifs ci-dessous: \n" +
                    "\n" +
                    "Pose de fournitures => tarif public catalogue de votre fournisseur.\n" +
                    "Main d’oeuvre => 45 € TTC/heure \n" +
                    "Déplacement supplémentaire=> 45 € TTC\n" +
                    "\n" +
                    "Après l’intervention, vous devrez nous régler la commission de 30% du montant final.\n" +
                    "\n" +
                    "L’ensemble de l’équipe mon-depannage.com reste à votre entière disposition par téléphone du lundi au vendredi de 8h à 19h au \n" +
                    "09 72 54 52 82.\n" +
                    "\n" +
                    "Bien cordialement,\n" +
                    "\n" +
                    (user.pseudo ||  "Bernard") + '\n' +
                    "\n" +
                    "Mon-Dépannage.com\n"
            },
            attenteReglement: function() {
                return "A l'attention de l'entreprise {{inter.sst.nomSociete}},<br>" +
                    "<br>" +
                    "Monsieur {{inter.sst.representant.nom}},<br>" +
                    "En date du {{options.datePlain}}, vous avez réalisé une intervention (<strong>Réf : {{inter.id}}</strong>) auprès de notre client :<br>" +
                    "<br>" +
                    "<strong>" +
                    "{{inter.client.nom}} {{inter.client.prenom}}<br>" +
                    "{{inter.client.address.n}} {{inter.client.address.r}}<br>" +
                    "{{inter.client.address.cp}} {{inter.client.address.v}}<br>" +
                    "</strong>" +
                    "<br>" +
                    "Pour les raisons suivantes :<br>" +
                    "<strong>{{inter.description}}</strong><br>" +
                    "<br>" +
                    "Nous vous prions de bien vouloir nous transmettre au plus vite les éléments suivant :<br>" +
                    "- La facture d'intervention n°{{inter.id}} ou l'ordre de service correspondant<br>" +
                    "- Le règlement de notre client<br>" +
                    "<br>" +
                    "Veuillez transmettre l'ensemble de ces documents par voie postale à :<br>" +
                    "<br>" +
                    "<strong>" +
                    "EDISON SERVICES<br>" +
                    "Comptabilité Fournisseur<br>" +
                    "32 rue Fernand Pelloutier, 92110 Clichy<br>" +
                    "</strong>" +
                    "<br>" +
                    "Dans le cas où l'intervention n'aurait pas été réalisée par vos soins, merci de prendre contact au plus vite avec le service comptabilité<br>" +
                    "<br>" +
                    "<strong>Tél. 09.72.45.27.09</strong> (ouvert de 09h00 à 12h30 / 14h00 à 16h30)<br>" +
                    "<br>" +
                    "Remarques :<br>" +
                    "- Si vous êtes détenteur du matériel installé, veuillez nous transmettre le montant H.T du coût de votre matériel (avec remise) pour nous permettre d'effectuer votre remboursement.<br>" +
                    "- Si vous avez pris du matériel auprès de l'un de nos fournisseurs, veuillez nous transmettre le bon de retrait correspondant.<br>" +
                    "<br>" +
                    "Dès réception de ces documents par nos services, votre règlement vous sera transmis sous <strong>7 jours.</strong><br>" +
                    "<br>" +
                    "Cordialement,<br>" +
                    "<br>" +
                    "<p style='text-align:right'><strong><u>Service comptabilité fournisseur</u></strong><br>" +
                    "Vincent QUEUDRAY<br>" +
                    "Tél.09.72.45.27.09</p>"
            },
            relanceArtisan: function() {
                return "A l'attention de l'entreprise <strong>{{sst.nomSociete}}</strong>,<br>" +
                    "<br>" +
                    "Monsieur <strong>{{sst.representant.nom}}</strong>,<br>" +
                    "Au cours de cette semaine vous avez réalisez plusieurs interventions auprès de nos clients.<br>" +
                    "Vous trouvez ci-dessous la liste des interventions actuellement en attente à notre service comptabilité :<br>" +

                    "<table style='border-collapse: collapse;' cellspacing='0' cellpadding='8'>" +
                    "    <tr style='background: rgb(106, 168, 79); !important;'>" +
                    "        <th style='border: 1px solid black;font-size:13px;width: 70px;'> Date </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;'> Numéro OS </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;'> Client </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;'> Lieu de l'intervention </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;'> Montant H.T </th>" +
                    "    </tr>" +
                    "<% _.forEach(inters, function(e) { %>" +
                    "           <tr>" +
                    "               <td style='border: 1px solid black;font-size:13px;'> {{moment(e.date.intervention).format('L')}} </td>" +
                    "               <td style='border: 1px solid black;font-size:13px;'> {{e.id}}</td>" +
                    "               <td style='border: 1px solid black;font-size:13px;'> {{e.client.civilite}} {{e.client.nom}}</td>" +
                    "               <td style='border: 1px solid black;font-size:13px;'> {{e.client.address.n}} {{e.client.address.r}}, {{e.client.address.cp}} - {{e.client.address.v}}</td>" +
                    "               <td style='border: 1px solid black;font-size:13px;'> {{e.prixFinal}} €</td>" +
                    "           </tr>" +
                    "<% }); %>" +
                    "</table>" +

                    "Nous vous prions de bien vouloir nous transmettre au plus vite les éléments suivant :<br>" +
                    "- La facture d'intervention ou l'ordre de service correspondant<br>" +
                    "- Le règlement de notre client<br>" +
                    "<br>" +
                    "Veuillez transmettre l'ensemble de ces documents par voie postale à :<br>" +
                    "<br>" +
                    "<center><strong>" +
                    "EDISON SERVICES<br>" +
                    "Comptabilité Fournisseur<br>" +
                    "32 rue Fernand Pelloutier, 92110 Clichy<br>" +
                    "</center></strong>" +
                    "<br>" +
                    "Dans le cas où l'intervention n'aurait pas été réalisée par vos soins, merci de prendre contact au plus vite avec le service comptabilité<br>" +
                    "<br>" +
                    "<strong>Tél. 09.72.45.27.09 </strong>(ouvert de 09h00 à 12h30 / 14h00 à 16h30)<br>" +
                    "<br>" +
                    "Remarques :<br>" +
                    "- Si vous êtes détenteur du matériel installé, veuillez nous transmettre le montant H.T du coût de votre matériel (avec remise) pour nous permettre d'effectuer votre remboursement.<br>" +
                    "- Si vous avez pris du matériel auprès de l'un de nos fournisseurs, veuillez nous transmettre le bon de retrait correspondant.<br>" +
                    "<br>" +
                    "Dès réception de ces documents par nos services, votre règlement vous sera transmis sous <strong>7 jours.</strong><br>" +
                    "<br>" +
                    "Cordialement,<br>" +
                    "<p style='text-align:right'>" +
                    "<u><strong>Service comptabilité fournisseur</strong></u><br>" +
                    "Vincent QUEUDRAY<br>" +
                    "Tél.09.72.45.27.09<br></p>"
            },
            relanceArtisanFinDeMois: function() {
                return "<p style='margin-top: 0px;'> Affaire de recouvrement suivie par: M. COLASS<br>" +
                    "Ligne direct: 09.72.45.27.09<br>" +
                    "Réf dossier: {{sst.id}}<br>" +
                    "En copie: Monsieur le Greffier du tribunal de commerce de Paris </p>" +
                    "<strong>OBJET : Troisième relançe concernant les réglements de nos clients</strong><br>" +
                    "Monsieur <strong>{{sst.representant.nom}}</strong>,<br>" +
                    "Malgré nos précédentes relances certaines de vos interventions ne sont toujours pas mis à jours." +
                    "Dans le but de continuer notre collaboration, nous vous prions de bien vouloir nous informer de l’avancement des dossiers suivants :<br><br>" +
                    "<table style='border-collapse: collapse;' cellspacing='0' cellpadding='8'>" +
                    "    <tr style='background: rgb(106, 168, 79); !important;'>" +
                    "        <th style='border: 1px solid black;font-size:13px;width: 70px;'> Date </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;'> Numéro OS </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;'> Client </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;'> Lieu de l'intervention </th>" +
                    "        <th style='border: 1px solid black;font-size:13px;'> Montant H.T </th>" +
                    "    </tr>" +
                    "<% _.forEach(inters, function(e) { %>" +
                    "           <tr>" +
                    "               <td style='border: 1px solid black;font-size:13px;'> {{moment(e.date.intervention).format('L')}} </td>" +
                    "               <td style='border: 1px solid black;font-size:13px;'> {{e.id}}</td>" +
                    "               <td style='border: 1px solid black;font-size:13px;'> {{e.client.civilite}} {{e.client.nom}}</td>" +
                    "               <td style='border: 1px solid black;font-size:13px;'> {{e.client.address.n}} {{e.client.address.r}}, {{e.client.address.cp}} - {{e.client.address.v}}</td>" +
                    "               <td style='border: 1px solid black;font-size:13px;'> {{e.prixFinal}} €</td>" +
                    "           </tr>" +
                    "<% }); %>" +
                    "</table><br>" +
                    "Vous pouvez nous contacter :<br>" +
                    "- Par mail à: comptabilite@edison-services.fr<br>" +
                    "- Par courrier:<br>" +
                    "<center><strong>" +
                    "EDISON SERVICES<br>" +
                    "Comptabilité Fournisseur<br>" +
                    "32 rue Fernand Pelloutier, 92110 Clichy<br>" +
                    "</center></strong>" +
                    "- Par telephone: Tél. 09.72.45.27.09 (ouvert de 09h00 à 12h30 / 14h00 à 16h30)<br>" +
                    "<br>" +
                    "Dans le cas où l'intervention n'aurait pas été réalisée par vos soins, merci de prendre contact au plus vite avec le service comptabilité<br>" +
                    "<br>" +
                    "<strong>Tél. 09.72.45.27.09 </strong>(ouvert de 09h00 à 12h30 / 14h00 à 16h30)<br>" +
                    "<br>" +
                    "Sans nouvelles de votre part <strong><u>dans un délai de 8 jours</u></strong>, votre dossier sera directement transféré à notre cabinet de recouvrement.<br>" +
                    "Nous vous prions d'agréer, Monsieur, nos salutations distinguées.<br>" +
                    "<p style='text-align:right'>" +
                    "<u><strong>Service comptabilité fournisseur</strong></u><br>" +
                    "Vincent QUEUDRAY<br>" +
                    "Tél.09.72.45.27.09<br></p>"
            }
        },
        devis: {
            envoi: function(user, _config, __, _moment) {
                var lodash = __ || _
                var mmt = _moment || moment
                var config = _config ||  require('./dataList.js')
                var categorieClean = config.categories[this.categorie].suffix + " " + config.categories[this.categorie].long_name.toLowerCase()
                var pseudo = user.pseudo
                var intro;
                if (this.client.civilite === "Soc.") {
                    intro = lodash.template("À l'intention du responsable de la société {{client.nom}},\n\n")(this);
                } else {
                    intro = lodash.template("{{client.civilite}} {{client.nom}},\n\n")(this);
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
                    var cont;
                    if (this.categorie == 'VT')
                        cont = "je vous ai envoyé le devis que vous m'avez demandé pour le remplacement de votre vitrage, vous deviez le transmettre directement à votre compagnie d'assurance.\n\n";
                    else if (this.categorie == 'AS')
                        cont = "je vous ai transmis comme convenue le devis de remplacement de votre ballon d'eau chaude sanitaire.\n\n";
                    else
                        cont = "je vous ai transmis comme convenue le devis " + categorieClean + " que vous avez souhaité.\n\n";
                    var text = start + cont + end;

                } else if (this.historique && this.historique.length > 1) {
                    var text = "je vous ai transmis un devis " + categorieClean + " en date du " + mmt(this.historique[0].date).format('L') + ".\n\n" + end;
                } else if (this.categorie == 'VT') {
                    var text = "Suite à notre échange téléphonique concernant le remplacement de votre vitrage," +
                        "vous trouverez ci-joint le devis n°" + this.id + " correspondant à ce que nous avons vu ensemble.\n\n" +
                        "Merci de bien vouloir transmettre ce devis de remplacement de vitrage directement à votre compagnie d’assurance, afin d'obtenir leurs accords (si nécessaire).\n" +
                        "Merci de nous renvoyer le devis signé accompagné de la mention « BON POUR ACCORD » par mail.\n\n" +
                        "Nous interviendrons dans les plus brefs délais.\n\n" +
                        "Je reste à votre entière disposition pour toutes les demandes de renseignement et les remarques que vous pourriez avoir.\n\n";
                } else if (lodash.find(this.produits, function(e) {
                        return lodash.startsWith(e.ref, "BAL");
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
                return "Cher M. {{representant.nom}},\n" +
                    "\n" +
                    "A la suite de notre conversation, veuillez trouver en pièce jointe, la présentation de notre activité.\n" +
                    "\n" +
                    "Nous vous remercions de l'intérêt que vous portez à notre réseau.\n" +
                    "\n" +
                    "Cordialement,\n" +
                    "Alexandre\n" +
                    "mon-depannage.com"
                    /*
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
                                        "Port : 09.72.45.27.10 Fax : 09.72.39.33.46\n" +
                                        "yohann.rhoum@edison-services.fr\n" +
                                        "\n" +
                                        "<b>Edison Services</b>\n" +
                                        "Dépannage - Entretien - Installation - Rénovation\n" +
                                        "Siège social : 32, rue Fernand Pelloutier - 92110 Clichy\n" +
                                        "contact@edison-services.fr - www.edison-services.fr"*/
            },
            relanceDocuments: function(user) {
                return "Bonjour Monsieur {{representant.nom}}\n" +
                    "\n" +
                    "Suite à notre conversation téléphonique du {{datePlain}} concernant une proposition de partenariat entre nos deux entreprises,\n" +
                    "je me permet de vous rappeler que certains documents sont essentiels à notre collaboration.\n" +
                    "\n" +
                    "Vous trouverez donc ci-joint la déclaration de sous-traitance à remplir.\n" +
                    "\n" +
                    "Merci de joindre également à cette déclaration les éléments suivants :\n" +
                    "\n" +
                    "<strong>• Extrait KBIS ou INSEE</strong>\n" +
                    "<strong>• Photocopie R/V de la pièce d'identité du gérant</strong>\n" +
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
                    "32 rue Fernand Pelloutier -921107ClichyS\n" +
                    "</b></u>" +
                    "\n" +
                    "\n" +
                    "Dès réception de ces documents et validation par nos services, vous recevrez par voie postal:\n" +
                    "\n" +
                    "• Un bloc facture Edison Services\n" +
                    "• Un bloc devis Edison Services\n" +
                    "• Un accès à tous nos fournisseurs\n" +
                    "\n" +
                    "Je reste à votre entière disposition pour toutes les questions ou les remarques que vous pourriez avoir.\n" +
                    "\n" +
                    "Dans l'attente d'une réponse favorable de votre part,\n" +
                    "\n" +
                    "Cordialement\n" +
                    "\n" +
                    "<b>Yohann RHOUM</b>\n" +
                    "Service Partenariat\n" +
                    "Tel : 09.72.45.27.10 Fax : 09.72.39.33.46\n" +
                    "yohann.rhoum@edison-services.fr\n" +
                    "\n" +
                    "<b>Edison Services</b>\n" +
                    "Dépannage - Entretien - Installation - Rénovation\n" +
                    "Siège social : 32 rue Fernand Pelloutier, 92110,Clichys\n" +
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
                    "Siège social : 32, rue Fernand Pelloutier - 92110 Clichy\n" +
                    "contact@edison-services.fr - www.edison-services.fr\n"
            }
        },
    }
}
