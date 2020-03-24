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
// Client ID and API key from the Developer Console

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

//var authorizeButton = document.getElementById('capas');
//var signoutButton = document.getElementById('signout_button');
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
	alert('loading POI');
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
          // Listen for sign-in state changes.
          //gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          //updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
		gapi.auth2.getAuthInstance(); //.signIn({prompt: 'none'});
		signinStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
		  
          //authorizeButton.onclick = handleAuthClick;
          //signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        alert(JSON.stringify(error, null, 2));
    });
}

function signinStatus(isSignedIn) {
    if (isSignedIn) {
        cargarPOI();
    }
}
      /**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */
     /*function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          //signoutButton.style.display = 'block';
    //      cargarPOI();
        } else {
          authorizeButton.style.display = 'block';
          //signoutButton.style.display = 'none';
        }
      }*/

      /**
       *  Sign in the user upon button click.
       */
      //function handleAuthClick(event) {
        //gapi.auth2.getAuthInstance().signIn();
      //}

      /**
       *  Sign out the user upon button click.
       */
      //function handleSignoutClick(event) {
      //  gapi.auth2.getAuthInstance().signOut();
      //}

      /**
       * Append a pre element to the body containing the given message
       * as its text node. Used to display the results of the API call.
       *
       * @param {string} message Text to be placed in pre element.
       */
      function cargarPOI() {
	  alert("getting data");
        gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: '17uB9MkvDjAUQ84PLvYZTwH2Y_JRFjJ08bvs2QHZYcTg',
          range: 'dbPOI-SIG-FADEEAC!A:V',
        }).then(function(response) {
          var dbTemp = response.result;
          if (dbTemp.values.length > 0) {
            //appendPre('Name, Major:');
			for (var i = 1; i < dbTemp.values.length; i++) {
				dbPOIimport.push(dbTemp.values[i]);
			
			//	appendPre(row[5] + ', ' + row[10]);
			}
			//alert('dbPOI length:' + dbPOIimport.length);
          } else {
            alert('No hay datos cargados.');
          }
        }, function(response) {
          alert('Error: ' + response.result.error.message);
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
	
	//alert('setting markers');
	
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
				var clase = dbPOI[i][3];
				var tipo = dbPOI[i][4];
				var bandera = dbPOI[i][5];
				var nombre = dbPOI[i][6];
				var direccion = dbPOI[i][7];
				var dir_add = dbPOI[i][8];
				var localidad = dbPOI[i][9];
				var provincia = dbPOI[i][10];
				var telefono = dbPOI[i][12];
				var horarios = dbPOI[i][13];
				var dir_email = dbPOI[i][14];
				var dir_web = dbPOI[i][15]; 
				var prestacion = dbPOI[i][16];
				var nota = dbPOI[i][17];
				var fecha_act = dbPOI[i][20];
				var estado = dbPOI[i][21];
				var latlngset;
				//alert(estado);

				if (tipo == tipoPOI && estado == 1) {
					//alert('lat:' +lat + ' lng:'+lng);
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

function campoRClick (marker, campo) {
	if (campo == 'hito') {
		addHito();
		document.getElementById(campo + counterHitos.toString()).value = 'LatLng' + marker.position;
		codeAddress(document.getElementById(campo + counterHitos.toString()));
	} else 	{
		document.getElementById(campo).value = 'LatLng' + marker.position;
		codeAddress(document.getElementById(campo));
	}
}

function comunicarProblema (marker) {
	alert(marker.tipo);
}
