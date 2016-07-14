function Locator(_main, _latLongObj){
    this.main = _main;
    this.latLongObj = _latLongObj;
}
Locator.prototype.showCurrentUserLoc = function(){
    var _self = this;

    if(navigator.geolocation){
        //console.log("newz - xxxyyy");
        navigator.geolocation.getCurrentPosition(function(_latLongObj){
            _self.showLatLong(_latLongObj);
            _self.main.mapView.map.setZoom(17);
        }, this.getLocError);
        //console.log("newz - after");
    }
    else{
        console.log("navigator.geolocation didn't work.");
    }
}
/*Locator.prototype.gerCurPosSuccess = function(_latLongObj){
    this.showLatLong(_latLongObj);
    this.mapView.map.setZoom(17);
}*/
Locator.prototype.showLatLong = function(_latLongObj){
    console.log("showStreet lat/long: " + _latLongObj.coords.latitude + ":" + _latLongObj.coords.longitude);
    var latLongObj = {lat:_latLongObj.coords.latitude, lng:_latLongObj.coords.longitude};
    //var latLongObj = {lat: 42.345573, lng: -71.098326};;
    //var myLatLongObj = {lat:event.latLng.lat(), lng:event.latLng.lng()};
    var center = new google.maps.LatLng(_latLongObj.coords.latitude, 
                                        _latLongObj.coords.longitude);
    this.main.mapView.map.panTo(center);
    this.main.streetView.setPanorama(center);
    if(this.main.getVideoOrPano() == "video"){
        this.main.videoPlayer.searchYouTubeByLoc(latLongObj, "personThing");
    }
}
Locator.prototype.getLocError = function(err){
    console.warn('ERROR(' + err.code + '): ' + err.message);
    switch(err.code) {
        case err.PERMISSION_DENIED:
            console.warn("User denied the request for Geolocation.");
            break;
        case err.POSITION_UNAVAILABLE:
            console.warn("Location information is unavailable.");
            break;
        case err.TIMEOUT:
            console.warn("The request to get user location timed out.");
            break;
        case err.UNKNOWN_ERROR:
            console.warn("An unknown error occurred.");
            break;
        default:
            console.warn("An unknown error occurred (default).");
            break;

    }
}
