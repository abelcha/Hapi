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
    return new Promise(function(resolve, reject) {
        if (!params.text || !params.to) {
            return reject("Invalid Parameters");
        }
        _this.service.request('GET', '/sms', function(err, serviceName) {

            if (err) {
                return reject(err);
            } else {
                var dest = (params.to.length == 10 ? params.to.replace('0', '0033') : params.to);
                _this.service.request('POST', '/sms/' + serviceName + '/jobs', {
                    message: params.text,
                    senderForResponse: true,
                    receivers: [dest]
                }, function(errsend, result) {
                    console.log(errsend, result);
                    return resolve('ok')
                });
            }
        });

    });
};

module.exports = OVH;
