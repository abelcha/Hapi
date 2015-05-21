/*
module.exports = {

    renderMailM: function(content) {
        if (content.textFile)
            content.text = npm.fs.readFileSync(__dirname + '/../Emails/Text/' + content.textFile).toString();
        var template = npm.fs.readFileSync(__dirname + '/../Emails/Template/' + content.template + '.ejs', 'utf8');
        return (npm.ejs.render(template, content));
    },

    sendMail: function(data) {
        var client = new npm.postmark.Client("b2c424bc-af2b-4175-b76f-c863bb3915c3");
        client.sendEmail({
            "From": "intervention@edison-services.fr", 
            "To": data.adress, 
            "Subject": data.title, 
            "HtmlBody": this.renderMail(data)
        }, function(error, success) {
            if(error) {
                console.error("Unable to send via postmark: " + error.message);
                return;
            }
            console.info("Sent to postmark for delivery")

        });
        return (this.renderMail(data))
    }
};
*/
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

Mail.prototype.sendOS = function(pdf_file, data) {
    var _this = this;
    return new Promise(function(resolve, reject) {
        _this.renderTemplate('os', data).then(function(textOS) {
            console.log("here", pdf_file)
            _this.client.sendEmail({
                From: "intervention@edison-services.fr",
                To: "abel@chalier.me",
                Subject: "Ordre de service d'intervention No " + data.id,
                HtmlBody: textOS,
                Attachments: [{
                    Content: pdf_file.toString('base64'),
                    Name: "Ordre de service.pdf",
                    ContentType: "application/pdf"
                }, {
                    Content: fs.readFileSync(rootPath + "/pdf/statics/manuel_utilisation.pdf").toString('base64'),
                    Name: "Manuel d'utilisation.pdf",
                    ContentType: "application/pdf"
                }, {
                    Content: fs.readFileSync(rootPath + "/pdf/statics/notice_intervention.pdf").toString('base64'),
                    Name: "Notice d'intervention.pdf",
                    ContentType: "application/pdf"
                }, {
                    Content: fs.readFileSync(rootPath + "/pdf/statics/facture.pdf").toString('base64'),
                    Name: "Facture .pdf",
                    ContentType: "application/pdf"
                }, {
                    Content: fs.readFileSync(rootPath + "/pdf/statics/devis.pdf").toString('base64'),
                    Name: "Manuel d'intervention.pdf",
                    ContentType: "application/pdf"
                }]
            }, function(error, success) {
                if (error) {
                    console.error("Unable to send via postmark: " + error.message);
                    return;
                }
                resolve(error, success)
                console.info("Sent to postmark for delivery")
            })
        }, reject);
    });
};
module.exports = Mail;
