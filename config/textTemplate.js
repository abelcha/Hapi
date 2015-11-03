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
                    "Bonjour M. {{e.sst.representant.nom}},\n" +
                    "nous vous rapellons que vous avez une intervention à effectuer chez {{e.client.civilite}} {{e.client.nom}} ({{e.client.address.cp}})" +
                    "aujourd'hui à {{datePlain}}\n" +
                    "Edison Services\n"

            },
            demande: function(user, config, _moment) {
                _moment = (_moment || moment);
                this.mmt = _moment(this.date.intervention);
                this.format = this.mmt.isSame(_moment(), 'day') ? "[aujourd'hui à ]HH[h]mm" : "[le ]DD[/]MM[ à ]HH[h]mm"
                this.datePlain = this.mmt.format(this.format)
                this.user = user;
                this.user.pseudo = this.user.pseudo ||  "Arnaud";
                this.ligneDirect = user.ligne ? (user.ligne.match(/.{2}|.{1,2}/g).join('.')) :  "09.72.44.16.63";
                this.categorieClean = config.categories[this.categorie].suffix + " " + config.categories[this.categorie].long_name.toLowerCase()
                return "Bonjour M. {{sst.representant.nom}} , nous cherchons a vous joindre pour une intervention {{categorieClean}}" +
                    " à faire {{datePlain}}, situé à {{client.address.cp}}, {{client.address.v}}.\n" +
                    " Pourriez-vous vous rendre disponible ?\n" +
                    "Merci de nous contacter au plus vite au 09.72.42.30.00.\n" +
                    "Merci d'avance pour votre réponse.\n" +
                    "{{user.pseudo}}\n" +
                    "Ligne Directe: {{ligneDirect}}\n" +
                    "Edison Services\n"
            },
            envoi: function(user) {
                var options = {
                    precision: getPrecision(this.client.address),
                    datePlain: moment(this.date.intervention).format("[le] DD[/]MM[ à ]HH[h]mm"),
                    login: user.pseudo || "Arnaud",
                    ligne: (user.ligne ||  "0972423000").match(/.{2}/g).join('.'),
                    remarques: this.remarqueSms ? (' (' + this.remarque + ')') : '',
                    prix: this.prixAnnonce ? this.prixAnnonce + "€ HT. " : "Pas de prix annoncé. ",
                    telClient: this.client.telephone.tel1.match(/.{2}/g).join('.')
                }
                if (this.newOs) {
                    sms = "OS {{inter.id}}\n" +
                        "Cher partenaire, merci d'interveni\n" +
                        "{{options.datePlain}}\n" +
                        "{{inter.client.civilite}} {{inter.client.prenom}} {{inter.client.nom}}\n" +
                        "{{inter.client.address.n}} {{inter.client.address.r}} {{inter.client.address.cp}}, {{inter.client.address.v}} {{options.precision}}\n" +
                        "Pour la raison suivante:\n" +
                        "{{inter.description}}{{options.remarques}}\n" +
                        "Prix: à partir de {{inter.prixAnnonce}}€ H.T\n" +
                        "Veuillez joindre le client au:\n" +
                        "09.701.702.01 (OS {{inter.id}})\n" +
                        "\n" +
                        "{{options.login}}\n" +
                        "{{options.ligne}} \n"
                } else {
                    var sms = "OS {{inter.id}}\n" +
                        "Intervention chez {{inter.client.civilite}} {{inter.client.prenom}} {{inter.client.nom}} au " +
                        "{{inter.client.address.n}} {{inter.client.address.r}} {{inter.client.address.cp}}, {{inter.client.address.v}} {{options.precision}}\n" +
                        "{{options.datePlain}}.\n" +
                        "Pour la raison suivante: {{inter.description}}{{options.remarques}}.\n" +
                        "{{options.prix}}\n" +
                        "Merci de prendre rdv avec le client au {{options.telClient}}" +
                        "\n" +
                        "Ligne directe: {{options.login}}\n" +
                        "{{options.ligne}} \n" +
                        "Edison Services."
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
                    "75 rue des dames, 75017 Paris<br>" +
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
                    "75 rue des dames, 75017 Paris<br>" +
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
                    "75 rue des dames, 75017 Paris<br>" +
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
                    "75 rue des dames, 75017 Paris\n" +
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
                    "75 rue des dames, 75017 Paris<br>" +
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
                    "<img style='width: 4.5cm;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAACNCAYAAACey2dEAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAABtmAAAc44AAPmLAACEeAAAfMMAAPeSAAAv8gAAEaGRNo2eAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH3woJDyowWuroyAAAav1JREFUeNrt/XWYVEeDNv7fVcfau6fHFQZ3gjsEC8GCBAiEhLgRf6JAiDskRElCQvDg7h7c3WUYd2uXI1XfP8hmd3/vPvLub9/leZL+XBdX9zTDcKpO3VNHquoAMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExf3Yrl68FAKxYthYrl6/F6pVrsXrlOgD4/XXl8jW/v65Ytvo/fRYT879BvNUb8K9ONJsBALIsg4GBM4bqykqsXL4GjDEAAKEUK1asBTi/1Zsb8ydFb/UG/Ktas3ojVq1cB4vDgVUr1wEgGDZsEAgAs8UCXTcAACtXrL3VmxoTEwv6f9e/9daekpLfvjawavlayhgnJpOJEELAOf//7cXJb39iYv5XxYL+38R0HQBARAEAiGFohFLCRQkghMJkkokgiL8Fm/9buLkky7Hj95j/dbFz9P8Lq1etByEUnDMQQmHoDCbFBFVXqWJWUF0aRiSskqRUCbrOOecMgiBynTHGOCBwDkJiHXrM/75Yj/7fQCgB4wyRsI5QOEwUhRJvjSqb46xiuwFNEAxzSgghnEPgHJwQQKIEIASaqt7qzY/5E4oF/b9BUzkoIUQSBTJ6zF28pjBM771/SFhSqy1X911L7dG7KScAs1ptejgc4SbJhGAwAkIp7h49HAB+f42J+d8QC/o/YO3K9QAAzjhcdgsEEDDGUbddHH/y/lli0zifunLt5sb7D9Dl29bWfL/ohxMJ7834nF294IEkSSjI9UMQKPJyc291UWL+pGJB/yuW/LL099dQNAgA4DqHwxKPevVkTJ/o4ss/LRA9ZRG9ME9KPbah5ofSfF9fnYl3+IPW7C8/+Bh+PyERNYSc6xySJCI5MfFWFyvmTyoW9H/Q8sVrQQWKs+cKEQ5zMuiBcumX2eV683aODku3+Fbn5Vb3yki3aw63xD2hGvrLnOOw2BmJczpojz5OiCYFDpfrVhcj5k8qFvR/AAHBqLHDoEY47rk/CUf2RyXFpmvjno/vV1CAzamN4joNvr/xMS5xv8fnKenSI6MIAJJSrNB1gzJoAGPQDeNWFyXmTyoW9L+DUgpCCBbP3oo2d1Ri4exqqXOnemo0EL7dbnL8kpxijR82KvPJsmLftqI8j8ss8V/uH98/vzDPJ8QnSOCcchAAFkvs1lrM7xYuWAIA+Pn7RVg4ZxEWzf0FALBowVLMn/sL5s1ZCACYP3fR7/9m/s8338+bvfD39//2+vfE7qP/FXEpAgCAUhl3j26Np4acRMW1eOm2AQ6txlfTuLzWtCA9DaRz9+Qhm5ceu1JRaj1AYJy9rUfyF4QQvPfGPITDYUaIyEAIEAyCxca6/yktW7gMY+4bg2ULl0EzdFAigAL4ZfEyyKKAiD8CMIKF8xdCEARwbsBqp8g0v3bzB9iG4+cvRyEp0QQAcCgKho8fhaSkONw5ZNA/tA2xHv2v4IIMAFBDnCRYvkb95lHZkV+hlZX4Wx/YWrqeGcyVnmW+1x9I2KgbrulR3XAnJMlTjh45WdGp1Ut0ynt9DKaCgQPkt+GyMX8eSxYu+/2VM45f5i9BZa0fAGBoDIxzlJojGDX6OxgGJ1FVh8nMEYkY4JyTuESKgtBjuL1vY3D/avTr1gTX8jQsmLMcFwvK8em0r7F99zF8+flMAMB33/z4N7cn1qP/B1s378CAgf2wZNF60IiCdyYuRsc762Dy5JD85tSV6sJPxrTctqlgGZUs9Tp3S73nRnFwe7Jx9k6/lwx0p8izvvy5+86P3rUrzz8Rr7740Drc80YXlJ8pgcvphMfrhRA7dP+nt2zJSowZezeWLVn5+6nW6HtGYuniFZAkCYwDnHNwZgAc4JyAMwZRpuDgECUB+TlhXL8exLQP5iM+mcJfbUCLaiC4eUTHOcAAUi/FzA+feBXXzldTKoP7PDonMIimQ7x0SuWTnlymHzo/mQNNwPkl0N25MJlkNKyTSGRJ4dVVPhj/4HWfWND/A8b+/dD6jgE/492Jw7Hq60vSK++vU+XAmE4nj6vLDY6Ujr0zn77/sZ4rv/1udvMr++Vvq2uDRSNH1/sIaBSNizsvzpm+ig94aATKThVi5Ohh2LRhK4aPGHKri/ent2LZWowaMwwrlq4FpxyUUkhUgqpFbn7Db8FevmINjIgGKt4M79JFywFCEAlGMW7CaCxbthrcYCAgoBKFJFB0vzMBP32ag9fefhAzpi25+aM44IijqC7zQtV0Eue00+pqnXEGMRwAxzXCtt0ooTanwpPSBRFUMOLSveyR+xX1ifsisNqk37a8Hnbt3GBKSaA6GGFeX1RgPMTq102jjBk6/oEJ0LGg/ybnyiVcuVYIACCcQOMf4+O//Cq4mkrqx590reO97JsdIjSzzYDk+x98tMdSsJkJ547ZvsvJq6qXnGI8/si4q0Vffr6eOtINvWer1kjPcECTbu4o/bcJMDH/761asRYjRw3Dqt+mBxNKAQaAEkTDKtasWg9du9kbgwPk385eOQEnv00tJPS35BBQApQFipHkyAQhHJeu3oChMRLwaJwxBsVsRpwbiLdYUHBJx8oVq6hiIgj4GSIaIRt/CcBstiEpRaa5BX4U54c5MemaGLEizZGEK2cLmECi2H72kJHqaIj33u8pffKux5WcRlwZ2dakXnfMdoAhfORAeVQxywEK5k9KUUoDAZ1qmk4pJQYAjr+T9FjQf7N//2VkN0jA6y9+gyWf5uH6lXJx6oxLxszv26Sf2hCZk5pobt51SMYLGzedXuh2s8RrZ9wfVubU9hBN4R9nrXhp2SrhIfrMxAf4hdyzuO/+4aitKUBFQQgAcNfwwbe6eH8K69dugqreDLOmaZBEERa7FUFvEOCAJAuglAIwAICCEM7/Q2fIOcAYI2qEcUmgBOCglHBHpBXE+BpCRJlcOneWqlGDmayy4KkOw1cZIOcOqvzgr16a2kAUDmypVuu1q2sU5aooKQiifj0TanWOSR94DBmFCPPe4uQXLyVzYrjsGaFAdlNza1lRkpp2ukMwW6Wqq9eKnZSCGAajkTDVJYWWcR6JmixKpTtBrvT7fKrF5tQMg2PEsPZs244TAACHw/o36yYWdAB7d+5ErTcKb1UAaWmJaP6MRbjvsSH6uHsPu19/4cRcX1jsfWfX9Ln3PNz/m3serid+Ounca8XXfI/6w5VXJ3028BMA3idf6ER3bjvL+/ete7PHAHDXsFjA/19YtGglxo+/GxvWbwFjN0cd6roOzhgMwwAh5Pc/VaXlMFtsBAQwh01cEzUIgkB0bggAh64bOjM45ZQTLcKMxCQrVE2jHAxMJUQUJARMVSjO0ahkglJdrhsVBVwrraggDbJH6kfWzeFpzZJx5lII50qqkI10fDSc29KzucXhMruIhnqCJWyZ/LQaDETj67/wyLmkqrJAB0URwuXl3tpgQEtMTJaPhMOREkJJUFH06wYzqiCIIWucEXn77Weiowd/jLgUA6a4bKihKhQX1kAx4pGbV3pzzQPg99e/5k8f9F9/3Q+mhQFO8PYnj2LiQ18Ky+dfofc9NkCa/NyhT65f8/QbMKLJ/tHPtXoLgDHtndMPnDhQONHgYfXuJ9t88sLjH+U0b9ZD+Gn5C8ZLz/6A8Y/chZwrxWjXqfOtLtof0ro1m+EPhrB2zSYQUFDyn6f+3gw4IAoiNN0gsskGZgCUc8JdnBsaw80hUAScMc44I7rBeTTEaTjMhfOnSrnLIQqUEBIKaayoIMDaD0hiz732ijGwy1OaoNmx4bgEzl8Wprz8ubNl72Q3RJLQ0e1q2CIgp0oyabhr/o3kgB5NZCqTHFZrdVSLEEEwTokmsUKSaC5I8JBmoDoUQVixmopnLnja27n+N9yVXgOXXUIg6AUkBfGNPZjy0o9E1VSSnmmB017FawyFl1d5kOF0oqCw8vcFUP7j9aX/yp/+MrATA7Fo3TM4d1DGw8/H4dM3z5k++/GhyMg7pn1anBd+pUv3lGN/mTrg0XCo9uz6FVdHnt1TNcune93dB9ef+tKro6c999h3xvMvDTGGDX8EF65sB4/NOf9/Yt3azbhr2ECcOHoaZRUV8Hk8cLriYDAGSRaIGtXAdAMGY4QzwsvyglyLWNG8m0y0qCHY7CZWkF9DqsqCMMlmQdM5uXTUy6xuiR7aXqOP+cRkPH/3aNw1YCWMchW1pT6cKq9AiH9Ft6ze6jh+sCIzN686jTAxkzPa2ePVGgGaw0xFdyDMkrhM/UzTwza7uE9RjNKAES2gjF00iXJFSPOF9Ljyot2/qJGWLbLhsKqQTBTXrwVwofgLfDVtrqhqnDDOWThkcMVEEfQbPBI14HCauFnxIyk1EZwBHn8EVqsAk1lAJERgsnDcP+G+v1t/f4oWuWb1BnDwm7/F+W+/AQ0D0x5ahsOBg6hle7B51V7sWpEvXT+maQ072Z+8fDw4M6uRa/XX80e/HxeXdmrtirV1531XtFok+m1D7s3+eMLDd00mhGDb1v1oUKcl37VzH0pKK9F/QHt06dHyVhf5X9aGdVsBSgHGAAJQQQABYBg3e2JuMEiKgIrSKriT4qmh6YRSClEiHMSAycy5rgnE72G4ft5DHPFECocYLp2pNIxqgTep15SP+kxi2dYxfECLl7D1vBecv0cefmqqvXF6G4s/4nXV5EbbqQEjzRcIdooaNFshUrLAmVnnXOTglEqkzB8Kl1gsUp7VQnNDmn6+fqPEw6WFNb76vXzBt194z+jS6h244gzUz3Kjyl+Jxas/QJ+Ok6nbbUdCokB03eAWqwmBsMZbtbZyEDM4OExWCa44BePG3Y5P3t8Eu0OGLBMoMgElBFW1IdTJjMeIMcPx4/eL8NiT4/+hev3DB33VirWgggCmG5BsNujhmzPRonoYffq3x6huMzFzwz1477HdoqL49aR6rnsKz+FHi0PZ9ea0QS+9+ta2gmHDs3ruXFDyaUWZr227O+O/eOeDB14hhBiXLl0ju3ZcZXXS4zF4RKdYT/4/YMO6rTA4wbFDhbj3seZgGkE4GEVZcQSMcWgRwBUvEd3QBS3CpGjU4EV5flZTxXlhbiVXLHZyWzunlBCnqM9O2KmX4nMM6/AFKjy1OHRtP+ZsHu30HI9LvH7dYxJ11qLGo7ejolg35As1qwnyBKdNjGPhqGSxiRXeUDjAOK2QKDkCphVY7PLlqKFWynG1uUuXB6ru6toSVomjuCIMU5yOeJcDuzappHk9Tsx1dCKJOomzWVlYD8KgUb5szXucEIIpL82E3xNBYqoNYS0Ks0ghKhIEUYDVLsDpMkEUBIy9dzQWL1qGcePH/P9dr3/4lrlm5bqbPYRugIsCCDg4ODEMgy+feQRLdy3Cu8+/KlYVBvWsFvZh5/cFFnAmL3/68x7TO7Zrf2n/vk3Zq5dUr75wqLJ1dl1x+cyVzz5CCPHPm72W1qmfzKrKwmjZLhP+gAft27S/1cX9p3Xm3DG0btkB126cxOkjVThx1IM7hqbjxK9F6DWkPvy+EPx+A9culeLlSeOwbcc+3NEvA6fPlxO/N0JCQUb83ogQ9umkqizEiSBJskQEPaxEnp86RB3aYxYO7jsPgiao5LeRHxbkKCVntKxAdcDNiKludU2kScirtRGJ2DoQNlyqpgtWs2ILhKKgAg8qAq4FGbvsMtMcGIEL6Y3jj0Xg96cl1foXfUlCkVAYve/Kxp6dN5AfmElE8jIZ2s9NIn4DhMtcMAvcapZhc1De9nYbykrzcPmCgJzjPoSjPrz+QS8QYkFuTgXUqIGgP4r4JCtsDgUJiSbIZoAZwLjx92DJL0sx9t57/kfr/88TdMZAKIXBDAoQDk3Ftg3XOONUeP2z9saejeXtD2yo3FF81X/gwec6P3rbnW0qI94z8b98X7Lg3JHS/o1a2va9/+3Ah6yWOjm5V3PJxDHf8klfjQGLMtRtnIjsOg1udVH/Ke3auR99+nbH8RPHcf5IHjbNu4DRL3RBqwZxaNS+PYBCAAQbN1yBxWRD736d8N6bC4lARGqziUIgwEjET1nx9WrWdFS5ETiRiZBXxIH9tTiY8yOWLH/KeuaAnG2SnWkl+RWNIFgSwt5Qo0i10ZbIQnZIjcga0yFQAj2se8yyqVKV9VzAOKdIuGKx0HNJDYzcoVPjPX0SC6MZMCMjI4o2veNQQwowoPEMsn7rJ5LTJaBuExchArgoG0b7bklswB0jef2sp9AoKxGb9y/CjLe/w779JwCmwp5sRoMmcZj61mOY8tp3+OCTp27pfvjDXnVfu3otho0YBsYZKOfQGSeUc0IJAacUhEikc/f6wtpZ13jR1WDc3g2VP+Vc8vlbdY1/dcvBV0uze3/gnPtx4Yy866H+FpdxbOzDbZ4QJJYz49PvaIdgF2Z3WOByOlBT4YmF/L8w85u1yL9aiqUzzuGR4TN//3zp4TfhD1wh+45VYFTrsSg/m4ROzRrTpt1d1OaykpWzF/L6T3m03d9Tg+dJBpUdCFb4sePiE3TFmtUNS1O0+OpKr9KyndK2YZOn2u+YJzWp9YcaUkW3+70+qMwPkyAassquWqzKr4au52lC5KrdZbpUU1t9veP9dcsnP7Xb26NFe+iKBM4Yaip09K59gtze9hMhziETt8sKp9PMO7buKoniSkx4rpnGCGOiRCGJAgpyPPzUkWoAgEAJqEDxzINvoKg0B6t2TMJLT3yPz3548vcy3+qQA3/QHn3VyjUQKIHBOCSBgHFA0zkESgkAokcZd6Wbyc5fbohpwUT1Ci94+/qFyFuyLNy//uhrCzmfIU1+xvljzpnIA5oQXPbW933fuH7syrX0+g2Ezl3bGxXXKnGlJA9Olx2tb2t6q4v7v+bA/pPQ1RB0piESFpGbW4NgrYItqzfiibe74/KhMOZ/dwE3fKUYPbgplm+cAs453pi8DG1aJxB/VS05e7YYM2YdALCOL32nmox5k5LOzm+NOh2t8PtkbD66BY9OaR1H/W6hWWJi3auXqrsV5Kt1zIo5SzKx7tFoNBkhBsYpBIGFicjKzDalUOWhPDC2J0p8Z7Ky3b4qb2FZt7FQJw5NiAJ56N0mHX5eiKcHTqB7rl4UMupJQkKCmRLCjcrKgNaoeQJJz3BAMzg0VefRsCaCU4NzzgkhPGyEuaJYoAgUfk8YBjcgiiYIgo69u65h5k+TbvXu+Zv+cD36qqU3n23GDQ7Qm5MOAA5JFEEIoGuMJzSw4PgvxWKK3a8mJFjb792mTTabpFk/ftlpWWIn4NVnnW/kX1UfCGj+n8c90OCNaxfySk8eqxJGTRhnRDwcJwuPIjOxMVq0aniri/v/1KlTZ9GmTSucOnMOalRDQS5BUiLwH/sHNcpw42opDu47gAcm3Evq1k8iOZe9OHP4GmkoTeZ3ZXwDKuv8zQ/b83WLanhxUQDAMnDOlVKsETeuMzV4cHLTFhfO1QRsLm4Zbundy7NH61LrDdku8fwkQZRsFhNgMBUS+HWzXT8Ak1ESCqvHG7aI21+k7SmfN3NJsE+baZxQDbtO7kH3Nt2w7+QMMnvGdvnZB4vkxPQMSaRg2zdEo1W2fDJ0XDoEgcLmMIVDgQit39QNzsBqqsMC45ypUZWpAZ+amBEHLSJDUiQUF9QgKdEETQDue3A0li9bBQJg1JhRt3o3/UP+cD36yiWrQSQCFmWgCsVvw5c5ISJhho6ULBOWTT9Lej6TyLy/eusd2IftBVUhT9vhtn5keqSWPuZ+7MqJ4CydG7/cPTHz5XP7L5W6E9Poa289wo4fOw2mCogK1XBbM/5QQZ/+3nK8PHU0vnzvZ0S5E627ZMLlDCMUcCEuAYiEdeRdp2jQsBypaZnQom4UV1fg2IE84i2vJpFglH709SbG+Sq2YvUefDR5DU5eDmCEfQBIvIqVub3i92y/mL1vf3ljTzXtEq0hjXWdSN6yUH0jwjJ06DC7JEQCGlx2Acyie7ksXHLY5NMZDSzn3Ym2q4oleu7+8S+VARxdm96Lg5c+xeFtucLBQ0eFKI/SkE81spvESUyHUZDjUZu1jydmiwRKCOWME0M3uCCIBgOjhsE4YwKj0AkIQCnlnDMCAq7qGnylFbAnuqHI1psTVAiHbtycszB6zEgsX7YKo8eMvNW77R/2hw06128+ZAGEEw4QzgFRpCgt8ZHvP7/BP/ymUfy8zwo2FhdHGwppvLfbZjndMF4ZWFkkrw9EvRtGPpb21L3331/64eS5dNIHDzAAKCstR8ATQcNmdW91Mf9H7N6wD72H9MDRXbsQCCqYMW03Dpxcg1f+8hoMqmHKW+NQ7L2CQ9vKSEWJj16/XMtzzmp83cFHf/sJj2DVhfG8aHMVynP9+ODbR1BYeyp+9rcXbDZFSvdWBroTr5JZ4YlKYT9rTqh2G2XEFvLrqPHrSE02w+v3l7tTLFVmq3TUbKNnGzRyBFMauGpv655yrY4rtRxI8BBCIveP+gwfz7oLa+eddxJERZ1x1eU2GbKJwmyWdYtVZLrOhJvDjwnTNUM3OKc+r8qcLokSQohAiEEoBQO4rmlwuO0I1AbAOYcgCDenfBICzdDAVR2SrIAxhtFj/3UC/df84YK+etkacAEgBgjAORFujonkTICOELm43xBKS2o0fyQ6yVNlvGOI4VGUs3WtO6XWzzmqbo/41ehDr7Uc2LgxzZv03GFhzd4pBgD8uv0YMuvGg+vCv2zQd245jr53tsepYxdw9lQ55n5xDMwIYs+VYuxc9zC+mL4b6/e+gSOnT5IzBwrJtSslZOZXF3iAf82++2EL8gqKMevDWtTyl29O8iKELz+02160r7RR6Y3axoxb2gZqeFfoNCNa63NFVGq3WQgihoEaXwjxyZZKGPomWWLnrelWdtttaTm2OHZh1D0DwoC5tH2dSex4/kfk+ee/519+OQZDe/wkd+ufLoeDXGvY1CnZnZIgyVQnlDBwCJxzBs51xgxwiBohTGSMMXDGREEkumEgomnMarIiqoYgCiIoFWBwBmboECUZuqr+Pi6eMfb7zLeRo4bd6t31P+oPGPTV4AIBMQwIogwQhkiIkWa9Qnz/d4po+uBu/fRdn3cqKOAza1G7LqtLvXdocUHj0irHIm9N+LZ2XeNG9Wo9Ys32Y/OkHxa8rn3+4Y/o3L0dUlISwImOBo3q3+oi/l2zv1uPR54aip++WweRidi1KR+TvuiO82dKcXjbNUz/YSJWzz+J9oNN2LO6EGX5NSQ+2U7Onikhxw5exv4LnxtFVVfw2Vvb8cXMD8B5acKBQ+fq+II1zcLVRtdQMNro2plqo6QwKPkD0aBbsLaTiZ5SHaWAQJEaJ6qMqF7BSlQO4w0B9HK7vomW9GxLSZcud+QQkqQB6ch2NsQNz7LfBxo9ft9nojvOjvrNE0l2Axe12WXu90ZFQUQ0FFQVzmFIoqxyMACciqLItGgUUU2DTBUe1SPgTAcVBMiSBE034AtHkBgXj1DID0kQQCgF44BhcEgSha4zjBj5x5989Ie5GLd+1ToMHXkXQpEonDYLuCgCjBOdcZJZ18a/nloo/DDnWf3pJz9JLz0vTlIRKRHVmmkNGtStl1OcslhTvY0yGggTvp49ccNnH8+zvTZ1RBAAmrTKAuccRcUF6NWnx60u5l918MBBdO3WFTXqJcz94Dy6NZmI21p1wtmTxwAATRq0gM1hQ8WNfPLha/NJTSXIEw+cYpX4gi9etJjnnPXwuCQ7JJYAAOZLF8oTGzVNbfz1p7M6T5q4qF/AH24QDbM0s2xBwBdESaUBG+XcYWb7Q0Zwi0eL5tZtmVjarFuiHAxFNIvFQt1Oidevm37oueErroSi1WjdKQ6vj/lMGNnsBfHI9RK0bJnA33xpNt+8bg+69KvDXZam+sQHPsXudcVo934W3CkyQsFKVVEIQkGECACDaWCMQRRFgwCQBQ5VA2TJCpVFAU5uPh+P3TwMN8kyVDUCSZJw17BBWLd2E4YN/8fWWfsj+UP06KtWrIVECTTGAcYhCxQMhDDOiCRQVFcHyf2P3GNcu77Q/NoTZR96yrU7uBIcNnxoSvjUMay7XuhtDKnqwQMnv1jxynNfm/ve2VhPSqinyab6OH16NpjqRpM2Llw+7ke9ZqlITLLAapKQUacxCvOvILNO4/+1sr739ixMfftxrNi0FjuXXENVSRS7d+Tgi5UjsOOXa5i78i/4dPIyrFy+E2t2v4nc3DKybOEpQg2NHN9XjstXTNi8vbmxcGk5Vv6Ug3z+IQ4d3mMvL9BaXbte0/DkvqLk7MzkpoFouG1lhTfeHLalhSMGVF5TLDDFZ0txnnO6jINRyVLCrcF8lxypsiQki+WX/N2FCM2q8kQGQLdY9WDEJUsSqwx4dZilD90JvrmK5CZd+2WxJp3ieM/2vcA5x/S3FqJLn6bo1qsd3pr0BbLrNoQoczjjJciyCENnECXh5jTU3yYM6boOSZJuHm4bxm9fK9ANDYT8vpQEBt81EBvWbcaQuwbe6iZ6y/1hevR/YxMVqNDAwGAwxnXO6aVTNUIFLgpfTqmdQnzk2YR0ZeqyrWtzhnYfub2mVGtrsvoeOHfWt+Kxez+zdO9dL1pTW2FYbVbUeq8hKTUBUupAdGzRHPN/mA5JvFll6VmN8NCEtxAI3FxEcu+vx9Hz9v83Q2C3rDmBO4e3AwDEWVLQpv5EjBr0PJ6a8AyKbtSgks/G3sN7YFJA3np6CS6drqRuKRUp6WlGSjrl6zee4YVn/Dh6pRgRuFFSXpYomHnmA8+0aPnk8Fm9GVPTgkG9nhE1sgxQseR8daHGI9GIEdzPNPUqc5AzyU3E3OQsJVCaH7qNRW3Mn1/ZWlXNd5dxqSU3qjO4rjtAOax2xZuSaQ7Z4pypx4+WgohWOJ2kT8tumYu2vts3arZuI0f3Xse3X6zCrp0n8cq79+Ohk9PQ/e/U3Yb1WzBk6J3YtHEbBEHAoMF3/P7Z3xIL+U3/8kFft3YDdM0AowRgnIS4SpnGjGBERXYTF3atKqAHVpxSwzQwsiyfTa7bOM43dkqbrYPb658Fw2rfqkj5u1dyHAu++GiIUreRYNRUelFREqUVhdeIO8lKdc1gZXseNjbteg89O/SAKNlAyL/P/W3SrC4eH/s5ju+7juKSS0hPa4p9v+5Hj9u7/w+U7kUAM7B49h60THse50rWg/8+77gc7brFk7BPJYM6vEVOHw+gFHb24StJ/PyNIqN5QmsAkPwI25nBE7MbJrd6OiOpZXmhv97CeXpbhYlJAqu85Pfx7kxieVC0M1D1owlpcTsi0YprgUhu3ojXe4XojaS4nRvy+/Iyx+jT58tbwdBSrYrkVAQ79GgkyJl2qkX7NENxCeVcDKxs0Nx6sCRHeObU0YLHKkr9SE1z72zeNuGbSa/fq10/+w557NnRvG2n5sBS4OtP1gEA5mx45e/WxL8FetDgO/6Pz2L+vn/6Q/fly1Zi9Ji7sXzpcnBCQBhBOKgiqgECERD2EiRkiLjn3hexZNHnRBQJlRSCpBQHP36gRH7mL1mRH7/Ia7d8YcFyyiidOKnVyz98c+Hu6mJ9rDOOz9p6rO3El54qtGmaronUpjdrHU+qyyI6C5l5jbeGpNYThLyLQb5i0VXDaY4SaypBk+ZJcCfaeE2tiqzUNP7hO8P5T4u3Yda0fXhyUjcIJooHHx6BBT+vxf0P/9dXb2fP3YQUtwyREgwY0he/7jwIT20UJXnVEBUKTQfOH83Huh2XUVyZizLP63hp9HWk1RPpqZO5hBMDO4+G+EcfZbB9q2uw6Wg5avTu0pevqm4mSvXKr4bbEUK6Rj2sqcpIHcUiMMOvyuUB3R7kammqw3y5vLzgeHKK+1BStnN/5++9Ps9ayUzL6rhKrmq3F1z2DdA0o6Mk89RIhJssEqkKRkP7ExLNe9yptjJ3vLOi4EruCY/Q2TfpvVDS4eNiuqdAb3jtbOm9N655BzJGjjJ4N93zWLN1jz018QLnZfj07eVo0MiFu8ffDOuG9VsxZOiAW93E/hT+aYO+Yf0G+CoDkGwSREJRVuDBjcsevPR5O2xeXAB/wACYiOdebgHOW+GRUR+Q1u2zBCJCqKqM0Hc/Xaca/HMDEFPu67tsQV4eb53SNDLaWyzfEwqQpzReO+1EzrRXmyU+jYuVmwDkA7gXnBfSA8fuk/bvrpBffbVBmGAMJ+RRw4l4eHEZgB8OpKDH7a3hZxxZThWe8ynUnOWl6VlxbMb8R9lH787HyX25uH1QMzzzlzHYuGYrKGGgigVnDhdj38Zc1GsZh8kzemDTLzmoLvVj/vdnsWLLC9iwcS8gMLz4ZE88/+oa4vUa5PC2EsK9Wfy+N8BOHKsBi1phIS4s3b0ETz/cI7PkutbMmZzYxluhtnUpriZaUK0nMqapIjWrYdVrcdE9mqTn8IieR638bCj+1wvH53X3hVGKFz+7LSnvZLAe8wrdYAjDzBT1Kj1qOtOESkkiuwxT8BhEcrx1B+XS5PfGhwEb+cuD830z5j2GY8ePdd+y5lLTihK9uyTZBhCPkezzhw9xiz5r5BP1V75x/3Z/7xEufPbdQcL5Wv7EfZ8hq04yvpv/IoqLqm51E8O6NRtx1/DBWLdmI4Cba/utWrkenHNIRAQHx7C7B2Ptyo3ghGH4yKFYvnglRo+7G8sXrwSA39+PHnf3rS7O3/RPFfSnJkzHzHkvYfqH3+PdKb9i467HcGRPDu57ohM2rzuDGxd8GDShPjmxt4hUVWmCHqEk92yYtWyfLJRW6qxucyt58S93a4QM55yvtJdWXW3x+Rt7Hzu4vWwctQkf2t00I1SBx6urAsetbnwLLmUIxKCKpFiDAS2NcljciRZ/VNWT9AhzaSoPRjR/OMlt99lMFk5MgupKl7SsOi6fxx84p5uF440zbcVPPXc0kE0IGz7RSS4e59JTL/c25n272+jZrzladnDD59WRmiShbuv6WPTNYexbn4s6zRz4et4n2LFlAc4cLMJL776Nq6f2kbWrd5Bar0r376pE9bkoe/S7NPbBU0eQgnG445XlsqzfVuf8ycoOJtnWhGloYyIkkxIpNcp5EtN1SEQqEKPG5bDqOZvcLPWiYQ6fOfTTsyeV5Om4Ul6C7zb3de+ZU9Qt4gt3ZCG0MiB2jAjUIXJJkwguc3i2l/vL9mXXz7o0e2ly4bh+ZWjRyw67y4V7nrbJN05YWpYVhAYU5kaHRYJia2+lplSW+BANB04rovFh0ZVzWzlt4dt0qSt6tFgvNGwWz4aNbsWHj3kVf3nyAXz23cS/OW9/3ZpNuGv4IKxbswmE/LaKKyFgug5REDBo6J3YuG4zBv83zr2PHDmBTp3aYf2qwxg6sjPWrVkHQ7dDEEPgAHTdwM1x0ww9EztgZ8UBiBBBCIUkU+jVHPVbcOzYqSIrmwCcQ48qEE0yZJlh2MiBAGzYtePmY7b79OuNXTt2o0+/3rc6Wv8cQf/svekAzcT1K4Vo0MiOvIsEiiMEEBOmf/ckPnrjJ2p1Cub8yxHNU03Y4PEDjJGjm3OgGVLRAyX8cwBfCx+9qLqu5tY649KT76CC8GRZrqfBlZOV1qguRuJstqtV1b7milmJglBdNIuGwTiXuaHa7aaiSCDsFjmgm6WQznU4zKaAqhn1zHZumKikSppoDvrExMqQn6hQYVZkSFSMUknIhxA5He+yrWjXPePgpA/vLT5z6hJeeGgO7dmjBRv5UAPkXPXBF6ggnioXqSoJkMtHaiBYddx1fzY/vq+CqCGDHtlZwdJ6MZ4azmMHT6TjXNkVnOdjxG+fzc8oPhvpYJIsXWur9a7ueEt9pnM30xnRDAJVi1y1uOWtLod8w1tVVtWmU9bhOiOtZfd1GhfoU/9D7L5RgTdfblfX52VtSwu84+0aT4hGSYcI1T0mSGURI3qROs27G7RKOf/kxylnM0n3cCPyDObmTUCXrA4C4Hdu370/If8KS/WW6UMDYf5oOKg5A5UhVbaZzoBr+1hA2zVlWfdtL7XerPnPLobU6SEhsSnYzLn7uCT78MX3o/H0w+sALP8v9/+m9VsxaOgAbFq/9bdWSf5tiXUIEKAxHRwAxc076ITzvxr0xfM2YtwDg7F04QZwRlFeoaOsLAS7mSE51Y6KMg9yL9fi6LHzkFMqMeml5xAIVCHkN/D4M/0x9+fdcDhlTFm5CB+NngCBEDAYoCKHXklQEQ4j6KPIbkBhGAx6REGL1s3wxZtfYfzzI9Cn3xDs2rEemnZzkUpRvHmv/o47+97SjN3SoL8y8XNMm/kXPPqXz2GvNRCKCmjUzAoxVA8F3lMk52ytIIt1ydB7k+l9jw5TbeR9nkgF/LD1uvLlh44WCFtSLIo5XaG2lJyC6t6MId1iFuO0iJ4Q0UhUNMLELDLJUFyGv9YvNmiZWBCNaourayqvWh1ylTvOWZGcaNFcdpSz6gquCpqox6dbqyo9gQ6dMoSUzKT2uiqI1y5eP1hVEDXJEUdaflF5RpEn6E512CWJ0caFHm2UwqgrqqpwxVsvJmYppx998fYfhua03fvI0e/ohCfaoLCwGgU3ZPrT57l6vYYmuFldnL18Bs+/2Uy+9+kf1QxkoxABcP6hec73G+IP7alp56/ld0hBvV5tFA2DflY/3mmGLxTwxTnF865401Wf6jlBwM76qJo/a8PAsjTSJdrc9BAuRIrB+Rrho3eX1y07H+ocitAhukF7+UKh1GhE9aRSY70m6Du9onHi2Zltb/RtOjQEPI1tU74lX85bTpfsGwpbXUW4Xnq26fl9FT1zL3n6qwG5aXllpH44ohOfP3RDkPjiFKewKsTK8nMOxlefvVGCqd+0oEdXlBOTRFjmk0G+52Mzth7bC1GieHhsH8xasBP/VdB37tiNaFiFIAuo1ygDBTfK4fP4Ics3e1KBEOicgXMGb5UGnRs48msZzIoCnyeAgoIw6tdLgN0MFOZ6YBgCJKrg7onZiEYYKip0lP4W9LR0J0pLanDpZDnOXriK7Sc+QiigIiszBYQQcM6xZfM2wWSVeNAfhQCBiCLloUgIJtmKhg3S+IXCfMg2B/wlVYgzW1HjCaBFm+Zo2rgBP3z4CDRdRdAXuXmbj1IIAoFhcPQf0OdWRu1/P+j9Oj2JHUe+x5MPjsLpo1moX9+EkvJctGreFl/OeQXPPvSpcONKmBRdVtjZmg2MYwxef6U2riiHNawtYi0FInevqgl3CoX0phZZQWK8qzIUDsIbCKkatMuKrOQ5FbrDarF1DelksMlqsRfmVCc2aGE9N33u4NcyUptuIYRwzjkFIAJRun3HAVGjJp4QH8+aZbpx+VI+sTqS1aYtMzkhdxtdb6vBgVO7RQA6IRIAAs5VAfiBP/lIeR0xaGsfNdQplVVq66oiCkciPf/FrCF9G7dsXfHNF0sVYjh1Pxtg1ObOSaiuinYvv+Hrm5xl35TY3bOn9rhcDyGpGRGtHUIBow+JIj0cUeOZzSySQBSGIHAVVIfAhWbNbZ+D53+8/fJGb3ZZPz2tgxlnj13EnkvzUXZukW3mLE+jnHxtoM0QWqoh0p0TJT3KwvlEEvYz7l/fpJP7QHL7ioqnRryhcs7J5+8stU56e52qoq/G+cMicExctrisTt41/9CaQn1QdbXWMeRXLfFx9tJgRF3v00IbOt/pOPDyC2k1PVNOYubO+4Sda4/IJhM16jaN17/9eD3rcHtztGhYB9VeP8wWCd7aIEIBFUznsMeZ8Mvy3ejfsSMUpwWZ2U5UlNUg5DEw6qlGaFTnDlzL24Xtqy8hNctOCABRFAgRbq71t/q7q6znyBR0Ht4UlniODLTC3lOnUJFfiZ9fX4e3VjyIS6dysG1VPlo1zSCSIpKKCh1VVUG4TARZjdz06qVyFvLqqK31Y+2BtbxNfC/StGMKZQZFoxY20eYU6KtvzQz3az6YHr5wHXf2b0jr18+gn3y/UmuGTDRvU49sPXWJa7BCgY7Rd3Qg1vSA0KRVEm/brZHepkMmP7LvGsJhjQDgf7qgnz9zAC1ad4MWKcHnM37Aa5NmoGebJ7D31DQM7fcqDZZTyoIPGmWBGdxsSsX6Sw0tzw861aOiWBivG0JrQ0dLh91ODBhRT9BXHe+QD4tm4RglPI/QUOGQAZYLT719ytMorgHadlNvq8l3z/NFLFZBYgmaWrv2tTfveGPPqivF9rqiLb1uHFUUgTDGmGFwPS7OTChhiq7ruqYZTJIlSJIg+HyqxjiByylLusbgqeZCgtMSGPXInVEAWLNkt6VLnwb8xSFLw5N+7j3w/MXSqet+vOI+f6aysT2Jfw+2+7mHRkxlj32QbEx84swQIWp+SNKQUphT26Sqyq8nxElnwkzoqjNutSky0hsmXvVW+0Uiim6VC0o0qonJqS7iMsnh8pxqrbC6unbQ/Q1un/qXuUVevsp25MCBhHXzTzY9f9nb3RRVOrud1o7lIdVmYmJIJOq2qBnLzQnlO+ct+bQcAE6fOW47vq9UCHgjNEyN8KRJCyOcr3ds3rCp4dFfy1vDsHYuKwh2r/FEmiomwORUTvkjvtmSEt56eIlwPaWlBfvOPYsvPtgky3IUjgQB7mQTcycqRlCPcv9hN4qMXJhMIgAB5eU+mM0CmA4wjWHtkqM4cO1LvDT+R0xbMBRff3sCOZcKiJ3YYXVTIggEyekmobo8yKxmM5FMVKgojhhJmYrCDI6zeypVm1ugH/3wqwrEkwRwVGENB0aQtrJC8lQfb6o0Q9NoU17vY8J9JZW4ei0MT3kNGrkc2LsrB/EN7EhKskESFCzZNxFAb/SqPwhU0UENFTuvnAbw21Tn3+Y4/61rCjenqxPOORfWrtiA/qNaGTvXXiBms/LbmvMC1zQDAwb2u2UhB/4Xgj797bl4+e0HkXPtEA4cKMD9D4zBnXf0w5ZtW/HkhGn0zLFqoc9wq7ZwWiWe/URXck5ldrhwNjBMjwiDvN5oM1myQhRQTgT1WHaqY118tunAhetna/cemVOagBcRhAdhzMXkt1eIRfsjtNp6ULH6k74szNEHa8QkU1Lzw5Eb9skP3WcRBw9tbHMnWCKaypluMMnQDYFSIUoJIUzXLYQSgwhcYwaR1CiIFgWTFUop5TwYYMa9D37hn/H1w3V3r8p7LM6eGMyoQ+a8+nV65bxPPXJ5cZU44fG+idt+PczX/5QzPxBkXV31pe7p9RueSjLzYYVXvM9VVgWSSC1JAgSrIAlEJDqjinLamiqtz8g0lce7EtqVF0VaEFhaUDOTiQySc6VcJAGDNcy2VzTrk3w0pZ5y/sqZSnfueX8DT0Wolb9WTSqrCcFsNlXH2cmc5l0StvjCAc8bnzU4Z0Vfcu1CDg7vv2irqYqysh5naz/udRXAUnx6O6iv2/z7w9XC+IrCwG1WwZSoRzWYE8xeSNGVcclsRY0eOLxjaX6tK9vAsF7dlVBUN9r1SOYJSRKPBDTy2+OLqMEIVyMGCwdVREIqomFGqspVUJmSmqoQjwY0eGr8xKbYUFXoQ1qDOGzecon37dmOZKRm8De/nM22r3mUMo2TsmIdvfVehr/jZd6l57eo4F+TJinv8aQUCfvOXAbncwn5fSBDXQB5v7W0JAAN0QT3woXO+DJPdFw5UGjPz4ezNK9asjHGBUFKKCmtDbicNqgRDQ6npVN5ccBRXRt2GVxVLQrcNptilyVYazxRQkFlTWUchFJZFFmyW9KDUSZGIhrjIojdYoZIqRUyj2r+4EtJdSMXIn437TUqm0V8HDa3CEG4eS4/8D/c//9DBX3h3F9w34P3Yukvy1BeWoN5q57E8f0cq5YvJ+++tpecyf2GTX15Bhb+lI9+I2hKba59bGV1aHh1tdpLohIMxms0yjYlp9rX9B6afODNqRMrCZli1Jd05Gif4rlH5koJCYYiyZSBqIYepeLUTx4NDr/93edry40XoiHDrXNt+bH88Y9/9s5VOaO+pOiMKdUValBRBJaWaRYYh0QFEhUIBeEQdcZJIKAroiioo8cO8hFCGOecrF+2UBw6xoz3XldfvnCkbIooWIk13lHhCdVea9Io/oFmrROq75nQlo/uuUS7ti8TjfsdedNTRt7UBPNh2Ux9NbXh7kmSZCPQorI9Ll8Q2OWwHtovx2nbV24aev3zt67fc/aI9+molzVp1jrdIli4XlzsE0rKaiGZBN6gcRLPbOBQI1VB8eLFYqmoKAhZkNGwYdz+6irfURZVt72/pM/RzPg2PuCGOTcvqBzfX2rxelWtuqK05vSJWnXxhleFBQvXt/bWsJ5F1z1JZXnhNpUe3JmeagUYq6mT6tioRr07kjrbTjzz8OgLQB9sWvSRdOjkFdGiiCwjy82Lr9Wy66dqeLs7s6WIypnXHwQPR3DwpzP6tuB0BuRizYpLOLijFDs3l8OaQFFeqqJxXQfycovRIDkdNkWBOUXCrHV70VbsjJP6ROR4r5i+mLrVXOmP6FlNOKO1sDZJb55QUuAVI1FqULNgj4tXkrxlodu4IGVpelQyVDB/rT9a6+dmq6RwzRsygpGIxWqzCpGI7jSi0bp2lyWutkZ1qVyXXLKIoBaBIVCfQHnEMMBNkqSYZFn0BCKw2BQoIieBYATOODMYNyCZJIQjUUiirNnskkWWKJEkIWIym+w61w3OdNUsm3RVi4RD/uBdcYnqEV+Nlfa4K5vVb5aIvCvVv5/7/+GCvmjBYlARgEFBRY7qihCeeuIhQK5B355T6M6937GBfV7D5l0PSW+8tLnzwT3V/UIhbbzm1+pzKkCUyXabpC91ZMj7127/5AowBvt2P6Ec219M/D6dm20CFxSdp6bbREkRuCTK3FsVECY8Ni6y7Ku5yVtXlXxzOdfXj5r1LXDnPvzMkxONQLjGZGiC/vgzbXVCsiOcc3HT+u0OXY9CkqUoJYwH/FyEwend9w72AcXm55/e1NYhORpJEql1pZmLfJWRsTWl+ou6auyr28A5mSqm5nt253yVmEqH5P6atD29T27XqsuhnoLi7FhWXt41ialmkzne41cDEufm1IRk888WKfBLkzsbXXr5lZUl/ep1QFpr0s9bI09RBEsviUpEsdAIZ7qkRlWiM/CETJeQkOKAr8iHgos1AI+WMEU7r5uixzLTHTvufyvxeM9G+wMacrF2xQvxAX/E7PeoRkKiIzLqvjtqOefS7l/3Z29Zebmj7uF3i7Ll9qDOXF6/FhYEfs0M4UBKmrJPcPNzb7yVcvGbD/zsmSnDMKLDt1KHu0yYPJXpwGN4rOMq3jOtPZZtWAkSB6hGCiwNFBw7ewNF0Yvg/GcBgFyunTKf3lVpu3HRb716yW+L6MyqG0wXNOYsKayMy0pIiVeDhsPkplXlHm92WkpWAudwe8urMkwm2aJGDeiGwSRRtIRU1c0lUawt8RoWCxXjrLKlqkYHFSlMFhF+XwguuwWeSBQQCGSmVRoazsS5HDVWE4XXW6NZ4+1iYqJVE2zU8Aei3qimXYqGjLOe6toQlSlt0DiDZWTZmMG5YTHb4HbbcCOvBM3apUMSNNicZqIZUa4oomazWx1UEIjJZglqETXZ0PQQFVlYVqDbTErY4pBK1s8/Ex06oTX2bc77P3Jx56D+//pBXzz/FxCBgTABBmOIz3LAXxEFBIaAL4orF0Lko8+moWPHZvzIkbXmubMXd1/7y5mHr15S7+ZEkWw2lk+pvqxpa8eqD2eMOpeW9laQ8xXC4+M+l7ObuHhympnFJ5m4xaowv1clIb9mWO2ywDng80VMlVc1fqroCi87x+dHK9Thjng+berExm8cLosT3Vmwj7y9kcfRoCU+e29Jrx2b8h71+/3nlmweNG33jmpzfJLIggEIfW9PCl7z+uM2zCsb4ik2xnoqw3fYHRZkN3cDET18+nCJWXYru+Ysu2sYIZMCj4zo9NP1675HEtKk2eVlNZlx1rhOAU/UqTHALftrAsEaa1CTVKfdsb1Vi6wf0jqX/3pyeqn6+LbxWPzlDkvJBWFyMGCaLIgmYrZITA2FDZNFFLIbu4k3aJBUmw0+nydQ4YlWpyW68nQtuj61OV8/ekKrwvp1W4U558JzQxdK7iyiWO2CptQy9flZP+vAUXz85VfOG4dC7UHFcTars2+gJlKHh3XiTrdFBYsxp26z+CWPPN78mkAyS/5togjnJSIQLwNyFND5itnH7RFJd+fkVbKKS1VC+w7ZcmWxx37tdEWqzuV00WGKr/aGkrhq2F0W4gypcGmRSIrNZXIGg1F7JKzbLRYBNklBMKBDFVWkJbgQqAyCSVKIyrQ4LcVWWhvktoDXKzhdVk0gUCLhKESTZOjUiMKss0B1VE92mE7YouTQ/pzqMKGqmpBgMVyJMuplZyC5nhNl1VW8SYfk/JF9+uT0i/+G76wpBLAdwKn/0EptSMa96N2/EcwmFRApmrdugOx6VhhcgdVqQmKCHVeulaJ11zSIgga7S4aqRRGfakFVKYPBCBLTrCgqCsAIR+FOIrA6JLglCwjSsXXzHvQcWBd7bwb9twcn/4GCvnThMnCiIhIi8Hn9iEQJGjdLIuFIRLhxyS899FpCONU6EnN+XtBz17r8Z69dCA70eqNWiLw8Jd3x6aC70pa9/MbjxYT05h+8M0oRuKxIihJt3CxR17QwkUSJBUOME+g3H2ktylFRBNWYJuSdgmj/ZmRoUerTb1VVKm9riO4y97sxeMqQ5+nVy8Xkq/eygk9+kN+Ye5wvnzlccu+VK5UWp5t9fOTSqDfm/VjgNJkF0qWV4j+bJ7Q9fqjmg/IbwT5Wl2LEx5s3x6cL19xJtnq7l+cMuHHVq5lc9EJWquurK4WlXYO1xqNEE02C1QyRUIiE1/gCYaug1obdZt3IrQkE5CTxiePnZm69r8tnWHjoZwAX8MM361qtm3X4MyFq62dxOlhBlZcmpMTDHe+EYiEIRSuhCLbLdZOc265dy13WZ0LLggn39y+2kKfYQ+PaYNHiY/DwH0UAFIAOgF3UDtry97MOO1aciqvOI7eBSLfbYG7vp4aZRgUIiqinNjUhOUU8LRj0y0Pbcjz+Gt3ljLebuSmiJDrcfodiclUXheqY7NRUEdLrBWuiqXa3iVpFhCqrfPGy2aT4an1EjxrMmRBnMWTINd4IswIsMd5EawOal1CclK30hCiRqNVEWcDv5TaTC5GoylMb2LhgEhDyBKI1VcblULnn/OL9U/x9+gwkzXu3ZSFiJlGlmD30cEN0cXcUzOjGAIMAgkEI0RpiIsohw4cfAYwF4EG3uG5QnSHUohLd+tfFpR9zSKcR7emvW8v4udCvHAgB2AsgDUAT0sJ+G2naPg1AFKAEaWkJiE8wIRRhsFjNcNhklJbXoE7DeBCiw2xTENUiEAWR2x0mAogwW2UwEBiaCkEwIMsiYDDOBJ0JEGEwBoHS3w/Z/xBB/2XeYtz7wDisWb4WoVAIwaCGYDCEsY80xbqlN4SrF73y7qUXw9PWpNiW/+iaePRQzavBimi82yl7nSn0p3ad4394f8blazu2jZPWrzguJqWY9CbNUpggUaGmymM2DF1LS02JBkNhpsgCj3oCIBYLlWQZgWCUXrtQa1nzNfOZ655/LOKXvjaYesScFJmw6efZRe989YPpq7mjwp++/eujx/ZWvM1VzV5c6eHBaGjftB9HjDh/PMeUmWkzt2pX17dz+4W6545HN4Wro3Vbt3Zf6Toi66XOHTptB6C98Ph3D9y4xN8PBmrFsvyqxKzMLBqO+qFTw0cFuyTarRoLBhWHg9ZSTZUjXn8cV2hemw62IZ/8tObiG08NTCssVzIiPlNTTkgfuxWdq/O9jWp9hmGIclQksmazijfiUu3H0rLMV2oqy86PebDd8f6Dt9SMatYU0WeqpC4VqVkRv9rIYbU29/mC9X0B3VbtjYpiANbacr/msFkyqWS0A6dUiHJwSYHNaUGIRVFcEoA5KgAOAX6/4Y0zs0pREZwQFAdYJCRJei2XlVq7IuaXXvUFbfGKOSIJlHCmxidLyEyPp75ggEU0HvAHIkeqPOHDohIKWM1WJLjjUb+Ok4tuM01MY5HhgweWd3B8zOJTbTh79SJuc6VA1BRsCuahjlVCZTCMEGrQtVlD+Mpv4HTVMnp2Hfi+nXtIxm26oHstrKiilpRe1/iZnPPoP7yhEPCEqdlGSVa2Sy6vCqsgDAKhzDDAzYrCBUXmXn8IkkiZO97Eew+tx6WIgGOn8xAMMXTtVw+CGEaypSUIqY+n73sNsxceQQRVADQQ2MFxGUAmbs7xqgCQCBN0UJKJEK9Am8z6mL1uDKqqwvho6gk8/UpbyLKBh4fewLPPOwBBgy750K1Xw98D/ocI+pIFSzH2/nsw56eZEKkDcXEmMMYRCOjEbBHo6mU5ZN6yIp2Qb/HIqPeH5xWrr/v86MR1WpLkFNaPf6T5jHsfG3GlMpAjfT51h5ycLmiNmyUY0QgjkaBKbVYrzy8oFAWBknr164V8gYAgUAKuA644Gzt54gapriTix1+cUe/oGTehLFebrYejtYl1I70nv/rY1YmPfUeue37SZ7y/9q0LJ6revHqxwp+VmbTtyrXr7eIzMW7L/qlH5/+8KR66JZKZptmWzC5e5akkLTrekbZl4pstv/x8yibt+CF/H68H/QI+tZMAyaSYxWgowoQ66SmiJIbyBUjhQIDUrwlXhRHWFZMoEodN2KMTMc0bYW6XTVwbCNc2U8NapsNsjQ9pCBLFOFunoXPjjcISLdWd1lx2WXMlQ/XUy44P596o9Qf8qi0aJXXMXMiqrAomMyrFpTiVlOpQqK5uEJtTliBTipKqIJEoNTLTTLl6hDUIegKIciPPGW8pdVglI8Q41zUmRHU1LDrN0ThFLvd7QmcuF4dy42yC4XJrIbPDpaSkWYTUeLvorGvLz+gSd3nN3TciiWkKKkQZl09WwJ1gRR2XgCNnClAaCEAQI3BnyEhKd6LKUwWLyYoWDdwwpdjgTtPwykuP4NGhP0mEEtRtaBISE60kVK2z44fKmB9+3qpDmlBZ4GGMCjwj3cFDUQ8nkgm6zniDpolUEICAP8wTU+zEnWAngXCIWy0KHTSwv7b9112UGox8+clhY/32k5g5415YrCbEJdoQjWowWWQMHdoQhKQDGIo+6Y3ATCY0a54BwUZQWRuAzSUiMysOb33yACY9/xM++vLRv9vWd+7ejr69+2PP3l3QDQN9e/fH/r0HoDEdVJLQq1tX/Lp3H27veXNRkq2bd2DAwH7YunkHOOe4c1B/bNm0/V836IQA/lA51IgZH32Wg29ntKdlxSFyeG+tuOfY5ejH0xu6Z31e+W7AozwdDBpwJ9AZHbuav/nkq9cKCCH69I9mO2w2QU/JtEa0CAhjnAiEEBDOKRVY40YNeVllNfH7vVw3uMA5YQIMYuigG9ZVIO98WBNNJc/rQfsUQdMEZxp9cvXed5dzzlHgOZ207oe8j/dvufGQ1xvc13/kbb9sXJczJeivnnn40nsfffLBL0l2yRoe/oymv/eQd5G/mo9IraP8LDho7pF9BW2Zgb6RMHdYuFymUVzVInobX0S1JMdbSGaSgsIq1UhPdQWoLyIrAvNoCjMn17dcH/t8p5XHDtzosWNRyYDaSlUiisHNDqXI5pRORVXNS0VSGvGr8UJQqq+LcoqDg1gVPZqnRrJsVHYpAkEgEIYaYRAEKUQEIadhhq2w2OsTVF1uaaWSTRYIN5mFiEmKBoiMqzWqcY4z37GoWzt5yXu1UraZ8NLTQ3gdazz5evWy6JL3vjYAMEIG8RZZnRHvEJCYbMBkdyEpxYS0BDscdW2QW6nIfdVMjlWegQ9mUnT9JGSTDkV3ID9YCAo3LNSEBvUykVbHDcgMIBLibSLiUmwQFA5HnJWntDW4rACWajvq1ElB8xI33l+2H28svAc/fb0S+Zcr4apjQv06aQAMBEIMaiQEu8MEV6KVVJb4uM50xCU4oOoaLCYFAwd1xrZdR0AZQ//+74PzPfji46VwuMyIT3EgGtVgtshwJ4po0S4VnkodddMbo6jiKjKSGt3SgP2z+L8K+i/zF4FpDIIsQaQUjFOUl1aTzt2ycPZMtf3yudrQuoVBvc2A2vaF18nXgWreWVLo6YaNne8t2fD6qqmTdghmMceRle1SkzIskerKADUMZiiyLAlE0ADOGTcEzrkAQg1d15ksy5RBAAXnalQXTxyuJAWV3SPwbJsYrDReryirTk9Otcxcf+Kt5wDwDSvX9zp3JvLZ9o1X29WWV864+/HbVuxZVTMrpAWK5py75+4FE0+z976/J0oIYa899M2z168ZH9b4DdkwmAgQKisMGuE7RCIuOXTs+1/W/fpD0q5fKvbcuFJVpzi/kGXXzSQ1ESDCI1q8RTLS68bDkWKOON00UnyjNrG2wm+Ul3BNrzEs3EKYwbkBkRkiqOhXGUyKFMi0SAWV4UB1giOugtNQRX5tdWmG3RGCws/7vGUF2S0SSMOWafFEV5JuXFY7BTW5W9TDbjeBw+LGXvhDG6CIZ0Im4ej3s+Z6TBARwRXsmb9CTNufajSclQHOOe9LVpBdWEeA7WhhG0PsdZNhN1M4XRosDhdS021IdFtgT7Xx+LR4duDdAnx+7CMA9QCs+m2vxwGo/e19W3RoNBi3tXOhSatMZKSlgLEIEhokwGGXMLTvTxh5VydUlBbhyec6QdN1VFWriI+X4HDZwHUDBucghILpKgjl0HQOXQ1CkUVohgjCDURVA6IigRIKzgFVVSFJAhhjN4eWEgpCKQgAQaTof0cfbN+2C/3vuLWjz/6Z/cNB/2X+IkAAWISBCgQWuxXOeBMIIBzcXWB6ZeA94euO4+a3/3Ly2evXaieDEXv9+rZvh95T56P7H1tW/NX0EXEWC1Xj4mwG4zrRdUMlAoMgiIRwyhhjnJCbT0zinBFQiQsi4VwnxBkn82uXq0nOlajp4OHCUEqCMr6miH9dVRW02JzCyeZdMoYvnV9WMWtB6wlXzulfnDhYEFdRXjPl6LVZHw7vN2VFaYGvy/Mv9Go/7qmeZZPf/Srr7IFoVy1oDAtVR+70eqOKze6skmV6JiHRdKJrt7hdL72/cQ+wFPNmL+1y7WjtVJ/HdGf+jRo9UOsXuWgnoYiGuAQnNNGAQnSQgA5/UIMfhNtMzC8JWnkcFXOpg1b6VF6UGK+c1YxooDoSqcxq5i5G040Vs5/bGulDl6LjYB0VJg9I1ISf1j4iTHt3aa/KiugwAto/5GNNuUpBLLzclWDbaEQDOx0pkT0sx1WsyToCEQWz5yynGZKDWOuaeSCq8cZNk9G4eSYskoJzF/LQ/LY66DKgAfp178Tv6DgddqsIm8OAw+1CUrIFdqsIQ6Bo2rMNNjy/F9+dXANCHeBsM4AqAK0AFADwAOiFzs1uR8vb7GjWug7S01LAWRQJ9eNhs4no2LoFtmzeDkopBtzZD1u37IDVakb3Ht3+arvavHE7Bg7uj80btwMAuCSBahoICEK/rdw69K5BWL9uE4be9edb6+1/yj8c9EXzF4KIBEaYQdM0PPzkw9i1baPw69Zrptff72wsX5XbcfVPOVMLcoL9FIEXpGdKz67Y++G6T95bKHmqq2mHrknw1Kqq02mHYUQkSgiTFMHQNJ2AU845EzgHEyXKBbuZc79KDMaJyUSRc81Hvp2l8ivXDrPxo5o9VJQb+TRYETXZbJKnTv24IU3app9xxKmPlRaSr69crlEiqnf6+h2vvTJiyEdjoh7bj7JZn5JVT9ubd5U9VVMRGcAMS7YvHAXRNWPwuMZCZj3rBofJ9kqxvyy6fNEFh8MrtZUs5GGmq13s1CREowJqIxxJcRJUWYloHFVJZqUqqEZLiKzmSgIvtUrmMme2pSajrrU8/2JpSV6ouPqz5fuCHUh/lih7YHNznClbAs5rsaJwMk7NqI8PZzyCLes2Ny0r1gbeyAln1FQEB3AdzSBIYFG92uFWjqZmmbdlNRO2jRx+/8UHh32KLkMJTq9lAgTO45Id/IPv7+WEDMFLL46C28ZRcKMKoQBD/sVquNKsyG6ShtRMKxo2TsD3n56FO06GYtL+j6AnujLwwNOdMfvLvXjk+Z63ul3G/A/7h4K+aO7Cm725yhHwhmFxmOiER4bz1577Ufl4xgSyeMW++1bMuTKt/HrImZRuWt28re2192c8d/25R7+wtu+SQFJSbcHyYsZtzptzfmVRIjqPEgKBcE4MgAucM25oUUMwmSmllBsqIxaLSA4eLMH1qyFyT5+pfOHWTybnXvO+KzNSYJZpsjPO/vW6g5te+fnHByflXqJvlxR4ZbNN/eCbuVPf6NHNYcnKev2DouuhQbIs+CP+QGPDoDZRAjKzkg2bhWu5ZwuF1CZxPBiN1hZeqQmxiJ4oEcMmSwRevxGhFlppsdrEpo0ySh2JynVuNnZJopHTolVSQZMOsrdhM0fIgY4UqI4Cbg5USUBaGAC2zT1ILpdUiycPl/HLZ8rZkYJPjL2/rmA9b78T07//Op1XJnaqLDLuhKqPtdlNdm/AgN8fuexwi4fSshz709Ll/fc8MDD36aHzNHd2Dd7/uoA+eU8bmphlsO0/FbDs1jaMf2ogJr88C53bNMCA/om4+9mxeOepH/HWd4/d6nYV80/m7wZ94Zz5qJeUgPxqD8wOisLrfpJZ1ykvnX8Wu/acjP7l5X6D1i8tm1VWFElv3ca9bMWutx6d/Mb3oVSn2ZxVzxqNhA1OKTilhHKAmYPnjaClqUgJ5RQCZzcnBYASwhljhAiUG4RymTLR71OxZY3Ezpy/bGQ3Mr9Rkh96j6rG2tsaZ1ZczSsdbEr0d77/4U4Ty0vp65dO17JWbZzrxt2X/cojw7d3DhE6yiyI2Tm5+Q2ZZDc7FVlTwYjVZeFcN6R0SWQhfzUrrPZFCeUmbyggJNqt/niHWFShBo7c3rfJ0vTmmZWZdTJMg4bXK7LAEwQahwFRv3D2pHgjp9qqqYZRWxsgiiLSaIRp/qAehQ4950o5/2buc9qCFWuxZbYPizavxrkLb9U9dvBy97KrWr+iYtZdjaK+LAOE8GsJqfKxuHhhdXJmdNe4+5+qGdn7A4y6rwHufWQwnhgxW0iqr/C+dzVjKU2v4L2HvTj361U0b5eGBh2T8d6n9+OFR3/EFz/Fwh3z1/39xSEZQ5dBA5E7fxFEiaBnv7rYuTlP/mXtWP3jdzLu2LDw2vTa0kBa597ZUxasuevTpx6eoTRo6KLpdcxaKKhzSRbAmc45J4QDnDibg2ignBHGJcJg4OZZOeeUE0IYA7M5RX7lfDUuHnHzCvIqSXJP+LrohvYMR3henz7py84dqdoQ9YVemvJdz+4nDkdev3ymhnGdHTl5orpq+U8XNgSDWmNmEjSuhiAzLqn+KpiUBMlMTKgq8cFgRJOTHCV1M9JPm1IsuUWlhaGUBqkFjdu4D7fq3bz84ZGDqwDIeZcvCjXlRXzZDwckUbZKhF5zSrKgiiJVZQVBZ4JJ7dCzhbFrWy7Pu8zw/ld385rqS/j03T3gnMtb9+5qPvAeuUf7zuP6/PzpmW4OmynB7zUgiULQ5ZA321L0Oe36JOwc0LN/zegeX+Dtr9ugfd2XhIbN3QgFGC8vK+bj+/9o9L+3LzatPYtPejwA4AdMnXM3Ro/qhifrfAcAsZDH/F1/s0ef99MciAKFwQkS2mWj9nSeEvDpojNe030ec991S0t+KsmvTW3Z1PTh3E1vTf30nTm2zLpm0Wqm3pDKREoIqEB0EKCehxq5LkbAIHBOYIAREEIoCAjnhmFwUEmgZqvISwsj5OTRWrrRM1FrF/30ndyLwTcEwrc+/nLT17euLv9UVzU9PTP4niFlLArWhOucOpSvKyZHxB+KOCgAiTA4E2wQTBzxshiRBK1GN1uuJcfZzwa0qCejTurluvXtp1vcyUu6N73TR4iDAX5wHlF2bzkgFpdUy4YBUVQEJogidzgsXBDAwKFRgTBOdG3xAq9hDdeI36x4Uv9p6Upc3BPA5zMfoJfPn2hy9HDRgOIbgSG1FXq3kIcpjACKhXjq1U08Kzixw5lJ1o0fPejSp2+vVrM7mvDQ4Bxy950KadbegS59GrCevRvj6w93o1n7VHz0wkbc+3InNGyUgtwbFXjggdhiijH/9/5m0H/+fjZEkwTOOIhJIFQjjh3rCiIfzeyTMeP9U+sO7qxt1qlb3Irps+57dNpHK0wZGXKIEsLBoRIKChAiiVJENzSBc3BBFDgzDJESgeswCCGEE0aoQIk+cmx7tmzpMSnnikdaveSUeuzSd9qQXh9+UFaiv5aWZj3+xCstTm1adrHz4X3eVrJF3Kf5/QmGmtA8GvYYjISFlNQUhNQI4l02uOOtESYYpUkZtn0JLrqFGbQkvkXC1QceqltlJ301GVPxzosDEZ98UlHFgEnTVEIlQU9MsQtOp0UTRcp13QBjXGO6DkGW0GdwU91MsjB/9nqh5GKIvP5Zb/3Zu1fj65VPCIfP7216do/vzsoidUBFua+jt1x1mCTqsYm4YDLxE2KifU/7fkmX2/WLL2pjWuybsaIX7h01iPzlyR9pm3ZZrO9djXhqUl0AwIyPV+KO4Y1xdGcRshomwBavoHP7Vti77xR69mhzq9tLzL+ovxn0OT/8DIvNCk0PAVyUvLVEmvjC+PArz3z+lqE731LV6NEXX+4zYvW6LVpKWhokiYcJg8Y5FwmhGuecg3BQSsEZ5xzU4GAmKgicUKaFQxqNBgCvJyz6/FEhKTWBP/vi2OCxY+fjvpiy+fVT52pe5VzQevWuX1JSWlKn6Ho1fAHDMDgTTFRAUlJqmFoIiU8xlZpl2S9SXmqxKNcTUuXNafWEU92GuD0tsr4Ivfvoi2jU6LhYUJlGVbMoBH3ESEu3MncKhzPOLMqiwKlADF3TwRnlmq4xNUy4KAsYNrIXpr27VjTbBDkhSaGLNhmBVoIX989s7vp1duGwwpyau6vLtf5Ol9UU9ego9QRzXHbz0oF3NFky/ImmVwhxqyO7fI6+YzMw8bn6GN31oNBjTAZGjGjMRg+ZzX+c+wDGDv8RDzzUF7d1SsWAIZ3wy8+7ce/Dt35BwZg/jr8a9Lk//QxRpDApZoQiQYQDXK6u0nSz2cg+eTS4rXGLlOzmbVwjfvhi9YbxD9+Ropiox9AZJ+CgoAYALojEUFXdzAFNoAIcbln31mrEW6PK5477jKCPcdGiGj8ufMkAgIP75lhfe+74QElwP19eGO3uC6k8zukwdFUVfT4frDLTiEAlUeRo0Lju+rr1Uvb6AkF/ekPL6TqZctkjE9uUEdo0yvkRaemiMqiqbg56DY0bnLlSTNRkorpAOahEGbjAGWMUjAscXB82YojBkYvDR8vJpQteWnS5nNjjLJLLZeMz3jkbOVdWC84/wtLVO9IubCgd5VfVZxRBbFjji4Iw8URqhnwmKVW62Lh91s6+A7qcmf3uNv7Im3fASh4howe0J827xKNegwR+x/iG3A43dq/Nx+tvzMarUwbh7rF9QQjBrzuP4fa+HW51m4j5A/pPQV+66BfcM/5eLF30CwSBIhrVUFVbjvS0NHLlrE9khGn+Gn/Pqkr79pad3IHsJsF2JVekQFyyQAjEIDjnAiFREEY4ByilALgQjeq4cKqa3bheSxTFyUeObcmGjZnFgGVYtGClY9XPZ5uVlPqG1XrUvlxFB6uiAKJQ5Q3BrasalaiBzDhTvjeCOlThpXEp9IVth9/ZAiwIJBKNVfKJ2LJ5m2nHxnzWqFGcmUpEc7olKLJIBAk6pURXVV1gBjcESsEJ5wQElAKlxRoDk6jDacL8mSfIxoNPG8cuXMVP72/HrCVrwPkMccbHJc1uXK3pLYSlQVGNtXLLJgqB5Wnm0N7kLPvuUS83PlnH1KZsTL2v4LhNxOzVT5OZb24g6c0p79G7E39q1HwMeqARHnhkOrZtfRdxCU4c2nodz04aAUIIvvlwA56ZPORWt4WYP7D/FPRli5dgzLixWLZ4KUQRKCv2QGV+JLpThGDQEEM+Hk1PN2UsW1Kys2GT+MyRYzIntOvUcNOiufvMoiTo4IxREZoiSXogoAne2rB49VINtzttxqfTfo2aYUItn4NJL31Z79LpcK+SEu8dxKD1uKG3rPUFzKpKYRIlnXDKiUglQSBQRLovLcV8WWGmAZpTKXQnhZ+du3TXqS+n32u3W20I+A3N5hCpyUyJYhIYFSkUhWiGQblhGCI45wZnTKCEC5RwUMDpVlBaGKK1VbrkqQij87D64YrCGowZMRRV7Gzakd2+zKObr0i1Ht7J7yED1YDakYrcLlF23iTJGzKbJCx4/f2B1wkxq1Nf+AUPf9Qc2eal5J5WqcRUT8QTr7fmXTp14XM/34DGreyYN/Myug7JxMAxbZFkT8WRY2fQqUPrW73vY/5ECADMm7MAggCIggjd0CEKIsAZGjati0tnbxDGmEAFgtwrQXHqR09FHh/77YeiIExq0srOa2u9e29rn/2gpvqqOCgqy31Ccb5Pq6nx6TPnvakRksF3b/nM8v2X59rkFQQHRoJKB8Lk2/RoJCkSUWGyWJjNIZWIsuKvqYnUpYZhNrhhuBOt6wWxdkHrNG1rdteOtkP7K+5t2yNzy+uTx1yZ9v58c+PmbkYI5wIlTNeZACqAGUwGgUopZTfv2EEihOuyDN1uc/PS4mpBDYJcOF1BPvz2UfXBMV9j7rJnxXM3TicWXy8fkHsh0LemzOhdVammV5VFtPh4KhCBXPcH1E31Glu3W+uED73wxMzaR8Y8jtnLJgK4i776dH+06lSfj7+/HydExhtvLcf772zDzPeHgzEVnXolo0Ovrji84yA69+t6q/d3zJ8UAYA5Py6ApAAmiSKiMkiiAM4ZMXQAhBNKBMLBhWCAC9eulGqdu92WsGHp2elxyeYuSenm5UlxlmmVlQFOWVB96e1nw4QQg/Og5bVn5jQ8sDdvWNCj3g5N6BnWmCCZrJBFc8QsaseciTiiEWezyuJwV00zXAbhSIqnW6w29ftNBztvImSh9u7ih6nn4Bnh+C6uzf46g244Zij1mzjBGQzOuEAoMW5uH6imaXYAEcUkhxljIjcICfg0/fCuUvb1/C3Grl+f42WXVIx78k6y79CWlsU3ol2Lr4V6+jyklw6SVlUcAcJaIUSWI7mUE82yle0T32p/nJBB1WP7Po0y8RJ+3boYT42cTrv2TOVtR2fze/o8hTffeRNfvLwHd41riK7DWyAjQ0G9Oi1u9b6NifkdAYCZny+AIwEIeTgsLkIIZwAXQAglnDGiGQYkWaSKWSThoKZoqkCI4DOJgtl+/4NLcszogzBeRon/cvr7z25sff1iba+AR+/u8QVbh1XDKnHK4+3WG6Y46wVLPPY0bJi4MxD2O66c8d9Tkh99UhJFGufCbtGq//za9w1WD+nyXuitV983RSIB3qJFIhNkgZ4/VsPqt4wj8ckKh8EoIaCiIHDdMAi/+dweDjBRkgS1rDjC928oYD+vf0FbunANPn71GE6VfEAPHd7TuORGYHBFqf+OnKv+jqEQnAoTIDCxVjCTS0mZrg0Ro3b57RMcRd0bj4i8OOhHfL5xBDKkKbRV+zRkNYjjDRom8oefGYTvJ23F5B9G4+5hD2PsvfdizNib843PXb2Alo2a3+r9GhPznxAAmD93ATLbdEfhqf0AQBjTIRGZEwpKCONRTRPCIaJEQkyQZVl0ui36+AkjI4QQ9duZSxKKb0RbXzpdfFdFcU2H2qpgF24QEFkIu9ym406XbWtKqmXr9GkDL8TXezp8x+1tW/oKyKNeL32aSorAWHhvWpbpo5mzq3Z0bWfW4/V69L7JitKhR0pUkcykpjJIJUlgskIgKQoLBCIiuTnIhoqiAM0wCGPQoxEu5V8NsVffGRf98Ye1ePzJ4eC8Nm7H9oOtci4Fut24EOwS8vOeWlh3mEwyIno0R7RgX2qKbWubju6zg+52FRPS1Tum5ydYuudVEDKCvjp2EBk8oTHrObAnT3QMxIsvjMeU9+7HZx8tQiRXgqm+hpdeG3+r92FMzN8lAgChQOGJXaCSAqZrAICIGiVOm8Evno0oYY0KH37WNULIeIPzNcpXH+2tM7LvtOGj+n7R85cvj9X1BvTmBgNsIq7a7Zbldeu7d8alW099N2f4JUKe88dZO6CwfG73RlktH869QB9wmxTqcrCTVmfkk5ajr6ybMcUZuW9sPzrugbCcminrzZs7o/5qlfqgMcUk6ZwZJBQgQCgoUpFQ2SQb0ZABX7mqFBUE9LPXqsiiJS9GANAy9WimzYoO70+ad8dzDy7qJlK5hb9WQ8jPQAl8jmRpSVpD+7omrRIP3zVicP6bzy5gPCKCRXwAHiYJiS7yydTF/Hzhm6x5Rhssn70FwM3fiA6n5feKmzJrzK3edzEx/zACAAvnzb+5XiUlEECIphlUlgjhmpNPmrjLyI18QZ57clqdnAu17bluHRTwGKMrK2ttmhGFWdYLRRNb2rpTg43t2iafefb1hwKEEO3+4ROxYI0Lr71CsnZsNN7x1pIHmaFDEfQzGfHm6a366Gt3rZL9vqJ7yeBHt4lDR9fVBSIjP7cWNrsMxgwuigIYI4QQRhwuM4mEDaGkJMwO7CnEguWnGeeLOABaXHy0zonjld2KrkYGnD1d07O6OJLptknwRcP7RChr7HbmTciWSeuOWTl339Pk1N3td3ue+igN/e+4k3z4+iKanGJmiVkKEpLc/Pi+Mjw36W28MelV1GtEYTNc6DqwLTLSk39fCywm5l/NzUktnIMSEZwb0HQGxjhKSlThxdcUddEc68AeLV9/IBRAf+hwy3KEh9TQVZdb2+VMNO+b8FzXX8ePfaD0dEEQzVrPMj057gt5+TuvsIyevbOpdHbMjrXRBwN+raHCQ+etcca3H/zQcsH9t58INmjYl8YlXBT7DN/M+g9saJSUhDDhwU58+S8HCCUgo+8by3ds2UCK8/y0KDdIQ/4a8YOZq6Jfffkgu3qlFhVlf0lf8MPqIbVlkV5llWq/qspooqcyDKtZLreY6WZXurJu8PAG6759/UyJp1JCrS+IaCgPd9/TH+40Klw84eFLFq3k99w70vhi6kIkZyvgkgarS8T6NV9i6PDbsXzxdowe9+9rfcVCHvOv6maPPnceCKEAGIlGDIS8USxcFiJzPiPC5Ddr15dX6gPCgciutGTl14w69l8tWbg64/Mp5UBHfPfZQ3IoQkz5xbpesbc8tPhcc/mddyPjTh+qfbbgam07ZiDPalOnN6lbuWzexnDle+8MlqIBryCbiNrotggL1SYTX7UGp8vFpz5xAXlYhDnfv00unSgjXg8Vvl/WXxvS5RdsOPSWDNxInDfvVLPTh2vuDtTow6gqpQRrQ56QRPeYJXI2Plk82eo209lHn+9d0idpdaTfKyZc2m0IXDMQ1SOoW9/NW3d38/seHMHnzV6Bz6afwdlL7+G9v/yEtr3TYXNbcHv323Fo/2F06d75Vu+bmJj/MTfP0YGbh6UAVxSJiAnAuLEavKyZ0aDpoWfb90rkk98ZkEfIZB3HVmLprA3SQ3e/Y2neNklRrFaeX1XXf+bKFePxpxq2eOHJ8EuXLnsezLlSArtZXXLPONeLkz7OL/v5+cWISO+bUpJ1rcHtGXruVR+MUBw9cqiY1W0k4eQmL6nfXCKuwBg89ORoNvezxXzGJ7ks92phfN9B9Xu+8tj3Y6IR9K+pjrpzSoJVnJHchpnxi1yJdPmiFc8eAV5ElkRQv0EjAFlIqCMK3jKDrdx83hjRrylqPbVon5KJLj3rYOYPqxBnN3Du8vvYf2wI3pzxGDDj3yslFvKYPxoCAIvmzgPnBIRwECpB16KUcQbFaiJjx95rEELw1utfKWazIhuaoTvjZZ6YbEbe9ZDw2pu7Q5yvpe++/9WE4svs7UvnarIqa8or4uKMNw+e/eLHL3/cisorecqZQ1ejT7zUDUNGjmQfTpmF7CY2obpMpVvXFnE1rKD/gGT95+9KoUcMXA1Plt55fma96hppQHWt5ymrZKlTUxSuDoTU/ZIkbPNxY/fec1OKwCfpJlxHBMvR2P0uFcUgRo9tROo1dzFXY8KH9hoBQgZibJ8BqPVXo/cdzdF9UDq6d+uJXTt3o0/f2MSRmD+H34MOSsF0A1QSoEU0cAJCKUFtVUgSBBHJaXbDYDpRNRCLQpGf55ePrq8MvvRD8+QNiyLvXb/ufay6zBvy1tR+53Lj+637N1z/y1NPmBs2trPUdDvXdcYNgxkXz9YK1WWMmyQzfXMaV0f1K8S2kxq+mp7mPH/C3Kos39+2prRmUGZmQueQHjaHovrGzATHFwlxkXOfLplS05S+gZTWMto2eY2sXDWDtGlTiza92rI3P5kLYC2W/rgVU9+chWFDB6JZuwbw+Wvx/MsjMOeHX/HQE7ff6vqOibklfr+69MuChdBUDYIoQFd1RA0NNosVo8e2hSQ1xQ9fzyIWk4zEDAv5/rMbdM2O1/Wn75t2pxq1TQ8EWfNAxLsxOUF8a/byZSc4PyZMfeVbc1Z2nFZ0PczCgRA9fyHIMtNsfPvmXD0h3o1jBTn4dnrnhN2bq2+rKdOHgEndZZPQTDBBMcvCOZfbuoUJ/u2zl7+yb3Tnb1SnoWPO8TzSo24y1R3gYa2aP/jAbfzZ1+7Da0/+gpyCUvgiVXj8vj4Y/cgdeH/SPLzx0QO3un5jYv4p/B70+bPngoPDJNkQUf3QGYMsy8jKdKFnn0R89/VFmJ0KVvwUEDfue0V/541P7tq3zTcv0R3vdcZFvnx7Rsfvx/TcFO4xNN5Ficjfmz7dv3n712ze9MtYsnUvgAwAfjw+vkXn8kK01CP89oA/2kuWhXTFaUKcS6lq2EDen9XUMvfO++ruTjHP8z14VxPMWfsXPDDwK0pCOrfYRT5zw3OYP/cJTJtWBwO6pYBQDYFAFC1apOL8+VJ8v+j5W12nMTH/dP7L+0WL5s7H+AcnYMHc+aAcGP/QBLz6wvf49IsT5NFB7/CW/Xb32L/Hs6CqLOIfOir7hRdfHrG7X6epSsP6qUZhVam6fXsAUT7dtvfAzhb5V/xNzx0uzb5yLqKUlwaTKcUDZpOEuCSlFJRdTq/jvFSvrfPo88/evo2QlNIet72CvadegYVMF4be6UC3Ls3ZgX3XeaJo4Mg1FfXSJCzbNwmNzR/iSnjyra6/mJh/Cf/l4pDjH5wAAAgzBTRaC86P48Wnj4HzZ4WvP9tz+5mjkS81j+7t3yfr2b+88sPeF19uYdpx5BlLseeQMftzZcBtrUi/R+75up0WQRdfZYSGfCo0iYZcyeJViyJ9kp5h39vrLvf5UWPvKSLEyf7i/ghABMBdxGWPI9Pe3syPXhpotGzaF/UbzAEhAGQJx3NeR9uG3wBALOQxMf8X/uYqsIxz3D2uM0bftY1mZNrZ59NOtD+2Jzw9FFBT+g3KeLthR6F6Ku558OWJu3rlX/O1qCyPcK6TDooiIaqpjOtsL+f6Bodb2DPiicZVDzzoLLOS2ZFudRrj7sfTQAghwJ3U7wuRbduLGec/80U/HOUff3IAOZc9eO6Vt4Ew0LZXPELVJgDArC3P3Oo6i4n5l/M3g+6QJLidTSFENpGI14GaQk9cVYmnjsYly+5NZc9vXB35mDFuqa7yQVEo4hwSkpKsRXEJ5pUNGiUum/j6yCP1pZeNYI0dB3YXoGnXJABOIT7ZQvZsqmR7f93Nm7bKYglx9bBg0W4A8bC7Oc7deB+EECxZtBxjx4++1XUUE/Mv728G3SaJOH7tLHq2dbISJRc9G9c7FvJFP7h0TX2g1utJoIRuI0zfn5iMyl6D6sjZ2fZokybmw23aD7n2zQdrQQhBryZTBW4Y3PBTrP86yDn/yZjy6vs4d7wChmHCiYMV+G7BJ3hjylgU5h7GsDGDcfLYPgCIhTwm5n/I3ww6B9C+YXvMOb6Yx3VzI+dSTdXnc1/8bPqM6XPMVrP89ONjqkTyheZEBJ7AdTRuQFH/ha4AEkhllZeuWryFzXh3p1FTxdE8KQn9hjZC92aT8c43PfHhtIFYufvf/68J9836/X3bDj1udb3ExPyh0L/1lxpjAIC8aoJX3ylEXqkKQh6CM55V+wKhUiBFa5HhoMkpZsFhswgUVmHvjjJ67uJKvDNjgXFw93VOCIFiunlxv7DQgwOXPsKGDfm3utwxMX8qf3c61uytM2G7HIfDN/Jw7+BmOHitFtfPVRCTWUJ2w0Q89dR4PrDbVAy8uxmSEi1QI1U4vF3Aoy+1xuKfDyK7bhZy8wowfVbsIlpMzK1C/943PDJgIu55fhxCPooOdwxDxKdBixIe8nMe8Bo3e2yFwmQWYLHJMBjw3fKHcOH8GUyf9QyennxXLOQxMbfY33/I4l/BOQcAbFy/E4OH9sX4JzZh2Mh/f1D9hEcfutVli4mJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYn54/j/AAZKvPc3BSRFAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE1LTEwLTA5VDE1OjQyOjQ4KzAyOjAwoEzkWwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNS0xMC0wOVQxNTo0Mjo0OCswMjowMNERXOcAAAAASUVORK5CYII='/>" +
                    "</header>"



            }
        }
    },
    mail: {
        intervention: {
            paiement: "Monsieur, <br>" +
                "Suite à votre intervention auprès de notre client, vous trouverez ci-joint l'autofacturation correspondant.<br>" +
                "Celle-ci s'accompagne automatiquement d'un virement sur votre compte bancaire.<br>" +
                "Si votre paiement n'apparaît pas sur votre compte dans les 4 jours ouvrés, merci de contacter notre service comptabilité.<br>" +
                "En cas d'erreur sur l'auto-facture, répondez à ce mail en expliquant les raisons de votre désaccord, la modification sera immédiatement effectuée par nos services.<br>" +
                "<br><i>Attention<br> depuis le 1er Janvier 2014, compte tenu de la Loi de Finances 2014, les sous-traitants n'auront ni à déclarer ni à payer la TVA due au titre de ces opérations.<br>" +
                "C'est le donneur d'ordre (SARL Edison Services) assujetti qui devra declarer la TVA sur ses déclarations de chiffre d'affaires.</i>" +
                "<br><br>Service Comptabilité Fournisseur<br>" +
                "09.72.45.27.09",
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
                    "   75 rue des dames, 75017 Paris<br>" +
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
                    "   75 rue des dames, 75017 Paris<br>" +
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
                    "75 rue des dames, 75017 Paris<br>" +
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
                return "A l'attention de l’entreprise {{sst.nomSociete}}\n" +
                    "\n" +
                    "Monsieur <strong>{{sst.representant.nom}}</strong>,\n" +
                    "Suite à notre conversation téléphonique,\n" +
                    "Nous vous prions de bien vouloir intervenir pour une intervention de {{categoriePlain}} auprès de notre client :\n" +
                    "\n" +
                    "<strong>" +
                    "OS n°{{id}}\n" +
                    "{{client.nom}} {{client.prenom}}\n" +
                    "Tél. {{newOs ? '09.701.702.01' : client.telephone.tel1}}\n" +
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
