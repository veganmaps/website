//GLOBAL VARIABLES
var base_url = "https://api.foursquare.com/v2/venues/explore?client_id=R1ICCLL0IRSVK1YJBWFFW0H2EEJHW3AFN2BTP4ATJUA4N5PY&client_secret=TV5MY5PDMSOZA11XBS0ZI4OCL2F3PJVP4WVOQEUVOABCCUZT&v=20170801";
var lat;
var longi;
var near;
var radius = 250;
var query;
var time = "any";
var day = "any";
var venuePhotos = 1;
var sortByDistance = 1;
var locationArray = [];


$(document).ready(function() //waits for the document to all be ready before proceeding (al html loaded etc)
{
	function success(position)
  {
    var coordinates = position.coords; //gives you your current location in lat, long
    lat = coordinates.latitude;
    longi = coordinates.longitude;
    console.log(lat);
    console.log(longi);
    //near = prompt("Location? ");
		near = document.getElementById("myForm").elements[0].value;
    near = near.replace(" ", "%20");
    //query = prompt("What type of food? (vegan, vegetarian, halal, donuts etc.)");
    query = document.getElementById("myForm").elements[1].value;
		query = query.replace(' ', '%20');
    //makeURL();
	};


  function error(err) // if the user declines to give loocal address
  {
		console.warn('ERROR(' + err.code + '): ' + "We need your location to customize your results. Hit reload and hit allow activate location services.");
    window.alert("We need your location to customize your results. Hit reload and hit allow to activate location services.");
	};
	navigator.geolocation.getCurrentPosition(success, error, {timeout: 10000});
});


function makeURL() // all the appends
{
  base_url += "&ll=" + lat + "," + longi;
  base_url += "&near=" + near;
  base_url += "&radius=" + radius;
  base_url += "&query=" + query;
  base_url += "&time=" + time;
  base_url += "&day=" + day;
  base_url += "&venuePhotos=" + venuePhotos;
  base_url += "&sortByDistance" + sortByDistance;
  console.log(base_url);
  setFourSquareArray();
}


//set base url to something else
function setFourSquareArray(){
  $.ajax({
    type: 'GET',
    url: base_url,
    dataType: 'json',
    crossDomain: true,

    success: function(data){
      console.log("i've successfully read the json code");


      for (var i = 0; i < data.response.groups[0].items.length; i++)
			{
          var blegh = data.response.groups[0].items[i].venue.location.address;
          if (typeof blegh == "undefined"){
            data.response.groups[0].items[i].venue.location.address = "Address unknown";
          }
					var tempLoc = [];
					var ugh1 = data.response.groups[0].items[i].venue.url;
					if (typeof ugh1 == "undefined"){
					 data.response.groups[0].items[i].venue.url = "URL unknown";
					 }
					var ugh2 = data.response.groups[0].items[i].venue.rating;
					if (typeof ugh2 == "undefined"){
					 data.response.groups[0].items[i].venue.rating = "No Rating Yet";
					}
					tempLoc.push(data.response.groups[0].items[i].venue.name);
					tempLoc.push(data.response.groups[0].items[i].venue.categories[0].shortName);
					tempLoc.push(data.response.groups[0].items[i].venue.location.formattedAddress);
					tempLoc.push(data.response.groups[0].items[i].venue.location.lat);
					tempLoc.push(data.response.groups[0].items[i].venue.location.lng);
					tempLoc.push(data.response.groups[0].items[i].venue.rating);
					tempLoc.push(data.response.groups[0].items[i].venue.url);

					//console.log(tempLoc);
					locationArray.push(tempLoc);






        document.getElementById('address').innerHTML = (data.response.groups[0].items[i].venue.location.address + " " +
				data.response.groups[0].items[i].venue.location.city + "</br>" + data.response.groups[0].items[i].venue.location.country + "</br>");
				var currentFeature = data.response.groups[0].items[i];
				var prop = currentFeature.venue;
					 // Select the listing container in the HTML and append a div
					 // with the class 'item' for each store
					 var listings = document.getElementById('section2');
					 var listing = listings.appendChild(document.createElement('div'));
					 listing.className = 'item';
					 listing.id = 'section2-' + i;

					 // Create a new link with the class 'title' for each store
					 // and fill it with the store address
					 var link = listing.appendChild(document.createElement('a'));
					 link.href = '#';
					 link.className = 'title';
					 link.dataPosition = i;
					 link.innerHTML = (prop.name);
					 // Create a new div with the class 'details' for each store
					 // and fill it with the city and phone number
					 var details = listing.appendChild(document.createElement('div'));
					 details.innerHTML = (prop.categories[0].shortName + "</br>" + prop.location.address + "</br>" + prop.location.city + "</br" + prop.location.country);
					/* if (prop.phone) {
						 details.innerHTML += ' &middot; ' + prop.phoneFormatted; */



			}

      console.log(data);
			printPlaces();
    },
    error: function(request, data, error)
  {
     console.log("dammit");
    }
  })


}
function printPlaces()
{
	document.getElementById("first-place").innerHTML = locationArray[0];
}

function nearQueryReplace() {
		locationArray = [];
		near = document.getElementById("myForm").elements[0].value;
		query = document.getElementById("myForm").elements[1].value;
		console.log("here are the places that came from the new search!!! pirya");
		makeURL();
}
