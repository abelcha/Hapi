module.exports = {
  find: function(model, options, callback) {
    model.find(options.query)
      .select(options.select || "-_id -_v")
      .sort(options.sort || "-id")
      .limit(options.limit)
      .exec(callback);
  },
  getKey: function(modelName, options) {
    return (modelName + '-' + options.bsonStringify());
  },
  getMethod: function(options) {
    if (options.method) {
      return this[options.method];
    } else {
      return (this.find)
    }
  },
  redisGet: function(key, callback) {
    edison.redisCli.get(key, callback)
  },
  redisSet: function(key, value, cacheTime, callback) {
    edison.redisCli.set(key, value)
    edison.redisCli.expire(key, cacheTime ||  600)
  },
  getData: function(modelName, options) {
    options.cache = false;
    var self = this;
    var model, method, key;
    return new Promise(function(resolve, reject) {
      key = self.getKey(modelName, options)
      if (modelName.endsWith('s'))
        modelName = modelName.slice(0, -1);
      model = edison.db.getModel(modelName);
      if (!model)
        return reject("Unknown model '" + modelName + "'.");
      method = self.getMethod(options);
      if (typeof(method) !== 'function')
        return reject("'" + options.method + "' is not a function.")
      self.redisGet(key, function(err, reply) {
        if (err)
          return reject(err);
        if (options.cache && reply)
          resolve(JSON.parse(reply));
        method(model, options, function(error, docs) {
          if (err)
            return reject(err);
          resolve(docs);
          self.redisSet(key, docs.stringify());
        });
      });
    });
  }
}
