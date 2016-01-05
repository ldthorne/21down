var markers = [];
var days = [];
var types = [];
var radius;
var inaccurateLoc;

function getIpLocation(){
    $.ajax({ 
        url: '//freegeoip.net/json/', 
        type: 'POST', 
        dataType: 'jsonp',
        success: function(location) {
            console.log(location)
            inaccurateLoc = {
                coords: {
                    latitude: location.latitude,
                    longitude: location.longitude
                }
            }
            showPosition(inaccurateLoc)
        },
        error: function(err){
            console.error(err)
        }
    })
}
$("#map-settings").submit(function(e){
    e.preventDefault()
    radius = $("#radius").val()
    if(!radius){
        radius=1;
    }
    types = [];
    if($("#bar").prop('checked')){
        types.push("bar")
    }
    if($("#liquor").prop('checked')){
        types.push("liquor_store")
    }
    if($("#club").prop('checked')){
        types.push("night_club")
    }
    getLocation()
})

$("#map-rating").submit(function(e){
    e.preventDefault()
    var nameOfLoc= $("#nameOfLoc").val()
    console.log(nameOfLoc)
    // getLocation()
})

function getLocation() {
    setActive()
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, fail);
    } else {
        alert("We were unable to retrieve your location. We will attempt to gather your location from your IP address");
    }

}

function fail(){
    alert("We were unable to retrieve your location. We will attempt to gather your location from your IP address");
    getIpLocation()
}
function setActive() {
  var aObj = document.getElementById('navButtons').getElementsByTagName('li');

  for(var i=0; i<aObj.length; i++){
    var currElem = aObj[i].firstChild
    if(currElem.href === document.location.href){
        aObj[i].className='active'
    }
  }
}

function showPosition(position) {
    console.log(position)
    if(types && radius){
        var map = initialize_gmaps(position, types, radius);
    }else if(types && !radius){
        var map = initialize_gmaps(position, types, null);
    }else if(!types && radius){
        var map = initialize_gmaps(position, null, radius);
    }else{
        var map = initialize_gmaps(position);
    }
}

getLocation()
