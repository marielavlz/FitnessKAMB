var map;
var infoWindow;
var request;
var service;
var markers=[];
var mypos;
var searchBar;
var places;

function onload(param) {
  console.log("inside onload");

  // this ccnstant defaults to downtown Houston (used if user denies location services)
  const DEFAULT_POS = {
    latitude: 29.7632800,
    longitude: -95.3632700
  };
  mypos = DEFAULT_POS;
  console.log(mypos);
  
  // Try HTML5 geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      // updating mypos with user's geolocation
      mypos.latitude = position.coords.latitude;
      mypos.longitude = position.coords.longitude;
      // create and draw map with restaurants near user's location
      console.log(mypos);
      initialize(mypos);
    }, function() {
      // if geolocation is supported but blocked, draw map using default location
      handleLocationError(true);
      initialize(DEFAULT_POS);
    });
  } else {
    // Browser doesn't support Geolocation draw map using default location
    handleLocationError(false);
    initialize(DEFAULT_POS);
  }
    function handleLocationError(browserHasGeolocation) {
    console.error(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
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
    initialize(mypos);
  }

}   // onload() -- End
  function initialize(pos) {
    console.log("inside JS initialize");
    var center = new google.maps.LatLng(pos.latitude,pos.longitude);
    // console.log("pos.latitude = " + pos.latitude);
    // console.log("pos.latitude = " + pos.longitude);

    map = new google.maps.Map(document.getElementById('map'), {
              center: center,
              zoom: 13
            });
     console.log(map);

         request = {
            location: center,
            radius:8047,  //5 miles in meters
            types: ['gym']  ///can use for various places
          };

          infoWindow = new google.maps.InfoWindow();

          service = new google.maps.places.PlacesService(map);

          service.nearbySearch(request, callback);

          google.maps.event.addListener(map, 'rightclick', function(event){
            map.setCenter(event.latLng)
            clearResults(markers) // call to cearResults() to clear the previous set of Markers

            var request = {
              location: event.latLng,
              radius: 8047,
              types: ['gym']
            };

            service.nearbySearch(request, callback); 
          })
  }  // initialize() -- End

      function callback(results,status){

        if (status == google.maps.places.PlacesServiceStatus.OK){
          for (var i=0; i< results.length;i++){
            markers.push(createMarker(results[i])); // call to createMarker()
            }
        }
      } // callback() -- End

      function createMarker(place){
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });
      
        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent(place.name);
            infoWindow.open(map,this);
        });

        return marker;
    } // createMarker() -- End

    function clearResults(markers){
      for (var m in markers){
        markers[m].setMap(null)
      }
      markers = []
    } // clearResults() -- End

  google.maps.event.addDomListener(window, 'load', initialize);
      
