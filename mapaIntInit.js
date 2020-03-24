var mapaAltura = 450;

function initialize() {	
	//inicialización del objeto mapa
	mapId = "miSIGmapa";  // div placeholder for map
	var defaultCentre = new google.maps.LatLng(-34.8, -63.5);
	var defaultZoom = 6;
	cargarMapa(defaultCentre, defaultZoom);
	initMenu();
	handleClientLoad();
 //buscadorControls();
//capasControl();
}

// Funciones a ejecutar al cargar la pagina
google.maps.event.addDomListener(window, 'load', initialize);

//contenido html: descripcion del proyecto y actualizaciones
function generarDescripcion() {
var Content = document.createElement('div');
//Content.style.height = '100%';
//Content.style.overflowY = 'scroll'; 
var htmlContent = '<div class="accordion  "><div class="title "><a title="Acerca del Proyecto" href="#tab-11 ">Acerca del Proyecto</a></div>';
	htmlContent += '<div class="content">Este proyecto, desarrollado por el Departamento de Asuntos Técnicos e Infraestructura de la Federación, tiene por objetivo reunir en un mismo lugar la información georeferenciable que los transportistas requieren para planificar sus actividades y recorridos. Por eso entendemos información sobre la ubicación de servicios en ruta, centros para tramitar los distintos permisos de diversas autoridades nacionales y provinciales y la tarjeta RUTA. También incluye capas informativas sobre el estado de las rutas, incluyendo restricciones al transporte pesado. El mantenimiento de la exactitud de los datos depende de la colaboración de usuarios como Usted. Ayudenos a mantenerlo actualizado, si observa algún error en la información que brindamos, o opera uno de los servicios, pongase en contacto con nosotros para asegurar que la información este siempre lo más actualizado posible. Sus comentarios nos ayudan a mejor la página, cuentenos como fue su experiencia y si encontró o no con facilidad la información que buscaba. <a href="mailto:sig.fadeeac@gmail.com">sig.fadeeac@gmail.com</a>';
	htmlContent += '<div class="title active"><a title="Novedades y Actualizaciones" href="#tab-22 ">Novedades y Actualizaciones</a></div>';
	htmlContent += '<div class="content"><table><tbody>';
	htmlContent += '<tr><td style="padding: 5px;">06/07/2016</td><td style="padding: 5px;">Red de Tránsito Pesado Municipal de Ituzaingó, Buenos Aires</td></tr>';
	htmlContent += '<tr><td style="padding: 5px;">31/05/2016</td><td style="padding: 5px;">Funcionalidad ameliorada para permitir ver el mapa en pantalla completa.</td></tr>';
	htmlContent += '<tr><td style="padding: 5px;">13/05/2016</td><td style="padding: 5px;">Disponibilidad de Azul 32 (para motores Euro V) en Estaciones de Servicio YPF.</td></tr>';
	htmlContent += '<tr><td style="padding: 5px;">13/05/2016</td><td style="padding: 5px;">Ubicación de Terminales Portuarias.</td></tr>';
	htmlContent += '<tr><td style="padding: 5px;">09/05/2016</td><td style="padding: 5px;">Parques Industriales incluidos en el registro del Ministerio de Industria.</td></tr>';
	htmlContent += '<tr><td style="padding: 5px;">03/01/2016</td><td style="padding: 5px;">Ubicación de Cajones Azules en Microcentro (Áreas reservadas para carga y descarga de camiones en la vía pública).</td></tr>';
	htmlContent += '</tbody></table></div></div>'
	
Content.innerHTML = htmlContent;
return Content;
}
