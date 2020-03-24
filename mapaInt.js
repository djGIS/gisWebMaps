//inicialización del objeto mapa
var map;
var mapId;

function cargarMapa(myCentre, myZoom) {
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
