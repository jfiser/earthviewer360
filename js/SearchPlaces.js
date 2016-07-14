
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
};
SearchPlaces.prototype.setPlaceClickedLisetener = function(_marker, _placeId){
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
}
SearchPlaces.prototype.setPlacesChangedListener = function(){
// Listen for the event fired when the user selects a prediction and retrieve
// more details for that place.
    var _self = this;
    this.searchBox.addListener('places_changed', function(){
        console.log("places_changed");
        _self.places = _self.searchBox.getPlaces();
        
        //var personOrPlace = $( "input:checked" ).val();
        var personOrPlace = $('input[name=personOrPlace]:checked', '#personPlaceRadioBtns').val();
        console.log(">>>>personOrPlace: " + personOrPlace);
        if(personOrPlace == "place"){
            _self.main.videoPlayer.searchYouTubeByLoc(null, "place", $("#pac-input").val());
        }
        else
        if(personOrPlace == "personThing"){
            _self.main.videoPlayer.searchYouTubeByLoc(_self.main.myLatLongObj, "personThing");
        }
        console.log("VAL: " + $("#pac-input").val());

        if (_self.places.length == 0) {
            return;
        }

        // Clear out the old markers.
        _self.markers.forEach(function(_marker){
            _marker.setMap(null);
        });
        _self.markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        _self.places.forEach(function(_place) {
            var icon = {
                url: _place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            console.log("placeName: " + _place.name);
            // Create a marker for each place.
            console.log("_place: %o", _place);
            var myMarker = _self.markers.push(new google.maps.Marker({
                map: _self.map,
                icon: icon,
                title: _place.name,
                position: _place.geometry.location
            }));

            console.log("marker: %o", _self.markers[_self.markers.length-1])
            var request =  {reference: _place.reference};
            google.maps.event.addListener(_self.markers[_self.markers.length-1],'click',function(){
                    _self.placeService.getDetails(request, function(place, status) {
                        var searchName = place.name + " " + place.address_components[2].long_name;
                        console.log(">>>>>>>>>>>searchName: " + searchName);
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            console.log("Tit: %o", place);

                            _self.main.videoPlayer.searchYouTubeByLoc(null, 
                                                    "place", searchName);
                        }
                        else{ 
                            console.log("NoTit");
                        }
                });

            });
            //_self.setPlaceClickedLisetener(myMarker, _place.id);

            console.log("_place.id: ", _place.id);

            if (_place.geometry.viewport) {
                // Only geocodes have viewport.
                console.log("union");
                bounds.union(_place.geometry.viewport);
                //_self.streetView.setPanorama(_place.geometry.location);
            }
            else {
                console.log("extend");
                bounds.extend(_place.geometry.location);
                //_self.streetView.setPanorama(_place.geometry.location);
            }
        });
        _self.map.fitBounds(bounds);
        //_self.streetView.setPanorama(_place.geometry.location);
    });

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
