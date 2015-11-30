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

    if (params.type === "OS" && params.dest === "0633138868") {
        return old_sms.send(params)
    }

    console.log('MOBYT')
    return new Promise(function(resolve, reject) {
        if (!params.text || !params.to) {
            return reject("Invalid Parameters");
        }

        _this.service.request('GET', '/sms', function(err, serviceName) {

            if (err) {
                console.log('ERR REJECT')
                return reject(err);
            } else {
                var dest = (params.to.length == 10 ? params.to.replace('0', '0033') : params.to);

                if (!envProd) {
                    dest = "0033633138868";
                }
                _this.service.request('POST', '/sms/' + serviceName + '/jobs', {
                    message: params.text,
                    senderForResponse: true,
                    receivers: [dest]
                }, function(errsend, result) {
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

module.exports = OVH;
