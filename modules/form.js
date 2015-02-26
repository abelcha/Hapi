var _sanitizer = require('../modules/formSanitizer.js');
var _validator = require('../modules/formValidator.js');

module.exports = function(type, form) {

	this.data = form;
	this.sanitizeAndValidate = function(callback) {
		var self = this;
		if (_sanitizer[type]) {
			_sanitizer[type](self.data, function(results) {
				_validator[type](self.data, function(validated) {
					callback(validated, self.data);
				});
			});
		} else if (_validator[type]) {
			_validator[type](self.data, function(validated) {
					callback(validated, self.data);
			});
		}
	}
}
