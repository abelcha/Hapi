'use strict'

module.exports = function(schema) {

  schema.statics.list = function(req, res) {
    var _this = this;
    return new Promise(function(resolve, reject) {
      edison.redisCli.get('interventionList', function(err, reply) {
        if (!err && reply && !req.query.cache) {
          return resolve(JSON.parse(reply));
        }
        _this.cacheReload().
        then(function(result) {
          resolve(result);
        });
      });
    });
  }
};
