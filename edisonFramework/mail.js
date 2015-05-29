var postmark = require("postmark");
var ejs = require('ejs');
var fs = require("fs");



var Mail = function(params) {
    this.client = new postmark.Client("b2c424bc-af2b-4175-b76f-c863bb3915c3");
}

Mail.prototype.renderTemplate = function(templateName, args) {
    var fs = require('fs');
    var ejs = require('ejs');
    var fileName = process.cwd() + '/Emails/Template/' + templateName + '.html';

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

Mail.prototype.sendOS = function(data, osFileBuffer, fileSupp) {
    var _this = this;


    return new Promise(function(resolve, reject) {
        _this.renderTemplate('os', data).then(function(textOS) {
            _this.client.sendEmail({
                From: "intervention@edison-services.fr",
                To: "abel@chalier.me",
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
