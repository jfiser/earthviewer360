
// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

/*function initAutocomplete() {
var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
});*/

// Create the search box and link it to the UI element.
//var input = document.getElementById('pac-input');
//var searchBox = new google.maps.places.SearchBox(input);

function SearchPlaces(_main, _input, _map, _streetView){
    console.log("map: %o", map);
    this.main = _main;
    this.markers = [];
    this.places = [];
    this.map = _map;
    this.streetView = _streetView;
    //this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    this.searchBox = new google.maps.places.SearchBox(_input);
    this.placeService = new google.maps.places.PlacesService(this.map);
    //this.setBoundsChangedListener();
    this.setPlacesChangedListener();
    //this.setPlaceClickedLisetener();
}
/*SearchPlaces.prototype.getPlacesWithinRadius = function(_latLongObj){
    var _self = this;
    var request = {
        location: _latLongObj,
        //bounds: map.getBounds(),
        keyword: 'beer',
        //type: "restaurant",
        //types: ['store'],
        radius: 1000 //this.main.mapView.zoomArr[this.main.mapView.map.getZoom()] * 800,
    };
 
    this.placeService.radarSearch(request, 
        function(_results, _status){
            console.log("========_results: %o", _results);
            console.log("_status: %o", _status);
            var request = {
                placeId: _results[0].place_id
            };
            _self.placeService.getDetails(request, 
                function(_results2, _status2){
                    console.log("========_results2: %o", _results2);
                    console.log("========_results2.name: %o", _results2.name);
                    console.log("_status2: %o", _status2);
                    var placeAddr = _results2.formatted_address.replace(/[0-9]/g, '');
                    _self.main.videoPlayer.searchYouTubeByLoc(
                            {lat: _results2.geometry.location.lat(), 
                                lng: _results2.geometry.location.lng()},
                            "filter", 
                            _results2.name + " " 
                                    + placeAddr.split(',')[1] + " " + placeAddr.split(',')[2]);
                                    //+ _results2.formatted_address.replace(/[0-9]/g, ''));                                    //+ " "
                                    //+  _results2.formatted_address.split(',')[2]);
                    _self.streetView.setPanorama(_results2.geometry.location);
                });


        });
}*/
/*SearchPlaces.prototype.setPlaceClickedLisetener = function(_marker, _placeId){
    try{
        this.placeService.getDetails({placeId: _placeId}, 
            function(place, status) {
                //if (status === google.maps.places.PlacesServiceStatus.OK) {
                    //var marker = new google.maps.Marker({
                    //map: map,
                    //position: place.geometry.location
                    //});
                    google.maps.event.addListener(_marker, 'click', function() {
                        console.log("placeName: " + place.name);
                    });
                //}
            });
    }
    catch(err){
        console.log("err: %o", err);
    }
}*/
SearchPlaces.prototype.getNearMe = function(_myLocObj){
    var _searchBoxTxt = $("#pac-input").val();
    var _beforeNearMe = _searchBoxTxt.split('near me')[0].trim();
    var myLocFuncs = new google.maps.LatLng(_myLocObj);
    var myTpe = null;
    nearMe = true;
    console.log("nearMe _beforeNearMe: " + _beforeNearMe);
    this.main.videoPlayer.searchYouTubeByLoc(_myLocObj, "filter", _beforeNearMe);
    //this.streetView.setPanorama(this.main.userLatLngFuncs);
    this.streetView.setPanorama(myLocFuncs);
    //this.map.pan(myLocFuncs);
    
    myType = this.main.placeTypes.checkForTypeMatch(_beforeNearMe);
    console.log("nearMe - myType: " + myType);
    var nearMeRequest = {
        //location: this.main.userLatLngObj,
        location: _myLocObj,
        //bounds: map.getBounds(),
        keyword: (myType == null ? _beforeNearMe : myType), //_beforeNearMe,
        type: (myType == null ? "restaurant" : myType),
        //types: ['store'],
        radius: 10000 //this.main.mapView.zoomArr[this.main.mapView.map.getZoom()] * 800,
    };
    this.placeService.nearbySearch(nearMeRequest, this.setMarkers.bind(this));
}
SearchPlaces.prototype.setPlacesChangedListener = function(){
    var _self = this, nearMe = false;
    
    this.searchBox.addListener('places_changed', function(){
        console.log("places_changed (placeOrFilter): " + _self.main.controlBar.placeOrFilter);
        _self.main.searchBoxTxt = $("#pac-input").val();
        var _searchBoxTxt = $("#pac-input").val();

        // near me
        if(_searchBoxTxt.indexOf("near me") != -1){
            _self.getNearMe(_self.main.userLatLngObj);
            return; // getNearMe will set the markers
        }
        else // place
        if(_self.main.controlBar.placeOrFilter == "place"){
            _self.main.videoPlayer.searchYouTubeByLoc(null, "place", _searchBoxTxt);
            //_self.streetView.setPanorama(_self.places[0].geometry.location);
            _self.places = _self.searchBox.getPlaces();
            console.log("_self.places.length: "+ _self.places.length);
            if (_self.places.length != 0){
                _self.streetView.setPanorama(_self.places[0].geometry.location);
                _self.setMarkers.bind(_self, _self.places);
                _self.setMarkers(_self.places);
            }
        }
        else{ // filter
            _self.main.videoPlayer.searchYouTubeByLoc(_self.main.myLatLongObj, 
                                                            "filter",
                                                            _searchBoxTxt);
            _self.streetView.setPanorama(_self.main.myLatLongFuncs);
            return; // don't set any markers
        }
        console.log("VAL: " + _searchBoxTxt);

    });
}
SearchPlaces.prototype.setMarkers = function(_placesArr) {
    var _self = this;
    //console.log("this: %o", this);
    console.log("_placesArr: %o", _placesArr);
    this.markers.forEach(function(_marker){
        _marker.setMap(null);
    });
    this.markers = [];
    this.panoMarkers = [];
    this.places = _placesArr;
    console.log("placeArr.length: "+ _placesArr.length)
    if(_placesArr.length == 0){
        console.log("found no places");
        return;
    }

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    this.places.forEach(function(_place) {
        var icon = {
            url: "./img/birdsEyeIcon2.png", //_place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };
        //console.log("placeName: " + _place.name);
        // Create a marker for each place.
        //console.log("_place: %o", _place);
        var myMarker = _self.markers.push(new google.maps.Marker({
            map: _self.map,
            icon: icon,
            animation: google.maps.Animation.DROP,
            //label: _place.name,
            title: _place.name,
            //opacity:.7,
            position: _place.geometry.location
        }));

        /*var myPanoMarker = _self.panoMarkers.push(new google.maps.Marker({
            map: _self.main.streetView.panorama,
            icon: icon,
            animation: google.maps.Animation.DROP,
            //label: _place.name,
            title: _place.name,
            //opacity:.7,
            position: _place.geometry.location
        }));*/

        //console.log("marker: %o", _self.markers[_self.markers.length-1])
        var request =  {reference: _place.reference};
        google.maps.event.addListener(_self.markers[_self.markers.length-1],
            'click',function(){
                _self.placeService.getDetails(request, function(place, status) {
                    console.log("Marker click - place: %o", place);
                    var searchName = place.name;
                    if(place.address_components[2] != undefined){
                        searchName += " " + place.address_components[2].long_name;
                    }
                    console.log("Marker click - searchName: " + searchName);
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        console.log("Tit: %o", place);                            
                        try{
                            _self.main.videoPlayer.searchYouTubeByLoc(null,"place", searchName);
                            _self.streetView.setPanorama(place.geometry.location);
                        }
                        catch(_err){
                            console.log("err: " + err)
                        }
                    }
                    else{ 
                        console.log("NoTit");
                    }
            });
        });
        google.maps.event.addListener(_self.markers[_self.markers.length-1],
                    'mouseover',function(evt){
                        console.log("mouseover: %o", evt);

                    })
        if (_place.geometry.viewport) {
            // Only geocodes have viewport.
            //console.log("union");
            bounds.union(_place.geometry.viewport);
            //_self.streetView.setPanorama(_place.geometry.location);
        }
        else {
            //console.log("extend");
            bounds.extend(_place.geometry.location);
            //_self.streetView.setPanorama(_place.geometry.location);
        }
    });
    _self.map.fitBounds(bounds);
    //_self.streetView.setPanorama(_self.places[0].geometry.location);
}
SearchPlaces.prototype.nearbyReturn = function(_nearbyResponse) {
    console.log("nearbyReturn: %o", _nearbyResponse);
}
SearchPlaces.prototype.showInfoWindow = function(i) {
    return function(place, status) {
      if (iw) {
        iw.close();
        iw = null;
      }
      
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        iw = new google.maps.InfoWindow({
          content: getIWContent(place)
        });
        iw.open(map, markers[i]);        
      }
    }
  }
