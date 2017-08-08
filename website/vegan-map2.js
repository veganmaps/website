//GLOBAL VARIABLES
var base_url =
"https://api.foursquare.com/v2/venues/explore?client_id=R1ICCLL0IRSVK1YJBWFFW0H2EEJHW3AFN2BTP4ATJUA4N5PY&client_secret=TV5MY5PDMSOZA11XBS0ZI4OCL2F3PJVP4WVOQEUVOABCCUZT&v=20170801";
mapboxgl.accessToken = 'pk.eyJ1IjoiZGhhbnlhIiwiYSI6ImNqNXY5ZjBvcDBlaHcycXMzYXZvODdrbGkifQ.xCbroOR-qaieJKlfV9NHCA';

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
		blankMap();
  //  makeURL();
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
	near = document.getElementById("location-input").value;
	near = near.replace(" ", "%20");
	query = document.getElementById("other-input").value;
	query = query.replace(' ', '%20');

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
      console.log("i've successfully read the json code!!!");
			console.log(base_url);

      for (var i = 0; i < data.response.groups[0].items.length; i++)
			{
			//editing the address
				console.log("editing undefined stuff");
        var blegh = data.response.groups[0].items[i].venue.location.address;
        if (typeof blegh == "undefined"){
          data.response.groups[0].items[i].venue.location.address = "Address unknown";
        }
				var ugh1 = data.response.groups[0].items[i].venue.url;
				if (typeof ugh1 == "undefined"){
					data.response.groups[0].items[i].venue.url = "URL unknown";
					}
				var ugh2 = data.response.groups[0].items[i].venue.rating;
				if (typeof ugh2 == "undefined"){
					data.response.groups[0].items[i].venue.rating = "No Rating Yet";
				}

				var tempLoc = [];
				tempLoc.push(data.response.groups[0].items[i].venue.name);
				tempLoc.push(data.response.groups[0].items[i].venue.categories[0].shortName);
				tempLoc.push(data.response.groups[0].items[i].venue.location.formattedAddress);
				tempLoc.push(data.response.groups[0].items[i].venue.location.lat);
				tempLoc.push(data.response.groups[0].items[i].venue.location.lng);
				tempLoc.push(data.response.groups[0].items[i].venue.rating);
				tempLoc.push(data.response.groups[0].items[i].venue.url);
				tempLoc.push(data.response.groups[0].items[i].venue.contact.formattedPhone);
				locationArray.push(tempLoc);

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
					 link.href = prop.url;
					 link.className = 'title';
					 link.dataPosition = i;
					 link.innerHTML = (prop.name);
					 // Create a new div with the class 'details' for each store
					 // and fill it with the city and phone number
					 var details = listing.appendChild(document.createElement('div'));
					 details.innerHTML = (prop.categories[0].shortName + "</br>" + prop.location.formattedAddress);
      }

			console.log("initializing map-...");
			longi = data.response.groups[0].items[0].venue.location.lng;
			lat = data.response.groups[0].items[0].venue.location.lat;
			initMap();
    },
    error: function(request, data, error)
    {
      console.log("dammit");
    }
  })

}

function blankMap()
{
	var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10',
    center: [longi, lat],
    zoom: 12
  });
  map.addControl(new mapboxgl.NavigationControl());
}

function initMap()
{
	//nearQueryReplace
	near = document.getElementById("location-input").value;
	query = document.getElementById("other-input").value;
	console.log(document.getElementById("other-input").value);
	console.log("here are the places that came from the new search!!! pirya");

  console.log("gvasghjvdasgkhj");
	console.log(longi + '' + lat);
  map = mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10',
    center: [longi, lat],
    zoom: 12

  });
  map.addControl(mapboxgl.NavigationControl());
  createMarkers();
}

function createMarkers()
{
		console.log("pirya is making the markers shindoodlez");
    geojson = {
    	type: 'FeatureCollection',
    	features: []
  	};

	console.log("pirya is ready to make sum markerz");
	console.log(locationArray.length);
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
	        description: locationArray[i][2][0] + "\n" + locationArray[i][2][1] + "\n" + locationArray[i][2][2] ,
					link: locationArray[i][6] ,
					phone: locationArray[i][7]
					},
    	};
    geojson.features.push(tempFeature);
		console.log("wrote sum descriptions");
}

    console.log('add markers to map');
    geojson.features.forEach(function(marker) {
    // create a HTML element for each feature
    	var el = document.createElement('div');
    	el.className = 'marker';

    console.log("make a marker for each feature and add to the map");
	    new mapboxgl.Marker(el, { offset: [0, -50 / 2] })
	    .setLngLat(marker.geometry.coordinates)
			.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
			.setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p><p>' + marker.properties.link + '</p><p>' + marker.properties.phone + '</p>'))
			.addTo(map);
			console.log(marker.properties.title + '</h3><p>' + marker.properties.description + '</p>' + marker.properties.link + '</p>' + marker.properties.phone)
			});
		console.log(marker.properties.title);
		console.log(map);

}
