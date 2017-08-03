
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
var geojson;
var map;


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
        var blegh = data.response.groups[0].items[i].venue.location.address;
          console.log(blegh);
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

				console.log(tempLoc);
				locationArray.push(tempLoc);
				console.log(locationArray[i][3], locationArray[i][4])
      }
			initMap();


    //  console.log(locationArray);
    },
    error: function(request, data, error)
    {
      console.log("dammit");
    }
  })

}

//use ajax









function initMap()
{
  console.log("gvasghjvdasgkhj");
  mapboxgl.accessToken = 'pk.eyJ1IjoiZGhhbnlhIiwiYSI6ImNqNXY5ZjBvcDBlaHcycXMzYXZvODdrbGkifQ.xCbroOR-qaieJKlfV9NHCA';
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-96, 37.8],
    zoom: 3

  });
  map.addControl(new mapboxgl.NavigationControl());
  createMarkers();




}

function createMarkers()
{
    geojson = {
    type: 'FeatureCollection',
    features: []
  };

  for(var i = 0; i < locationArray.length; i++)
  {
    var tempFeature =
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [locationArray[i][4], locationArray[i][3]]
      },
      properties: {
        title: locationArray[i][0] ,
        description: locationArray[i][2][0] + "\n" + locationArray[i][2][1] + "\n" + locationArray[i][2][2]
      },
    };
    geojson.features.push(tempFeature);
    console.log("pirya");
  }
      // add markers to map

    geojson.features.forEach(function(marker) {

    // create a HTML element for each feature
    var el = document.createElement('div');
    el.className = 'marker';

    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el, { offset: [0, -50 / 2] })
    .setLngLat(marker.geometry.coordinates)


    .addTo(map);
    });

}
