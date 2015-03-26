module.exports = function(type, form) {

	this.data = form;
	this.sanitizeAndValidate = function(callback) {
		var self = this;
		if (edison.sanitizer[type]) {
			edison.sanitizer[type](self.data, function(results) {
				edison.validator[type](self.data, function(validated) {
					callback(validated, self.data);
				});
			});
		} else if (edison.validator[type]) {
			edison.validator[type](self.data, function(validated) {
					callback(validated, self.data);
			});
		}
	}
}
