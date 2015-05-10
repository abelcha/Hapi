'use strict'

module.exports = function(schema) {

  schema.statics.list = function(req, res) {
    var _this = this;
    // console.time('interList')
    return new Promise(function(resolve, reject) {
      edison.redisCli.get('interventionList', function(err, reply) {
        if (err)
          return reject(err);
        if (reply && !req.query.cache) {
          //console.timeEnd('interList')
          //console.log('cache')
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
