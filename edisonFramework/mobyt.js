var MD5 = require('MD5')
var _ = require("lodash");

var Mobyt = function(user, pass) {

  this.user = user;
  this.pass = pass;

}

Mobyt.prototype.getTicket = function(params) {
  return MD5(_.reduce(params, function(total, p) {
    return total += p;
  }))
}

Mobyt.prototype.getStatus = function(params) {
  var _this = this;
  return new Promise(function(resolve, reject) {
    var id;

    var requestStatus = function(doc) {
      var f = {
        user: _this.user,
        pass: _this.pass,
        id: doc.id,
        type: "notify",
        schema: 1
      }
      f.ticket = _this.getTicket([f.user, f.id, f.type, f.schema, MD5(f.pass)]);
      requestp.post({
        url: 'http://multilevel.mobyt.fr/sms/batch-status.php',
        form: f
      }).then(function(result) {
        var log = result.split(',');
        if (log.length === 9) {
          resolve(parseInt(log[7]));
        } else {
          reject(log);
        }
      })
    }

    if (typeof params === 'object')
      id = params.id
    else
      id = params;
    db.model('sms').findOne({
      id: id
    }).then(requestStatus, reject)
  })
}


Mobyt.prototype.send = function(params) {
  var _this = this;
  return new Promise(function(resolve, reject) {
    if (!params.text || !params.to) {
      console.log("here")
      return reject("Invalid Parameters");
    }
    var f = {
      user: _this.user,
      pass: _this.pass,
      data: params.text,
      rcpt: params.to.length == 10 ? params.to.replace('0', '+33') : params.to,
      sender: 'Edison Srv.',
      qty: 'n',
      operation: 'MULTITEXT',
      domaine: "http://multilevel.mobyt.fr",
      return_id: "1",
    };
    f.ticket = _this.getTicket([f.user, f.rcpt, f.sender, f.data, f.qty, MD5(f.pass)])
    requestp.post({
        url: 'http://multilevel.mobyt.fr/sms/send.php',
        form: f
      })
      .then(function(response) {
        if (response.startsWith('OK')) {
          params.id = response.substr(3);
          resolve(params);
        } else {
          reject(response);
        }
      }, reject);
  });

};

module.exports = Mobyt;
