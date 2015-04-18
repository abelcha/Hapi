module.exports = function() {

  Object.defineProperty(Object.prototype, 'bsonStringify', {
    value: function() {
      return new Buffer(JSON.stringify(this)).toString('base64');
    },
    writable: true,
    configurable: true,
    enumerable: false
  });

  Object.defineProperty(Object.prototype, 'stringify', {
    value: function() {
      return (JSON.stringify(this))
    },
    writable: true,
    configurable: true,
    enumerable: false
  });
  Object.defineProperty(Object.prototype, 'parse', {
    value: function() {
      return (JSON.parse(this))
    },
    writable: true,
    configurable: true,
    enumerable: false
  });

}
