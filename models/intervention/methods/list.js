'use strict'

module.exports = function(schema) {



  schema.statics.list = function(req, res) {

    var reloadCache = req.query.cache;

    var getCache = function(resolve, reject) {
      return edison.worker.createJob({
        name: 'db',
        model: 'intervention',
        method: 'cacheReload'
      }).then(function()  {
        reloadCache = false;
        return getList(resolve, reject);
      }, reject);
    }

    var getList = function(resolve, reject) {
      if (!reloadCache)  {
        redis.get('interventionList', function(err, reply) {
          if (!err && reply) {
            return resolve(JSON.parse(reply));
          } else {
            getCache(resolve, reject);
          }
        });
      } else if (envProd || envDev) {
        return getCache(resolve, reject);
      } else {
        db.model('intervention').cacheReload().then(resolve, reject);
      }
    }
    return new Promise(getList);

  };

}
