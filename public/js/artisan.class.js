function Artisan(data) {

	self = this;

	var toCopy = ['id', 'add', 'prenomRep', 'nomRep', 'civ', 'categories'];
	for (var i = 0; i < toCopy.length; i++) {
		self[toCopy[i]] = data[toCopy[i]];
	};
};

Artisan.prototype.getStats = function(newArtisan) {
		//get artisans stats
};

Artisan.prototype.setMarker = function(map) {
	this.marker = map.createMarker({
		title: 'Artisan',
		position: new google.maps.LatLng(self.add.lt, self.add.lg),
		icon: ICON_RED,
    }, false);
};

Artisan.prototype.practice = function(newCategorie) {
	return (this.categories.indexOf(newCategorie) >= 0);
};