 var moment = require('moment')
 var async = require('async')
 var PDF = requireLocal('pdf-mail')
 var _ = require('lodash')
 var textTemplate = requireLocal('config/textTemplate');
 require('nodeify').extend();

 var RelanceClient = function(doc, type, email) {
    if (!(this instanceof RelanceClient)) {
        return new RelanceClient(doc, type, email)
    }
    var _this = this;
    _this.doc = doc;
    _this.type = type;
    _this.emailDest = email;

    this.doc.prixFinalTTC = _.round(this.doc.prixFinal * (1 + (this.doc.tva / 100)), 2).toFixed(2)
    _this.doc.datePlain = moment(_this.doc.date.intervention).format('DD/MM/YYYY');
    _this.doc.os = _.padLeft(_this.doc.id, 6, '0')
    _this.doc.type = 'facture'


 }

 RelanceClient.prototype.send = function(callback) {
    var async = require('async');
    if (this.type === "relance-client-1") {
        this.mailBody = _.template(textTemplate.mail.intervention.relance1())(this.doc);
        this.letterBody = _.template(textTemplate.lettre.intervention.relance1())(this.doc);
        this.mailTitle = _.template("Première relance pour facture n°{{id}} impayée")(this.doc);
        async.waterfall([
            this.createFacture.bind(this),
            this.sendMail.bind(this),
        ], callback);
    } else if (this.type === 'relance-client-2') {
        this.mailBody = _.template(textTemplate.mail.intervention.relance2())(this.doc);
        this.letterBody = _.template(textTemplate.lettre.intervention.relance2())(this.doc);
        this.mailTitle = _.template("Deuxieme relance pour facture n°{{id}} impayée")(this.doc);
        async.waterfall([
            this.createFacture.bind(this),
            this.sendMail.bind(this),
            this.createPrintableFacture.bind(this),
            // this.writeTmpFile.bind(this),
            // this.insertBlankPage.bind(this),
            this.printStack.bind(this)
        ], callback)
    } else if (this.type === 'relance-client-3') {
        this.mailBody = _.template(textTemplate.mail.intervention.relance3())(this.doc);
        this.letterBody = _.template(textTemplate.lettre.intervention.relance3())(this.doc);
        this.mailTitle = _.template("Troisième relance pour facture n°{{id}} impayée")(this.doc);

        async.waterfall([
            this.createFacture.bind(this),
            this.sendMail.bind(this),
            this.createPrintableFacture.bind(this),
            // this.writeTmpFile.bind(this),
            // this.insertBlankPage.bind(this),
            this.printStack.bind(this)
        ], callback)
    } else if (this.type === 'relance-client-4') {
        this.letterBody = _.template(textTemplate.lettre.intervention.relance4())(this.doc);

        async.waterfall([
            this.createInjonction.bind(this),
            this.printStack.bind(this)
        ], callback)

    } else if (this.type === 'relance-client-5') {
        async.waterfall([
            this.createAvisAvantPoursuites.bind(this),
            this.printStack.bind(this)
        ], callback)

    } else {
        callback(null);
    }
 }


 RelanceClient.prototype.createAvisAvantPoursuites = function(callback) {
    if (envDev) {
        callback(null, null);
    }
    var _this = this;
    this.doc.printable = true
    PDF([{
        model: 'recouvrement',
        options: _this.doc
    }, {
        model: 'facture',
        options: _.merge(this.doc, {
            printable: true
        })
    }]).toBuffer(callback)
 }


 RelanceClient.prototype.createInjonction = function(callback) {
    if (envDev) {
        callback(null, null);
    }
    var _this = this;
    this.doc.printable = true
    PDF([{
        model: 'injonction',
        options: _this.doc
    }, {
        model: 'facture',
        options: _.merge(this.doc, {
            printable: true
        })
    }]).toBuffer(callback)
 }


 RelanceClient.prototype.createFacture = function(callback) {
    if (envDev) {
        callback(null, null);
    }
    PDF([{
        model: 'letter',
        options: {
            address: this.doc.facture.address,
            dest: this.doc.facture,
            text: this.letterBody,
            title: "",
            factureQrCode: true,
            id: this.doc.os,
            date: this.doc.date
        }
    }, {
        model: 'facture',
        options: this.doc
    }, {
        model: 'conditions',
        options: this.doc
    }]).toBuffer(callback)
 }

 RelanceClient.prototype.sendMail = function(buffer, callback) {
    console.log('sendMail');

    if (envDev) {
        return callback(null, buffer);
    }
    mail.send({
        From: "comptabilite@edison-services.fr",
        ReplyTo: "comptabilite@edison-services.fr",
        To: this.emailDest,
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

 RelanceClient.prototype.writeTmpFile = function(buffer, callback) {
    console.log('writeTmpFile');

    var fs = require('fs')
    var uuid = require('uuid')
    var filename = '/tmp/' + uuid.v4() + '.pdf';
    fs.writeFile(filename, buffer, function(err) {
        callback(err, buffer, filename);
    })
 }

 RelanceClient.prototype.createPrintableFacture = function(buffer, callback, c) {
    if (envDev) {
        return callback(null, null);
    }
    this.doc.printable = true
    PDF([{
        model: 'letter',
        options: {
            address: this.doc.facture.address,
            dest: this.doc.facture,
            text: this.letterBody,
            title: "",
            factureQrCode: true,
            id: this.doc.os,
            date: this.doc.date
        }
    }, {
        model: 'blank',
        options: {}
    }, {
        model: 'facture',
        options: _.merge(this.doc, {
            printable: true
        })
    }]).toBuffer(callback)
 }

 RelanceClient.prototype.insertBlankPage = function(buffer, filename, callback) {
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
 RelanceClient.prototype.printStack = function(buffer, callback) {
    console.log('printStack');
    if (envDev) {
        return require('fs').writeFile('/tmp/result.pdf', buffer, callback)
    }
    document.stack(buffer, this.type + ' - ' + this.doc.id, "AUTO")
        .then(function(resp) {
            console.log('ok uploaded')
            callback(null, callback)
        }, callback)
 }

 module.exports = RelanceClient;
