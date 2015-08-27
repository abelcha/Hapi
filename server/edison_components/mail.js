var ejs = require('ejs');
var fs = require("fs");



var Mail = function(params) {

    var postmark = require("postmark");
    var key = requireLocal('config/_keys');

    this.client = new postmark.Client(key.postmark);
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
