'use strict';

var CryptoJS = require('crypto-js');
var key = 'pass phrase';
var encrypt = function(str)
{
    return CryptoJS.AES.encrypt(str, key);
};
var decrypt = function(str)
{
    return JSON.parse(CryptoJS.AES.decrypt(str, key)
        .toString(CryptoJS.enc.Utf8));
};

var s = 'hello world';

console.log(decrypt(encrypt("loltoto42", key), key));