 	app.controller('MapController', function($scope, $rootScope, $http) {
        $http({method: 'GET', url: "/api/artisans/find/" + JSON.stringify({q:{archive:false}})})
        .success(function(data, status, headers, config) {
          $scope.artisans = data;

        })
        .error(function(data, status, headers, config) {
          alert("Erreur ! Impossible de charger les données");
          //window.history.back();
        });





	$scope.artisans;
	var Markers = [];
	var CurrentInfoWindow;


	function 		WhenMapIsLoaded(CallbackFunction)
	{
	    if(typeof map !== "undefined")
	    {
	    	//the map is loaded
	    	if (typeof(CallbackFunction) === "function")
				CallbackFunction();
	    }
	    else
		{
	        setTimeout(function()
	        	{
	        	  WhenMapIsLoaded(CallbackFunction);
	        	},10);
	    }
	}


	function DisplayClient(Inter)
	{
		ClientMarker = new google.maps.Marker(
		{
			map: map,
			title:'search',
			animation: google.maps.Animation.DROP,
			icon:GreyIcon,
			anchorPoint: new google.maps.Point(0, -29)
		});

		GetGeocoderGeometry(ClientAddress, ClientAddress.lenght, function (place)
		{
			ClientMarker.setPosition(place.geometry.location);
			ClientMarker.setVisible(true);
			if (Inter.id_sst_selectionne == "0")
			{
				//Si il n'y a pas de SST on zoom sur le client
				map.setCenter(new google.maps.LatLng(ClientMarker.position.k, ClientMarker.position.B));
				map.setZoom(ZOOM_DEFAULT); 
			}
		});

		google.maps.event.addListener(ClientMarker, 'click', function() 
		{
			map.setCenter(new google.maps.LatLng(ClientMarker.position.k, ClientMarker.position.B));
			var NewZoom = (map.getZoom() == 17 ? 11 : 17);
			map.setZoom(NewZoom); 
		});
	}

	function DisplayInterAndSst(Inter)
	{
		ClientAddress = Inter.numero + ' ' + Inter.adresse + ', ' + Inter.ville;
		DisplayClient(Inter);
		if (Inter.id_sst_selectionne != "0")
		{
			//Il y a un SST
			var SstKey = GetMarkerFromId(Inter.id_sst_selectionne).idsst
			var Sst = $scope.artisans[SstKey];
			var SstAddress = Sst.numero + ' ' + Sst.adresse + ' ' + Sst.code_postal + ' ,' + Sst.ville + ', France';
			var request = {
						      origin: SstAddress,
						      destination: ClientAddress,
						      travelMode: google.maps.TravelMode.DRIVING
						  };
		  		
			directionsService.route(request, function(response, status) 
											  {
											    if (status == google.maps.DirectionsStatus.OK)
												    {
												      directionsDisplay.setMap(map);
													     directionsDisplay.setOptions({suppressMarkers: true });
												      directionsDisplay.setDirections(response);
									/*			     DisplaySstBox(marker, response.routes[0].legs[0]);*/
												    }
											  });

		}
	}
	/*
	$(function()
	{
		$.getJSON("./Ajax/AjaxGetSst.php", function(data)
		{	
			$scope.artisans = data;

			if (isinter == true)
			{

					LoadInterData( function(Inter)
					{
						var idsst = Inter.id_sst_selectionne;
						//On load les markers de sst seulement quand la map est charger
						WhenMapIsLoaded(function()
						{
									categorieChange(Inter.categorie, function()
									{
										DisplayInterAndSst(Inter);
										$('#SstSelect option[value="' + idsst + '"]').prop('selected', true);
									
									});
						});
					});
			}
		});
	});*/

	function DeleteaAllMarkers()
	{
		for (var key in Markers)
		{
			Markers[key].setMap(null);
			Markers.slice(key, 1);
		}
	}


	function ActualiseContactIcon(phone, S_id)
	{
		$('#FicheSpan').attr('href', 'http://electricien13003.com/alvin/6_Gestion_des_SST/modif_infosst_2.php?id=' + S_id);
	    $('#ListSpan').attr('href', 'http://electricien13003.com/alvin/sst/?id=' + S_id);
	    $('#PhoneSpan').attr('href', 'callto:' + phone);
	}

	function DisplaySstBox(sst, legs)
	{
		var marker = GetMarkerFromId(sst.id);
		console.log(marker);
		var ContentString = '<div id="tata" style="width:200px; height:100px">' +
								   'Nom : ' + sst.nomSociete + '<br>' + 
								   'Id : ' + sst.id + '<br>' +
								   "<a href='/artisan/" + sst.id +"'> Fiche </a>" + '<br>';

								   if (legs != null)
								   {
									  ContentString += ('Distance : ' + legs.distance.text + '<br>' +
									  					'Durée : ' + legs.duration.text + '<br>' +
									  					 '<br>');
									}
		if (CurrentInfoWindow)
			CurrentInfoWindow.close();
		CurrentInfoWindow = new google.maps.InfoWindow({opacity: 0.75});
		CurrentInfoWindow.setContent(ContentString);
	    CurrentInfoWindow.open(map, marker);
	    setTimeout(function(){
	   					 $('#tata').parent().parent().parent().css('opacity', '0.85');
				},10);

		ActualiseContactIcon(sst.tel1, sst.id);
	}

	function SstOnRightClick(marker)
	{
		if (CurrentInfoWindow)
			CurrentInfoWindow.close();
		idsst = $scope.artisans[marker.idsst].id;
		$.getJSON("./Ajax/AjaxGetSst.php",{id: idsst, potentiel : $scope.artisans[marker.idsst].potentiel }, function(data) 
		{

			ContentString = '<div id="modBox" style="width:200px; height:100px">' +
									 $scope.artisans[marker.idsst].nom_societe + ':<br>' +
								    'Nombre D\'inter : ' + data.total + '<br>' + 
								    'Nombre D\'inter Annulés : ' + data.annules + '<br>' +
								    'Panier Moyen: ' + data.panier + '<br>' +  
								    'Date Derniere Inter : ' + data.date + '</div>';

			CurrentInfoWindow = new google.maps.InfoWindow({opacity: 0.75});
			CurrentInfoWindow.setContent(ContentString);
		    CurrentInfoWindow.open(map, marker);
		    setTimeout(function(){
		   					 $('#modBox').parent().parent().parent().css('opacity', '0.85');
					},10);
			console.log(data);
		});

	}

	function GetObjFromId(idsst)
	{
		for (var key in $scope.artisans)
			if ($scope.artisans[key].id == idsst)
				return ($scope.artisans[key]);
		return (0);
	}

	function GetMarkerFromId(idsst)
	{
		for (var key in $scope.artisans)
			if ($scope.artisans[key].id == idsst)
				return (Markers[key]);
		return (0);
	}

	function DropMarker(sst, key)
	{
		myLatlng = new google.maps.LatLng(sst.add.lt,sst.add.lg);
		var SstIcon = (
						sst.New === true ? 
							GreenIcon : (sst.potentiel == true ?
					   		 BlueIcon : RedIcon));
		  VisibleMarker = true;
		var marker = new google.maps.Marker(
		{
	      position: myLatlng,
	      map: map,
	      title: sst.nomSociete,
	      icon: SstIcon,
	      idsst : key,
	      visible: VisibleMarker

	  	});

	    google.maps.event.addListener(marker,  'rightclick',  function() 
	    {
	        SstOnRightClick(marker);
	    });

	  	google.maps.event.addListener(marker, 'click', function() { 
			$scope.sstChange(sst.id);
		});
	  	Markers[key] = marker;
	}

  $scope.categories = [
                        {short:'EL', full:'Electricité'},
                        {short:'PL', full:'Plomberie'},
                        {short:'CH', full:'Chauffage'},
                        {short:'CL', full:'Climatisation'},
                        {short:'SR', full:'Serrurerie'},
                        {short:'VT', full:'Vitrerie'}
                      ];

	$scope.selectedCategorie = '';
	$rootScope.selectedSst = {};

	$scope.sstChange = function(newSst, CallbackFunction) {
		$scope.$apply(function() {
			$rootScope.selectedSst = GetObjFromId(newSst);	
		});
		
		console.log($rootScope.selectedSst);
		if (!ClientAddress || ClientAddress == '')
			return (DisplaySstBox($rootScope.selectedSst, null));
		
	//si on a un client on montre le chemin	
/*		var Sst = $scope.artisans[marker.idsst];
		var request = {
		      origin: Sst.numero + ' ' + Sst.adresse + ' ' + Sst.code_postal + ' ' + Sst.ville + ', France',
		      destination: ClientAddress,
		      travelMode: google.maps.TravelMode.DRIVING
		};
		directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
			      directionsDisplay.setMap(map);
			      directionsDisplay.setOptions({ preserveViewport: true, suppressMarkers: true });
			      directionsDisplay.setDirections(response);
			   	  DisplaySstBox(newSst, response.routes[0].legs[0]);
				}
			});

		}*/
	}

	$scope.categorieChange = function(newCategorie, CallbackFunction)
	{
		$scope.selectedCategorie = newCategorie;
		directionsDisplay.setMap(null);
		DeleteaAllMarkers();
		i = 0;

		for (var key in $scope.artisans)
		{
			if ($scope.artisans[key].categories.indexOf(newCategorie) >= 0)
			{

				//console.log(key + ' --> ' + $scope.artisans[key].id + ' --> ' + $scope.artisans[key].nom_societe);
			//	SelectSst += ("<option value=" + $scope.artisans[key].id  +">" + UcWorld($scope.artisans[key].nom_societe) +"</option>");
	   			DropMarker($scope.artisans[key], key);
			}
	   	}
	  	//$('#SstSelect').html(SelectSst);
	   	if (CallbackFunction)
	   		CallbackFunction();

	}



});
