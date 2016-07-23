function Main(_latLongObj){
    this.defaultLatLng = _latLongObj;
    this.defaultLatLngFuncs = new google.maps.LatLng(_latLongObj); 
    this.myLatLongObj = null; //_latLongObj;
    this.myLatLongFuncs = null; //new google.maps.LatLng(_latLongObj);
    this.userLatLngObj = null;
    this.userLatLngFuncs = null;

    this.playlistLayout = "grid"; 
    console.log(">>>>>>>>>>>>>>>this.myLatLongObj %o", this.myLatLongObj);
    this.videoOrPano = "pano";
    this.locator = new Locator(this);
    
    this.placeTypes = new PlaceTypes(this);
    // show the user's current location if possible
    this.streetView = new StreetView(this);
    this.mapView = new MapView(this, this.streetView);
    this.searchPlaces = new SearchPlaces(this, input, this.mapView.map, this.streetView);
    this.speechRecog = new SpeechRecognition(this.streetView);
    this.middleBar = new MiddleBar(this, this.mapView, this.streetView, 
                                        document.getElementById('middleBar'));

    this.controlBar = new ControlBar(this);
    this.mapView.addSearchPlaces(this.searchPlaces);
    this.videoPlayer = new VideoPlayer(this);
    this.playlist = new Playlist(this);
    this.handleTouchDevices();
    var _self = this;

    this.setListeners();
    this.windowResize("Startup window resize");
    
    $("#videoPlayerCover").hide();

    this.setTrends();
}
Main.prototype.setTrends = function(){
    $.getJSON( "./data/trends.json", function( data ) {
        var items = [];
        $.each( data, function( key, val ) {
            //items.push( "<li id='" + key + "'>" + val + "</li>" );
            console.log("key: " + val);
        });
    });
}


Main.prototype.setListeners = function(){
    var _self = this;

    window.addEventListener('orientationchange', function()
        {
            switch(window.orientation) 
            {  
            case -90:
            case 90:
                console.log('landscape');
                break; 
            default:
                console.log('portrait');
                break; 
            }
            _self.windowResize("orientationchange");
        });

    $(window).resize(function(){
        _self.windowResize("window Resize event");
    });
}
Main.prototype.setVideoOrPano = function(_newState){
    this.videoOrPano = _newState;
}
Main.prototype.getVideoOrPano = function(){
    //console.log("returning: " + this.videoOrPano);
    return(this.videoOrPano);
}
Main.prototype.handleTouchDevices = function(){
    if(this.isTouchDevice()){
        $(".tooltiptext").css("visibility", "hidden");
        this.middleBar.setViewConfig("pano");
        //$("html, body").css("overflow-y", "hidden"); 
    }  
}
Main.prototype.windowResize = function(_reason){
    var reason = _reason;
    //console.log("reason: " + reason);
    /*var spaceAvailable = $(window).height() - $("#topNav").height();

    if($(window).height() > ($("#topNav").height() + $("#mainHolder").height())){
        $("#mainHolder").height(spaceAvailable + "px");
    }*/

    // horizontal    
    if($("#mainHolder").width() > $("#mainHolder").height()){
        if(this.orientation == "vertical"){ // just switched from vertical orientation to horiz
                //this.middleBarLoc = parseInt($("#middleBar").css("top")) / $("#mainHolder").height()
                                                //* $("#mainHolder").height();
                this.middleBarLoc = .5 * $("#mainHolder").width();
        }
        else{
            //console.log("reason: " + reason);
            if(reason == "resizeMiddleBar"){
                this.middleBarLoc = parseInt($("#middleBar").css("left")) / $("#mainHolder").width()
                                                * $("#mainHolder").width();
            }
            else{
                this.middleBarLoc = .5 * $("#mainHolder").width();
            }
        }
        this.orientation = "horizontal";
        $("#pano").width(this.middleBarLoc);
        $("#pano").height("100%");
        $("#pano").css("left", 0);
        $("#pano").css("top", 0);

        /*$("#pano").width(this.middleBarLoc);
        $("#pano").height("100%");
        $("#pano").css("left", 0);
        $("#pano").css("top", 0);*/

        $("#middleBar").width("43px");
        $("#middleBar").height("100%");
        $("#middleBar").css("left", this.middleBarLoc);
        $("#middleBar").css("top", 0);

        $("#map").width($("#mainHolder").width() 
                            - this.middleBarLoc 
                            - $("#middleBar").width());
        $("#map").height("100%");
        //$("#map").css("left", auto);
        $("#map").css("left", "auto");
        $("#map").css("bottom", "auto");
        $("#map").css("right", 0);
        $("#map").css("top", 0);

        $("#svgDotsHoriz").hide();
        $("#svgDotsVert").show();
        $(".middleBarBtn").css("margin", "2px 3px");
        // need this to cover the YT player because it listens to mouseover
    }
    else{  // vertical
        if(this.orientation == "horizontal"){ // just switched from horiz orientation to vert
            //this.middleBarLoc = parseInt($("#middleBar").css("left")) / $("#mainHolder").width()
                                                //* $("#mainHolder").width();
                this.middleBarLoc = .5 * $("#mainHolder").height();
        }
        else{
            if(reason == "resizeMiddleBar"){
                this.middleBarLoc = parseInt($("#middleBar").css("top")) / $("#mainHolder").height()
                                                * $("#mainHolder").height();
            }
            else{
                this.middleBarLoc = .5 * $("#mainHolder").height();
            }
        }        
        this.orientation = "vertical";
        $("#pano").height(this.middleBarLoc);
        $("#pano").width("100%");
        $("#pano").css("left", 0);
        $("#pano").css("top", 0);

        $("#middleBar").height("43px");
        $("#middleBar").width("100%");
        $("#middleBar").css("top", this.middleBarLoc);
        $("#middleBar").css("left", 0);
        
        //console.log("b4 mainHolder: " + $("#mainHolder").height());
        //console.log("b4 middleBar_t: " + $("#middleBar").css("top"));

        $("#map").height($("#mainHolder").height() 
                            - $("#middleBar").height() 
                            - this.middleBarLoc);
        //console.log("after middle_t: " + $("#middleBar").css("top"));
        //console.log("mappp_h: " + $("#map").height());
        $("#map").width("100%");

        $("#map").css("top", "auto");
        $("#map").css("right", "auto");
        $("#map").css("left", 0);
        $("#map").css("bottom", 0);

        $("#svgDotsHoriz").show();
        $("#svgDotsVert").hide();

        $(".middleBarBtn").css("margin", "3px 2px");
        // need this to cover the YT player because it listens to mouseover
    }
    var pano_w = $("#pano").width();
    if(pano_w <= 340){
        $(".playlistItem-grid").width("48%");
    }
    else
    if(pano_w <= 530){
        $(".playlistItem-grid").width("32%");
    }
    else
    if(pano_w <= 780){
        $(".playlistItem-grid").width("24%");
    }
    else
    if(pano_w <= 900){
        $(".playlistItem-grid").width("19%");
    }
    else{
        $(".playlistItem-grid").width("16.3%");
    }

    if(this.playlistOrVideo == "video"){
        TweenLite.set($("#playlistHolderHolder"), {left:$("#pano").width()*-1});
    }
    //$(".playlistItem-grid. 
}
Main.prototype.isTouchDevice = function(){
  var bool = 'ontouchstart' in window || navigator.maxTouchPoints;
  console.log("touch?: " + bool);
  return(bool); 
};
