function Locator(_main){
    this.main = _main;
    //this.latLongObj = _latLongObj;
    //this.tryToGetUserLoc();
}
Locator.prototype.tryToGetUserLoc = function(){
    var _self = this;

    if(navigator.geolocation){
        //console.log("newz - xxxyyy");
        navigator.geolocation.getCurrentPosition(function(_latLongObj){
            _self.main.userLatLngObj = {lat:_latLongObj.coords.latitude, lng:_latLongObj.coords.longitude};
            _self.main.userLatLngFuncs = new google.maps.LatLng(_self.main.userLatLngObj);
            console.log("usrLatLng: " + _self.main.userLatLngObj.lat + ":" + _self.main.userLatLngObj.lng);
    
            _self.main.streetView.setPanorama(_self.main.userLatLngFuncs);
            _self.main.mapView.moveToLatLng(_self.main.userLatLngObj);
            _self.main.videoPlayer.searchYouTubeByLoc(_self.main.userLatLngObj, 
                                            "filter",
                                            "restaurant near me");
        }, this.getLocError);
        //console.log("newz - after");
    }
    else{
        console.log("navigator.geolocation didn't work.");
        this.main.streetView.setPanorama(this.main.defaultLatLng);
    }
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
/*Locator.prototype.showCurrentUserLoc = function(){
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
}*/
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
    this.main.streetView.setPanorama(_self.main.defaultLatLng);
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
        this.main.videoPlayer.searchYouTubeByLoc(latLongObj, "filter");
    }
}
