//funciones de geolocalización
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
		map.setZoom(15);
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
	
	var fuenteId = fuente.id;
	geoLocFuente = fuenteId.substring(0, fuenteId.length - 6);
	
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, positionOptions);
	} else {
		alert('La función de ubicación automático está soportada por su browser.');
	}
}
