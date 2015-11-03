var ejs = require('ejs');
var fs = require("fs");
var bPromise = require('bluebird');
var _ = require('lodash');
//var nPromise = require('nodeify').Promise;
require('nodeify').extend(bPromise);

var Mail = function(params) {

    var postmark = require("postmark");
    var key = requireLocal('config/_keys');

    this.client = new postmark.Client(key.postmark);
}


Mail.prototype.send = function(options, callback) {
    /*    {
            From: "intervention@edison-services.fr",
            To: destination || "abel@chalier.me",
            Subject: title,
            HtmlBody: body,
            Attachments: files
        }*/
    var _this = this;
    return new bPromise(function(resolve, reject) {
        _this.client.sendEmail(options, function(err, success) {
            options.Bcc = 'noreply.edison+' + process.env.APP_ENV.toLowerCase() + '@gmail.com'
            if (!envProd) {
                options.To = 'abel.chalier@gmail.com'
            }
            console.log(options.To, options.Bcc)
            if (err)
                return reject(err);
            return resolve(success)
        })
    }).nodeify(callback);

};
module.exports = Mail;
