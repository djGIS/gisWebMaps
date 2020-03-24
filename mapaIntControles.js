//funciones de control de formularios y formularios dinamicos

function initMenu() { 
	var menuItems = [
		['icono', 'http://www.fadeeac.org.ar/wp-content/uploads/2016/03/fadeeac.png', 'none', '170px;margin-right:5px;'],
		['busqueda', 'http://www.fadeeac.org.ar/wp-content/uploads/2017/01/mibuscar.png', 'none', '50px;margin-right:5px;'],
		['ruteo', 'http://www.fadeeac.org.ar/wp-content/uploads/2017/01/mirutear.png', 'none', '50px;margin-right:5px;'],
		['capas', 'http://www.fadeeac.org.ar/wp-content/uploads/2017/01/micapas.jpg', 'block', '50px']
	];
	
	//var panelLatWidth = 350;

	var panelLatMapa = document.createElement('div');
	panelLatMapa.id = 'miSideBar';
	panelLatMapa.style.cssText = 'height:100%;width:350px;maxHeight:400px;'; //maxWidth:350px;
	
	var panelLatMenu = document.createElement('div');
	panelLatMenu.id = 'miSideBarMenu';
	panelLatMenu.style.cssText = 'border: 1px solid Silver;border-radius: 2px;height:50px;margin:5px;background-color: white;';
	panelLatMapa.appendChild(panelLatMenu);
	
	var panelLatInfo = document.createElement('div');
	panelLatInfo.id = 'miSideBarInfo';
	panelLatInfo.style.cssText = 'border: 1px solid Silver;border-radius: 2px;margin:5px;background-color: white;';
	panelLatMapa.appendChild(panelLatInfo);
	
	var panelLatContent = document.createElement('div');
	panelLatContent.id = 'miSideBarContent';
	panelLatContent.style.cssText = 'border: 0px solid;border-radius: 2px;margin:5px;padding:5px;background-color: white;';
	panelLatContent.style.maxHeight = '320px'; 
	panelLatContent.style.overflowY = 'scroll'; 
	panelLatInfo.appendChild(panelLatContent);
	
	var panelLatMinimize = document.createElement('div');
	//panelLatMinimize.id = 'misideBarMinimize';
	//panelLatMinimize.style.cssText = 'position:relative;bottom:0;';
	panelLatInfo.appendChild(panelLatMinimize);
	
	var controles = document.createElement('input');
	controles.type = 'button';
	controles.id = 'panelLatMinMax';
	controles.style.cssText = 'border: 0px solid;border-radius: 2px;height:10px;width:338px;background-image:url("http://www.fadeeac.org.ar/wp-content/uploads/2017/01/double-arrow-up-512.png");background-position:center;background-size:8px;background-repeat:no-repeat;background-color: white;';
	controles.onclick = function(){panelMinMax(this);};
	panelLatMinimize.appendChild(controles);
	
	for (var i = 0; i < menuItems.length; i++) {
		controles = document.createElement('input');
		controles.type = 'button';
		controles.id = menuItems[i][0];
		controles.style.cssText = 'border: 0px solid;border-radius: 2px;width:' + menuItems[i][3] + ';height:50px;background-image:url(' + menuItems[i][1] + ');background-position:center;background-size:100%;background-repeat:no-repeat;background-color: white;';
		controles.onclick = function(){formControls(this);};
		panelLatMenu.appendChild(controles);
		
		var container = document.createElement('div');
		var name = menuItems[i][0] + 'Container';
		container.id = name;
		container.style.cssText = 'display:' + menuItems[i][2];
		if (name == 'capasContainer') {
		var contents = capasControls();
		container.appendChild(contents);
		} else if (name == 'busquedaContainer') {
		var contents = busquedaControls();
		container.appendChild(contents);
		} else if (name == 'ruteoContainer') {
		var contents = ruteoControls();
		container.appendChild(contents);
		contents = ruteoInfo();
		container.appendChild(contents);
		} else if (name == 'iconoContainer') {
		var contents = generarDescripcion();
		container.appendChild(contents);
		} 
		panelLatContent.appendChild(container);
	}
	
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(panelLatMapa);
	
	google.maps.event.addDomListenerOnce(panelLatMapa, 'mouseover', function() { 
		cargarTarifas();
	});
}

function formControls(tipo) { 
	var children = document.getElementById('miSideBarContent').children;
	for (var i = 0; i < children.length; i++) {
		if (children[i].id == tipo.id + 'Container') { 
			children[i].style.display = 'block';
		} else {
			children[i].style.display = 'none';
		}	
	}
	panelMinMax(tipo);	
}

function panelMinMax(tipo) { 
	var estado = document.getElementById('miSideBarContent').style.display;
	if (estado == 'none') { 
		document.getElementById('miSideBarContent').style.display = 'block';
		document.getElementById('panelLatMinMax').style.cssText = 'border: 0px solid;border-radius: 2px;height:10px;width:338px;background-image:url("http://www.fadeeac.org.ar/wp-content/uploads/2017/01/double-arrow-up-512.png");background-position:center;background-size:8px;background-repeat:no-repeat;background-color: white;';
	} else { 
		if (tipo.id == 'panelLatMinMax'){
			document.getElementById('miSideBarContent').style.display = 'none';
			document.getElementById('panelLatMinMax').style.cssText = 'border: 0px solid;border-radius: 2px;height:10px;width:338px;background-image:url("http://www.fadeeac.org.ar/wp-content/uploads/2017/01/double-arrow-down-e1484768866722.png");background-position:center;background-size:8px;background-repeat:no-repeat;background-color: white;';
		}
	}
}

function capasControls() {
var capasContainer = document.createElement('div');
capasContainer.id = 'controlCapas';
//capasContainer.style.display = 'none'; 
//capasContainer.style.height = '385px'; 
//capasContainer.style.overflowY = 'scroll'; 

var controles = document.createElement('div');
var texto = document.createTextNode('Puntos de Interés');
controles.appendChild(texto);
//controles.style.cssText = 'font-weight:bold;font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro;padding-top:5px';
capasContainer.appendChild(controles); 

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
//controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro';
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
controles.style.cssText = 'padding-top:5px';//font-weight:bold;font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro;
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
//controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro';
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
//controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro';
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
//controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro';
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
controles.style.cssText = 'padding-top:5px';//font-weight:bold;font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro;padding-top:5px';
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
//controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro';
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
controles.style.cssText = 'padding-top:5px';//'font-weight:bold;font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro;padding-top:5px';
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
//controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro';
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

//capasControlDiv.appendChild(capasContainer);
//capasContainerDiv.appendChild(capasControlDiv);
//map.controls[google.maps.ControlPosition.TOP_RIGHT].push(capasContainerDiv);

//alert('cargando capas');
//document.getElementById('capasContainer').appendChild(capasContainer);
return capasContainer;
//alert('here now');
//google.maps.event.addDomListener(capasContainerDiv, 'mouseover', function() {
//document.getElementById('controlCapas').style.display = 'block';
//});

//google.maps.event.addDomListener(capasContainerDiv, 'mouseout', function() {
//document.getElementById('controlCapas').style.display = 'none';
//});

}

var counterHitos = 0;

function geoLocControl(tipo) {
	var controles = document.createElement('input');
	controles.type = 'button';
	controles.id = tipo + 'GeoLoc';
	controles.style.cssText = 'border: 1px solid Silver;border-radius: 2px;width:25px;height:25px;background-image:url("http://www.fadeeac.org.ar/wp-content/uploads/2017/01/migeoloc.png");background-position:center;background-size:25px;background-color: white;';
	controles.onclick = function(){geoLocUsuario(this);};
//controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;width:15%;float:right';
	return controles;
}

var direccionTxtCSS = 'float:right;border: 1px solid Silver;border-radius: 2px;height:25px;width:260px;padding-left:5px;padding-right:5px;';
var wideButtonCSS = 'border: 1px solid Silver;border-radius: 2px;height:25px;width:302px;background-color: LightSteelBlue;margin-top:10px;';

function busquedaControls() {
var outerContainer = document.createElement('div');
outerContainer.id = 'Buscador';

// Inputs de usuario para busqueda de dirección
var container = document.createElement('div');
container.id = 'busquedaInputs';

var controles = geoLocControl('direccion');
container.appendChild(controles);

controles = document.createElement('input');
controles.type = 'text';
controles.id = 'direccion';
controles.statsValue = null;
controles.geoLocStatus = null;
controles.style.cssText = direccionTxtCSS;
controles.onchange = function(){codeAddress(this);};
container.appendChild(controles);
var autocomplete = new google.maps.places.Autocomplete((controles), { types: ['geocode'] });

controles = document.createElement('input');
controles.type = 'button';
controles.id = 'buscar';
controles.value = 'Buscar';
controles.style.cssText = wideButtonCSS;
//controles.onclick = function(){codeAddress(document.getElementById('buscar'));};
container.appendChild(controles);

//container.style.display = 'none';
outerContainer.appendChild(container);

return outerContainer;
}

function ruteoControls() {
	// Inputs de usuario para busqueda de dirección
	var container = document.createElement('div');
	container.id = 'ruteoInputs';

	var controles = geoLocControl('origen');
	container.appendChild(controles);

	controles = document.createElement('input');
	controles.type = 'text';
	controles.id = 'origen';
	controles.placeholder = 'Origen : Introduce una ubicación';
	controles.statsValue = null;
	controles.geoLocStatus = null;
	controles.style.cssText = direccionTxtCSS;
	controles.onchange = function(){codeAddress(this);};
	container.appendChild(controles);
	var autocomplete = new google.maps.places.Autocomplete((controles), { types: ['geocode'] });

	controles = document.createElement('input');
	controles.type = 'button';
	controles.id = 'AddHito0';
	controles.value = '+';
	controles.style.cssText = 'margin-left:276px;margin-top:5px;margin-bottom:5px;border: 1px solid Silver;border-radius: 2px;width:25px;height:25px;background-color: white;';
	controles.onclick = function(){addHito();};
	container.appendChild(controles);

	controles = document.createElement('span');
	controles.id = 'Hitos';
	container.appendChild(controles);

controles = geoLocControl('destino');
container.appendChild(controles);

controles = document.createElement('input');
controles.type = 'text';
controles.id = 'destino';
controles.placeholder = 'Destino : Introduce una ubicación';
controles.statsValue = null;
controles.geoLocStatus = null;
controles.style.cssText = direccionTxtCSS;
controles.onchange = function(){codeAddress(this);};
container.appendChild(controles);
autocomplete = new google.maps.places.Autocomplete((controles), { types: ['geocode'] });

var opciones = document.createElement('div');
opciones.id = 'OpcionesRuteo';
opciones.style.display = 'none';
container.appendChild(opciones);

controles = document.createElement('div');
var texto = document.createTextNode('Opciones de Ruteo');
controles.appendChild(texto);
controles.style.cssText = 'padding-top:5px';//font-weight:bold;font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro;
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
//controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro';
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
//controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro';
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
//controles.style.cssText = 'font-family:arial,helvetica,sans-serif;font-size:10pt;color:Gainsboro';
c.appendChild(controles);

opciones.appendChild(t);

controles = document.createElement('input');
controles.type = 'button';
controles.id = 'mostrarOpciones';
controles.value = 'Mostrar Opciones de Busqueda';
controles.onclick = function(){opcionesControls();};
controles.style.cssText = wideButtonCSS;
container.appendChild(controles);

controles = document.createElement('input');
controles.type = 'button';
controles.id = 'rutear';
controles.value = 'Obtener Indicaciones';
controles.onclick = function(){obtenerDirecciones();};
controles.style.cssText = wideButtonCSS;
container.appendChild(controles);

return container;
}

//crear contenedores para visualicación de la información de ruteo
function ruteoInfo() {
	var container = document.createElement('div');
	container.id = 'ruteoInfo';

	var infoArea = document.createElement('div');
	infoArea.id = 'tCamion';
	infoArea.style.cssText = 'border: 1px solid Silver; margin-top: 10px; margin-bottom: 5px;padding:5px;';//'background:rgba(255,255,255,0.75)';
	//infoArea.style.maxHeight = '100px'; 
	infoArea.style.display = 'none';
	infoArea.style.overflowY = 'auto';
	container.appendChild(infoArea);

	infoArea = document.createElement('div');
	infoArea.id = 'indicaciones';
	//infoArea.style.cssText = 'background:rgba(255,255,255,0.75)';
	//infoArea.style.maxHeight = '250px'; 
	//infoArea.style.overflowY = 'scroll';
	//; maxHeight:250px; overflowY:scroll';
	container.appendChild(infoArea);

	var infoArea = document.createElement('div');
	infoArea.id = 'peajes';
	infoArea.style.cssText = 'border: 1px solid Silver; margin-top: 10px; margin-bottom: 5px;padding:5px;';//'background:rgba(255,255,255,0.75)';
	//infoArea.style.maxHeight = '100px'; 
	infoArea.style.display = 'none';
	infoArea.style.overflowY = 'auto';
	container.appendChild(infoArea);

	return container;
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
controles.id = 'hito' + counterHitos;
controles.placeholder = 'Parada ' + counterHitos + ' : Introduce una ubicación';
controles.statsValue = null;
controles.geoLocStatus = null;
controles.style.cssText = 'margin-left:29px;margin-right:5px;margin-top:5px;border: 1px solid Silver;border-radius: 2px;height:21px;width:230px;padding-left:5px;padding-right:5px;';
controles.onchange = function(){codeAddress(this);};
document.getElementById('Hitos').appendChild(controles);
autocomplete = new google.maps.places.Autocomplete((controles), { types: ['geocode'] });

controles = document.createElement('input');
controles.type = 'button';
controles.id = 'RemoveHito' + counterHitos;
controles.value = '-';
controles.style.cssText = 'margin-top:5px;border: 1px solid Silver;border-radius: 2px;width:25px;height:25px;background-color: white;';
controles.onclick = function(){removeHito();};
document.getElementById('Hitos').appendChild(controles);

controles = document.createElement('input');
controles.type = 'button';
controles.id = 'AddHito' + counterHitos;
controles.value = '+';
controles.style.cssText = 'margin-left:276px;margin-top:5px;margin-bottom:5px;border: 1px solid Silver;border-radius: 2px;width:25px;height:25px;background-color: white;';
controles.onclick = function(){addHito();};
document.getElementById('Hitos').appendChild(controles);
} else {
alert("Se llegó a la cantidad máxima de hitos permitods por el buscador."); 
} 
}

function removeHito() {
if (counterHitos != 0) {
document.getElementById('Hitos').removeChild(document.getElementById('hito' + counterHitos));
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
