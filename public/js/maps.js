var infowindow;
var map;

function initialize_gmaps(position, types, radius) {
    console.log(position)
    // initialize new google maps LatLng object

    var myLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    // set the map options hash
    var mapOptions = {
        center: myLatLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
        // styles: styleArr
    };

    var userLocation = {
        lat: position.coords.latitude, 
        lng: position.coords.longitude
    }
    // get the maps div's HTML obj
    var map_canvas_obj = document.getElementById('map-canvas');

    // initialize a new Google Map with the options
    map = new google.maps.Map(map_canvas_obj, mapOptions);

    var image = "../images/person.png"
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: image
    });
    infowindow = new google.maps.InfoWindow();
    var userRadius;
    var userTypes;
    if(radius>0){
        userRadius = radius*1609.34;
    }else{
        userRadius=804.672;
    }
    if(types.length){
        userTypes = types;
    }else{
        userTypes = ['bar', 'liquor_store', 'night_club'];
    }
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: userLocation,
        radius: userRadius,
        types: userTypes
    }, callback);
    return map;
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        var allPlaces = [];
        console.log(results)
        results.forEach(function(currentPlace){
            var place = {
                geometry: currentPlace.geometry,
                name: currentPlace.name,
                googleId: currentPlace.id,
                placeId: currentPlace.place_id,
                location: currentPlace.vicinity,
                googleRating: currentPlace.rating,
                priceLevel: currentPlace.price_level
            }
            allPlaces.push(place);
        })
        var places = JSON.stringify(allPlaces)
        $.ajax({
            url:"/add",
            type: "POST",
            data: {places: places}
        }).done(function(places){
            places.forEach(function(place){
                createMarker(place)
            })
        }).fail(function(){
            console.log("FAIL")
        })            
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        console.log(place)
        var rating = 0;
        if(place.rating.length === 0){
            rating = "N/A"
        }
        else{
            place.rating.forEach(function(oneRating){
                rating+=oneRating
            });
            rating = rating/place.rating.length+"/5"
        }
        var content = "<p><b>"+place.name+"</b></p>How easy is it to get in: "+rating;
        infowindow.setContent(content);
        infowindow.open(map, this);
    });
}

// draw some locations on the map
function drawLocation(map, location, opts) {
    if (typeof opts !== 'object') {
        opts = {};
    }
    opts.position = new google.maps.LatLng(location[0], location[1]);
    opts.map = map;
    var marker = new google.maps.Marker(opts);
    return marker;
}
