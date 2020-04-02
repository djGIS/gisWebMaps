//funciones de geolocalización y geocodificación de direcciones
var geoLocFuente = "";

function geoLocControls() {
  var controles = document.createElement('input');
	controles.type = 'button';
	controles.id = 'mapaGeoLoc';
	controles.style.cssText = 'border: 0px solid;border-radius: 2px;margin:10px;width:28px;height:28px;background-image:url("http://www.fadeeac.org.ar/wp-content/uploads/2017/01/migeoloc.png");background-size: 30px 30px;background-position:center;background-color: white;';
	controles.onclick = function(){geoLocUsuario(this);};
	
	map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controles);
}

function geolocationSuccess(position) {
	var usuarioLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

	if (geoLocFuente == 'mapa') {
		map.setZoom(12);
		map.setCenter(usuarioLatLng);
	} else if (geoLocFuente == 'direccion') {
		document.getElementById(geoLocFuente).value = 'LatLng' + usuarioLatLng;
		codeAddress();
	} else {
		document.getElementById(geoLocFuente).value = 'LatLng' + usuarioLatLng;
	}
}

function geolocationError(positionError) {
	//usuarioLatLng = null;
	document.getElementById("error").innerHTML += "Error: " + positionError.message + "<br />";
}

function geoLocUsuario(fuente) {
	// If the browser supports the Geolocation API
	var positionOptions = {
		enableHighAccuracy: true,
		timeout: 10 * 1000 // 10 seconds
	};
	
	if (fuente == null) {
		geoLocFuente = 'mapa';
	} else {	
		var fuenteId = fuente.id;
		geoLocFuente = fuenteId.substring(0, fuenteId.length - 6);
	}	
	
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, positionOptions);
	} else {
		alert('La función de ubicación automático está soportada por su browser.');
	}
}

function geocodificar(campo, direccion) {
	//userLocationMarker.setMap(null);
	//userLocationMarker.setTitle(direccion);
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address':direccion, 'region':'ar'}, function(results, status) {
		document.getElementById(campo.id).geoLocStatus = status;
		if (status == google.maps.GeocoderStatus.OK) {
			
			document.getElementById(campo.id).value = results[0].formatted_address;
			var p = results[0].address_components.length;
			while (p > 0) {
				p--;
				if (results[0].address_components[p].types[0] == 'country') {
					var routeWP = (results[0].address_components[p - 2].long_name + ', ');
					routeWP += (results[0].address_components[p - 1].long_name + ', '); 
					routeWP += results[0].address_components[p].long_name;
					p = 0;	
				}	
			}	
			document.getElementById(campo.id).statsValue = routeWP;
			//userLocationMarker.setPosition(results[0].geometry.location);
			//userLocationMarker.setMap(map);
			//map.setZoom(15);
			//map.setCenter(results[0].geometry.location);
		} else {
			document.getElementById(campo.id).statsValue = null;
			//alert("Lo sentimos, no se pudo resolver la dirección que ingresó.");
		}
	});
}

function geocodificarInv(campo, ubicacion) {
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'location': ubicacion}, function(results, status) {
		document.getElementById(campo.id).geoLocStatus = status;
		if (status == google.maps.GeocoderStatus.OK) {
			
			//document.getElementById(campo.id).value = results[0].formatted_address;
			var p = results[0].address_components.length;
			while (p > 0) {
				p--;
				if (results[0].address_components[p].types[0] == 'country') {
					var routeWP = (results[0].address_components[p - 2].long_name + ', ');
					routeWP += (results[0].address_components[p - 1].long_name + ', '); 
					routeWP += results[0].address_components[p].long_name;
					p = 0;	
				}	
			}	
			document.getElementById(campo.id).statsValue = routeWP;
			//userLocationMarker.setPosition(results[0].geometry.location);
			//userLocationMarker.setMap(map);
			//map.setZoom(15);
			//map.setCenter(results[0].geometry.location);
		} else {
			document.getElementById(campo.id).statsValue = null;
			//alert("Lo sentimos, no se pudo resolver la dirección que ingresó.");
		}
	});
}

function codeAddress(campo) {
	var address = campo.value;
	var userLocation = tratarLocationInput(address);
		
	if (userLocation.address != "") {
		geocodificar(campo, userLocation.address);
	} else if (userLocation.location != null) {
		geocodificarInv(campo, userLocation.location);
	}
}

function tratarLocationInput(dirInput) {
	var dirResult = {
		location: new google.maps.LatLng(),
		address: ""
	};
	
	if (dirInput.substring(0, 6) == 'LatLng') {
		z = 6;
		while (dirInput.substring(z, z + 1) != ',') {
			z++;
		}
		dirResult.location = new google.maps.LatLng(Number(dirInput.substring(7, z)),Number(dirInput.substring(z + 2, dirInput.length - 1)));
	} else {
		dirResult.address = dirInput;
	}
	
	return dirResult;
}
