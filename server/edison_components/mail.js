var ejs = require('ejs');
var fs = require("fs");



var Mail = function(params) {

    var postmark = require("postmark");
    var key = requireLocal('config/_keys');

    this.client = new postmark.Client(key.postmark);
}

Mail.prototype.renderTemplate = function(templateName, args) {
    var fs = require('fs');
    var ejs = require('ejs');
    var fileName = process.cwd() + '/server/Emails/Template/' + templateName + '.html';

    return new Promise(function(resolve, reject) {
        fs.readFile(fileName, 'utf8', function(err, template) {
            if (err) return reject(err);
            resolve(ejs.render(template, args))
        });
    })
}

Mail.prototype.readFilesOS = function() {

}

Mail.prototype.getAttachements = function(osFileBuffer, fileSupp) {
    var attachements = [];
    attachements.push({
        Content: osFileBuffer.toString('base64'),
        Name: "Ordre de service.pdf",
        ContentType: "application/pdf"
    });
    if (fileSupp !== null) {
        attachements.push({
            Content: fileSupp.data.toString('base64'),
            Name: fileSupp.name,
            ContentType: fileSupp.mimeType
        });
    }
    return attachements;
}

Mail.prototype.sendFacture = function(options) {
    //title, htmlTemplate, mailText
    var _this = this;
    return new Promise(function(resolve, reject) {
        _this.client.sendEmail({
            From: "intervention@edison-services.fr",
            To: "abel@chalier.me",
            Subject: "Facture de l'intervention " + options.data.id,
            HtmlBody: options.text,
            Attachments:  [{
                Content: options.file.toString('base64'),
                Name: "Facture",
                ContentType: "application/pdf"
            }]
        }, function(err, resp) {
            if (err)
                return reject(err);
            resolve(resp)
        })
    });
}

Mail.prototype.sendDevis = function(options, user) {
    //title, htmlTemplate, mailText
    var _this = this;
    return new Promise(function(resolve, reject) {
        _this.client.sendEmail({
            From: "intervention@edison-services.fr",
            To: user.email || "abel@chalier.me",
            Subject: "Devis de l'intervention " + options.data.id,
            HtmlBody: options.text,
            Attachments:  [{
                Content: options.file.toString('base64'),
                Name: "Devis",
                ContentType: "application/pdf"
            }]
        }, function(err, resp) {
            if (err)
                return reject(err);
            resolve(resp)
        })
    });
}

Mail.prototype.sendContrat = function(artisan, buffer, user, text) {
    var _this = this;
    console.log("==>", text)
    return new Promise(function(resolve, reject) {
        _this.renderTemplate('basic', {
            text: text
        }).then(function(textOS) {
            _this.client.sendEmail({
                From: "intervention@edison-services.fr",
                To: "abel@chalier.me",
                Subject: "Contrat de sous-traitance",
                HtmlBody: textOS,
                Attachments: [{
                    Content: buffer.toString('base64'),
                    Name: 'Contrat',
                    ContentType: 'application/pdf'
                }]
            }, function(error, success) {
                if (error)
                    return reject(error);
                return resolve(success)
            })
        })
    });
}

Mail.prototype.sendOS = function(data, osFileBuffer, fileSupp, user) {
    var _this = this;

    return new Promise(function(resolve, reject) {
        _this.renderTemplate('os', data).then(function(textOS) {
            _this.client.sendEmail({
                From: "intervention@edison-services.fr",
                To: user.email || "abel@chalier.me",
                Subject: "Ordre de service d'intervention No " + data.id,
                HtmlBody: textOS,
                Attachments: _this.getAttachements(osFileBuffer, fileSupp)
            }, function(error, success) {
                if (error)
                    return reject(error);
                return resolve(success)
            })
        }, reject);
    });
};
module.exports = Mail;
