

var map;
var infoWindow; // use later for pop up info windows on restaurants
var markers=[];
var restaurantName;
var ratings;
var thumb;

// loading page populating the map
function onload(param) {

  // this ccnstant defaults to downtown Houston (used if user denies location services)
  const DEFAULT_POS = {
    latitude: 29.7632800,
    longitude: -95.3632700
  };
  var mypos = DEFAULT_POS;

  // Try HTML5 geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      // updating mypos with user's geolocation
      mypos.latitude = position.coords.latitude;
      mypos.longitude = position.coords.longitude;
      // create and draw map with restaurants near user's location
      mapRestaurants(mypos);
    }, function() {
      // if geolocation is supported but blocked, draw map using default location
      handleLocationError(true);
      mapRestaurants(DEFAULT_POS);
    });
  } else {
    // Browser doesn't support Geolocation draw map using default location
    handleLocationError(false);
    mapRestaurants(DEFAULT_POS);
    }
      // Added a autocomplete search bar.
    // Convert address from search bar to lat-long
    
    var searchBox = new google.maps.places.SearchBox(document.getElementById('inputAddress'));

    google.maps.event.addListener(searchBox,'places_changed', function() {
        // place change events on search box
      places = searchBox.getPlaces();
    });

    document.getElementById('searchGym').onclick = function() {
      searchBar()
    };
    

    function searchBar(){
      console.log("inside searchBar");
     event.preventDefault();
     var geocoder = new google.maps.Geocoder();
     geocoder.geocode( { address:searchBox}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
          mypos.latitude = results[0].geometry.location.lat();
          mypos.longitude = results[0].geometry.location.lng();
          
          } 
      }); 
      console.log(mypos);
      mapRestaurants(mypos);
    }
  

  // Get the restaurants with cuisine types: healthy food, juices, salads, and vegetarian (by Zomato cuisine code)
  function mapRestaurants(pos) {
    Zomato.init({
      key: "c8e2f5b03a41606edd2c1b651d82edec"
    });
    // find restaurants with cuisine types: healthy food, juices, salads, and vegetarian (by Zomato cuisine code)
    Zomato.search(pos, [143, 164, 998, 308], function(s) {
      // invoke Google API pass response as a parameter
      initialize(pos, s);
    }, function(e) {
      // TODO - ERROR CASE - may want to go back and write this to html
      console.error(e)
    });        
  }

  function handleLocationError(browserHasGeolocation) {
    console.error(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
  }
}
// END onLoad function  



//-------- Here I'm incorporating the Google API code to generate a new map --------
function initialize(pos, res) {
  var center = new google.maps.LatLng(pos.latitude,pos.longitude);
  map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: 13
  });

  infoWindow = new google.maps.InfoWindow();  
  placeMarkers(res);
}

// This places markers for the restaurants
function placeMarkers(results) {
  for (var i=0; i< results.restaurants.length;i++){
    markers.push(createMarker(results.restaurants[i]));
  }
}

// FYI "place" is a Zomato object
console.log("place")
// console.log(place);
function createMarker(place) {
  var placeLoc = place.restaurant.location;
  var restaurantName = place.restaurant.name;
  var ratings = place.restaurant.user_rating.aggregate_rating;
  var thumb = place.restaurant.featured_image;
  var marker = new google.maps.Marker({
    map: map,
    // converting from Zomato format (string) to Google format (floating point)
    position: {lat: parseFloat(placeLoc.latitude), lng: parseFloat(placeLoc.longitude)}
  });

   google.maps.event.addListener(marker, 'click', function(place){
          infoWindow.setContent(restaurantName + " " + "Ratings: " + ratings + "");
          infoWindow.open(map,this);
    });

  // TODO - ability to click on new location to get pop up info (add in later)

  return marker;
} 
  
function clearResults(markers){
  for (var m in markers){
    markers[m].setMap(null)
  }
  markers = []
}
//----------END of Google API code------------ 

