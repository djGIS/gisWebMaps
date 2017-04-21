//archivos de Base de Datos
var vinculo_dbPOI = '1i0Q7uVwWjJgw3cEg-dsAUnmhMPX2nzuLfkzgsNA';
var vinculo_dbTarifasPeajes = '1hWzwymGyRqw2c-YoOMNjmla5WiiUZsvO71bWmR2r';
var vinculo_dbRUTA = '1KKWAfz1a-1Zt2P0E5UoJLTIL7GmsRLA62tWn91EQ';
var vinculo_dbFPT = '1pIMj1G2CF4T83VaMuqOtmBw7Z2NBXEl7JOYK7kJq';
var vinculo_dbEESS = '1obPn7mFkffMcwMUrxb4mLGnFyBu8GJGUBgddupK9';
var vinculo_dbRTP = '1bDkJ4DpLj2wBuuSMxWyiDT5FLMO52zz9wtlsoAU';
var vinculo_dbRestricciones = '1MxNzFFtAKZpbHpmF07tUzqxmMBGN_fxdaaYEaAJz';
var vinculo_dbPartesDNV = '1ApY8xmm_K_4OEErgX4SNRNDcj9Neruu3-t_U9vY';
var miftah = 'AIzaSyDXbo71RxVDc9lB-Ahpif7s-tDqrSbcvDQ';

var mapaAltura = 450;

function initialize() {
	//cargar base de datos de POI desde fusion tables
	getDataPeajes(vinculo_dbTarifasPeajes);
	getData(vinculo_dbPOI);
	getData(vinculo_dbRUTA);
	getData(vinculo_dbFPT);
	getData(vinculo_dbEESS);
	
	//inicialización del objeto mapa
	mapId = "miSIGmapa";
	myCenter = new google.maps.LatLng(-34.8, -63.5);
	myZoom = 6;
	cargarMapa();
	initMenu();
	fullscreenControls();
	geoLocControls();

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
