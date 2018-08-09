google.maps.event.addDomListener(window, "load", initMap);

var map, infobox, allMarkers = [], userLocation, TransportMode = "DRIVING", directionDisplay, currentMarker;
var wellingtonStation = new google.maps.LatLng(-41.279214,174.780340);
var allMarkers = [];
// var userLocation, transport

var infobox;
// var allMarkers = [];

function initMap() {

    var mapOptions = {
        zoom: 12,
        center: wellingtonStation
    };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    addAllmarkers();
    // findUser();

}

function addAllmarkers() {
  $.ajax({
    url: "markers/markers.json",
    type: "GET",
    dataType: "json",
    success: function(markers) {
      placeMarkers(markers);
    },
    error: function(error) {
      console.log(error);
    }
  });
} // addAllMarkers END


function placeMarkers(markers) {
  for (let i = 0; i < markers.length; i++) {
    $("#container").append(
      '<div class="place" markers-id=" ' +
        markers[i].id +
        ' ">' +
        '<div class="padding">' +
        "<h3>" +
        markers[i].place_name +
        "</h3>" +
        "<p>" +
        markers[i].description +
        "</p>" +
        "</div>" +
        "<hr>" +
        "</div>"
    ); // end append

    var marker = new google.maps.Marker({
      position: {
        lat: markers[i].lat,
        lng: markers[i].lng
      },
      markerID: markers[i].id,
      title: markers[i].place_name
    }); // end marker var
    markerClickEvent(marker);
    allMarkers.push(marker);
    // marker.setMap(map);

  } // end for loop

} // end placeMarkers func

function markerClickEvent(marker) {
    infobox = new google.maps.InfoWindow();
    map.panTo(marker.position);
    google.maps.addListener(marker, 'click', function(){
        showInfoBox(marker);
    })
}

$(document).on("click", ".place", function() {
  var id = $(this).markers("id");

  for (let i = 0; i < allMarkers.length; i++) {
    if (allMarkers[i].markerID == id) {
    //   map.panTo(allMarkers[i].position);
    //   map.setZoom(17);
    showDirections(allMarkers[i].postion);
    currentMarker = allMarkers[i];
    showInfoBox(allMarkers[i]);
    findPlaceInfo(allMarkers[i].title);
    showDirection(currentMarker.postion);
    break;
      stop = allMarkers[i].position;
      waypts.push({
        location: stop,
        stopover: true
      });
    //   start = new google.maps.LatLng(-41.279214, 174.78034);
    //   end = allMarkers[i].position;
    //   var request = {
    //     origin: start,
    //     destination: end,
    //     waypoints: waypts,
    //     optimizeWaypoints: true,
    //     travelMode: google.maps.DirectionsTravelMode.DRIVING
    //   };
    //   directionsService.route(request, function(response, status) {
    //     if (status == google.maps.DirectionsService.OK) {
    //       directionsDisplay.setDirections(response);
    //       var route = response.routes[0];
    //     }
    //   });

    //   infobox = new google.maps.InfoWindow();
    //   infobox.setContent(
    //     '<div class="infobox">' +
    //       "<strong>" +
    //       allMarkers[i].title +
    //       "</strong>" +
    //       "</div>"
    //   );
    //   infobox.open(map, allMarkers[i]);

    } // if statement end
  } // for loop end
});

var service;
function findPlaceInfo(title) {
  console.log(title);
  var request = {
    query: title + ' Wellington New Zealand',
    // query: title,
    fields: [
      "id",
      "name",
      "photos",
      "formatted_address",
      "rating",
      "opening_hours"
    ]
  };
  service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, getPlaces);
}

function getPlaces(results, status){
    console.log(status);
    if(status == 'OK'){
        console.log(results);
        for (let i = 0; i < results.length; i++) {
            console.log(results[i])
            var photos = results[i].photos;
            console.log(photos[0].getUrl({
                'maxWidth': 300,
                'maxHeight': 300
            }))
        }
            
    } else {
        console.log('Something went wrong with getting the places')
    }
        
};


function showInfoBox(marker){
    if(infobox){
        infobox.close();
    };
    infobox = new google.maps.InfoWindow();
    infobox.setContent(
        '<div class="infobox">' +
        "<strong>" +
        marker.title +
        "</strong>" +
        "</div>"
    );
    infobox.open(map, marker)
};



function showDirection(location) {
    if(directionDisplay){
        directionDisplay.setMap(null);
    }
    var directionService = new google.maps.DirectionService();
    directionDisplay = new google.maps.DirectionsRenderer();

    directionDisplay.setMap(map);

    directionService.route({
        origin: userLocation.position,
        destination: {location},
     function(response, status){
        if (status== 'OK'){
            directionDisplay.setDirections(response);
        } else if (status == 'NOT_FOUND'){

        } else if (status == 'ZERO_RESULTS') {

        }
    }
    });
}
