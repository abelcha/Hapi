var MD5 = require('md5')
var _ = require("lodash");
var requestp = require("request-promise")
var OVH = function() {

    this.service = require('ovh')({
        appKey: 'UTdTvZ5KCBp2TOXf',
        appSecret: 'VQAjm5IKFHYY5knjORqhUnsWNCCtswJy',
        consumerKey: 'GBa7hS3IFsxErDzvdq6jxGegUIeMcFoL'
    });

}

OVH.prototype.send = function(params) {
    var _this = this;
    console.log('OVH.prototype.SEND')
    return new Promise(function(resolve, reject) {
        if (!params.text || !params.to) {
            return reject("Invalid Parameters");
        }
        console.log('OK PARAMETERS')

        _this.service.request('GET', '/sms', function(err, serviceName) {
            console.log('GET /SMS')

            if (err) {
                console.log('ERR REJECT')

                return reject(err);
            } else {
                var dest = (params.to.length == 10 ? params.to.replace('0', '0033') : params.to);
                console.log('DEST', dest)

                if (!envProd) {
                    dest = "0033633138868";
                }
                console.log("POST /SMS/SERVICENAME")
                _this.service.request('POST', '/sms/' + serviceName + '/jobs', {
                    message: params.text,
                    senderForResponse: true,
                    receivers: [dest]
                }, function(errsend, result) {
                    console.log("OK CALLBACK")
                    console.log(!err, !params.silent, params)
                    if (!err && !params.silent)  {
                        mail.send({
                            From: "contact@edison-services.fr",
                            To: "noreply.edison+sms@gmail.com",
                            Subject: "[SMS] - " + "[" + (params.type ||  "INCONNU") + "] - " + "[" + (params.dest || "INCONNU") + "]",
                            HtmlBody: "Sent to:" + params.to + "<br>" + params.text.replaceAll('\n', '<br>'),
                        })
                    }
                    console.log(errsend, result);
                    return resolve('ok')
                });
            }
        });

    });
};


OVH.prototype.jobs = function() {
    var _this = this;
    return new Promise(function(resolve, reject) {

        _this.service.request('GET', '/sms', function(err, serviceName) {
            console.log(err, serviceName)
            if (err) {
                return reject(err);
            } else {
                _this.service.request('GET', '/sms/' + serviceName + '/jobs/' + '42911188', {}, function(errsend, result) {
                    console.log(errsend, result);
                    return resolve('ok')
                });
            }
        });

    });

};
/*var x = new OVH;
x.jobs().then(function() {

})*/

module.exports = OVH;
