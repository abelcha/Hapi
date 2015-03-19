app.controller('MainController', function($rootScope, $scope, $http) {
	var self = this;

	self.intervention = {};
	self.client = new Client;
	self.map = new gMap(self.client);
	var artisans = [];

	// get the array of artisans
	$http({method: 'GET', url: "/api/artisans/find/" + JSON.stringify({q:{archive:false}})})
	.success(function(data) {
		//for each artisans
		for (var i = 0; i < data.length; i++) {
			//stock artisan in array of artisan object
			artisans[i] = new Artisan(data[i]);
			// set artisan marker on the map
			artisans[i].setMarker(self.map);
			// on click, the artisan become the inter sst
      google.maps.event.addListener(artisans[i].marker, 'click', (function(id) {
      	// trap the artisan inside a closurre
      		return function() {
					// on click, the artisan become the inter sst
      			self.intervention.artisan = artisans[id];
      			// show route between artisan and client
      			self.map.showArtisanRoute(artisans[id], self.client);
      		}
  	  })(i));
   	};		
	})
	.error(function() { alert("Erreur ! Impossible de charger les données"); });

	// When the user enters a new address
	google.maps.event.addListener(self.map.autocomplete, 'place_changed', function() {
		// drop marker + set new client address
		self.map.placeChanged();
		// draw 30km and 50km circles
		self.map.drawCircle(self.client.address, 30000, 1);
		self.map.drawCircle(self.client.address, 50000, 1);
		//the client address have changed -> refresh view
		$scope.$digest();
	});

  $scope.categories = [
    {short:'EL', full:'Electricité'},
    {short:'PL', full:'Plomberie'},
    {short:'CH', full:'Chauffage'},
    {short:'CL', full:'Climatisation'},
    {short:'SR', full:'Serrurerie'},
    {short:'VT', full:'Vitrerie'}
	];

	$scope.categorieChange = function(newCategorie)
	{
		//toggle sst market
		$scope.selectedCategorie = newCategorie;
		for (var i = 0; i < artisans.length; i++) {
			// if the artisan practice the categorie display it else hide it
		 		artisans[i].marker.setVisible(artisans[i].practice(newCategorie));
	  };	
	}

});
