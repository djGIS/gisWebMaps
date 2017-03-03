//inicialización del objeto mapa
var map;
var mapId;
var myCenter;
var myZoom;

function cargarMapa() {
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
    mapTypeControl : false,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      position: google.maps.ControlPosition.TOP_RIGHT
    },
    scaleControl : true,
    streetViewControl : false,
    overviewMapControl : false,
    mapTypeId : google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById(mapId),mapProp);
}

function fullscreenTogle (elemId) {
	var fullscreenElem = document.getElementById(elemId);

	google.maps.event.addDomListener(document, 'keyup', function (){ //e) {
		//var code = (e.keyCode ? e.keyCode : e.which);

    		//if (e.keyCode === 27) {
        		alert('going out of fullscreen');
    		//}
	});
	if (fullscreenElem.requestFullscreen)   
        if (document.fullScreenElement) {
            document.cancelFullScreen();       
        } else {
          fullscreenElem.requestFullscreen();
        }
  	//if (fullscreenElem.requestFullscreen) {
    	//	fullscreenElem.requestFullscreen();
  	} else if (fullscreenElem.msRequestFullscreen) {
    		fullscreenElem.msRequestFullscreen();
  	} else if (fullscreenElem.mozRequestFullScreen) {
    		fullscreenElem.mozRequestFullScreen();
  	} else if (fullscreenElem.webkitRequestFullScreen) {
		fullscreenElem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
  	}
	
	
}
	
function fullscreenControls() {
  var controles = document.createElement('input');
	controles.type = 'button';
	controles.id = 'fullscreenTogle';
	controles.style.cssText = 'border: 0px solid;border-radius: 2px;margin-right:10px;width:28px;height:28px;background-image:url("http://www.fadeeac.org.ar/wp-content/uploads/2016/08/fullscreenIcon.png");background-size: 30px 30px;background-position:center;background-color: white;';
	controles.onclick = function(){fullscreenTogle('miSIGmapa');};
	
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controles);
}
