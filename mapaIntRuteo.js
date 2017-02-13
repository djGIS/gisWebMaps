//Variables para funciones de ruteo
var directionsDisplay = null;
var directionsService = null;
var routePath = [];

//Funciones para el ruteo
function obtenerDirecciones() {
	var routeIndex = 0;
	var myroute = null;
	
	if (directionsDisplay != null) {
		directionsDisplay.setMap(null);
		document.getElementById('indicaciones').innerHTML = "";
	}

	directionsDisplay = new google.maps.DirectionsRenderer({
		draggable: true,
		map: map,
		panel: document.getElementById('indicaciones')
	});
	directionsService = new google.maps.DirectionsService();

	google.maps.event.addListener(directionsDisplay, 'routeindex_changed', function() { 
		calcularTconduccion(directionsDisplay.getDirections(),directionsDisplay.getRouteIndex());
		calcularPeaje2(directionsDisplay.getDirections(),directionsDisplay.getRouteIndex());
		sendRouteStats();
	});
			
	google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
		calcularTconduccion(directionsDisplay.getDirections(),directionsDisplay.getRouteIndex());
		calcularPeaje2(directionsDisplay.getDirections(),directionsDisplay.getRouteIndex());
		sendRouteStats();
	});
	
	var origen = tratarDireccionInput(document.getElementById("origen").value);
	var destino = tratarDireccionInput(document.getElementById("destino").value);

	var segRoute;
	var segLength;
	var hitos = [];

	var total = 0;
	var i = 0;

	while (i < counterHitos) {
		i++

		var hitoLoc = tratarDireccionInput(document.getElementById("hito" + i.toString()).value);

		hitos.push({
			location: hitoLoc,
			stopover: true
		});
	}

	var request = {
		origin: origen,
		destination: destino,
		waypoints: hitos,
		travelMode: google.maps.DirectionsTravelMode.DRIVING,
		optimizeWaypoints: document.getElementById('optimizarRuteo').checked,
		provideRouteAlternatives: true,
		//avoidHighways: Boolean,
		//avoidTolls: Boolean
		region: 'ar'
	};

	directionsService.route(request, function(result, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(result);
		} else {
			alert("Lo sentimos, no se pudo calcular una ruta entre los puntos ingresados.");
		}
	}); 
}

function tratarDireccionInput(dirInput) {
	var dirResult; 
	
	if (dirInput.substring(0, 6) == 'LatLng') {
		z = 6;
		while (dirInput.substring(z, z + 1) != ',') {
			z++;
		}
		dirResult = new google.maps.LatLng(Number(dirInput.substring(7, z)),Number(dirInput.substring(z + 2, dirInput.length - 1)));
	} else {
		dirResult = dirInput;
	}
	
	return dirResult;
}

function computeTotalDistance(result) {
	var total = 0;
	var myroute = result.routes[0];
	
	for (var i = 0; i < myroute.legs.length; i++) {
		total += myroute.legs[i].distance.value;
	}
	total = total / 1000.
}



function peajeSelecEjes(fuente) {
	alert(fuente.value);
	for (var i = 1; i < 8; i++) {
		if (i == fuente.value) {
			document.getElementById("PeajeCol" + i.toString()).display = 'block';
		} else {
			document.getElementById("PeajeCol" + i).display = 'none';
		}
	}
}

var dbTarifasPeajes = [];
//cargar base de datos de POI desde fusion tables
function getDataPeajes(table) {
	var query = "SELECT * FROM " + table;
	var encodedQuery = encodeURIComponent(query);

	// Construct the URL
	var url = ['https://www.googleapis.com/fusiontables/v2/query'];
	url.push('?sql=' + encodedQuery);
	url.push('&key=' + miftah);
	url.push('&callback=?');

	// Send the JSONP request using jQuery
	$.ajax({
		url: url.join(''),
		dataType: 'jsonp',
		success: function (data) {
			var dbTemp = data['rows'];
			for (var i = 0; i < dbTemp.length; i++) {
				//alert(Number(dbTemp[i][4]).toFixed(2));
				var tarifa = {
					ref_ext: dbTemp[i][0],
					horaPico: dbTemp[i][3], 
					ej2: {
						valle: Number(dbTemp[i][4]).toFixed(2), 
						pico: Number(dbTemp[i][5]).toFixed(2)},
					ej3: {
						valle: Number(dbTemp[i][6]).toFixed(2), 
						pico: Number(dbTemp[i][7]).toFixed(2)},
					ej4: {
						valle: Number(dbTemp[i][8]).toFixed(2), 
						pico: Number(dbTemp[i][9]).toFixed(2)},
					ej5: {
						valle: Number(dbTemp[i][10]).toFixed(2), 
						pico: Number(dbTemp[i][11]).toFixed(2)},
					ej6: {
						valle: Number(dbTemp[i][12]).toFixed(2), 
						pico: Number(dbTemp[i][13]).toFixed(2)}
				}
				dbTarifasPeajes.push(tarifa);
			}
		}
	});
}

function cargarTarifas() {
	for (var i = 0; i < dbPOIimport.length; i++) {
		if (dbPOIimport[i][3] == 'PEAJE') { 
			for (var j = 0; j < dbTarifasPeajes.length; j++) {
				if (dbPOIimport[i][19] == dbTarifasPeajes[j].ref_ext) {
					//alert(dbTarifasPeajes[j].ref_ext);
					dbPOIimport[i][15] = dbTarifasPeajes[j];
				}
			}
		} 
	}
}

function getEjes(fuente) {
	var selectSelected = fuente.value;
	var selectOptions = fuente.options;

	for (var i = 0; i < selectOptions.length; i++) {
		var columnas = document.getElementsByClassName(selectOptions[i].value);
		
		if (selectOptions[i].value == selectSelected) {
			columnaDisplay = 'block';
		} else {
			columnaDisplay = 'none';
		}
		
		for (var j = 0; j < columnas.length; j++) {
			columnas.item(j).style.display = columnaDisplay;
		}
	}
}



function calcularTconduccion(result, indice) {
	var vGoogle = 0;
	var vCalculada = 0;
	var vMax = 80 * 3.6;
	var vFactor = 0.9;
	var cFactor = 35 / 100000;
	var cUrbano = 1.1;
	var cCalculada = 0;
	var cTotal = 0;
	var tCalculada = 0;
	var tParcial = 0;
	var tTotal = 0;
	var dTotal = 0;
	var myroute = result.routes[indice];

	for (var i = 0; i < myroute.legs.length; i++) {
		for (var j = 0; j < myroute.legs[i].steps.length; j++) {
			dTotal += myroute.legs[i].steps[j].distance.value;
			vGoogle = myroute.legs[i].steps[j].distance.value / myroute.legs[i].steps[j].duration.value;
			if (vGoogle > vMax) 
				vGoogle = vMax;
			vCalculada = vFactor * vGoogle;
			tCalculada = myroute.legs[i].steps[j].distance.value / vCalculada;
			tParcial += tCalculada;
			tTotal += tCalculada;

			if (vCalculada > 60) { cCalculada = myroute.legs[i].steps[j].distance.value * cFactor; }
			else { cCalculada = myroute.legs[i].steps[j].distance.value * cFactor * cUrbano; }
			cTotal = cTotal + cCalculada;
		}
	}

	dTotal = Math.round(dTotal / 100) / 10;
	tTotal = formatearTiempo(tTotal);

	var contents =  '<img src="http://www.fadeeac.org.ar/wp-content/uploads/2017/01/miCamion.png" style="height:30px;width:30px;float:left;">';
	contents += '<span style="float:right;width:250px;">Distancia total: ' + dTotal + ' km</br>Tiempo estimado de conducción: ' + tTotal + '</span>';

	document.getElementById('tCamion').innerHTML = "";
	document.getElementById('tCamion').innerHTML = contents;
	document.getElementById('tCamion').style.display = 'block';
}

function formatearTiempo(tImput) { 
	var tFormateado;
	var temp;
	tImput = tImput / 3600;
	
	if (tImput > 24) {
		temp = Math.floor(tImput / 24);
		tImput -= temp * 24;
		if (temp == 1) {
			tFormateado = temp.toString() + ' día '
		} else {
			tFormateado = temp.toString() + ' días '
		}
		temp = Math.round(tImput);
		if (temp == 1) {
			tFormateado += temp.toString() + ' h. '
		} else {
			tFormateado += temp.toString() + ' hs. '
		}
	} else if (tImput > 1) { 
		temp = Math.floor(tImput);
		tImput = (tImput - temp) * 60;
		if (temp == 1) {
			tFormateado = temp.toString() + ' h. '
		} else {
			tFormateado = temp.toString() + ' hs. '
		}
		temp = Math.round(tImput);
		tFormateado += temp.toString() + ' min. '
	} else { 	
		tImput = tImput * 60;
		temp = Math.round(tImput);
		tFormateado = temp.toString() + ' min. '
	}
	
	return tFormateado;
}

function sendRouteStats() {
	var indicacionesHitos = document.getElementById('origen').statsValue + ' | ';
	for (var i = 0; i < counterHitos; i++) {
		indicacionesHitos += document.getElementById('hito' + counterHitos.toString()).statsValue + ' | ';
	}	
	indicacionesHitos += document.getElementById('destino').statsValue;

	dataLayer.push({'obtenerIndicaciones': indicacionesHitos, 'event':'ClicObtenerIndicaciones'});
}
