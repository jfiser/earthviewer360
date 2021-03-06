function MapView(_main, _streetView){
    this.main = _main;
    this.startLatLongObj = this.main.defaultLatLng;
    this.streetView = _streetView;
    this.streetView.mapView = this; // map reference for streetView
    this.zoomArr = ["200mi", "200mi", "180mi", "170mi", "160mi", 
                    "140mi", "105mi", "64mi", "53mi", "28mi", "10mi",
                    "13mi", "11mi", "7mi", "5mi", "4mi", "4mi",
                    "3mi", "3mi", "3mi", "2mi", "2mi", "1mi"
                    ];
    
    this.addMap(this.main.defaultLatLng);

}
MapView.prototype.addSearchPlaces = function(_searchPlaces){
    this.searchPlaces = _searchPlaces;
}

MapView.prototype.addMap = function(_latLongObj){
    var _self = this;
    this.map = (new google.maps.Map(document.getElementById('map'), {
        center: _latLongObj,
        mapTypeId: google.maps.MapTypeId.HYBRID,

        styles: [{
                featureType: 'poi',
                stylers: [{ visibility: 'off' }]  // Turn off points of interest.
            }, 
            {
                featureType: 'transit.station',
                stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
            }],
        //disableDoubleClickZoom: true
        zoom: 3
    }));

    this.map.setClickableIcons(false);
    console.log("this.streetView.panorama: %o", this.streetView.panorama);
    this.map.setStreetView(this.streetView.panorama);

    this.main.myLatLongFuncs = new google.maps.LatLng(_latLongObj); 
    //this.streetView.setPanorama(this.main.myLatLongFuncs);

    this.map.addListener('click', function(event) {
        console.log(">>>>evt: %o", event);
        console.log("lat: %o", event.latLng.lat());
        console.log("lng: %o", event.latLng.lng());
        _self.main.myLatLongObj = {lat:event.latLng.lat(), lng:event.latLng.lng()};
        _self.main.myLatLongFuncs = event.latLng;

        /*if(_self.main.searchBoxTxt.indexOf("near me") != -1){
            _self.main.searchPlaces.getNearMe(_self.main.myLatLongObj);
            return;
        }
        else{*/
            //_self.main.locator.latLngToAddress_YT_Search(_self.main.myLatLongObj);                          
            _self.main.videoPlayer.searchYouTubeByLoc(_self.main.myLatLongObj, "filter");
            _self.streetView.setPanorama(event.latLng);
        //}
    });
    this.map.addListener('bounds_changed', function(){
        console.log("boundschanged");
        google.maps.event.trigger(_self, 'resize');
        _self.main.searchPlaces.searchBox.setBounds(_self.map.getBounds());
    });
}
MapView.prototype.moveToLatLng = function(_latLngObj){
    var center = new google.maps.LatLng(_latLngObj.lat, _latLngObj.lng);
    this.map.panTo(center);
}
MapView.prototype.zoomInOut = function(_zoomInOut, _increment){
    if(_zoomInOut == "in"){
        this.map.setZoom(this.map.getZoom() + _increment);
    }
    else{
        this.map.setZoom(this.map.getZoom() - _increment);
    }
}
MapView.prototype.setZoom = function(_newZoomLevel){
    this.map.setZoom(_newZoomLevel);
}