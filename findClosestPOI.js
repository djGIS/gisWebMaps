function findClosest(userPosition, all) {
	var distAnt = 1000000;
	var distAct = 1000001;

	var latlngset;
	var tipo = document.getElementById("tipo").value;

	for (var i in all) { 
		if (tipo == 'CG')
		var cursos = all[i][11];
	else 
		var cursos = all[i][12];

	if (cursos == true) { 
	var latLngA = userPosition;
var latLngB = new google.maps.LatLng(all[i][1], all[i][2]);
distAct = google.maps.geometry.spherical.computeDistanceBetween (latLngA, latLngB);

if (distAct < distAnt) {
distAnt = distAct;
closestPoint = i;
} 
}
}

//alert(distAnt + ', ' + all[closestPoint][4]); 
latlngset = new google.maps.LatLng(all[closestPoint][1], all[closestPoint][2]);

setMarkers(dbPOIimport)

var latlngbounds = new google.maps.LatLngBounds( );
latlngbounds.extend(userPosition);
latlngbounds.extend(latlngset);
map.fitBounds(latlngbounds);
}
