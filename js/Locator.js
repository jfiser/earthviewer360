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
            console.log("usrLatLng: %o", _self.main.userLatLngObj);
    
            _self.main.streetView.setPanorama(_self.main.userLatLngFuncs);
            _self.main.mapView.moveToLatLng(_self.main.userLatLngObj);
            _self.main.mapView.moveToLatLng(_self.main.userLatLngObj);
            _self.main.mapView.moveToLatLng(_self.main.userLatLngObj);
            _self.main.mapView.moveToLatLng(_self.main.userLatLngObj);
            _self.main.mapView.moveToLatLng(_self.main.userLatLngObj);
            _self.main.mapView.moveToLatLng(_self.main.userLatLngObj);
            //_self.main.videoPlayer.searchYouTubeByLoc(_self.main.userLatLngObj, 
                                            //"filter",
                                            //"restaurant");
            _self.latLngToAddress_YT_Search(_self.main.userLatLngObj);                          
        }, this.getLocError.bind(_self));
        //console.log("newz - after");
    }
    else{
        console.log("navigator.geolocation didn't work.");
        this.main.streetView.setPanorama(this.main.defaultLatLng);
    }
}
Locator.prototype.latLngToAddress_YT_Search = function(_latLngObj){
    var _self = this;
    var pacInput = ($("#pac-input").val() == "" ? "restaurant" : $("#pac-input").val());
    var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?'
                + 'latlng=' + _latLngObj.lat + ',' +  _latLngObj.lng
                + '&key=AIzaSyDlPrs2egoZrLaWiYzG_qAx88PpeDin5oE';
   
    $.getJSON(apiRequest, function(_data){
        console.log("data: %o", _data);
        var _str = '', i, _tmpStr = "";

        if(_data.results.length == 0){
            return;
        }
        for(i = 0; i < _data.results[0].address_components.length; i++){
            _tmpStr = _data.results[0].address_components[i].types[0]
            if(_tmpStr == "locality" || _tmpStr == "administrative_area_level_1"){
                _str += _data.results[0].address_components[i].long_name + " ";
            }
        }
        _str.trim();

        _self.main.videoPlayer.searchYouTubeByLoc(_self.main.userLatLngObj, 
                    "filter",
                    pacInput + ' in ' + ' ' + _str
                            //+ _data.results[0].address_components[2].long_name
                            //+ ' '
                            //+ _data.results[0].address_components[4].long_name
                            );
    });
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
    //this.main.streetView.setPanorama(_self.main.defaultLatLng);

    $("#infoBox").html('<p id="thumbDate">' + err.message + '</p>');

    $("#infoBox").html('<p id="thumbDate">'
                        + err.message + '</p>'
                        + '<p id="thumbDesc">' 
                        + 'That means "near me" search functionality '
                        + 'and the Home button won\'t work. You can still click the '
                        + 'map to view local videos. Try Burma.'
                        + '</p>');
    
    $("#infoBox").show();
    $("#infoBox").click(function(){
        $("#infoBox").hide();
    });
    console.log("this: %o", this);
    this.main.mapView.moveToLatLng(this.main.defaultLatLng);
    this.main.streetView.setPanorama(this.main.defaultLatLngFuncs);
    this.main.videoPlayer.searchYouTubeByLoc(this.main.defaultLatLng, "filter",
                                            "restaurant");
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
