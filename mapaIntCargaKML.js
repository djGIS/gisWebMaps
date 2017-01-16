//cargar datos de tipo KML

var layers = []; 
var dbRestriccionesImport = [];

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
