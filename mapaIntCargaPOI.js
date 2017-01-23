//carga de la base de datos de POI e inicialización de los marcadores

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

//cargar base de datos de POI desde fusion tables
function getData(table) {
	var query = "SELECT LONGITUD, LATITUD, CLASE, TIPO, BANDERA, NOMBRE, DIRECCION, DIRECCION_ADD, LOCALIDAD, PROVINCIA, TELEFONO, HORARIOS, DIR_EMAIL, DIR_WEB, PRESTACIONES, NOTA, FOTO, FECHA_ACT, ESTADO_POI, REF_EXTERN FROM " + table;
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

var markerRclickContent = document.createElement('div');	
	
	var para = document.createElement('p');
	var texto = document.createTextNode('Usar este punto como origen');
	para.appendChild(texto);
	texto = document.createElement('span');
	texto.innerHTML = '</br>';
	para.appendChild(texto);
	para.style.lineHeight = '50%';
	para.onclick = function(){campoRClick(marker, 'origen');};
	markerRclickContent.appendChild(para);
	
	para = document.createElement('p');
	texto = document.createTextNode('Usar este punto como destino');
	para.appendChild(texto);
	texto = document.createElement('span');
	texto.innerHTML = '</br>';
	para.appendChild(texto);
	para.style.lineHeight = '50%';
	para.onclick = function(){campoRClick(marker, 'destino');};
	markerRclickContent.appendChild(para);

	para = document.createElement('p');
	texto = document.createTextNode('Agregar este punto como hito');
	para.appendChild(texto);
	texto = document.createElement('span');
	texto.innerHTML = '</br>';
	para.appendChild(texto);
	para.style.lineHeight = '50%';
	para.onclick = function(){campoRClick(marker, 'hito');};
	markerRclickContent.appendChild(para);
		
	para = document.createElement('p');
	texto = document.createTextNode('Señalar un problema con los datos');
	para.appendChild(texto);
	para.style.lineHeight = '50%';
	para.onclick = function(){comunicarProblema(marker);};
	markerRclickContent.appendChild(para);
	
	
google.maps.event.addListener(marker, 'rightclick', (function(marker, markerRclickContent) {
	return function() {
		infowindow.setContent(markerRclickContent);
		infowindow.open(map, marker);
	}
})(marker, markerRclickContent));

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
