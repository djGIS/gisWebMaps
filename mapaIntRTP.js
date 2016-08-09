var myCenter = new google.maps.LatLng(-34.61667, -58.45000); 
var myZoom = 12; 
var geocoder; 
var map; 
var mapProp; 
     
    var infowindow = null; 
    var userLocationMarker = null; 
    var markers = []; 
    var layers = []; 
    var markerCluster; 
    var dbPOIimport = []; 
    var dbRestriccionesImport = []; 
    //Variables para funciones de ruteo 
    var rendererOptions = { 
        draggable: true 
    }; 
    var directionsDisplay; 
    var directionsService; 
    var routePath = []; 
    //var routeBoxer = null; 
     
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
         
        map = new google.maps.Map(document.getElementById("MapaRTP-CABA"),mapProp); 
     
        //Codigo de inicialización para función de ruteo 
        directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions); 
        directionsService = new google.maps.DirectionsService(); 
        directionsDisplay.setMap(map); 
        directionsDisplay.setPanel(document.getElementById('indicaciones')); 
        document.getElementById('directionsPanel').style.display = 'none'; 
                         
        google.maps.event.addListener(directionsDisplay, 'directions_changed', function() { 
            computeTotalDistance(directionsDisplay.directions); 
            directionsDisplay.setMap(map); 
            directionsDisplay.setPanel(document.getElementById('indicaciones')); 
        }); 
     
        //Codigo para grilla de distancia 
        //routeBoxer = new RouteBoxer(); 
        buscadorControls(); 
        cargarCapaKML(); 
    } 
 
    function cargarCapaKML() { 
        var layer = []; 
         
        layer = new google.maps.FusionTablesLayer({ 
         
        query: { 
            select: 'GEOMETRY', 
            from: '1bDkJ4DpLj2wBuuSMxWyiDT5FLMO52zz9wtlsoAU' 
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
                         
        layer.setMap(map); 
        layers.push(layer); 
         
         google.maps.event.addListener(layer, 'click', function(e) { 
 
         // Change the content of the InfoWindow 
         e.infoWindowHtml = "<b>" + e.row['TIPO'].value + " " + e.row['NOMBRE'].value + "</b><br>" + e.row['TRAMO_DV'].value; 
 
         
        }); 
    } 
     
    //Funciones para el ruteo 
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
         
        while (i <counterHitos) { 
            i++ 
            hitos.push({ 
                location: document.getElementById("Hito" + i.toString()).value, 
                stopover: true 
            }); 
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
                //advertenciaPeaje(dbPOIimport); 
            } else { 
                alert("Lo sentimos, no se pudo calcular una ruta entre los puntos ingresados."); 
            } 
        });  
         
        document.getElementById('directionsPanel').style.display = 'block'; 
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
            for (var a = 0; a <markers.length; a++) { 
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
         
    // Funciones de control de formularios y formularios dinamicos 
     
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
            document.getElementById('ruteo').style.cssText = 'font-weight: 100;font-family:arial,helvetica,sans-serif;font-size:10pt;width:49.5%;float:right'; 
            document.getElementById('busquedaInputs').style.display = 'block'; 
            document.getElementById('busqueda').style.cssText = 'font-weight: 900;font-family:arial,helvetica,sans-serif;font-size:10pt;width:49.5%'; 
        } else if (tipoBusqueda == 'ruteo') { 
            document.getElementById('ruteoInputs').style.display = 'block'; 
            document.getElementById('ruteo').style.cssText = 'font-weight: 900;font-family:arial,helvetica,sans-serif;font-size:10pt;width:49.5%;float:right'; 
            document.getElementById('busquedaInputs').style.display = 'none'; 
            document.getElementById('busqueda').style.cssText = 'font-weight: 100;font-family:arial,helvetica,sans-serif;font-size:10pt;width:49.5%'; 
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
     
    function showHelpBuscador() { 
        if (document.getElementById("HelpBuscador").style.display == 'none') { 
            document.getElementById("HelpBuscador").style.display = 'block'; 
        } else { 
            document.getElementById("HelpBuscador").style.display = 'none'; 
        } 
    } 
     
    google.maps.event.addDomListener(window, 'load', initialize); 
