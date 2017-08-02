
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



$(document).ready(function() //waits for the document to all be ready before proceeding (al html loaded etc)
{
	function success(position)
  {
    var coordinates = position.coords; //gives you your current location in lat, long
    lat = coordinates.latitude;
    longi = coordinates.longitude;
    console.log(lat);
    console.log(longi);
    near = prompt("Location? ");
    near = near.replace(" ", "%20");
    query = prompt("What type of food? (vegan, vegetarian, halal, donuts etc.)");
    query = query.replace(' ', '%20');
    makeURL();
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


      for (var i = 0; i < data.response.groups[0].items.length; i++) {
        document.write(data.response.groups[0].items[i].venue.name + "</br>");
        document.write(data.response.groups[0].items[i].venue.categories[0].shortName + "</br>");
          var blegh = data.response.groups[0].items[i].venue.location.address;
          console.log(blegh);
          if (typeof blegh == "undefined"){
            data.response.groups[0].items[i].venue.location.address = "Address unknown";
          }
        document.write(data.response.groups[0].items[i].venue.location.address + " ");
        document.write(data.response.groups[0].items[i].venue.location.city + " ");
        document.write(data.response.groups[0].items[i].venue.location.country + "</br>");
//document.write(data.response.groups[0].items[i].reasons.items[0].summary + "</br>"); REASON: always = "this spot is popular"
        document.write("</br>")
        document.write("</br>")
      }

      console.log(data);
    },
    error: function(request, data, error)
    {
      console.log("dammit");
    }
  })


}

//use ajax

