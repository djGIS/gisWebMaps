var myCenter = new google.maps.LatLng(-34.8, -63.5);
var myZoom = 6;
var geocoder;
var map;
var mapProp;

//Archivos de Base de Datos
var vinculo_dbPOI = '1i0Q7uVwWjJgw3cEg-dsAUnmhMPX2nzuLfkzgsNA';
var vinculo_dbEESS = '1obPn7mFkffMcwMUrxb4mLGnFyBu8GJGUBgddupK9';
var vinculo_dbRTP = '1bDkJ4DpLj2wBuuSMxWyiDT5FLMO52zz9wtlsoAU';
var vinculo_dbRestricciones = '1MxNzFFtAKZpbHpmF07tUzqxmMBGN_fxdaaYEaAJz';
var vinculo_dbPartesDNV = '1ApY8xmm_K_4OEErgX4SNRNDcj9Neruu3-t_U9vY';
var miftah = 'AIzaSyBJtngqawEy_5cbLEDZVCu1f37_OhU-oDo';

var dbPOIimport = [];
var infowindow = null;
var userLocationMarker = null;
var markers = [];
var markerCluster;
var POIvisualFormato = [
	//[CLASE, TIPO, textoMenu, icono, infoWindowTexto],
	['EN RUTA', 'PEAJE', 'Peajes', 'http://maps.google.com/mapfiles/ms/icons/yellow.png', ' '],
	['EN RUTA', 'ESTACION DE SERVICIO', 'Estaciones de Servicio', 'http://maps.google.com/mapfiles/ms/icons/blue.png', ' '],
	['EN RUTA', 'PASO INTERNACIONAL', 'Pasos Internacionales', 'http://maps.google.com/mapfiles/ms/icons/yellow.png', ' '],
	['EN RUTA', 'CAJON AZUL', 'Cajones Azules CABA', 'http://maps.google.com/mapfiles/ms/icons/lightblue.png', ' '],
	['EN RUTA', 'PARQUE INDUSTRIAL', 'Parques Industriales','http://maps.google.com/mapfiles/ms/icons/purple.png', ' '],
	['EN RUTA', 'TERMINALES PORTURIAS', 'Terminales Portuarias','http://maps.google.com/mapfiles/ms/icons/purple.png', ' '],
	['PERMISOS', 'RTO/VTV', 'Revisión Técnica', 'http://maps.google.com/mapfiles/ms/icons/red.png', ' '],
	['PERMISOS', 'RUTA', 'RUTA', 'http://maps.google.com/mapfiles/ms/icons/red.png', ' '],
	['PERMISOS', 'FPT', 'LNH/Cursos COAP', 'http://maps.google.com/mapfiles/ms/icons/red.png', ' '],
	['PERMISOS', 'PSICOFISICO', 'Examen Psicofisico', 'http://maps.google.com/mapfiles/ms/icons/red.png', ' '],
	['PERMISOS', 'ADUANA', 'AFIP - Aduana', 'http://maps.google.com/mapfiles/ms/icons/red.png', ' '],
	['PERMISOS', 'TRANSPORTE ALIMENTOS', 'SENASA (Alimentos)', 'http://maps.google.com/mapfiles/ms/icons/red.png', ' '],
	['PERMISOS', 'VIALIDAD', 'Vialidad - Cargas Excepcionales', 'http://maps.google.com/mapfiles/ms/icons/red.png', ' '],
	['SERVICIOS', 'FADEEAC', 'FADEEAC (Afiliados)', 'http://maps.google.com/mapfiles/ms/icons/lightblue.png', ' '],
	['SERVICIOS', 'POLICIA', 'Comisarias', 'http://maps.google.com/mapfiles/ms/icons/blue.png', ' '],
	['SERVICIOS', 'TALLER', 'Talleres', 'http://maps.google.com/mapfiles/ms/icons/purple.png', ' ']
]; 
var layers = []; 
var dbRestriccionesImport = [];

//Variables para funciones de ruteo
var rendererOptions = {
	draggable: true
};
var directionsDisplay;
var directionsService;
var routePath = [];
var routeBoxer = null;
//var closestPoint = centrosRuta.length + 1;

function getData(table) {
	var query = "SELECT LONGITUD, LATITUD, CLASE, TIPO, BANDERA, NOMBRE, DIRECCION, DIRECCION_ADD, LOCALIDAD, PROVINCIA, TELEFONO, HORARIOS, DIR_EMAIL, DIR_WEB, PRESTACIONES, NOTA, FOTO, FECHA_ACT, ESTADO_POI FROM " + table;
	var encodedQuery = encodeURIComponent(query);

	// Construct the URL
	var url = ['https://www.googleapis.com/fusiontables/v1/query'];
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
				dbPOIimport.push(dbTemp[i]);
			}
		}
	});
}

function getRestricciones(table) {
	var query = "SELECT GEOMETRY, TIPO, JURISDICCION, NOMBRE FROM " + table;
	var encodedQuery = encodeURIComponent(query);
	var geometries = [];

	// Construct the URL
	var url = ['https://www.googleapis.com/fusiontables/v1/query'];
	url.push('?sql=' + encodedQuery);
	url.push('&key=' + miftah);
	url.push('&callback=?');

	// Send the JSONP request using jQuery
	$.ajax({
		url: url.join(''),
		dataType: 'jsonp',
		success: function (data) {
			dbRestriccionesImport = data['rows'];
			for(var i in dbRestriccionesImport) {
				geometries[i] = dbRestriccionesImport[i][0]['geometries'];
			}
		//alert(geometries[0]);

		}
	});
}

function getEstado(table) {
	var query = "SELECT GEOMETRY, RUTA, TRAMO, ESTADO FROM " + table;
	var encodedQuery = encodeURIComponent(query);

	// Construct the URL
	var url = ['https://www.googleapis.com/fusiontables/v1/query'];
	url.push('?sql=' + encodedQuery);
	url.push('&key=' + miftah);
	url.push('&callback=?');

	// Send the JSONP request using jQuery
	$.ajax({
		url: url.join(''),
		dataType: 'jsonp',
		success: function (data) {
			dbEstadoImport = data['rows'];
			//alert(dbEstadoImport[0][0]);
		}
	});
}



function writeAddressName(latLng) {
var geocoder = new google.maps.Geocoder();
geocoder.geocode({
"location": latLng
},

function(results, status) {
if (status == google.maps.GeocoderStatus.OK)
document.getElementById("address").value = results[0].formatted_address;
else
alert('Unable to retrieve your address');
});
}

function geolocationSuccess(position) {
var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

writeAddressName(userLatLng);

// Place UserPosition marker
var marker = new google.maps.Marker({
map: map,
icon: 'http://maps.google.com/mapfiles/kml/pal3/icon52.png',
position: userLatLng
}); 
//userLocationMarker.push(marker);
findClosest(userLatLng, centrosRuta);
}

function geolocationError(positionError) {
document.getElementById("error").innerHTML += "Error: " + positionError.message + "<br />";
}

function geolocateUser() {
// If the browser supports the Geolocation API
if (navigator.geolocation) {
var positionOptions = {
enableHighAccuracy: true,
timeout: 10 * 1000 // 10 seconds
};
navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, positionOptions);
}
else
alert('La función de ubicación automaticano está soportada por su browser.');
}

function infoCallback(infowindow, marker) { 
return function() {
infowindow.open(map, marker);
};
}

function marcador(tipo, latlngset, icono, content, infowindow) { 
var marker = new google.maps.Marker({ 
map: map, 
title: tipo, 
position: latlngset, 
icon: {
url: icono,
//size: new google.maps.Size(32, 32),
origin : new google.maps.Point(0, 0),
anchor: new google.maps.Point(16, 32),
//scaledSize: new google.maps.Size(32, 32)
}
});
markers.push(marker);

google.maps.event.addListener(marker, 'click', (function(marker, content) {
return function() {
infowindow.setContent(content);
infowindow.open(map, marker);
}
})(marker, content));
}

function setMarkers(dbPOI) { 
var infowindow = new google.maps.InfoWindow();
var icono = 'http://maps.google.com/mapfiles/ms/icons/lightblue.png'
var content;
var POIselector = document.getElementsByName('POIselect');

// Unset all markers
if (markers.length != 0) {
for(var i=0; i<markers.length; i++) {
markers[i].setMap(null)
}
markers = [];
}

for (x = 0; x < POIselector.length; x++) {
if (POIselector[x].checked == true) {
var tipoPOI = POIselector[x].value;

for (var i=0; i < dbPOI.length; i++) { 
var lng = dbPOI[i][0];
var lat = dbPOI[i][1];
var clase = dbPOI[i][2];
var tipo = dbPOI[i][3];
var bandera = dbPOI[i][4];
var nombre = dbPOI[i][5];
var direccion = dbPOI[i][6];
var dir_add = dbPOI[i][7];
var localidad = dbPOI[i][8];
var provincia = dbPOI[i][9];
var telefono = dbPOI[i][10];
var horarios = dbPOI[i][11];
var dir_email = dbPOI[i][12];
var dir_web = dbPOI[i][13]; 
var prestacion = dbPOI[i][14];
var nota = dbPOI[i][15];
var fecha_act = dbPOI[i][17];
var estado = dbPOI[i][18];
var latlngset;

if (tipo == tipoPOI && estado == 1) {
latlngset = new google.maps.LatLng(lat, lng);
//asignar icono para marcador

for (var j = 0; j < POIvisualFormato.length; j++) { 
//[CLASE, TIPO, textoMenu, icono, infoWindowTexto],
if (tipo == POIvisualFormato[j][1]) {
icono = POIvisualFormato[j][3];
} 
}
//switch para asignar formato a los marcadores y burbujas de información
switch(clase) {
case 'EN RUTA':
content = '<div style="width:300px;padding-bottom: 5px"><span style="font-family: arial,helvetica,sans-serif;font-size: 9pt;"><strong>' + nombre + '</br>' + bandera + '</strong></span></div>';
content += '<div style="width:300px;padding-bottom: 5px"><span style="font-family: arial,helvetica,sans-serif;font-size: 9pt;">' + direccion + '</br>' + localidad + ', ' + provincia + '</span></div>';

if(prestacion.length > 0)
content += '<div style="width:300px;padding-bottom: 5px"><span style="font-family: arial,helvetica,sans-serif;font-size: 9pt;">Servicios disponibles:</br> ' + prestacion + '</span></div>';

if(nota.length > 0)
content += '<div style="width:300px;padding-bottom: 5px"><span style="font-family: arial,helvetica,sans-serif;font-size: 9pt;">' + nota + '</span></div>';
content += '<div style="width:300px;"><span style="font-family: arial,helvetica,sans-serif;font-size: 9pt;">' + 'Atención al Cliente: ' + telefono + '</br>' + dir_email + '</br>' + dir_web + '</span></div>'
break;
case 'PERMISOS':
content = '<div style="width:300px;padding-bottom: 5px"><span style="font-family: arial,helvetica,sans-serif;font-size: 9pt;"><strong>' + nombre + '</br>' + bandera + '</strong></span></div>';
content += '<div style="width:300px;padding-bottom: 5px"><span style="font-family: arial,helvetica,sans-serif;font-size: 9pt;">' + direccion + '</br>' + localidad + ', ' + provincia + '</span></div>';
content += '<div style="width:300px;padding-bottom: 5px"><span style="font-family: arial,helvetica,sans-serif;font-size: 9pt;">' + nota + '</span></div>';
content += '<div style="width:300px;"><span style="font-family: arial,helvetica,sans-serif;font-size: 9pt;">Atención al Cliente: ' + telefono + '</br>' + dir_email + '</br>' + dir_web + '</span></div>'
break;
case 'SERVICIOS':
content = '<div style="width:300px;padding-bottom: 5px"><span style="font-family: arial,helvetica,sans-serif;font-size: 9pt;"><strong>' + nombre + '</br>' + bandera + '</strong></span></div>';
content += '<div style="width:300px;padding-bottom: 5px"><span style="font-family: arial,helvetica,sans-serif;font-size: 9pt;">' + direccion + '</br>' + localidad + ', ' + provincia + '</span></div>';
content += '<div style="width:300px;"><span style="font-family: arial,helvetica,sans-serif;font-size: 9pt;">' + telefono + '</br>' + dir_email + '</br>' + dir_web + '</span></div>'
break;
default:
// code to be executed if n is different from case 1 and 2
}

content += '<div style="width:300px;text-align:right;"><span style="font-family: arial,helvetica,sans-serif;font-size: 9pt;">Ultima Actualización: ' + fecha_act + '</span></div>';
marcador(tipo, latlngset, icono, content, infowindow);
} 
}
}
}
if (document.getElementById('applygrid').checked == true) {
aplicarGrilla(document.getElementById('gridsize').value);
}
}

function initialize() {
var mapProp = {
center : myCenter,
zoom : myZoom,
panControl : true,
panControlOptions: {
position: google.maps.ControlPosition.RIGHT_BOTTOM
},
zoomControl : true,
zoomControlOptions: {
style: google.maps.ZoomControlStyle.SMALL,
position: google.maps.ControlPosition.RIGHT_BOTTOM
},
mapTypeControl : true,
mapTypeControlOptions: {
style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
position: google.maps.ControlPosition.LEFT_BOTTOM
},
scaleControl : true,
streetViewControl : false,
overviewMapControl : false,
mapTypeId : google.maps.MapTypeId.ROADMAP
};



map = new google.maps.Map(document.getElementById("miSIGmapa"),mapProp);
//map = new Microsoft.Maps.Map(document.getElementById("miSIGmapa"), {
// credentials:"ArRc4uqsAG2VJkVMBMs9eyMEK_14jLiOw-s4ZvNQcK_c-z6E02ixmfYs8mj4xlNe",
// center: new Microsoft.Maps.Location(45.5, -122.5),
// mapTypeId: Microsoft.Maps.MapTypeId.road,
// zoom: 7});

//Codigo de inicialización para función de ruteo
directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
directionsService = new google.maps.DirectionsService();
directionsDisplay.setMap(map);
directionsDisplay.setPanel(document.getElementById('indicaciones'));

google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
computeTotalDistance(directionsDisplay.directions);
directionsDisplay.setMap(map);
directionsDisplay.setPanel(document.getElementById('indicaciones'));
});

//Codigo para grilla de distancia
//routeBoxer = new RouteBoxer();
fullscreenControls();
buscadorControls();
capasControl();
}

function codeAddress(direccion) {
var address = document.getElementById(direccion).value;
var geocoder = new google.maps.Geocoder();

geocoder.geocode( { 'address': address, 'region': 'ar'}, function(results, status) {
if (status == google.maps.GeocoderStatus.OK) {
map.setZoom(12);
map.setCenter(results[0].geometry.location);
//document.getElementById(direccion).value = results[0].formatted_address;

// Place UserPosition marker 
if (userLocationMarker != null)
userLocationMarker.setMap(null);

if (direccion == 'direccion') { 
var image = {
url: 'http://maps.google.com/mapfiles/kml/paddle/ylw-stars.png',
size: new google.maps.Size(64, 64),
origin: new google.maps.Point(0, 0),
anchor: new google.maps.Point(16, 32),
scaledSize: new google.maps.Size(32, 32)
};

userLocationMarker = new google.maps.Marker({
map: map,
position: results[0].geometry.location,
title: results[0].formatted_address,
icon: image
}); 
//findClosest(results[0].geometry.location, centrosRuta);
}
} else {
alert("Lo sentimos, no se pudo resolver la dirección que ingresó.");
}
});
}

function cargarCapaKML() {
var layer = [];
var KMLselector = document.getElementsByName('selectKML');

// Unset all layers
if (layers.length != 0) {
for(var i=0; i<layers.length; i++) {
layers[i].setMap(null)
}
layers = [];
}

for (x = 0; x < KMLselector.length; x++) {
if (KMLselector[x].checked == true) {
switch(KMLselector[x].value) {
case 'RTP CABA':
layer = new google.maps.FusionTablesLayer({
query: {
select: 'GEOMETRY',
from: vinculo_dbRTP
},
styles: [{
polylineOptions: {
strokeColor: '#33CCFF',
strokeOpacity: 0.5,
strokeWeight: 5
}
}],
templateId: 2
});
break;
case 'RFS ANSV':
layer = new google.maps.FusionTablesLayer({
query: {
select: 'GEOMETRY',
from: vinculo_dbRestricciones
}, 
//styles: [{
// polylineOptions: {
// strokeColor: '#F70D1A',
// strokeOpacity: 0.5,
// strokeWeight: 5
// }
//}],
templateId: 2
});
break;
case 'ER DNV':
layer = new google.maps.FusionTablesLayer({
query: {
select: 'Estado Ruta',
from: vinculo_dbPartesDNV
}, 
//styles: [{
// polylineOptions: {
// strokeColor: '#F87431',
// strokeOpacity: 0.5,
// strokeWeight: 5
// }
//}],
templateId: 2
});
break;
default: 
}
layer.setMap(map);
layers.push(layer);
}
}
}

//Funciones para el ruteo
function calcRoute() {
var origen = document.getElementById("origen").value;
var destino = document.getElementById("destino").value;
var optimizar = false;
var segRoute;
var segLength;
var request;
var hitos = [];

var total = 0;
var i = 0;

while (i < counterHitos) {
i++
hitos.push({
location: document.getElementById("Hito" + i.toString()).value,
stopover: true
});
}

if (document.getElementById('optimizarRuteo').checked == true) {
optimizar = true;
} else {
optimizar = false;
}

request = {
origin: origen,
destination: destino,
travelMode: google.maps.DirectionsTravelMode.DRIVING,
//transitOptions: TransitOptions,
//unitSystem: UnitSystem,
waypoints: hitos, //[{location: 'Bourke, NSW'}, {location: 'Broken Hill, NSW'}],
optimizeWaypoints: optimizar,
provideRouteAlternatives: true,
//avoidHighways: Boolean,
//avoidTolls: Boolean
region: 'ar'
};

directionsService.route(request, function(result, status) {
if (status == google.maps.DirectionsStatus.OK) {
//segRoute[0] = directionRequest(request);
directionsDisplay.setDirections(result);
routePath = result.routes[0].overview_path;
myroute = result.routes[0];
//for (i = 0; i < myroute.legs.length; i++) {
// total += myroute.legs[i].distance.value;
//} 
if (document.getElementById('applygrid').checked == true) {
aplicarGrilla(document.getElementById('gridsize').value);
}
advertenciaPeaje(dbPOIimport);
} else {
alert("Lo sentimos, no se pudo calcular una ruta entre los puntos ingresados.");
}
}); 
}

function computeTotalDistance(result) {
var total = 0;
var myroute = result.routes[0];
for (var i = 0; i < myroute.legs.length; i++) {
total += myroute.legs[i].distance.value;
}
total = total / 1000.
}

function aplicarGrilla(distGrilla) {
//var distGrilla = 10; // km
var boxes = routeBoxer.box(routePath, distGrilla);

if (routePath != null && markers.length > 0) {
for (var a = 0; a < markers.length; a++) {
var boundsTest = false;
for (var i = 0; i < boxes.length; i++) {
var bounds = boxes[i];
if (bounds.contains(markers[a].position)) {
boundsTest = true;
}
}
if (boundsTest != true)
markers[a].setMap(null)
}
}
}

function filtrarServicios(dbPOI) {
var filtro = document.getElementById("filtroServicios").value;
var POIselector = document.getElementsByName('POIselect');
var flag = false;
var umpalumpa = [];

for (var i = 0; i < dbPOI.length; i++) { 
umpalumpa[i] = dbPOI[i]
}

if (filtro != "") {
for (var i = 0; i < umpalumpa.length; i++) { 
var bandera = umpalumpa[i][3];
var nombre = umpalumpa[i][4];
var prestacion = umpalumpa[i][13];
var nota = umpalumpa[i][14];

filtro = filtro.toLowerCase();
var searchstring = bandera + " " + nombre + " " + prestacion + " " + nota;
searchstring = searchstring.toLowerCase();

if (searchstring.search(filtro) == -1) {
//alert(dbPOIimport.length);
umpalumpa.splice(i, 1);
i -= 1;
}
}

// Averiguar si hay un tipo de POI seleccionado, sino seleccionar todos para mostrar todos los resultados de busqueda

for (x = 0; x < POIselector.length; x++) {
if (POIselector[x].checked == true)
flag = true;
}
if (flag == false) {
for (x = 0; x < POIselector.length; x++) {
POIselector[x].checked = true;
}
}

setMarkers(umpalumpa);

} else {
setMarkers(dbPOIimport);
}

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

function advertenciaPeaje(dbPOI) {
var textTemp = '<br><select id="ConfigEjes" onchange="peajeSelecEjes(this)"><option value="1">Auto o Camioneta</option><option selected="selected" value="2">Camión 2 Ejes</option><option selected="selected" value="3">Camión 3 Ejes</option><option selected="selected" value="4">Camión 4 Ejes</option></select>'; //visibility: collapse
textTemp += '<br><table width="100%"><tr><th width="25%"><b>PUESTO DE PEAJE</b></th><th id="PeajeCol1"><b>AUTO</b></th><th id="PeajeCol2"><b>2 EJES</b></th><th id="PeajeCol3"><b>3 EJES</b></th><th id="PeajeCol4"><b>4 EJES</b></th><th id="PeajeCol5"><b>5 EJES</b></th><th id="PeajeCol6"><b>6 EJES</b></th><th id="PeajeCol7"><b>7 EJES</b></th><th id="PeajeCol8">ESP.</b></th><th width="15%"><b>HORA PICO</b></th></tr>';
var peajesPasados = [];

for (var i = 1; i < routePath.length; i++) {
for (var a = 0; a < dbPOI.length; a++) {
if (dbPOI[a][3] == 'PEAJE') { 
var x0 = dbPOI[a][1];
var y0 = dbPOI[a][0];
var x1 = routePath[i-1].lat();
var y1 = routePath[i-1].lng();
var x2 = routePath[i].lat();
var y2 = routePath[i].lng();

var a_to_p = [x0 - x1, y0 - y1]; // Storing vector A->P
var a_to_b = [x2 - x1, y2 - y1]; // Storing vector A->B

var atb2 = Math.pow(a_to_b[0], 2) + Math.pow(a_to_b[1], 2); // Basically finding the squared magnitude of a_to_b

var atp_dot_atb = (a_to_p[0] * a_to_b[0]) + (a_to_p[1] * a_to_b[1]); // The dot product of a_to_p and a_to_b

var t = atp_dot_atb / atb2; // The normalized distance from a to your closest point

var x3 = x1 + a_to_b[0] * t;
var y3 = y1 + a_to_b[1] * t; // Add the distance to 1, moving towards 2

var p0 = new google.maps.LatLng(x0, y0);
var p1 = new google.maps.LatLng(x1, y1);
var p2 = new google.maps.LatLng(x2, y2);
var p3 = new google.maps.LatLng(x3, y3);

var distancia = google.maps.geometry.spherical.computeDistanceBetween (p0, p3); //Math.abs(((y1 - y2) * x0) - ((x1 - x2) * y0) + (x1 * y2) - (x2 * y1)) / Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))

if (distancia < 25) {
var distancia1 = google.maps.geometry.spherical.computeDistanceBetween (p3, p1);
var distancia2 = google.maps.geometry.spherical.computeDistanceBetween (p3, p2);
//alert(dbPOI[a][4]);
//alert(Math.min(distancia1, distancia2));
if ((x3 < Math.max(x1, x2) && x3 > Math.min(x1, x2)) || Math.min(distancia1, distancia2) < 1500) {
var j = 0;

while (dbPOI[a][4] != peajesPasados[j]) {
if (j == peajesPasados.length) { 
var textTarifas = dbPOI[a][15];
var counter = 0;
var posCounter = 0;
var Tarifas = '<td id="PeajeCol' + posCounter + '">';
for (var y = 0; y < textTarifas.length; y++) {
if (textTarifas.charAt(y) == ';') {
Tarifas += textTarifas.substring(counter, y) + '</td><td id="PeajeCol' + posCounter + '">';
counter = y + 1;
posCounter += 1;
} else if (textTarifas.charAt(y) == '|') {
Tarifas += textTarifas.substring(counter, y) + '<br>';
counter = y + 1;
} else if (y == textTarifas.length - 1) { 
if (posCounter == 8) {
Tarifas = Tarifas.substring(0, Tarifas.length);
Tarifas += textTarifas.substring(counter, y + 1) + '</td>';
} else {
Tarifas += textTarifas.substring(counter, y + 1) + '</td>'; 
}
}
}
textTemp = textTemp + '<tr><td>PEAJE ' + dbPOI[a][4] + '<br>' + dbPOI[a][3] + '<br>' + dbPOI[a][5] + '</td>' + Tarifas + '</tr>';
peajesPasados.push(dbPOI[a][4]);
break;
} 
j += 1;
} 
} 
}
}
}
} 
textTemp = textTemp + '</table>';
if (peajesPasados.length > 0) {
document.getElementById('advertirPeajes').innerHTML = textTemp; 
} else {
document.getElementById('advertirPeajes').innerHTML = ""; 
}
}


// Funciones de control de formularios y formularios dinamicos

function capasControl() {
var capasContainerDiv = document.createElement('div');
capasContainerDiv.style.cssText = 'width:240px;padding:5px';

var capasControlDiv = document.createElement('div');
capasControlDiv.style.cssText = 'background:rgba(0,51,102,0.75);padding-left:2px;padding-right:2px;padding-bottom:1px';

var controles = document.createElement('input');
controles.type = 'button';
controles.value = 'Capas Informativas';
controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;width:100%';
capasControlDiv.appendChild(controles);

var capasContainer = document.createElement('div');
capasContainer.id = 'controlCapas';
capasContainer.style.display = 'none'; 
capasContainer.style.maxHeight = '250px'; 
capasContainer.style.overflowY = 'scroll'; 

//controles = document.createElement('div');
//var texto = document.createTextNode('Puntos de Interés');
//controles.appendChild(texto);
//controles.style.cssText = 'font-weight:bold;font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro;padding-top:5px';
//capasContainer.appendChild(controles); 

var POIselector;
var c, r, t;
t = document.createElement('table');
t.id = 'tablaENRUTA';
t.width = '100%';

//POIvisualFormato = [
//[CLASE, TIPO, textoMenu, icono, infoWindowTexto],
var i = 0;
var j = 0;
//for (var i = 0; i < POIvisualFormato.length; i ++) {
while (POIvisualFormato[j][0] == 'EN RUTA') {
r = t.insertRow(i); 

c = r.insertCell(0);
POIselector = document.createElement('input');
POIselector.type = 'checkbox';
POIselector.name = 'POIselect';
POIselector.value = POIvisualFormato[j][1];
POIselector.onclick = function(){setMarkers(dbPOIimport);};
c.appendChild(POIselector);

c = r.insertCell(1);
c.width = '78%';
controles = document.createElement('span');
var texto = document.createTextNode(POIvisualFormato[j][2]);
controles.appendChild(texto);
controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro';
c.appendChild(controles);

c = r.insertCell(2);
controles = document.createElement('img');
controles.src = POIvisualFormato[j][3];
controles.setAttribute('width', '50%');
controles.setAttribute('height', '50%');
c.appendChild(controles);

i++;
j++;
}
capasContainer.appendChild(t);

controles = document.createElement('div');
var texto = document.createTextNode('Estado de Rutas y Restricciones');
controles.appendChild(texto);
controles.style.cssText = 'font-weight:bold;font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro;padding-top:5px';
capasContainer.appendChild(controles); 

var KMLselector = document.createElement('select');
var c, r, t;
t = document.createElement('table');
r = t.insertRow(0); 

c = r.insertCell(0);
KMLselector = document.createElement('input');
KMLselector.type = 'checkbox';
KMLselector.name = 'selectKML';
KMLselector.value = 'RTP CABA';
KMLselector.onclick = function(){cargarCapaKML();};
c.appendChild(KMLselector);

c = r.insertCell(1);
controles = document.createElement('span');
var texto = document.createTextNode('Red de Tránsito Pesado');
controles.appendChild(texto);
controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro';
c.appendChild(controles);

r = t.insertRow(1); 

c = r.insertCell(0);
KMLselector = document.createElement('input');
KMLselector.type = 'checkbox';
KMLselector.name = 'selectKML';
KMLselector.value = 'RFS ANSV';
KMLselector.onclick = function(){cargarCapaKML();};
c.appendChild(KMLselector);

c = r.insertCell(1);
controles = document.createElement('span');
var texto = document.createTextNode('Restricciones de Tránsito');
controles.appendChild(texto);
controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro';
c.appendChild(controles);

r = t.insertRow(2); 

c = r.insertCell(0);
KMLselector = document.createElement('input');
KMLselector.type = 'checkbox';
KMLselector.name = 'selectKML';
KMLselector.value = 'ER DNV';
KMLselector.onclick = function(){cargarCapaKML();};
c.appendChild(KMLselector);

c = r.insertCell(1);
controles = document.createElement('span');
var texto = document.createTextNode('Estado de Rutas - DNV');
controles.appendChild(texto);
controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro';
c.appendChild(controles);

//KMLselector.id = 'selectKML';
//KMLselector.multiple = 'true';
//KMLselector.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;width:100%';
//KMLselector.onchange = function(){cargarCapaKML();};
//KMLselector.options[0] = new Option('Red de Tránsito Pesado - CABA', 'RTP CABA');
//KMLselector.options[1] = new Option('Restricciones de Tránsito - ANSV', 'RFS ANSV');
//KMLselector.options[2] = new Option('Estado de Rutas - DNV', 'ER DNV');
//KMLselector.options[3] = new Option('Advertencias - FADEEAC', 'Warnings');
//KMLselector.options[4] = new Option('TMDA', 'TMDA DNV');
//capasContainer.appendChild(KMLselector);

capasContainer.appendChild(t);

controles = document.createElement('div');
var texto = document.createTextNode('Tramites y Permisos');
controles.appendChild(texto);
controles.style.cssText = 'font-weight:bold;font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro;padding-top:5px';
capasContainer.appendChild(controles); 

t = document.createElement('table');
t.width = '100%';
i = 0;
while (POIvisualFormato[j][0] == 'PERMISOS') {
r = t.insertRow(i); 

c = r.insertCell(0);
POIselector = document.createElement('input');
POIselector.type = 'checkbox';
POIselector.name = 'POIselect';
POIselector.value = POIvisualFormato[j][1];
POIselector.onclick = function(){setMarkers(dbPOIimport);};
c.appendChild(POIselector);

c = r.insertCell(1);
c.width = '78%';
controles = document.createElement('span');
var texto = document.createTextNode(POIvisualFormato[j][2]);
controles.appendChild(texto);
controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro';
c.appendChild(controles);

c = r.insertCell(2);
controles = document.createElement('img');
controles.src = POIvisualFormato[j][3];
controles.setAttribute('width', '50%');
controles.setAttribute('height', '50%');
c.appendChild(controles);

i++;
j++;
}
capasContainer.appendChild(t);

controles = document.createElement('div');
var texto = document.createTextNode('Servicios');
controles.appendChild(texto);
controles.style.cssText = 'font-weight:bold;font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro;padding-top:5px';
capasContainer.appendChild(controles); 

t = document.createElement('table');
t.width = '100%';
i = 0;
while (j < POIvisualFormato.length) {
r = t.insertRow(i); 

c = r.insertCell(0);
POIselector = document.createElement('input');
POIselector.type = 'checkbox';
POIselector.name = 'POIselect';
POIselector.value = POIvisualFormato[j][1];
POIselector.onclick = function(){setMarkers(dbPOIimport);};
c.appendChild(POIselector);

c = r.insertCell(1);
c.width = '78%';
controles = document.createElement('span');
var texto = document.createTextNode(POIvisualFormato[j][2]);
controles.appendChild(texto);
controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro';
c.appendChild(controles);

c = r.insertCell(2);
controles = document.createElement('img');
controles.src = POIvisualFormato[j][3];
controles.setAttribute('width', '50%');
controles.setAttribute('height', '50%');
c.appendChild(controles);

i++;
j++;
}

capasContainer.appendChild(t);

capasControlDiv.appendChild(capasContainer);
capasContainerDiv.appendChild(capasControlDiv);
map.controls[google.maps.ControlPosition.TOP_RIGHT].push(capasContainerDiv);

google.maps.event.addDomListener(capasContainerDiv, 'mouseover', function() {
document.getElementById('controlCapas').style.display = 'block';
});

google.maps.event.addDomListener(capasContainerDiv, 'mouseout', function() {
document.getElementById('controlCapas').style.display = 'none';
});

}

var counterHitos = 0;

function buscadorControls() {
var buscadorContainerDiv = document.createElement('div');
buscadorContainerDiv.id = 'buscadorPanel';
buscadorContainerDiv.style.cssText = 'width:350px;padding:5px';

// Div sombreado para controles
var buscadorControlDiv = document.createElement('div');
buscadorControlDiv.style.cssText = 'background:rgba(0,51,102,0.75);padding-left:2px;padding-right:2px';

var controles = document.createElement('input');
controles.type = 'button';
controles.id = 'busqueda';
controles.value = 'Buscar Lugar';
controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;width:49.5%';
controles.onclick = function(){formControls('busqueda');};
buscadorControlDiv.appendChild(controles);

controles = document.createElement('input');
controles.type = 'button';
controles.id = 'ruteo';
controles.value = 'Cómo Llegar';
controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;width:49.5%;float:right';
controles.onclick = function(){formControls('ruteo');};
buscadorControlDiv.appendChild(controles);

// Bottones de control de tipo de busqueda
var outerContainer = document.createElement('div');
outerContainer.id = 'Buscador';
buscadorControlDiv.appendChild(outerContainer);

// Inputs de usuario para busqueda de dirección
var container = document.createElement('div');
container.id = 'busquedaInputs';

controles = document.createElement('input');
controles.type = 'text';
controles.id = 'direccion';
controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;width:82.5%';
container.appendChild(controles);
var autocomplete = new google.maps.places.Autocomplete((controles), { types: ['geocode'] });

controles = document.createElement('input');
controles.type = 'button';
controles.id = 'buscar';
controles.value = 'Buscar';
controles.onclick = function(){codeAddress('direccion');};
controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;width:15%;float:right';
container.appendChild(controles);

container.style.display = 'none';
outerContainer.appendChild(container);

// Inputs de usuario para busqueda de dirección
container = document.createElement('div');
container.id = 'ruteoInputs';

controles = document.createElement('input');
controles.type = 'text';
controles.id = 'origen';
controles.placeholder = 'Origen : Introduce una ubicación';
controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;width:82.5%';
container.appendChild(controles);
var autocomplete = new google.maps.places.Autocomplete((controles), { types: ['geocode'] });

controles = document.createElement('input');
controles.type = 'button';
controles.id = 'AddHito0';
controles.value = '+';
controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;width:7.5%;float:right';
controles.onclick = function(){addHito();};
container.appendChild(controles);

controles = document.createElement('span');
controles.id = 'Hitos';
container.appendChild(controles);

controles = document.createElement('input');
controles.type = 'text';
controles.id = 'destino';
controles.placeholder = 'Destino : Introduce una ubicación';
controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;width:82.5%';
container.appendChild(controles);
autocomplete = new google.maps.places.Autocomplete((controles), { types: ['geocode'] });

var opciones = document.createElement('div');
opciones.id = 'OpcionesRuteo';
opciones.style.display = 'none';
container.appendChild(opciones);

controles = document.createElement('div');
var texto = document.createTextNode('Opciones de Ruteo');
controles.appendChild(texto);
controles.style.cssText = 'font-weight:bold;font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro;padding-top:5px';
opciones.appendChild(controles);

var c, r, t;
t = document.createElement('table');
r = t.insertRow(0); 

c = r.insertCell(0);
var controles = document.createElement('input');
controles.type = 'checkbox';
controles.id = 'applygrid';
controles.onclick = function(){setMarkers(dbPOIimport);};
c.appendChild(controles);

c = r.insertCell(1);
controles = document.createElement('span');
var texto = document.createTextNode('Mostrar solamente servicios alrededor del itinerario (hasta ');
controles.appendChild(texto);
controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro';
c.appendChild(controles);

controles = document.createElement('input');
controles.type = 'number';
controles.id = 'gridsize';
controles.min = '1';
controles.max = '100';
controles.step = '5';
controles.value = '4'; 
controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;width:35px'
c.appendChild(controles);

controles = document.createElement('span');
var texto = document.createTextNode(' km).');
controles.appendChild(texto);
controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro';
c.appendChild(controles);

r = t.insertRow(1); 

c = r.insertCell(0);
var controles = document.createElement('input');
controles.type = 'checkbox';
controles.id = 'optimizarRuteo';
c.appendChild(controles);

c = r.insertCell(1);
controles = document.createElement('span');
var texto = document.createTextNode('Optimizar el ruteo a través de las paradas indicadas.');
controles.appendChild(texto);
controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro';
c.appendChild(controles);

opciones.appendChild(t);

controles = document.createElement('input');
controles.type = 'button';
controles.id = 'mostrarOpciones';
controles.value = 'Mostrar Opciones de Busqueda';
controles.onclick = function(){opcionesControls();};
controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;width:100%';
container.appendChild(controles);

controles = document.createElement('input');
controles.type = 'button';
controles.id = 'rutear';
controles.value = 'Obtener Indicaciones';
controles.onclick = function(){calcRoute();};
controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;width:100%';
container.appendChild(controles);

container.style.display = 'none';
outerContainer.appendChild(container);
buscadorContainerDiv.appendChild(buscadorControlDiv);

map.controls[google.maps.ControlPosition.TOP_LEFT].push(buscadorContainerDiv);

google.maps.event.addDomListener(buscadorContainerDiv, 'mouseover', function() {
document.getElementById('Buscador').style.display = 'block';
});

google.maps.event.addDomListener(buscadorContainerDiv, 'mouseout', function() {
if (event.clientX < 0 || event.clientX > 350)
document.getElementById('Buscador').style.display = 'none';
});

//google.maps.event.addDomListener(document.getElementById('applygrid'), 'onclick', function() {
// 
//});
}

function formControls(tipoBusqueda) { 
if (tipoBusqueda == 'busqueda') {
document.getElementById('ruteoInputs').style.display = 'none';
document.getElementById('busquedaInputs').style.display = 'block';
} else if (tipoBusqueda == 'ruteo') {
document.getElementById('ruteoInputs').style.display = 'block';
document.getElementById('busquedaInputs').style.display = 'none';
}
}

function opcionesControls() {
if (document.getElementById('mostrarOpciones').value == 'Mostrar Opciones de Busqueda') {
document.getElementById('mostrarOpciones').value = 'Ocultar Opciones de Busqueda';
document.getElementById('OpcionesRuteo').style.display = 'block';
} else {
document.getElementById('mostrarOpciones').value = 'Mostrar Opciones de Busqueda';
document.getElementById('OpcionesRuteo').style.display = 'none';
}
} 

function addHito() {
if (counterHitos < 8) {
document.getElementById("AddHito" + counterHitos.toString()).style.display = 'none';
if (counterHitos > 0) 
document.getElementById("RemoveHito" + counterHitos.toString()).style.display = 'none';
counterHitos = counterHitos + 1;

var controles = document.createElement('input');
controles.type = 'text';
controles.id = 'Hito' + counterHitos;
controles.placeholder = 'Parada ' + counterHitos + ' : Introduce una ubicación';
controles.style.cssText = 'width:82.5%';
document.getElementById('Hitos').appendChild(controles);
autocomplete = new google.maps.places.Autocomplete((controles), { types: ['geocode'] });

controles = document.createElement('input');
controles.type = 'button';
controles.id = 'RemoveHito' + counterHitos;
controles.value = '-';
controles.style.cssText = 'width:7.5%;float:right';
controles.onclick = function(){removeHito();};
document.getElementById('Hitos').appendChild(controles);

controles = document.createElement('input');
controles.type = 'button';
controles.id = 'AddHito' + counterHitos;
controles.value = '+';
controles.style.cssText = 'width:7.5%;float:right';
controles.onclick = function(){addHito();};
document.getElementById('Hitos').appendChild(controles);
} else {
alert("Se llegó a la cantidad máxima de hitos permitods por el buscador."); 
} 
}

function removeHito() {
if (counterHitos != 0) {
document.getElementById('Hitos').removeChild(document.getElementById('Hito' + counterHitos));
document.getElementById('Hitos').removeChild(document.getElementById('AddHito' + counterHitos));
document.getElementById('Hitos').removeChild(document.getElementById('RemoveHito' + counterHitos));
counterHitos = counterHitos - 1;
document.getElementById("AddHito" + counterHitos.toString()).style.display = 'inline';
document.getElementById("RemoveHito" + counterHitos.toString()).style.display = 'inline';
} 
}

function showHelpLayers() {
if (document.getElementById("HelpLayers").style.display == 'none') {
document.getElementById("HelpLayers").style.display = 'block';
} else {
document.getElementById("HelpLayers").style.display = 'none';
}
}

function showHelpBuscador() {
if (document.getElementById("HelpBuscador").style.display == 'none') {
document.getElementById("HelpBuscador").style.display = 'block';
} else {
document.getElementById("HelpBuscador").style.display = 'none';
}
}


	
	function fullscreenTogle (elemId) {
		var fullscreenElem = document.getElementById(elemId);

        if (fullscreenElem.requestFullscreen) {
            fullscreenElem.requestFullscreen();
        }
        else if (fullscreenElem.msRequestFullscreen) {
            fullscreenElem.msRequestFullscreen();
        }
        else if (fullscreenElem.mozRequestFullScreen) {
            fullscreenElem.mozRequestFullScreen();
        }
        else if (fullscreenElem.webkitRequestFullScreen) {
			fullscreenElem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    }
	
	function fullscreenControls() {
		//var ContainerDiv = document.createElement('div');
		//ContainerDiv.style.cssText = 'padding-right:10px;width:40px;height:30px;';
		
		var controles = document.createElement('input');
		controles.type = 'button';
		controles.id = 'fullscreenTogle';
		//controles.value = 'Pantalla Completa';
		controles.style.cssText = 'border: 0px solid;border-radius: 2px;margin-right:10px;width:28px;height:28px;background-image:url("http://www.fadeeac.org.ar/images/imagenes/Departamentos/TecnicosInfraestructura/fullscreenIcon.png");background-size: 30px 30px;background-position:center;background-color: white;';
		controles.onclick = function(){fullscreenTogle('miSIGmapa');};
		//ContainerDiv.appendChild(controles); 
				
		map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controles);
	}
	
// Funciones a ejecutar al cargar la pagina
//google.maps.event.addDomListener(body, 'load', formControls);
google.maps.event.addDomListener(window, 'load', getData(vinculo_dbPOI));
google.maps.event.addDomListener(window, 'load', getData(vinculo_dbEESS));
//google.maps.event.addDomListener(window, 'load', getRestricciones(vinculo_dbRestricciones));
//google.maps.event.addDomListener(window, 'load', getEstado(vinculo_dbPartesDNV));
google.maps.event.addDomListener(window, 'load', initialize);
