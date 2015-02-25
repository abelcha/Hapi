var _sanitizer = require('../modules/formSanitizer.js');
var _validator = require('../modules/formValidator.js');

module.exports = function(type, data) {

	this.data = data;
	this.sanitizeAndValidate = function(callback) {
		var self = this;
		_sanitizer[type](this.data, function(results) {
			_validator[type](results, function(validated) {
				callback(validated, self.data);
			});
		});
	}
}
