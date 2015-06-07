///////////////////////////////////////////////////////////////////////////////////////////
// Global vars
//
var db; //The database
var homeLat = 3; //TODO: set to some default
var homeLng = 3;
var map;
var marker;

///////////////////////////////////////////////////////////////////////////////////////////
// DB Code
//
function dbInitialize() {

  function populateDB(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS REMDATA (Latitude, Longitude, Message, Radius)');
  }

  function errorCB(err) {
    alert("Error processing SQL: "+err.code);
  }

  function successCB() {
    //alert("success!");
  }

  db = window.openDatabase("Reminders", "1.0", "Remidner List", 200000);
  db.transaction(populateDB, errorCB, successCB);
}

///////////////////////////////////////////////////////////////////////////////////////////
// Map Code
//
function mapInitialize() {

  //Map configurations
  var markers = [];

  function makeMap() {

    var mapOptions = {
      zoom: 14,
      center: new google.maps.LatLng(homeLat, homeLng)
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    marker = new google.maps.Marker({
      position: new google.maps.LatLng(homeLat, homeLng),
      map: map,
      title: 'You Are Here',
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
        var newMarker = new google.maps.Marker({
          map: map,
          icon: image,
          title: place.name,
          position: place.geometry.location,
        });

        markers.push(newMarker);

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
  } else {
    alert("Unable to find your location");
    makeMap();
  }

  function showPosition(position) {
    homeLat = position.coords.latitude;
    homeLng = position.coords.longitude;
    makeMap();
  }
}

function askForReminder() {
  var person = prompt("Enter the reminder to set", "");
  
  function insertRem(tx) {
    //tx.executeSql('CREATE TABLE IF NOT EXISTS REMDATA (id unique, Latitude, Longitude, Message, Radius)');
    tx.executeSql('INSERT INTO REMDATA (Latitude, Longitude, Message, Radius) VALUES (?, ?, ?, 10)', [marker.getPosition().latitude, marker.getPosition().longitude, person]);
  }

  function errorCB(err) {
    alert("Error processing SQL: "+err.code);
  }

  function successCB() {
    //alert("success!");
  }

  db.transaction(insertRem, errorCB, successCB);

}

function showReminder() {
  function queryDB(tx) {
    tx.executeSql('SELECT * FROM REMDATA', [], querySuccess, errorCB);
  }

  function querySuccess(tx, results) {
    alert("Returned rows = " + results.rows.length);
    // this will be true since it was a select statement and so rowsAffected was 0
    //if (!results.rowsAffected) {
    //  alert('No rows affected!');
    //  return false;
    //}
    // for an insert statement, this property will return the ID of the last inserted row
    //console.log("Last inserted row ID = " + results.insertId);

    var table = document.getElementById("old_reminder_list");
    var header = table.createTHead();

    for( var i=0; i < results.rows.length ; i++ ) {
      var row = header.insertRow(0);
      row.id = "test_id";
      //row.setAttribute("onclick", 
      var cell = row.insertCell(0);
      cell.innerHTML = results.rows.item(0)['Message'];
    }
  }

  function errorCB(err) {
    alert("Error processing SQL: "+err.code);
  }

  db.transaction(queryDB, errorCB);

}

///////////////////////////////////////////////////////////////////////////////////////////
// Starting point to the JS code
//
function __init__() {

  dbInitialize();
  mapInitialize();

  google.maps.event.addDomListener(window, 'load', mapInitialize);
}

__init__();

