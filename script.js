var map;
var infobox;
var allMarkers = [];
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -41.286460, lng: 174.776236},
    zoom: 12
  });
  addAllmarkers();
}

function addAllmarkers(){
    $.ajax({
        url: 'data/markers.json',
        type: 'GET',
        dataType: 'json',
        success:function(data){
            placeMarkers(data);
        },
        error:function(error){
            console.log(error)
        }
    })

}; // addAllMarkers END


function placeMarkers(data){
    for (let i = 0; i < data.length; i++) {
        $('#container').append(
            '<div class="place" data-id=" '+ data[i].id +' ">' +
                '<div class="padding">' +
                    '<h3>' + data[i].place_name + '</h3>' +
                    '<p>' + data[i].description + '</p>' +
                '</div>' +
                '<hr>' +
            '</div>'
        ) // end append



        var marker = new google.maps.Marker({
            position: {
                lat: data[i].lat,
                lng: data[i].lng
            },
            markerID: data[i].id,
            title: data[i].place_name
        }) // end marker var
        allMarkers.push(marker)
        marker.setMap(map)

    } // end for loop
    console.dir(allMarkers);
} // end placeMarkers func


$(document).on('click', '.place', function(){
    var id = $(this).data('id');
    if (infobox){
        infobox.close();
    }

    for (let i = 0; i < allMarkers.length; i++) {
        if(allMarkers[i].markerID == id) {
            map.panTo(allMarkers[i].position);
            map.setZoom(17);

            infobox = new google.maps.InfoWindow();
            infobox.setContent(
                '<div class="infobox">'+
                    '<strong>'+allMarkers[i].title+'</strong>'+
                '</div>'
            )
            infobox.open(map, allMarkers[i]);
            break;
        } // if statement end
    } // for loop end
        
});

