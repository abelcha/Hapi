 var moment = require('moment')
 var async = require('async')
 var PDF = require('edsx-mail')
 var _ = require('lodash')
 var textTemplate = requireLocal('config/textTemplate');
 require('nodeify').extend();

 var Relance = function(doc, type) {
     if (!(this instanceof Relance)) {
         return new Relance(doc, type)
     }
     var _this = this;
     _this.doc = doc;
     _this.type = type;
     this.doc.prixFinalTTC = _.round(this.doc.prixFinal * (1 + (this.doc.tva / 100)), 2).toFixed(2)

     _this.doc.os = _.padLeft(_this.doc.id, 6, '0')
     _this.doc.datePlain = moment(_this.doc.date.intervention).format('DD/MM/YYYY');
     _this.doc.type = 'facture'

     _this.doc.produits.unshift({
         desc: _.template("Suite à notre intervention chez {{client.civilite}} {{client.nom}} " +
             "{{client.prenom}},\n {{client.address.n}} {{client.address.r}}, {{client.address.cp}} " +
             "{{client.address.v}}\n le ")(doc) + moment(_this.doc.date.intervention).format('DD[/]MM/YYYY[ à ]HH[h]mm'),
         pu: 0,
         quantite: 1
     })

 }

 Relance.prototype.send = function(callback) {
     var async = require('async');
     if (this.type === "relance1") {
         this.mailBody = _.template(textTemplate.mail.intervention.relance1())(this.doc);
         this.letterBody = _.template(textTemplate.lettre.intervention.relance1())(this.doc);
         this.mailTitle = _.template("Première relance pour facture n°{{id}} impayée")(this.doc);
         async.waterfall([
             this.createFacture.bind(this),
             this.sendMail.bind(this),
         ], callback);
     } else if (this.type === 'relance2') {
         this.mailBody = _.template(textTemplate.mail.intervention.relance2())(this.doc);
         this.letterBody = _.template(textTemplate.lettre.intervention.relance2())(this.doc);
         this.mailTitle = _.template("Deuxieme relance pour facture n°{{id}} impayée")(this.doc);
         async.waterfall([
             this.createFacture.bind(this),
             this.sendMail.bind(this),
             this.writeTmpFile.bind(this),
             this.insertBlankPage.bind(this),
             this.printStack.bind(this)
         ], callback)
     } else if (this.type === 'relance3') {
         this.mailBody = _.template(textTemplate.mail.intervention.relance3())(this.doc);
         this.letterBody = _.template(textTemplate.lettre.intervention.relance3())(this.doc);
         this.mailTitle = _.template("Troisième relance pour facture n°{{id}} impayée")(this.doc);

         async.waterfall([
             this.createFacture.bind(this),
             this.sendMail.bind(this),
             this.writeTmpFile.bind(this),
             this.insertBlankPage.bind(this),
             this.printStack.bind(this)
         ], callback)
     } else if (this.type === 'relance4') {
         this.letterBody = _.template(textTemplate.lettre.intervention.relance4())(this.doc);

         async.waterfall([
             this.createInjonction.bind(this),
             this.insertBlankPage.bind(this),
             this.printStack.bind(this)
         ], callback)

     } else {
         callback(null);
     }
 }

 Relance.prototype.createInjonction = function(callback) {
     console.log('createInjonction');
     PDF([{
         model: 'letter',
         options: {
             address: this.doc.facture.address,
             dest: this.doc.facture,
             text: this.letterBody,
             title: ""
         }
     }, {
         model: 'injonction',
         options: this.doc
     }, {
         model: 'facture',
         options: this.doc
     }, {
         model: 'conditions',
         options: this.doc
     }]).toBuffer(callback)
 }


 Relance.prototype.createFacture = function(callback) {
     console.log('createFacture');
     PDF([{
         model: 'letter',
         options: {
             address: this.doc.facture.address,
             dest: this.doc.facture,
             text: this.letterBody,
             title: ""
         }
     }, {
         model: 'facture',
         options: this.doc
     }, {
         model: 'conditions',
         options: this.doc
     }]).toBuffer(callback)
 }

 Relance.prototype.sendMail = function(buffer, callback) {
     console.log('sendMail');

     if (envDev) {
         return callback(null, buffer);
     }
     mail.send({
         From: "comptabilite@edison-services.fr",
         ReplyTo: "comptabilite@edison-services.fr",
         To: "mzavot@gmail.com",
         // Bcc: "comptabilite@edison-services.fr",
         Subject: this.mailTitle,
         HtmlBody: this.mailBody,
         Attachments: [{
             Content: buffer.toString('base64'),
             Name: "Facture n°" + this.doc.id + ".pdf",
             ContentType: 'application/pdf'
         }]
     }, function(resp) {
         callback(null, buffer)
     });
 }

 Relance.prototype.writeTmpFile = function(buffer, callback) {
     console.log('writeTmpFile');

     var fs = require('fs')
     var uuid = require('uuid')
     var filename = '/tmp/' + uuid.v4() + '.pdf';
     fs.writeFile(filename, buffer, function(err) {
         callback(err, buffer, filename);
     })
 }

 Relance.prototype.insertBlankPage = function(buffer, filename, callback) {
     console.log('insertBlankPage');

     if (envDev) {
         return callback(null, buffer)
     }
     var fs = require('fs')
     var scissors = require('scissors');
     var pageNumber = PDF('facture', this.doc).getHTML().split('</page>').length
     var p1 = scissors(filename).pages(1) // select or reorder individual pages 
     var p2 = scissors(filename).range(2, pageNumber + 1);
     var blank = scissors(process.cwd() + '/front/assets/pdf/blank.pdf').pages(1);
     var stream = scissors.join(p1, blank, p2).pdfStream()
     var finalBuffer = [];
     stream.on('data', function(data) {
         finalBuffer.push(data);
     }).on('end', function() {
         callback(null, Buffer.concat(finalBuffer))

     })
 }
 Relance.prototype.printStack = function(buffer, callback) {
     console.log('printStack');

     document.stack(buffer, this.type + ' - ' + this.doc.id, "AUTO")
         .then(function(resp) {
             callback(null, callback)
         }, callback)
 }

 module.exports = Relance;
