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



Mail.prototype.sendFacture = function(options, user) {
    //title, htmlTemplate, mailText
    var _this = this;
    return new Promise(function(resolve, reject) {
        _this.client.sendEmail({
            From: "intervention@edison-services.fr",
            To: user.email || "abel@chalier.me",
            Subject: "Facture de l'intervention " + options.data.id,
            HtmlBody: options.text,
            Attachments:  [{
                Content: options.file.toString('base64'),
                Name: "Facture",
                ContentType: "application/pdf"
            }]
        }, function(err, resp) {
            console.log(1, err, resp)
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
            console.log(2, err, resp)
            if (err)
                return reject(err);
            resolve(resp)
        })
    });
}


Mail.prototype.sendContrat = function(artisan, buffer, email, text) {
    var _this = this;
    console.log("==>", email, text)
    return new Promise(function(resolve, reject) {
        _this.renderTemplate('basic', {
            text: text
        }).then(function(textOS) {
            _this.client.sendEmail({
                From: "intervention@edison-services.fr",
                To: email ||  "abel@chalier.me",
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

Mail.prototype.send = function(options) {
    /*    {
            From: "intervention@edison-services.fr",
            To: destination || "abel@chalier.me",
            Subject: title,
            HtmlBody: body,
            Attachments: files
        }*/
        var _this = this;
    return new Promise(function(resolve, reject) {

        _this.client.sendEmail(options, function(err, success) {
            console.log(err, success);
            if (err)
                return reject(err);
            return resolve(success)
        })
    })

};
module.exports = Mail;
