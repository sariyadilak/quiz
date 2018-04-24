// load the map
var mymap = L.map('mapid').setView([51.505, -0.09], 13);
		// load the tiles
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {maxZoom: 18,attribution: 'Map data &copy; <ahref="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,' +'Imagery © <a href="http://mapbox.com">Mapbox</a>',id: 'mapbox.streets'}).addTo(mymap);



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

//get coordinate from question point
var questionslayer;
var qlat = [];
var qlng = [];
	function getQuestions(){
		client = new XMLHttpRequest();
		client.open('GET','http://developer.cege.ucl.ac.uk:30281/getGeoJSON/questions/geom');
		client.onreadystatechange = questionsResponse;
		client.send();
	}
	
	function questionsResponse(){
	if(client.readyState == 4){
		var questionsdata = client.responseText;
		loadquestionslayer(questionsdata);
		}
	}

	function loadquestionslayer(questionsdata){
		
				//convert the text to JSON
				var questionsjson = JSON.parse(questionsdata);				
				questionslayer = L.geoJson(questionsjson,{
				pointToLayer: questioncoords ,
				onEachFeature: questionlatlng
				})
				alert(qlat.toString());
				alert(qlng.toString());
			}
	
	//from point to layer
	function questioncoords (feature , latlng){
		return L.marker(latlng).addTo(mymap)
	}
	//push latitude longitude for each feature in array
	function questionlatlng (feature, layer){
		return qlat.push(feature.geometry.coordinates[0]),qlng.push(feature.geometry.coordinates[1]);
	}
	
	
	
//track user location on the map
function trackLocation() {
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(showPosition);
	alert (distance.toString());
} else {
	document.getElementById('showLocation').innerHTML = "Geolocation is not supported by this browser.";
	}
}

var marker;
var distance = [];
function showPosition(position) {
	var i, j;
	for (i = 0; i < qlat.length ; i++) {
		distance.push(calculateDistance(position.coords.latitude, position.coords.longitude, qlat[i],qlng[i], 'K'));
		return alert (distance.toString());
}
}
			
