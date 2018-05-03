	// load the map
	var mymap = L.map('mapid').setView([51.505, -0.09], 13);
			// load the tiles
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {maxZoom: 18,attribution: 'Map data &copy; <ahref="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,' +'Imagery © <a href="http://mapbox.com">Mapbox</a>',id: 'mapbox.streets'}).addTo(mymap);

	/*
	*    Title: Calculate the Distance between Two Points in your Web Apps
	*    Author:Gravelle,R 
	*    Availability: https://www.htmlgoodies.com/beyond/javascript/calculate-the-distance-between-two-points-in-your-web-apps.html
	*
	*/
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

	//get user's location and get question
	function questionTrack(){
		trackLocation(),getQuestions();
	}


	//get questions from database
	var questionslayer;

	function getQuestions(){
		client = new XMLHttpRequest();
		client.open('GET','http://developer.cege.ucl.ac.uk:30281/getQuestion');
		client.onreadystatechange = questionsResponse;
		client.send();
	}
	
	function questionsResponse(){
	if(client.readyState == 4){
		var questionsdata = client.responseText;
		loadquestionslayer(questionsdata);
		}
	}
	//process GeoJSON data
	function loadquestionslayer(questionsdata){
				//convert the text to JSON
				var questionsjson = JSON.parse(questionsdata);				
				questionslayer = L.geoJson(questionsjson,{
				pointToLayer: questioncoords
				})
			}
	
	
	
		
	//The below function will pop up nearby question, upload user id, user answer
	var questionnear;
	var q_a_id; //define variable to hold id of question. This will upload to database as foreign key.
	var a; //define variable for the answer of the question
	//extract latitude and longitude form GEOJSON
	function questioncoords (feature , latlng){
		//calculate question distance and popup question
		var distance = calculateDistance(latitude,longitude, feature.geometry.coordinates[1],feature.geometry.coordinates[0], 'K');
		//add distance as one of properties
		feature.properties.distance = distance;
		//user id text box
		user_id = '<label for="user_id">User ID:</label><input type="text" size="10" id="user_id"/>';
		//define question id, question, choices and answer variable
		q_id = feature.properties.id;
		q = feature.properties.question;
		c_1 = feature.properties.choice_1;
		c_2 = feature.properties.choice_2;
		c_3 = feature.properties.choice_3;
		c_4 = feature.properties.choice_4;
		answer = feature.properties.answer;
		//button for answer question
		radio_b1 = '<input type="radio" name="amorpm" id="1" />';
		radio_b2 = '<input type="radio" name="amorpm" id="2" />';
		radio_b3 = '<input type="radio" name="amorpm" id="3" />';
		radio_b4 = '<input type="radio" name="amorpm" id="4" />';
		//upload button and result message
		upload_b = '<a href="#" class="mdl-button"onclick="checkResult();return"><i class="mdl-color-text--blue-grey-400 material-icons" role="presentation">publish</i>Answer</a>';
		upload_r = '<div id="dataUploadResult">Upload Result</div>'
		//information in popup
		q_c = user_id+"<br />"+"<b>"+q+"</b>"+"<br />"+radio_b1+c_1+"<br />"+radio_b2+c_2+"<br />"+radio_b3+c_3+"<br />"+radio_b4+c_4+"<br />"+upload_b+"<br />"+upload_r+"<br />";
		//if distance between question and user's location less than 500 meters pop up the question
		if (feature.properties.distance < 0.5) {
			q_a_id = q_id;	//define id of the question that is less than 500 meters from  user's location
			a = answer;		//define answer of the question that is less than 500 meters from  user's location
			questionnear = L.marker(latlng).addTo(mymap.panTo(latlng,22)).bindPopup(q_c).openPopup();	//pop up the question
		}
		}
	
	//define function when click on upload button
	function checkResult(){
	startDataUpload(),processResult();
	}
	
	//The below function will process the result that user answer and compute that it is correct or wrong, and tell the correct answer.
	var user_answer;
	function processResult(){
		//get the value of user answer and define the user answer variable
		if (document.getElementById("1").checked) {
 		 user_answer = 1;
		}
		if (document.getElementById("2").checked) {
		user_answer = 2;
		}
		if (document.getElementById("3").checked) {
		user_answer = 3;
		}
		if (document.getElementById("4").checked) {
		user_answer = 4;
		}
		//if the user answer equal to the answer of the question, it means that it is correct answer
		if (user_answer === a) {
			return	alert ("correct answer");
		}else{
			return alert("wrong answer. The answer is choice "+a); //if not alert that it is wrong answer, and tell the correct choice.
		}
	}

	
	//track user location on the map
	function trackLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.watchPosition(showPosition);
	} else {
		document.getElementById('showLocation').innerHTML = "Geolocation is not supported by this browser.";
		}
	}
	
	//define latitude longitude of user
	var latitude;
	var longitude;
	function showPosition(position) {
		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
		return latitude ,longitude;
	}



			
