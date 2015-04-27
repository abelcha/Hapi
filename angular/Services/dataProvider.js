angular.module('edison').factory('dataProvider', [function() {
	var self = this;
	if (!this.data) {
		return (function(data) {
			self.data = data;
		})
	} else {
		return (this.data);
	}

}]);