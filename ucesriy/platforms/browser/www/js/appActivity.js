// load the map
var mymap = L.map('mapid').setView([51.505, -0.09], 13);
		// load the tiles
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {maxZoom: 18,attribution: 'Map data &copy; <ahref="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,' +'Imagery © <a href="http://mapbox.com">Mapbox</a>',id: 'mapbox.streets'}).addTo(mymap);

//track user location
function trackLocation() {
if (navigator.geolocation) {
	navigator.geolocation.watchPosition(showPosition);
} else {
	document.getElementById('showLocation').innerHTML = "Geolocation is not supported by this browser.";
	}
}
var marker;
function showPosition(position) {
	  if (marker) { // check
        mymap.removeLayer(marker); // remove
    }
	marker = new L.marker([position.coords.latitude, position.coords.longitude]).addTo(mymap);
	marker
	mymap.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude), 18)

}

function showPosition(position) {
	var lat = 51.524616;
	var lng = -0.13818;
	var distance = calculateDistance(position.coords.latitude, position.coords.longitude, lat,lng, 'K');
	var LocDist = "<dd>" + position.coords.latitude.toString()+"," +position.coords.longitude.toString() + "</dd>"+ "Distance from Warren Street:  "+distance+"  kms";
	L.marker([position.coords.latitude, position.coords.longitude]).addTo(mymap).bindPopup(LocDist).openPopup();
	mymap.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude), 13)
	if (distance < 4) {
	alert('user is within 4 kms from Warren Street');
	}
	else {
	alert ('user is 4 kms away from Warren Street');
	}
}

//calculate distance function
function calculateDistance(lat1, lon1, lat2, lon2, unit) {
var radlat1 = Math.PI * lat1/180;
var radlat2 = Math.PI * lat2/180;
var radlon1 = Math.PI * lon1/180;
var radlon2 = Math.PI * lon2/180;
var theta = lon1-lon2;
var radtheta = Math.PI * theta/180;
var subAngle = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
subAngle = Math.acos(subAngle);
subAngle = subAngle * 180/Math.PI; // convert the degree value returned by acos back to degrees from radians
dist = (subAngle/360) * 2 * Math.PI * 3956; // ((subtended angle in degrees)/360) * 2 * pi * radius )
// where radius of the earth is 3956 miles
if (unit=="K") { dist = dist * 1.609344 ;} // convert miles to km
if (unit=="N") { dist = dist * 0.8684 ;} // convert miles to nautical miles
return dist;
}

// var formlayer;
	// function getForm(){
		// client = new XMLHttpRequest();
		// client.open('GET','http://developer.cege.ucl.ac.uk:30281/getGeoJSON/formdata/geom');
		// client.onreadystatechange = formResponse;
		// client.send();
	// }
	
	// function formResponse(){
	// if(client.readyState == 4){
		// var formdata = client.responseText;
		// loadformlayer(formdata);
		// }
	// }

	// function loadformlayer(formdata){
				// convert the text to JSON
				// var formjson = JSON.parse(formdata);
				// add the JSON layer onto the map - it will appear using the default icons
				// formlayer = L.geoJson(formjson).addTo(mymap);
			// change the map zoom so that all the data is shown
				// mymap.fitBounds(formlayer.getBounds());
		// }