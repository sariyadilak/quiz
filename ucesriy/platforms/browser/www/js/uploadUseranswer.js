

function startDataUpload() {
	alert ("start data upload");
//get user id value	
	var user_id = document.getElementById("user_id").value;
	postString = "user_id="+user_id
// now get the radio button values
	if (document.getElementById("1").checked) {
 		 postString=postString+"&user_answer="+1;
	}
	if (document.getElementById("2").checked) {
 		 postString=postString+"&user_answer="+2;
	}
	if (document.getElementById("3").checked) {
 		 postString=postString+"&user_answer="+3;
	}
	if (document.getElementById("4").checked) {
 		 postString=postString+"&user_answer="+4;
	}
	
processData(postString);
}

var client;

function processData(postString) {
   client = new XMLHttpRequest();
   client.open('POST','http://developer.cege.ucl.ac.uk:30281/uploadUseranswer',true);
   client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   client.onreadystatechange = dataUploaded;  
   client.send(postString);
}
// create the code to wait for the response from the data server, and process the response once it is received
function dataUploaded() {
  // this function listens out for the server to say that the data is ready - i.e. has state 4
  if (client.readyState == 4) {
    // change the DIV to show the response
    document.getElementById("dataUploadResult").innerHTML = client.responseText;
    }
}

