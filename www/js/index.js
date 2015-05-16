function __init__() {

  //TODO: Commented temporarily for pushing, till testing is complete

  ///////////////////////////////////////////////////////////////////////////////////////////
  // File Code
  //

//  if( window.requestFileSystem ) {
//    alert("hello");
//  }
//  if( window.webkitRequestFileSystem ) {
//  alert("onnnn");
//  window.requestFileSystem = window.webkitRequestFileSystem;
//  }
//
//  if( window.TEMPORARY ) {
//  alert("hiiiee");
//  }
//
//  window.requestFileSystem( window.TEMPORARY, 1024, gotFS, fail);
//  //alert("hiiiee");
//
//  function gotFS(fileSystem) {
//    alert( fileSystem.root.fullPath );
//    fileSystem.root.getFile("readme.txt", null, gotFileEntry, fail);
//  }
//
//  function gotFileEntry(fileEntry) {
//    fileEntry.file(gotFile, fail);
//  }
//
//  function gotFile(file) {
//    readAsText(file);
//  }
//
//  function readAsText(file) {
//    var reader = new FileReader();
//    reader.onloadend = function(evt) {
//      //console.log("Read as text");
//      //console.log(evt.target.result);
//    };
//    reader.readAsText(file);
//  }
//
//  function fail(error) {
//    alert("errori : " + error.code);
//  }

  ///////////////////////////////////////////////////////////////////////////////////////////
  // Map Code
  //
  function mapInitialize() {

    //Map configurations
    var homeLat = 3; //TODO: set to some default
    var homeLng = 3;
    var markers = [];

    function makeMap() {

      var mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(homeLat, homeLng)
      };

      var map = new google.maps.Map(document.getElementById('map-canvas'),
          mapOptions);

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(homeLat, homeLng),
        map: map,
        title: 'You Are Here'
      });

      var defaultBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(homeLat-10, homeLat+10),
          new google.maps.LatLng(homeLng-10, homeLng+10));

      // Create the search box and link it to the UI element.
      var input = (
          document.getElementById('pac-input'));
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      var searchBox = new google.maps.places.SearchBox(
          (input));

      // Listen for the event fired when the user selects an item from the
      // pick list. Retrieve the matching places for that item.
      google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }
        for (var i = 0, marker; marker = markers[i]; i++) {
          marker.setMap(null);
        }

        // For each place, get the icon, place name, and location.
        markers = [];
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
          var image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          var marker = new google.maps.Marker({
            map: map,
            icon: image,
            title: place.name,
            position: place.geometry.location
          });

          markers.push(marker);

          bounds.extend(place.geometry.location);
        }

        map.fitBounds(bounds);
      });

      // Bias the SearchBox results towards places that are within the bounds of the
      // current map's viewport.
      google.maps.event.addListener(map, 'bounds_changed', function() {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
      });

      //Put a marker to where we click on the map, and remove the previous position of the marker
      google.maps.event.addListener(map, 'click', function(event) {
        marker.setMap(null);
        marker = new google.maps.Marker({
          position: event.latLng,
          map: map
        });
      });
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
      //alert( homeLat + " , " + homeLng );
    } else {
      alert("Unable to find your location");
    }

    function showPosition(position) {
      homeLat = position.coords.latitude;
      homeLng = position.coords.longitude;
      //alert( homeLat + " , " + homeLng );
      makeMap();
    }

  }

  google.maps.event.addDomListener(window, 'load', mapInitialize);
}

function askForReminder() {
  var person = prompt("Enter the reminder to set", "");
}

if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
  document.addEventListener("deviceready", __init__, false);
} else {
  __init__(); //this is the browser
}
