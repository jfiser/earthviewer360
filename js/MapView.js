function MapView(_main, _latLongObj, _streetView){
    this.main = _main;
    this.streetView = _streetView;
    this.streetView.mapView = this; // map reference for streetView
    this.addMap(_latLongObj);
}
MapView.prototype.addSearchPlaces = function(_searchPlaces){
    this.searchPlaces = _searchPlaces;
}

MapView.prototype.addMap = function(_latLongObj){
    var _self = this;
    this.map = (new google.maps.Map(document.getElementById('map'), {
      center: _latLongObj,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      zoom: 3
    }));

    this.map.addListener('click', function(event) {
        //_self.streetView.streetViewSvc.getPanorama({location: event.latLng, radius: 50}, processStreetViewData);
        
        //console.log("evt: %o", event.latLng.lat());
        console.log("lat: %o", event.latLng.lat());
        console.log("lng: %o", event.latLng.lng());
        var myLatLongObj = {lat:event.latLng.lat(), lng:event.latLng.lng()};
        //_self.addMarker(myLatLongObj);
        //_self.streetView.setPanorama(myLatLongObj);
        _self.streetView.setPanorama(event.latLng);

        //_self.streetView.panorama.setPano(_self.streetView.panorama.getPano());
        console.log("getPano: " + _self.streetView.panorama.getPano());

        
        //this.setStreetView(_self.streetView.panorama);
        //sv.getPanorama({location: event.latLng, radius: 50}, processSVData);
    });
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    
    this.map.addListener('bounds_changed', function(){
        console.log("boundschanged");
        google.maps.event.trigger(this, 'resize');
        _self.main.windowResize();

        /*if(this.searchPlaces){
            this.searchPlaces.searchBox.setBounds(this.getBounds());
        }
        console.log("getCenter: %o", this.getBounds().getCenter().lat())
        var _latLongObj = {lat:this.getBounds().getCenter().lat(), lng:this.getBounds().getCenter().lng()};
        _self.streetView.setPanorama(_latLongObj);*/
        
        //this.setStreetView(_self.streetView.panorama);

        //_self.streetView.getPanorama({location: event.latLng, radius: 50}, processSVData);
    });
    
    this.map.setStreetView(this.streetView.panorama);
}
MapView.prototype.addMarker = function(_latLongObj){
    var image = {
            url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
            // This marker is 20 pixels wide by 32 pixels high.
            size: new google.maps.Size(20, 32),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(0, 32)
            };
            // Shapes define the clickable region of the icon. The type defines an HTML
            // <area> element 'poly' which traces out a polygon as a series of X,Y points.
            // The final coordinate closes the poly by connecting to the first coordinate.
    var shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly'
    };
    var marker = new google.maps.Marker({
        position: _latLongObj,
        map: this.map,
        //icon: image,
        //shape: shape,
        title: "Fat Monkey"
        //zIndex: 0
    });
}
MapView.prototype.zoomInOut = function(_zoomInOut){
    if(_zoomInOut == "in"){
        this.map.setZoom(this.map.getZoom() + 1);
    }
    else{
        this.map.setZoom(this.map.getZoom() - 1);
    }
}